package com.project.ezimenu;

import com.project.ezimenu.entities.User;
import com.project.ezimenu.repositories.UserRepository;
import com.project.ezimenu.utils.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void run(String...args) {
        // Một số database cloud không áp dụng đầy đủ ddl-auto khi thêm
        // ElementCollection. Tạo bảng lưu nhiều ảnh trước khi API món ăn chạy.
        jdbcTemplate.execute("""
                CREATE TABLE IF NOT EXISTS dish_images (
                    id BIGINT NOT NULL AUTO_INCREMENT,
                    dishId BIGINT NOT NULL,
                    imageUrl VARCHAR(1000),
                    PRIMARY KEY (id),
                    INDEX idx_dish_images_dish_id (dishId)
                ) ENGINE=InnoDB
                """);

        String adminUsername = "admin@gmail.com";
        if (userRepository.findByUsername(adminUsername).isEmpty()) {
            User adminUser = new User();
            adminUser.setPassword(passwordEncoder.encode("admin"));
            adminUser.setUsername(adminUsername);
            adminUser.setRole(Role.ADMIN.toString());
            userRepository.save(adminUser);
        }
    }
}
