package com.project.ezimenu.services.interfaces;

import com.project.ezimenu.dtos.BillDTO.BillResponseDTO;
import com.project.ezimenu.entities.Bill;
import com.project.ezimenu.exceptions.BadRequestException;
import com.project.ezimenu.exceptions.NotFoundException;

public interface IBillService {
    BillResponseDTO getBill(Long orderId)throws NotFoundException;
    Bill addBill(Long orderId) throws NotFoundException, BadRequestException;
    void deleteBill(Long orderId) throws NotFoundException;
}
