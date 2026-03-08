package com.project.ezimenu.services.interfaces;

import com.project.ezimenu.dtos.OrderDTO.OrderListResponseDTO;
import com.project.ezimenu.dtos.OrderDTO.OrderResponseDTO;
import com.project.ezimenu.entities.Order;
import com.project.ezimenu.exceptions.NotFoundException;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IOrderService {
    OrderListResponseDTO getAllOrders(Pageable pageable);
    OrderResponseDTO getOrderResponseById(Long orderId) throws NotFoundException;
    OrderResponseDTO getOrderResponseByTableId(Long tableId) throws NotFoundException;
    Order getOrderById(Long orderId) throws NotFoundException;
    Order sendOrder(Long tableId) throws NotFoundException;
    Order deleteOrder(Long orderId) throws NotFoundException;

    OrderResponseDTO getOrderResponseForCustomerByTableId(Long tableId) throws NotFoundException;
}