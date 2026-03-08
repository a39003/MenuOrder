package com.project.ezimenu.services;

import com.project.ezimenu.dtos.BillDTO.BillResponseDTO;
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

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class BillService implements IBillService {
    @Autowired
    private BillRepository billRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private BillItemRepository billItemRepository;
    @Autowired
    private ModelMapper modelMapper;
    public BillResponseDTO getBill(Long orderId) throws NotFoundException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy đơn hàng có id: " + orderId));
        BillResponseDTO billResponseDTO = modelMapper.map(order.getBill(), BillResponseDTO.class);
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
        bill.setTotalAmount(calculateTotalAmount(billItems));
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
}
