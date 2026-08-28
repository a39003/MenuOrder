package com.project.ezimenu.dtos.BillDTO;

import lombok.Data;

@Data
public class PaymentConfirmDTO {
    private String paymentMethod;
    private String transactionCode;
}
