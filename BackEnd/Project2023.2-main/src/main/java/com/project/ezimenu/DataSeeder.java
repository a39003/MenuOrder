package com.project.ezimenu;

import com.project.ezimenu.entities.User;
import com.project.ezimenu.repositories.UserRepository;
import com.project.ezimenu.utils.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Component
public class DataSeeder implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void run(String...args) {
        migrateDishImagesToJson();

        String adminUsername = "admin@gmail.com";
        if (userRepository.findByUsername(adminUsername).isEmpty()) {
            User adminUser = new User();
            adminUser.setPassword(passwordEncoder.encode("admin"));
            adminUser.setUsername(adminUsername);
            adminUser.setRole(Role.ADMIN.toString());
            userRepository.save(adminUser);
        }
    }

    private void migrateDishImagesToJson() {
        Integer tableExists = jdbcTemplate.queryForObject("""
                SELECT COUNT(*) FROM information_schema.tables
                WHERE table_schema = DATABASE() AND table_name = 'dish_images'
                """, Integer.class);
        if (tableExists == null || tableExists == 0) return;

        Map<Long, List<String>> imagesByDish = new LinkedHashMap<>();
        jdbcTemplate.query("SELECT dishId, imageUrl FROM dish_images", resultSet -> {
            long dishId = resultSet.getLong("dishId");
            String imageUrl = resultSet.getString("imageUrl");
            if (imageUrl != null && !imageUrl.isBlank()) {
                imagesByDish.computeIfAbsent(dishId, ignored -> new ArrayList<>()).add(imageUrl);
            }
        });

        imagesByDish.forEach((dishId, images) -> {
            try {
                jdbcTemplate.update("""
                        UPDATE dishes SET images = ?
                        WHERE dishId = ? AND (images IS NULL OR images = '' OR images = '[]')
                        """, objectMapper.writeValueAsString(images), dishId);
            } catch (Exception exception) {
                throw new IllegalStateException("Không thể chuyển dữ liệu ảnh của món " + dishId, exception);
            }
        });
    }
}
