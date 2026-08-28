package com.project.ezimenu.dtos.DishDTO;

import lombok.Data;

import java.util.List;

@Data
public class DishResponseDTO {
    private long dishId;
    private String dishName;
    private int dishPrice;
    private String dishStatus;
    private String thumbnail;
    private List<String> images;
    private Long menuId;
    private String description;
    private String ingredients;
    private Integer spiceLevel;
    private Boolean featured;
}
