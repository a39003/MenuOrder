package com.project.ezimenu.controllers;

import com.project.ezimenu.dtos.UserDTO.UserRequestDTO;
import com.project.ezimenu.dtos.UserDTO.UserResponseDTO;
import com.project.ezimenu.entities.User;
import com.project.ezimenu.exceptions.BadRequestException;
import com.project.ezimenu.exceptions.NotFoundException;
import com.project.ezimenu.repositories.RefreshTokenRepository;
import com.project.ezimenu.repositories.UserRepository;
import com.project.ezimenu.utils.Role;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/users")
public class UserController {
    private final UserRepository users;
    private final RefreshTokenRepository refreshTokens;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository users, RefreshTokenRepository refreshTokens,
                          PasswordEncoder passwordEncoder) {
        this.users = users;
        this.refreshTokens = refreshTokens;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    public List<UserResponseDTO> list() {
        return users.findAll().stream().map(this::toResponse).toList();
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody @Valid UserRequestDTO request) throws BadRequestException {
        if (users.findByUsername(request.getUsername().trim()).isPresent())
            throw new BadRequestException("Tên đăng nhập đã tồn tại");
        if (request.getPassword() == null || request.getPassword().length() < 6)
            throw new BadRequestException("Mật khẩu phải có ít nhất 6 ký tự");
        User user = new User();
        apply(user, request, true);
        return new ResponseEntity<>(toResponse(users.save(user)), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Transactional
    public UserResponseDTO update(@PathVariable long id, @RequestBody @Valid UserRequestDTO request)
            throws NotFoundException, BadRequestException {
        User user = users.findById(id).orElseThrow(() -> new NotFoundException("Không tìm thấy tài khoản"));
        if (users.findByUsername(request.getUsername().trim())
                .filter(other -> other.getUserId() != id).isPresent())
            throw new BadRequestException("Tên đăng nhập đã tồn tại");
        apply(user, request, false);
        if (!user.isEnabled()) refreshTokens.deleteByUserUserId(user.getUserId());
        return toResponse(users.save(user));
    }

    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<?> disable(@PathVariable long id) throws NotFoundException {
        User user = users.findById(id).orElseThrow(() -> new NotFoundException("Không tìm thấy tài khoản"));
        user.setEnabled(false);
        users.save(user);
        refreshTokens.deleteByUserUserId(id);
        return ResponseEntity.noContent().build();
    }

    private void apply(User user, UserRequestDTO request, boolean creating) throws BadRequestException {
        String role;
        try { role = Role.valueOf(request.getRole()).name(); }
        catch (Exception error) { throw new BadRequestException("Vai trò không hợp lệ"); }
        if (Role.CUSTOMER.name().equals(role)) throw new BadRequestException("Không thể cấp vai trò CUSTOMER");
        user.setUsername(request.getUsername().trim());
        user.setFullName(request.getFullName());
        user.setRole(role);
        user.setEnabled(request.getEnabled() == null || request.getEnabled());
        if (request.getPassword() != null && !request.getPassword().isBlank())
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        else if (creating) throw new BadRequestException("Vui lòng nhập mật khẩu");
    }

    private UserResponseDTO toResponse(User user) {
        return new UserResponseDTO(user.getUserId(), user.getUsername(), user.getFullName(),
                user.getRole(), user.isEnabled());
    }
}
