package com.project.ezimenu.services.interfaces;

import com.project.ezimenu.dtos.TableDTO.TableRequestDTO;
import com.project.ezimenu.dtos.TableDTO.TableResponseDTO;
import com.project.ezimenu.entities.Table;
import com.project.ezimenu.exceptions.BadRequestException;
import com.project.ezimenu.exceptions.NotFoundException;

import java.util.List;

public interface ITableService {
    List<TableResponseDTO> getAllTables();
    TableResponseDTO getTableById(Long tableId) throws NotFoundException;
    List<TableResponseDTO> getTablesByStatus(String status) throws NotFoundException;
    Table addTable(TableRequestDTO tableRequestDTO) throws BadRequestException;
    Table updateTable(Long tableId, TableRequestDTO tableRequestDTO) throws NotFoundException, BadRequestException;
    Table updateTableStatus(Long tableId, String status) throws NotFoundException;
    Table deleteTable(Long tableId) throws NotFoundException;
}
