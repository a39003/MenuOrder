package com.project.ezimenu.dtos.UserDTO;

public record UserResponseDTO(long userId, String username, String fullName,
                              String role, boolean enabled) {}
