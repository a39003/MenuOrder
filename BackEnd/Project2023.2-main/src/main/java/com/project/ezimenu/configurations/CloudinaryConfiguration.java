package com.project.ezimenu.configurations;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class CloudinaryConfiguration {
    @Bean
    public Cloudinary getCloudinary()
    {
        Map config = new HashMap();
        config.put("cloud_name", "dj2lvmrop");
        config.put("api_key", "836157481113457");
        config.put("api_secret", "phmoefA32dPgbCIfoyoooX4bx34");
        config.put("secure", true);
        return new Cloudinary(config);
    }
}

