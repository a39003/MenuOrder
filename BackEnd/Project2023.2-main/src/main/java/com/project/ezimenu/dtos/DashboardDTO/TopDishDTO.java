package com.project.ezimenu.dtos.DashboardDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TopDishDTO {
    private String dishName;
    private long quantity;
    private long revenue;
}
