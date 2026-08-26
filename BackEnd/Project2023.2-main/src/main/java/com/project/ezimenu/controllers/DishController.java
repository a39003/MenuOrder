package com.project.ezimenu.controllers;

import com.project.ezimenu.dtos.DishDTO.DishRequestDTO;
import com.project.ezimenu.dtos.DishDTO.DishResponseDTO;
import com.project.ezimenu.entities.Dish;
import com.project.ezimenu.exceptions.BadRequestException;
import com.project.ezimenu.exceptions.NotFoundException;
import com.project.ezimenu.services.DishService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;
import java.util.List;

@RestController
public class DishController {
    private static final Logger LOGGER = LoggerFactory.getLogger(DishController.class);

    @Autowired
    private DishService dishService;

    @GetMapping("/dishes")
    public ResponseEntity<?> getAllDishes() throws NotFoundException {
        List<DishResponseDTO> dishes = dishService.getAllDishes();
        if(dishes.isEmpty()){
            throw new NotFoundException("Hiện không có món ăn nào!");
        }
        return ResponseEntity.ok(dishes);
    }

    @GetMapping("/dishes/{dishId}")
    public ResponseEntity<?> getDishById(@PathVariable Long dishId) throws NotFoundException {
        DishResponseDTO dish = dishService.getDishById(dishId);
        return ResponseEntity.ok(dish);
    }

    @RequestMapping(path = "/admin/dishes", method = RequestMethod.POST, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> addDish(@ModelAttribute @Valid DishRequestDTO dishRequestDTO) throws Exception {
        try {
            Dish newDish = dishService.addDish(dishRequestDTO);
            DishResponseDTO response = dishService.getDishById(newDish.getDishId());
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (Exception exception) {
            LOGGER.error("ADD_DISH_FAILED name={}, menuId={}, imageCount={}",
                    dishRequestDTO.getDishName(), dishRequestDTO.getMenuId(),
                    dishRequestDTO.getImages() == null ? 0 : dishRequestDTO.getImages().size(),
                    exception);
            throw exception;
        }
    }
    @RequestMapping(path = "/admin/dishes/{dishId}", method = RequestMethod.PUT, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> updateDish(@PathVariable Long dishId,
                                        @ModelAttribute @Valid DishRequestDTO dishRequestDTO)
            throws Exception {
        try {
            dishService.updateDish(dishId, dishRequestDTO);
            DishResponseDTO response = dishService.getDishById(dishId);
            return new ResponseEntity<>(response, HttpStatus.ACCEPTED);
        } catch (Exception exception) {
            LOGGER.error("UPDATE_DISH_FAILED dishId={}, name={}, menuId={}, imageCount={}",
                    dishId, dishRequestDTO.getDishName(), dishRequestDTO.getMenuId(),
                    dishRequestDTO.getImages() == null ? 0 : dishRequestDTO.getImages().size(),
                    exception);
            throw exception;
        }
    }
    @RequestMapping(path = "/admin/dishes/{dishId}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteDish(@PathVariable Long dishId) throws NotFoundException {
        Dish dish = dishService.deleteDish(dishId);
        return new ResponseEntity<>(dish, HttpStatus.OK);
    }
}
