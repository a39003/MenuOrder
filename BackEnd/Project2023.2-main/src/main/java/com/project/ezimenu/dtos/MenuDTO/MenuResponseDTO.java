package com.project.ezimenu.dtos.MenuDTO;

import com.project.ezimenu.dtos.DishDTO.DishResponseDTO;
import lombok.Data;

import java.util.List;
@Data
public class MenuResponseDTO {
    private long menuId;
    private String menuTitle;
    private String menuDescription;
    private List<DishResponseDTO> dishResponseDTO;
}
