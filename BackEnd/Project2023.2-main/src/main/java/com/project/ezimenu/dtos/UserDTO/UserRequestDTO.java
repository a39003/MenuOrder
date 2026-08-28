package com.project.ezimenu.dtos.UserDTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserRequestDTO {
    @NotBlank private String username;
    private String password;
    private String fullName;
    @NotBlank private String role;
    private Boolean enabled;
}
