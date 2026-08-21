package com.project.ezimenu.dtos.DashboardDTO;

import lombok.Data;

import java.util.List;

@Data
public class DashboardResponseDTO {
    private long todayRevenue;
    private long todayOrders;
    private long todayDishes;
    private long activeTables;
    private long periodRevenue;
    private List<RevenuePointDTO> revenueByDay;
    private List<TopDishDTO> topDishes;
}
