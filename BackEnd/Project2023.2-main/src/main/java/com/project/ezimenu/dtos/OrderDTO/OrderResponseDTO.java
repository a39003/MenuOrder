package com.project.ezimenu.dtos.OrderDTO;

import com.project.ezimenu.dtos.OrderItemDTO.OrderItemResponseDTO;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderResponseDTO {
    private Long orderId;
    private String tableName;
    private String orderStatus;
    private LocalDateTime orderTime;
    private List<OrderItemResponseDTO> orderItemResponseDTO;
}
