package com.project.ezimenu.dtos.OrderItemDTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class OrderItemRequestDTO {
    @NotBlank
    private Long dishId;
    @NotBlank
    private int dishQuantity;
    private int customPrice;
    private String dishNote;
    private String dishStatus;
}
