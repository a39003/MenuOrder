package com.project.ezimenu.controllers;

import com.project.ezimenu.dtos.AuthDTO.AuthRequestDTO;
import com.project.ezimenu.dtos.AuthDTO.AuthResponseDTO;
import com.project.ezimenu.security.JwtTokenProvider;
import com.project.ezimenu.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    @Autowired
    private UserService userService;
    @PostMapping("/login")
    public ResponseEntity<?> signIn(@RequestBody AuthRequestDTO authRequestDTO) throws Exception{
        AuthResponseDTO authResponseDTO= userService.signIn(authRequestDTO);
        System.out.println(SecurityContextHolder.getContext());
        return new ResponseEntity<>(authResponseDTO, HttpStatus.OK);
    }
}
