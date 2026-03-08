package com.project.ezimenu.configurations;

import com.project.ezimenu.services.DishService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DishConfiguration {
    @Bean
    public DishService dishService(){
        return new DishService();
    }
}
