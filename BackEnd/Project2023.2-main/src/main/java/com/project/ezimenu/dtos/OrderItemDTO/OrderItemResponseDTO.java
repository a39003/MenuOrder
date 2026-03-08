package com.project.ezimenu.dtos.OrderItemDTO;

import lombok.Data;

@Data
public class OrderItemResponseDTO {
    private long orderItemId;
    private String dishName;
    private int dishQuantity;
    private int customPrice;
    private String dishNote;
    private String dishStatus;
}
