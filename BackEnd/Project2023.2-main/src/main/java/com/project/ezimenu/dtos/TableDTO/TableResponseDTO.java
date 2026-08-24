package com.project.ezimenu.dtos.TableDTO;

import lombok.Data;

@Data
public class TableResponseDTO {
    private long tableId;
    private String tableName;
    private String tableStatus;
    private String tableDescription;
    private String tableType;
    private Integer floorNumber;
    private Integer capacity;
    private long serviceFee;
    private int notificationNumber;
    private int doneDish;
    private int totalDish;
    private long totalTime;
}
