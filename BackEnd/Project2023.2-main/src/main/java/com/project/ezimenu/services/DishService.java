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
import org.springframework.web.multipart.MultipartFile;
import jakarta.transaction.Transactional;

import java.io.IOException;
import java.util.ArrayList;
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
    @Transactional
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
        List<String> images = uploadImages(dishRequestDTO);
        if (images.isEmpty()) {
            throw new BadRequestException("Vui lòng thêm ít nhất một ảnh món ăn!");
        }
        String thumbnail = images.get(0);
        Dish newDish = new Dish();
        newDish.setMenu(menu);
        newDish.setDishName(dishRequestDTO.getDishName());
        newDish.setDishPrice(dishRequestDTO.getDishPrice());
        newDish.setDishStatus(dishRequestDTO.getDishStatus());
        newDish.setThumbnail(thumbnail);
        newDish.setImages(images);
        applyDetails(newDish, dishRequestDTO);
        newDish.setStatus(Constants.ENTITY_STATUS.ACTIVE);
        menu.getDishes().add(newDish);
        return dishRepository.save(newDish);
    }
    public DishResponseDTO getDishById(Long dishId) throws NotFoundException {
        Dish dish = dishRepository.findByDishIdAndStatus(dishId, Constants.ENTITY_STATUS.ACTIVE)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy món ăn có id: " + dishId));
        return toResponse(dish);
    }

    public List<DishResponseDTO> getAllDishes() {
        List<Dish> dishes = dishRepository.findByStatus(Constants.ENTITY_STATUS.ACTIVE);
        return dishes.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    @Transactional
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
        List<String> retainedImages = dishRequestDTO.getRetainedImages();
        if (retainedImages != null) {
            updatedDish.setImages(new ArrayList<>(retainedImages.stream().limit(6).toList()));
        }

        List<String> newImages = uploadImages(dishRequestDTO);
        if (!newImages.isEmpty()) {
            List<String> allImages = updatedDish.getImages() == null
                    ? new ArrayList<>() : new ArrayList<>(updatedDish.getImages());
            if (allImages.isEmpty() && updatedDish.getThumbnail() != null) {
                allImages.add(updatedDish.getThumbnail());
            }
            newImages.stream()
                    .limit(Math.max(0, 6 - allImages.size()))
                    .forEach(allImages::add);
            updatedDish.setImages(allImages);
            if (!allImages.isEmpty()) updatedDish.setThumbnail(allImages.get(0));
        }
        if (newImages.isEmpty() && retainedImages != null) {
            List<String> remaining = updatedDish.getImages();
            updatedDish.setThumbnail(remaining == null || remaining.isEmpty() ? null : remaining.get(0));
        }
        updatedDish.setDishName(dishRequestDTO.getDishName());
        updatedDish.setDishPrice(dishRequestDTO.getDishPrice());
        updatedDish.setDishStatus(dishRequestDTO.getDishStatus());
        applyDetails(updatedDish, dishRequestDTO);

        return dishRepository.save(updatedDish);
    }

    private List<String> uploadImages(DishRequestDTO request) throws IOException {
        List<MultipartFile> files = new ArrayList<>();
        if (request.getImages() != null) {
            request.getImages().stream()
                    .filter(file -> file != null && !file.isEmpty())
                    .limit(6)
                    .forEach(files::add);
        }
        if (files.isEmpty() && request.getThumbnail() != null && !request.getThumbnail().isEmpty()) {
            files.add(request.getThumbnail());
        }
        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            urls.add(cloudinaryService.upload(file.getBytes(), file.getOriginalFilename(), "dish-images"));
        }
        return urls;
    }

    private void applyDetails(Dish dish, DishRequestDTO request) {
        dish.setDescription(request.getDescription());
        dish.setIngredients(request.getIngredients());
        dish.setSpiceLevel(Math.max(0, Math.min(request.getSpiceLevel() == null ? 0 : request.getSpiceLevel(), 3)));
        dish.setFeatured(Boolean.TRUE.equals(request.getFeatured()));
    }

    private DishResponseDTO toResponse(Dish dish) {
        DishResponseDTO response = modelMapper.map(dish, DishResponseDTO.class);
        List<String> images = dish.getImages() == null
                ? new ArrayList<>() : new ArrayList<>(dish.getImages());
        if (images.isEmpty() && dish.getThumbnail() != null) images.add(dish.getThumbnail());
        response.setImages(images);
        return response;
    }

    public Dish deleteDish(Long dishId) throws NotFoundException {
        Dish dish = dishRepository.findByDishIdAndStatus(dishId, Constants.ENTITY_STATUS.ACTIVE)
                .orElseThrow(() -> new NotFoundException("Không thể tìm thấy món ăn có id: " + dishId));
        dish.setStatus(Constants.ENTITY_STATUS.INACTIVE);
        return dishRepository.save(dish);
    }
}
