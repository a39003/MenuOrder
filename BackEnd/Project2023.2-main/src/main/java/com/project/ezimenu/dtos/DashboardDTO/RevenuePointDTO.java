package com.project.ezimenu.dtos.DashboardDTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RevenuePointDTO {
    private String date;
    private long revenue;
    private long orderCount;
}
