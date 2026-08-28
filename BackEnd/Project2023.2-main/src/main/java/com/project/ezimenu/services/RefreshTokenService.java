package com.project.ezimenu.services;

import com.project.ezimenu.entities.RefreshToken;
import com.project.ezimenu.entities.User;
import com.project.ezimenu.exceptions.BadRequestException;
import com.project.ezimenu.repositories.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HexFormat;
import java.util.UUID;

@Service
public class RefreshTokenService {
    private final RefreshTokenRepository repository;
    private final long refreshDays;

    public RefreshTokenService(RefreshTokenRepository repository,
            @Value("${app.jwt.refresh-token-days:14}") long refreshDays) {
        this.repository = repository;
        this.refreshDays = refreshDays;
    }

    @Transactional
    public String create(User user) {
        String rawToken = UUID.randomUUID() + "." + UUID.randomUUID();
        RefreshToken token = new RefreshToken();
        token.setTokenHash(hash(rawToken));
        token.setUser(user);
        token.setExpiresAt(Instant.now().plus(refreshDays, ChronoUnit.DAYS));
        token.setRevoked(false);
        repository.save(token);
        return rawToken;
    }

    @Transactional
    public User rotate(String rawToken) throws BadRequestException {
        RefreshToken token = repository.findByTokenHashAndRevokedFalse(hash(rawToken))
                .orElseThrow(() -> new BadRequestException("Phiên đăng nhập không hợp lệ"));
        if (token.getExpiresAt().isBefore(Instant.now()) || !token.getUser().isEnabled()) {
            token.setRevoked(true);
            throw new BadRequestException("Phiên đăng nhập đã hết hạn");
        }
        token.setRevoked(true);
        return token.getUser();
    }

    @Transactional
    public void revoke(String rawToken) {
        repository.findByTokenHashAndRevokedFalse(hash(rawToken)).ifPresent(token -> {
            token.setRevoked(true);
            repository.save(token);
        });
    }

    private String hash(String value) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception exception) {
            throw new IllegalStateException("Không thể bảo vệ refresh token", exception);
        }
    }
}
