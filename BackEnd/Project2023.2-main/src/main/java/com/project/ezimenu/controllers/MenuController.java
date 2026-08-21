package com.project.ezimenu.controllers;

import com.project.ezimenu.dtos.MenuDTO.MenuRequestDTO;
import com.project.ezimenu.dtos.MenuDTO.MenuResponseDTO;
import com.project.ezimenu.entities.Menu;
import com.project.ezimenu.entities.Notification;
import com.project.ezimenu.exceptions.BadRequestException;
import com.project.ezimenu.exceptions.NotFoundException;
import com.project.ezimenu.services.MenuService;
import com.project.ezimenu.services.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MenuController {
    @Autowired
    private MenuService menuService;
    @Autowired
    private NotificationService notificationService;
    @GetMapping("/menus")
    public ResponseEntity<?> getAllMenus() throws NotFoundException {
        List<MenuResponseDTO> menus = menuService.getAllMenus();
        if(menus.isEmpty()){
            throw new NotFoundException("Hiện không có menu nào!");
        }
        return ResponseEntity.ok(menus);
    }
    @GetMapping("/{tableId}/menus")
    public ResponseEntity<?> getAllMenusAndCreateOrder(@PathVariable Long tableId,
                                                        @RequestParam String customerName) throws NotFoundException, BadRequestException {
        if (customerName == null || customerName.trim().isEmpty()) {
            throw new BadRequestException("Vui lòng nhập tên khách hàng!");
        }
        List<MenuResponseDTO> menus = menuService.getAllMenusAndCreateOrder(tableId, customerName.trim());

        if(menus.isEmpty()){
            throw new NotFoundException("Hiện không có menu nào!");
        }
        Notification notification = notificationService.addNotification(tableId, "Khách ở bàn " + tableId + " đang order.");
        return ResponseEntity.ok(menus);
    }
    @GetMapping("/menus/{menuId}")
    public ResponseEntity<?> getMenuById(@PathVariable Long menuId) throws NotFoundException {
        MenuResponseDTO menu = menuService.getMenuById(menuId);
        return ResponseEntity.ok(menu);
    }
    @RequestMapping(path = "/admin/menus", method = RequestMethod.POST)
    public ResponseEntity<?> addMenu(@RequestBody MenuRequestDTO menuRequestDTO) throws BadRequestException {
        Menu newMenu = menuService.addMenu(menuRequestDTO);
        return new ResponseEntity<>(newMenu, HttpStatus.CREATED);
    }
    @RequestMapping(path = "/admin/menus/{menuId}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateMenu(@PathVariable Long menuId,
                                        @RequestBody MenuRequestDTO menuRequestDTO)
            throws NotFoundException, BadRequestException {
        Menu updatedMenu = menuService.updateMenu(menuId, menuRequestDTO);
        return new ResponseEntity<>(updatedMenu, HttpStatus.ACCEPTED);
    }
    @RequestMapping(path = "/admin/menus/{menuId}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteMenu(@PathVariable Long menuId) throws NotFoundException {
        Menu menu = menuService.deleteMenu(menuId);
        return new ResponseEntity<>(menu, HttpStatus.OK);
    }
}
