package com.project.ezimenu.dtos.AuthDTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponseDTO {
    private String jwt;
    private String accessToken;
    private String refreshToken;
    private UserSessionDTO user;
    private boolean status;

    public record UserSessionDTO(long userId, String username, String fullName, String role) {}
}
