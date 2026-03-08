package com.project.ezimenu.services;

import com.project.ezimenu.dtos.DishDTO.DishRequestDTO;
import com.project.ezimenu.dtos.DishDTO.DishResponseDTO;
import com.project.ezimenu.entities.Dish;
import com.project.ezimenu.entities.Menu;
import com.project.ezimenu.exceptions.BadRequestException;
import com.project.ezimenu.exceptions.NotFoundException;
import com.project.ezimenu.repositories.DishRepository;
import com.project.ezimenu.repositories.MenuRepository;
import com.project.ezimenu.services.interfaces.IDishService;
import com.project.ezimenu.utils.Constants;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public class DishService implements IDishService {
    @Autowired
    private DishRepository dishRepository;
    @Autowired
    private MenuRepository menuRepository;
    @Autowired
    private CloudinaryService cloudinaryService;
    @Autowired
    private ModelMapper modelMapper;
    public Dish addDish(DishRequestDTO dishRequestDTO) throws NotFoundException, BadRequestException, IOException {
        if(dishRequestDTO.getDishName() == null
                || "".equals(dishRequestDTO.getDishName())
                || Objects.isNull(dishRequestDTO.getDishPrice())
                || Objects.isNull(dishRequestDTO.getMenuId())){
            throw new BadRequestException("Vui lòng nhập đầy đủ thông tin!");
        }
        if (dishRepository.existsByDishNameAndStatus(dishRequestDTO.getDishName(), dishRequestDTO.getDishStatus())) {
            throw new BadRequestException("Tên món ăn đã tồn tại!");
        }
        Menu menu = menuRepository.findById(dishRequestDTO.getMenuId())
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy thực đơn có id: " + dishRequestDTO.getMenuId()));
        String thumbnail = cloudinaryService.upload(dishRequestDTO.getThumbnail().getBytes(), dishRequestDTO.getThumbnail().getOriginalFilename(), "thumbnails");
        Dish newDish = new Dish();
        newDish.setMenu(menu);
        newDish.setDishName(dishRequestDTO.getDishName());
        newDish.setDishPrice(dishRequestDTO.getDishPrice());
        newDish.setDishStatus(dishRequestDTO.getDishStatus());
        newDish.setThumbnail(thumbnail);
        newDish.setStatus(Constants.ENTITY_STATUS.ACTIVE);
        menu.getDishes().add(newDish);
        return dishRepository.save(newDish);
    }
    public DishResponseDTO getDishById(Long dishId) throws NotFoundException {
        Dish dish = dishRepository.findByDishIdAndStatus(dishId, Constants.ENTITY_STATUS.ACTIVE)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy món ăn có id: " + dishId));
        return modelMapper.map(dish, DishResponseDTO.class);
    }

    public List<DishResponseDTO> getAllDishes() {
        List<Dish> dishes = dishRepository.findByStatus(Constants.ENTITY_STATUS.ACTIVE);
        return dishes.stream()
                .map(dish -> modelMapper.map(dish, DishResponseDTO.class))
                .collect(Collectors.toList());
    }
    public Dish updateDish(Long dishId, DishRequestDTO dishRequestDTO) throws NotFoundException, BadRequestException, IOException {
        if(dishRequestDTO.getDishName() == null
                || "".equals(dishRequestDTO.getDishName())
                || Objects.isNull(dishRequestDTO.getDishPrice())
                || Objects.isNull(dishRequestDTO.getMenuId())){
            throw new BadRequestException("Vui lòng nhập đầy đủ thông tin!");
        }
//        if (dishRepository.existsByDishNameAndStatus(dishRequestDTO.getDishName(), dishRequestDTO.getDishStatus())) {
//            throw new BadRequestException("Tên món ăn đã tồn tại!");
//        }
        Dish updatedDish = dishRepository.findByDishIdAndStatus(dishId, Constants.ENTITY_STATUS.ACTIVE)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy món ăn có id: " + dishId));
        Menu menu = menuRepository.findByMenuIdAndStatus(dishRequestDTO.getMenuId(), Constants.ENTITY_STATUS.ACTIVE)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy thực đơn có id: " + dishRequestDTO.getMenuId()));
        updatedDish.setMenu(menu);
        if (dishRequestDTO.getThumbnail() != null) {
            String thumbnail = cloudinaryService.upload(dishRequestDTO.getThumbnail().getBytes(), dishRequestDTO.getThumbnail().getOriginalFilename(), "thumbnails");
            updatedDish.setThumbnail(thumbnail);
        }
        updatedDish.setDishName(dishRequestDTO.getDishName());
        updatedDish.setDishPrice(dishRequestDTO.getDishPrice());
        updatedDish.setDishStatus(dishRequestDTO.getDishStatus());

        return dishRepository.save(updatedDish);
    }

    public Dish deleteDish(Long dishId) throws NotFoundException {
        Dish dish = dishRepository.findByDishIdAndStatus(dishId, Constants.ENTITY_STATUS.ACTIVE)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy món ăn có id: " + dishId));
        dish.setStatus(Constants.ENTITY_STATUS.INACTIVE);
        return dishRepository.save(dish);
    }
}
