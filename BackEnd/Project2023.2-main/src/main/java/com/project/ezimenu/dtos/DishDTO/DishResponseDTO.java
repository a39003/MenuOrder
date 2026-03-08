package com.project.ezimenu.dtos.DishDTO;

import lombok.Data;

@Data
public class DishResponseDTO {
    private long dishId;
    private String dishName;
    private int dishPrice;
    private String dishStatus;
    private String thumbnail;
    private Long menuId;
}
