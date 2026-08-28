package com.project.ezimenu.dtos.AuthDTO;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RefreshTokenRequestDTO {
    @NotBlank
    private String refreshToken;
}
