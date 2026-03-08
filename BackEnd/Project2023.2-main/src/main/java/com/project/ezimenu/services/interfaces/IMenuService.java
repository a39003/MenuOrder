package com.project.ezimenu.services.interfaces;

import com.project.ezimenu.dtos.MenuDTO.MenuRequestDTO;
import com.project.ezimenu.dtos.MenuDTO.MenuResponseDTO;
import com.project.ezimenu.entities.Menu;
import com.project.ezimenu.exceptions.BadRequestException;
import com.project.ezimenu.exceptions.NotFoundException;

import java.util.List;

public interface IMenuService {
    List<MenuResponseDTO> getAllMenus();
    List<MenuResponseDTO> getAllMenusAndCreateOrder(Long tableId) throws NotFoundException;
    MenuResponseDTO getMenuById(Long menuId) throws NotFoundException;
    Menu addMenu(MenuRequestDTO menuRequestDTO) throws BadRequestException;
    Menu updateMenu(Long menuId, MenuRequestDTO menuRequestDTO) throws NotFoundException, BadRequestException;
    Menu deleteMenu(Long menuId) throws NotFoundException;
}
