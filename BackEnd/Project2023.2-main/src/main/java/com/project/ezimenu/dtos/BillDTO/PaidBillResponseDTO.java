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
    private String tableType;
    private int floorNumber;
    private int capacity;
    private String customerName;
    private long totalAmount;
    private long foodAmount;
    private long tableServiceFee;
    private LocalDateTime paidAt;
    private String paymentMethod;
    private String transactionCode;
    private String paymentStatus;
    private int totalItems;
    private List<BillItemResponseDTO> items;
}
