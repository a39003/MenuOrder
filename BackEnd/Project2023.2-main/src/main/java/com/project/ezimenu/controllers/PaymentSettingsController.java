package com.project.ezimenu.controllers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/settings/payment")
public class PaymentSettingsController {
    @Value("${app.payment.bank-code}") private String bankCode;
    @Value("${app.payment.bank-name}") private String bankName;
    @Value("${app.payment.account-number}") private String accountNumber;
    @Value("${app.payment.account-name}") private String accountName;

    @GetMapping
    public ResponseEntity<?> getPaymentSettings() {
        return ResponseEntity.ok(Map.of(
                "bankCode", bankCode,
                "bankName", bankName,
                "accountNumber", accountNumber,
                "accountName", accountName));
    }
}
