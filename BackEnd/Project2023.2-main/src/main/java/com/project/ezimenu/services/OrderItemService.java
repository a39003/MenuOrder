package com.project.ezimenu.services;

import com.project.ezimenu.dtos.OrderItemDTO.OrderItemRequestDTO;
import com.project.ezimenu.entities.Dish;
import com.project.ezimenu.entities.Order;
import com.project.ezimenu.entities.OrderItem;
import com.project.ezimenu.exceptions.BadRequestException;
import com.project.ezimenu.exceptions.NotFoundException;
import com.project.ezimenu.repositories.DishRepository;
import com.project.ezimenu.repositories.OrderItemRepository;
import com.project.ezimenu.repositories.OrderRepository;
import com.project.ezimenu.repositories.TableRepository;
import com.project.ezimenu.services.interfaces.IOrderItemService;
import com.project.ezimenu.utils.Constants;
import org.springframework.beans.factory.annotation.Autowired;

public class OrderItemService implements IOrderItemService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private DishRepository dishRepository;
    @Autowired
    private OrderItemRepository orderItemRepository;
    @Autowired
    private TableRepository tableRepository;

    public OrderItem addOrderItem(Long orderId, OrderItemRequestDTO orderItemRequestDTO) throws NotFoundException, BadRequestException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy đơn hàng với id: " + orderId));
        Dish dish = dishRepository.findById(orderItemRequestDTO.getDishId())
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy món ăn có id: " + orderItemRequestDTO.getDishId()));
        OrderItem newOrderItem = new OrderItem();
        if(dish.getDishStatus() == Constants.DISH_STATUS.OUT_OF_DISH){
            throw new BadRequestException("Món ăn đã hết hàng");
        }
        newOrderItem.setDish(dish);
        newOrderItem.setDishQuantity(orderItemRequestDTO.getDishQuantity());
        if(orderItemRequestDTO.getDishNote() != null) newOrderItem.setDishNote(orderItemRequestDTO.getDishNote());
        newOrderItem.setDishStatus("Đang chọn");
        newOrderItem.setOrder(order);
        return orderItemRepository.save(newOrderItem);
    }

    public Order updateOrderItem(Long orderId, Long orderItemId, OrderItemRequestDTO orderItemRequestDTO) throws NotFoundException, BadRequestException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy đơn hàng với id: " + orderId));
        OrderItem orderItem = order.getOrderItems().stream()
                .filter(item -> item.getOrderItemId() == orderItemId)
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy món ăn đặt hàng với id: " + orderItemId + " trong đơn hàng!"));
        if(!orderItem.getDishStatus().equals("Đang chọn")){
            throw new BadRequestException("Bạn không thể chỉnh sửa món này nữa!");
        }
        orderItem.setDishQuantity(orderItemRequestDTO.getDishQuantity());
        if(orderItemRequestDTO.getDishNote() != null) orderItem.setDishNote(orderItemRequestDTO.getDishNote());
        orderItemRepository.save(orderItem);
        return order;
    }
    public Order updateOrderItemForAdmin(Long orderId, Long orderItemId, OrderItemRequestDTO orderItemRequestDTO) throws NotFoundException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy đơn hàng với id: " + orderId));
        OrderItem orderItem = order.getOrderItems().stream()
                .filter(item -> item.getOrderItemId() == orderItemId)
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy món ăn đặt hàng với id: " + orderItemId + " trong đơn hàng!"));
        orderItem.setDishQuantity(orderItemRequestDTO.getDishQuantity());
        if(orderItemRequestDTO.getDishNote() != null) orderItem.setDishNote(orderItemRequestDTO.getDishNote());
        if(orderItemRequestDTO.getCustomPrice() != 0) orderItem.setCustomPrice(orderItemRequestDTO.getCustomPrice());
        orderItemRepository.save(orderItem);
        return order;
    }
    public OrderItem updateOrderItemStatus(Long orderId, Long orderItemId) throws NotFoundException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy đơn hàng với id: " + orderId));
        OrderItem orderItem = order.getOrderItems().stream()
                .filter(item -> item.getOrderItemId() == orderItemId)
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy món ăn đặt hàng với id: " + orderItemId + " trong đơn hàng!"));
        if(orderItem.getDishStatus().equals("Đang ra món")){
            orderItem.setDishStatus("Đã ra món");
        } else {
            orderItem.setDishStatus("Đang ra món");
        }
        long completedDish = order.getOrderItems().stream()
                .filter(item -> "Đã ra món".equals(item.getDishStatus()))
                .count();
        long totalDish = order.getOrderItems().size();
        if (completedDish == totalDish) {
            order.setOrderStatus("Đã hoàn thành");
        } else {
            order.setOrderStatus("Đang ra món");
        }
        orderRepository.save(order);
        return orderItemRepository.save(orderItem);
    }
    public Order deleteOrderItem(Long orderId, Long orderItemId) throws NotFoundException, BadRequestException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy đơn hàng với id: " + orderId));
        OrderItem orderItem = order.getOrderItems().stream()
                .filter(item -> item.getOrderItemId() == orderItemId)
                .findFirst()
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy món ăn đặt hàng với id: " + orderItemId + " trong đơn hàng!"));
        if(!"Đang chọn".equals(orderItem.getDishStatus())){
            throw new BadRequestException("Bạn không thể xóa món ăn này nữa!");
        }
        order.getOrderItems().remove(orderItem);
        orderItemRepository.delete(orderItem);
        orderRepository.save(order);
        return order;
    }

    public OrderItem getOrderItemById(Long orderItemId) throws NotFoundException {
        OrderItem orderItem = orderItemRepository.findById(orderItemId)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy món ăn đặt hàng với id: " + orderItemId));
        return orderItem;
    }
}
