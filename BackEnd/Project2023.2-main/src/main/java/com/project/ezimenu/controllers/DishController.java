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

import java.io.IOException;
import java.util.List;

@RestController
public class DishController {
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
    public ResponseEntity<?> addDish(@ModelAttribute @Valid DishRequestDTO dishRequestDTO) throws NotFoundException, BadRequestException, IOException {
        Dish newDish = dishService.addDish(dishRequestDTO);
        return new ResponseEntity<>(newDish, HttpStatus.CREATED);
    }
    @RequestMapping(path = "/admin/dishes/{dishId}", method = RequestMethod.PUT, consumes = {MediaType.MULTIPART_FORM_DATA_VALUE})
    public ResponseEntity<?> updateDish(@PathVariable Long dishId,
                                        @ModelAttribute @Valid DishRequestDTO dishRequestDTO)
            throws NotFoundException, BadRequestException, IOException {
        Dish updatedDish = dishService.updateDish(dishId, dishRequestDTO);
        return new ResponseEntity<>(updatedDish, HttpStatus.ACCEPTED);
    }
    @RequestMapping(path = "/admin/dishes/{dishId}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteDish(@PathVariable Long dishId) throws NotFoundException {
        Dish dish = dishService.deleteDish(dishId);
        return new ResponseEntity<>(dish, HttpStatus.OK);
    }
}
