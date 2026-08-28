package com.project.ezimenu.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Collection;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;
@Configuration
public class JwtTokenProvider {
    private final SecretKey key;
    private final long accessTokenMs;

    public JwtTokenProvider(@Value("${app.jwt.secret}") String secret,
                            @Value("${app.jwt.access-token-minutes:15}") long minutes) {
        key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        accessTokenMs = minutes * 60_000L;
    }
    public String generateToken(Authentication auth) {
        return Jwts.builder()
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenMs))
                .claim("username",auth.getName())
                .claim("type", "access")
                .signWith(key)
                .compact();
    }
    public String getUsernameFromJwtToken(String jwt) {
        jwt=jwt.substring(7);

        Claims claims=Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt).getBody();
        return String.valueOf(claims.get("username"));
    }
    public Claims parse(String jwt) {
        return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(jwt).getBody();
    }
    public String populateAuthorities(Collection<? extends GrantedAuthority> collection) {
        Set<String> auths=new HashSet<>();

        for(GrantedAuthority authority:collection) {
            auths.add(authority.getAuthority());
        }
        return String.join(",",auths);
    }
}
