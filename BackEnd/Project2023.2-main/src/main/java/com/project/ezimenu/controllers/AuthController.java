package com.project.ezimenu.controllers;

import com.project.ezimenu.dtos.AuthDTO.AuthRequestDTO;
import com.project.ezimenu.dtos.AuthDTO.AuthResponseDTO;
import com.project.ezimenu.dtos.AuthDTO.RefreshTokenRequestDTO;
import com.project.ezimenu.entities.User;
import com.project.ezimenu.security.JwtTokenProvider;
import com.project.ezimenu.services.UserService;
import com.project.ezimenu.services.RefreshTokenService;
import jakarta.validation.Valid;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
    @Autowired
    private RefreshTokenService refreshTokenService;
    @PostMapping("/login")
    public ResponseEntity<?> signIn(@RequestBody AuthRequestDTO authRequestDTO) throws Exception{
        AuthResponseDTO authResponseDTO= userService.signIn(authRequestDTO);
        System.out.println(SecurityContextHolder.getContext());
        return new ResponseEntity<>(authResponseDTO, HttpStatus.OK);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody @Valid RefreshTokenRequestDTO request) throws Exception {
        User user = refreshTokenService.rotate(request.getRefreshToken());
        var authentication = new UsernamePasswordAuthenticationToken(user.getUsername(), null,
                userService.loadUserByUsername(user.getUsername()).getAuthorities());
        String accessToken = jwtTokenProvider.generateToken(authentication);
        AuthResponseDTO response = new AuthResponseDTO();
        response.setJwt(accessToken);
        response.setAccessToken(accessToken);
        response.setRefreshToken(refreshTokenService.create(user));
        response.setStatus(true);
        response.setUser(new AuthResponseDTO.UserSessionDTO(
                user.getUserId(), user.getUsername(), user.getFullName(), user.getRole()));
        return ResponseEntity.ok(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody @Valid RefreshTokenRequestDTO request) {
        refreshTokenService.revoke(request.getRefreshToken());
        return ResponseEntity.noContent().build();
    }
}
