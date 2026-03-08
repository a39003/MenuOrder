package com.project.ezimenu.configurations;

import com.project.ezimenu.dtos.DishDTO.DishResponseDTO;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.lang.reflect.Type;
import java.util.List;

@Configuration
public class ModelMapperConfiguration {
    @Bean
    public ModelMapper modelMapper(){
        return new ModelMapper();
    }
    @Bean
    public Type listType() {
        return new TypeToken<List<DishResponseDTO>>() {}.getType();
    }
}
