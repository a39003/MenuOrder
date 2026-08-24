package com.project.ezimenu.controllers;

import com.project.ezimenu.dtos.BillDTO.BillResponseDTO;
import com.project.ezimenu.exceptions.BadRequestException;
import com.project.ezimenu.exceptions.NotFoundException;
import com.project.ezimenu.services.BillService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
public class BillController {
    @Autowired
    private BillService billService;
    @GetMapping("/admin/bills")
    public ResponseEntity<?> getPaidBills(
            @RequestParam(required = false) LocalDate from,
            @RequestParam(required = false) LocalDate to,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(billService.getPaidBills(from, to, search));
    }

    @GetMapping("/admin/bills/{billId}")
    public ResponseEntity<?> getPaidBill(@PathVariable Long billId) throws NotFoundException {
        return ResponseEntity.ok(billService.getPaidBill(billId));
    }

    @GetMapping("/orders/{orderId}/bill")
    public ResponseEntity<?> getBill(@PathVariable Long orderId) throws NotFoundException {
        BillResponseDTO bill = billService.getBill(orderId);
        if(bill == null) throw new NotFoundException("Đơn hàng này chưa có hóa đơn!");
        return ResponseEntity.ok(bill);
    }
    @RequestMapping(path = "/admin/orders/{orderId}/bill", method = RequestMethod.POST)
    public ResponseEntity<?> addBill(@PathVariable Long orderId) throws NotFoundException, BadRequestException {
        billService.addBill(orderId);
        return ResponseEntity.ok(billService.getBill(orderId));
    }
    @RequestMapping(path = "/admin/orders/{orderId}/bill", method = RequestMethod.DELETE)
public ResponseEntity<?> deleteBill(@PathVariable Long orderId) throws NotFoundException {
        billService.deleteBill(orderId);
        return ResponseEntity.ok("Đã xóa bill thành công!");
    }
}
