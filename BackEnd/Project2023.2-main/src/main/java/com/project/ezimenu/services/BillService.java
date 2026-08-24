package com.project.ezimenu.services;

import com.project.ezimenu.dtos.BillDTO.BillResponseDTO;
import com.project.ezimenu.dtos.BillDTO.PaidBillResponseDTO;
import com.project.ezimenu.dtos.BillItemDTO.BillItemResponseDTO;
import com.project.ezimenu.entities.Bill;
import com.project.ezimenu.entities.BillItem;
import com.project.ezimenu.entities.Order;
import com.project.ezimenu.entities.OrderItem;
import com.project.ezimenu.exceptions.BadRequestException;
import com.project.ezimenu.exceptions.NotFoundException;
import com.project.ezimenu.repositories.BillItemRepository;
import com.project.ezimenu.repositories.BillRepository;
import com.project.ezimenu.repositories.OrderRepository;
import com.project.ezimenu.services.interfaces.IBillService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class BillService implements IBillService {
    private static final long VIP_SERVICE_FEE = 1_000_000L;
    @Autowired
    private BillRepository billRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private BillItemRepository billItemRepository;
    @Autowired
    private ModelMapper modelMapper;

    @Transactional(readOnly = true)
    public List<PaidBillResponseDTO> getPaidBills(LocalDate from, LocalDate to, String search) {
        LocalDate startDate = from == null ? LocalDate.of(2000, 1, 1) : from;
        LocalDate endDate = to == null ? LocalDate.now() : to;
        String keyword = search == null ? "" : search.trim().toLowerCase();

        return billRepository.findAllByOrderByBillDateTimeDesc().stream()
                .filter(this::isPaidBill)
                .filter(bill -> bill.getBillDateTime() != null)
                .filter(bill -> !bill.getBillDateTime().toLocalDate().isBefore(startDate))
                .filter(bill -> !bill.getBillDateTime().toLocalDate().isAfter(endDate))
                .map(this::toPaidBillResponse)
                .filter(bill -> keyword.isEmpty()
                        || String.valueOf(bill.getBillId()).contains(keyword)
                        || String.valueOf(bill.getOrderId()).contains(keyword)
                        || (bill.getCustomerName() != null && bill.getCustomerName().toLowerCase().contains(keyword))
                        || bill.getTableName().toLowerCase().contains(keyword))
                .toList();
    }

    @Transactional(readOnly = true)
    public PaidBillResponseDTO getPaidBill(Long billId) throws NotFoundException {
        Bill bill = billRepository.findById(billId)
                .filter(this::isPaidBill)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy hóa đơn đã thanh toán có id: " + billId));
        return toPaidBillResponse(bill);
    }

    private boolean isPaidBill(Bill bill) {
        return bill.getOrder() != null && "Đã thanh toán".equalsIgnoreCase(bill.getOrder().getOrderStatus());
    }

    private PaidBillResponseDTO toPaidBillResponse(Bill bill) {
        PaidBillResponseDTO response = new PaidBillResponseDTO();
        response.setBillId(bill.getBillId());
        response.setOrderId(bill.getOrder().getOrderId());
        response.setTableId(bill.getOrder().getTable().getTableId());
        response.setTableName(bill.getTableNameSnapshot() != null
                ? bill.getTableNameSnapshot() : bill.getOrder().getTable().getTableName());
        response.setTableType(bill.getTableTypeSnapshot() != null
                ? bill.getTableTypeSnapshot() : defaultTableType(bill.getOrder().getTable().getTableType()));
        response.setFloorNumber(bill.getFloorNumberSnapshot() != null
                ? bill.getFloorNumberSnapshot() : defaultNumber(bill.getOrder().getTable().getFloorNumber(), 1));
        response.setCapacity(bill.getCapacitySnapshot() != null
                ? bill.getCapacitySnapshot() : defaultNumber(bill.getOrder().getTable().getCapacity(), 4));
        response.setCustomerName(bill.getOrder().getCustomerName());
        response.setTotalAmount(bill.getTotalAmount());
        response.setFoodAmount(getFoodAmount(bill));
        response.setTableServiceFee(getTableServiceFee(bill));
        response.setPaidAt(bill.getBillDateTime());
        response.setTotalItems(bill.getBillItems().stream().mapToInt(BillItem::getBillItemQuantity).sum());
        response.setItems(bill.getBillItems().stream()
                .map(item -> modelMapper.map(item, BillItemResponseDTO.class))
                .toList());
        return response;
    }

    public BillResponseDTO getBill(Long orderId) throws NotFoundException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy đơn hàng có id: " + orderId));
        BillResponseDTO billResponseDTO = modelMapper.map(order.getBill(), BillResponseDTO.class);
        billResponseDTO.setCustomerName(order.getCustomerName());
        billResponseDTO.setTableName(order.getTable().getTableName());
        billResponseDTO.setFoodAmount(getFoodAmount(order.getBill()));
        billResponseDTO.setTableServiceFee(getTableServiceFee(order.getBill()));
        List<BillItemResponseDTO> billItemResponseDTOS = order.getBill().getBillItems().stream()
                .map(billItem -> modelMapper.map(billItem, BillItemResponseDTO.class))
                .collect(Collectors.toList());
        billResponseDTO.setBillItemResponseDTOS(billItemResponseDTOS);
        return billResponseDTO;
    }
    public Bill addBill(Long orderId) throws NotFoundException, BadRequestException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy đơn hàng có id: " + orderId));
        List<OrderItem> undoneOrderItem = order.getOrderItems()
                .stream()
                .filter(orderItem1 -> !"Đã ra món".equals(orderItem1.getDishStatus()))
                .toList();
        if(!undoneOrderItem.isEmpty()){
            throw new BadRequestException("Thanh toán không thành công do có món chưa ra \nVui lòng xác nhận lại trạng thái món ăn!");
        }
        Bill bill = new Bill();
        bill = billRepository.save(bill);
        Map<String, BillItem> billItemMap = new HashMap<>();
        for(OrderItem orderItem : order.getOrderItems()){
            String dishName = orderItem.getDish().getDishName();
            int dishPrice = (orderItem.getCustomPrice() != 0) ? orderItem.getCustomPrice() : orderItem.getDish().getDishPrice();
            int quantity = orderItem.getDishQuantity();
            String key = dishName + " - " + dishPrice;
            if(billItemMap.containsKey(key)){
                BillItem billItem = billItemMap.get(key);
                billItem.setBillItemQuantity(billItem.getBillItemQuantity() + quantity);
            } else {
                BillItem billItem = new BillItem();
                billItem.setBill(bill);
                billItem.setBillItemName(dishName);
                billItem.setBillItemPrice(dishPrice);
                billItem.setBillItemQuantity(quantity);
                billItemMap.put(key, billItem);
            }
        }
        List<BillItem> billItems = new ArrayList<>(billItemMap.values());
        bill.setOrder(order);
        bill.setBillDateTime(LocalDateTime.now());
        bill.setBillItems(billItems);
        long foodAmount = calculateTotalAmount(billItems);
        long serviceFee = "VIP".equalsIgnoreCase(order.getTable().getTableType())
                ? VIP_SERVICE_FEE : 0L;
        bill.setFoodAmount(foodAmount);
        bill.setTableServiceFee(serviceFee);
        bill.setTableNameSnapshot(order.getTable().getTableName());
        bill.setTableTypeSnapshot(defaultTableType(order.getTable().getTableType()));
        bill.setFloorNumberSnapshot(defaultNumber(order.getTable().getFloorNumber(), 1));
        bill.setCapacitySnapshot(defaultNumber(order.getTable().getCapacity(), 4));
        bill.setTotalAmount(foodAmount + serviceFee);
        billItemRepository.saveAll(billItems);
        return billRepository.save(bill);
    }
    public void deleteBill(Long orderId) throws NotFoundException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy đơn hàng có id: " + orderId));
        Bill bill = order.getBill();
        if(bill == null) throw new NotFoundException("Đơn hàng này không có hóa đơn!");
        bill.setOrder(null);
        billRepository.save(bill);
    }
    private long calculateTotalAmount(List<BillItem> billItems) {
        long totalAmount = 0;
        for (BillItem item : billItems) {
            totalAmount += item.getBillItemPrice() * item.getBillItemQuantity();
        }
        return totalAmount;
    }

    private long getTableServiceFee(Bill bill) {
        return bill.getTableServiceFee() == null ? 0L : bill.getTableServiceFee();
    }

    private long getFoodAmount(Bill bill) {
        if (bill.getFoodAmount() != null) return bill.getFoodAmount();
        return Math.max(0L, bill.getTotalAmount() - getTableServiceFee(bill));
    }

    private String defaultTableType(String tableType) {
        return tableType == null || tableType.isBlank() ? "THƯỜNG" : tableType;
    }

    private int defaultNumber(Integer value, int fallback) {
        return value == null || value < 1 ? fallback : value;
    }
}
