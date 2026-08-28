package com.project.ezimenu.repositories;

import com.project.ezimenu.entities.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByTokenHashAndRevokedFalse(String tokenHash);
    void deleteByUserUserId(long userId);
}
