package com.project.ezimenu.dtos.TableDTO;
import lombok.Data;

@Data
public class TableRequestDTO {
    private String tableName;
    private String tableStatus;
    private String tableDescription;
    private String tableType;
    private Integer floorNumber;
    private Integer capacity;
}
