package com.project.ezimenu.dtos.BillDTO;

import com.project.ezimenu.dtos.BillItemDTO.BillItemResponseDTO;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PaidBillResponseDTO {
    private long billId;
    private long orderId;
    private long tableId;
    private String tableName;
    private String customerName;
    private long totalAmount;
    private LocalDateTime paidAt;
    private int totalItems;
    private List<BillItemResponseDTO> items;
}
