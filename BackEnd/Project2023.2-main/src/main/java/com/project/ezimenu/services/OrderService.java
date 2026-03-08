package com.project.ezimenu.services;

import com.project.ezimenu.dtos.OrderDTO.OrderListResponseDTO;
import com.project.ezimenu.dtos.OrderDTO.OrderResponseDTO;
import com.project.ezimenu.dtos.OrderItemDTO.OrderItemRequestDTO;
import com.project.ezimenu.dtos.OrderItemDTO.OrderItemResponseDTO;
import com.project.ezimenu.entities.*;
import com.project.ezimenu.exceptions.NotFoundException;
import com.project.ezimenu.repositories.*;
import com.project.ezimenu.services.interfaces.IOrderService;
import com.project.ezimenu.utils.Constants;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class OrderService implements IOrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private DishRepository dishRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private TableRepository tableRepository;
    @Autowired
    private BillRepository billRepository;
    @Autowired
    private ModelMapper modelMapper;
    private Sort sortByTimeAsc = Sort.by(Sort.Direction.ASC, "orderTime");
    public OrderListResponseDTO getAllOrders(Pageable pageable) {
        int total = orderRepository.findAll().size();
        List<Order> orders = orderRepository.findByStatusOrderByOrderTimeDesc(Constants.ENTITY_STATUS.ACTIVE, pageable).getContent();
        List<OrderResponseDTO> orderResponseDTOList =  orders.stream()
                .map(order -> {
                    OrderResponseDTO orderResponseDTO = modelMapper.map(order, OrderResponseDTO.class);
                    List<OrderItemResponseDTO> orderItemResponseDTOS = order.getOrderItems().stream()
                            .map(orderItem -> {
                                OrderItemResponseDTO orderItemResponseDTO = modelMapper.map(orderItem, OrderItemResponseDTO.class);
                                orderItemResponseDTO.setDishName(orderItem.getDish().getDishName());
                                orderItemResponseDTO.setCustomPrice((orderItem.getCustomPrice() == 0) ? orderItem.getDish().getDishPrice() : orderItem.getCustomPrice());
                                return orderItemResponseDTO;
                            })
                            .collect(Collectors.toList());
                    orderResponseDTO.setOrderItemResponseDTO(orderItemResponseDTOS);
                    return orderResponseDTO;
                })
                .collect(Collectors.toList());
        return OrderListResponseDTO
                .builder()
                .orderResponseDTOList(orderResponseDTOList)
                .total(total)
                .build();
    }

    public OrderResponseDTO getOrderResponseById(Long orderId) throws NotFoundException {
        Order order = orderRepository.findByOrderIdAndStatus(orderId, Constants.ENTITY_STATUS.ACTIVE)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy đơn hàng với id: " + orderId));
        OrderResponseDTO orderResponseDTO = modelMapper.map(order, OrderResponseDTO.class);
        List<OrderItemResponseDTO> orderItemResponseDTOS = order.getOrderItems().stream()
                .map(orderItem -> {
                    OrderItemResponseDTO orderItemResponseDTO = modelMapper.map(orderItem, OrderItemResponseDTO.class);
                    orderItemResponseDTO.setDishName(orderItem.getDish().getDishName());
                    orderItemResponseDTO.setCustomPrice((orderItem.getCustomPrice() == 0) ? orderItem.getDish().getDishPrice() : orderItem.getCustomPrice());
                    return orderItemResponseDTO;
                })
                .collect(Collectors.toList());
        orderResponseDTO.setOrderItemResponseDTO(orderItemResponseDTOS);
        return orderResponseDTO;
    }
    public OrderResponseDTO getOrderResponseByTableId(Long tableId) throws NotFoundException {
        Table table = tableRepository.findByTableIdAndStatus(tableId, Constants.ENTITY_STATUS.ACTIVE)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy bàn có id: " + tableId));
        if(table.getTableStatus().equals("Đang trống")){
            throw new NotFoundException("Bàn này chưa có order nào!");
        }
        Order order = table.getOrders().get(table.getOrders().size() - 1);
        List<OrderItemResponseDTO> orderItemResponseDTOS = order.getOrderItems().stream()
                .map(orderItem -> {
                    OrderItemResponseDTO orderItemResponseDTO = modelMapper.map(orderItem, OrderItemResponseDTO.class);
                    orderItemResponseDTO.setDishName(orderItem.getDish().getDishName());
                    orderItemResponseDTO.setCustomPrice((orderItem.getCustomPrice() == 0) ? orderItem.getDish().getDishPrice() : orderItem.getCustomPrice());
                    return orderItemResponseDTO;
                })
                .collect(Collectors.toList());
        OrderResponseDTO orderResponseDTO = modelMapper.map(order, OrderResponseDTO.class);
        orderResponseDTO.setOrderItemResponseDTO(orderItemResponseDTOS);
        return orderResponseDTO;
    }
    public Order getOrderById(Long orderId) throws NotFoundException {
        return orderRepository.findByOrderIdAndStatus(orderId, Constants.ENTITY_STATUS.ACTIVE)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy đơn hàng với id: " + orderId));
    }
    public Order createEmptyOrder(Long tableId) throws NotFoundException {
        Table table = tableRepository.findById(tableId)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy bàn có id: " + tableId));
        Order newOrder = new Order();
        newOrder.setTable(table);
        newOrder.setOrderTime(LocalDateTime.now());
        newOrder.setOrderStatus("Đang order");
        return orderRepository.save(newOrder);
    }
    public Order sendOrder(Long tableId) throws NotFoundException {
        Table table = tableRepository.findByTableIdAndStatus(tableId, Constants.ENTITY_STATUS.ACTIVE)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy bàn có id: " + tableId));
        table.setTableStatus("Đang phục vụ");
        if (table.getOrders().isEmpty()) {
            throw new NotFoundException("Bàn này chưa có order để gửi đi!");
        }
        Order order = table.getOrders().get(table.getOrders().size() - 1);
        if (order.getBill() != null) {
            Bill bill = order.getBill();
            bill.setOrder(null);
            billRepository.save(bill);
        }
        order.setOrderTime(LocalDateTime.now());
        order.setOrderStatus("Đang ra món");
        order.setStatus(Constants.ENTITY_STATUS.ACTIVE);
        order = orderRepository.save(order);
        if (order.getOrderItems() != null && !order.getOrderItems().isEmpty()) {
            List<OrderItem> orderItems = order.getOrderItems()
                    .stream()
                    .map(orderItem -> {
                        if(orderItem.getDishStatus().equals("Đang chọn")){
                            orderItem.setDishStatus("Đang ra món");
                        }
                       return orderItem;
                    })
                    .collect(Collectors.toList());
            orderItemRepository.saveAll(orderItems);
        }
        tableRepository.save(table);
        return orderRepository.save(order);
    }
    public Order deleteOrder(Long orderId) throws NotFoundException {
        Order order = orderRepository.findByOrderIdAndStatus(orderId, Constants.ENTITY_STATUS.ACTIVE)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy đơn hàng với id: " + orderId));
        order.setStatus(Constants.ENTITY_STATUS.INACTIVE);
        return orderRepository.save(order);
    }

    @Override
    public OrderResponseDTO getOrderResponseForCustomerByTableId(Long tableId) throws NotFoundException {
        Table table = tableRepository.findByTableIdAndStatus(tableId, Constants.ENTITY_STATUS.ACTIVE)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy bàn có id: " + tableId));
        if(table.getTableStatus().equals("Đang trống")){
            throw new NotFoundException("Bàn này chưa có order nào!");
        }
        Order order = table.getOrders().get(table.getOrders().size() - 1);
        List<OrderItemResponseDTO> orderItemResponseDTOS = order.getOrderItems().stream()
                .map(orderItem -> {
                    OrderItemResponseDTO orderItemResponseDTO = modelMapper.map(orderItem, OrderItemResponseDTO.class);
                    orderItemResponseDTO.setDishName(orderItem.getDish().getDishName());
                    orderItemResponseDTO.setCustomPrice((orderItem.getCustomPrice() == 0) ? orderItem.getDish().getDishPrice() : orderItem.getCustomPrice());
                    return orderItemResponseDTO;
                })
                .collect(Collectors.toList());
        OrderResponseDTO orderResponseDTO = modelMapper.map(order, OrderResponseDTO.class);
        orderResponseDTO.setOrderItemResponseDTO(orderItemResponseDTOS);
        return orderResponseDTO;
    }

    private OrderItem convertToOrderItem(OrderItemRequestDTO orderItemRequestDTO) throws NotFoundException {
        OrderItem orderItem = new OrderItem();
        Dish dish = dishRepository.findById(orderItemRequestDTO.getDishId())
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy món ăn đặt hàng có id: " + orderItemRequestDTO.getDishId()));
        orderItem.setDish(dish);
        orderItem.setDishQuantity(orderItemRequestDTO.getDishQuantity());
        orderItem.setDishNote(orderItemRequestDTO.getDishNote());
        orderItem.setDishStatus(orderItemRequestDTO.getDishStatus());
        orderItem.setOrder(null);
        return orderItem;
    }
}
