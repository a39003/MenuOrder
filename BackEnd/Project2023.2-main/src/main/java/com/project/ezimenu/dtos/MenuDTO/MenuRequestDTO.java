package com.project.ezimenu.dtos.MenuDTO;
import com.project.ezimenu.dtos.DishDTO.DishRequestDTO;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.List;

@Data
public class MenuRequestDTO {
    @NotBlank(message = "Tên thực đơn không được để trống!")
    private String menuTitle;
    private String menuDescription;
}
