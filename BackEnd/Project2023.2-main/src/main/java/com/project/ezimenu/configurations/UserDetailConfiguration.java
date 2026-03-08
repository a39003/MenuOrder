package com.project.ezimenu.configurations;

import com.project.ezimenu.services.UserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UserDetailConfiguration {
    @Bean
    public UserService userService(){
        return new UserService();
    }
}
