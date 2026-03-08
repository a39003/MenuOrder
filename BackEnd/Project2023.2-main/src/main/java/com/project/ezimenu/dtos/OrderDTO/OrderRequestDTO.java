package com.project.ezimenu.dtos.OrderDTO;

import com.project.ezimenu.dtos.OrderItemDTO.OrderItemRequestDTO;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OrderRequestDTO {
    private long tableId;
    private LocalDateTime orderTime;
    private List<OrderItemRequestDTO> orderItemRequestDTO;
}
