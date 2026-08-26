package com.project.ezimenu.dtos.DishDTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
public class DishRequestDTO {
    @NotBlank
    private String dishName;
    @NotNull
    private Long menuId;
    @NotNull
    private Integer dishPrice;
    @NotNull
    private Short dishStatus;
    private MultipartFile thumbnail;
    private List<MultipartFile> images;
}
