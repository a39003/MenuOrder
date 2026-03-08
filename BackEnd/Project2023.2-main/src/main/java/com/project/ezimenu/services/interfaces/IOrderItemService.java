package com.project.ezimenu.services.interfaces;

import com.project.ezimenu.dtos.OrderItemDTO.OrderItemRequestDTO;
import com.project.ezimenu.entities.Order;
import com.project.ezimenu.entities.OrderItem;
import com.project.ezimenu.exceptions.BadRequestException;
import com.project.ezimenu.exceptions.NotFoundException;

public interface IOrderItemService {
    OrderItem addOrderItem(Long orderId, OrderItemRequestDTO orderItemRequestDTO) throws NotFoundException, BadRequestException;
    Order updateOrderItem(Long orderId, Long orderItemId, OrderItemRequestDTO orderItemRequestDTO) throws NotFoundException, BadRequestException;
    Order updateOrderItemForAdmin(Long orderId, Long orderItemId, OrderItemRequestDTO orderItemRequestDTO) throws NotFoundException;
    OrderItem updateOrderItemStatus(Long orderId, Long orderItemId) throws NotFoundException;
    Order deleteOrderItem(Long orderId, Long orderItemId) throws NotFoundException, BadRequestException;
    OrderItem getOrderItemById(Long orderItemId) throws NotFoundException;
}
