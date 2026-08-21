// package com.project.ezimenu.security;

// import jakarta.servlet.http.HttpServletRequest;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;
// import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.CorsConfigurationSource;

// import java.util.Arrays;
// import java.util.Collections;
// @Configuration
// @EnableWebSecurity
// @EnableGlobalMethodSecurity(prePostEnabled = true, securedEnabled = true, jsr250Enabled = true)
// public class SecurityConfiguration {
//     @Bean
//     public PasswordEncoder passwordEncoder() {
//         return new BCryptPasswordEncoder();
//     }
//     @Bean
//     public JwtTokenValidator jwtTokenValidator() {
//         return new JwtTokenValidator();
//     }
//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//         http
//                 .sessionManagement()
//                 .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
//                 .and()
//                 .authorizeHttpRequests(Authorize -> Authorize
//                         .requestMatchers("/orders/**").permitAll()
//                         .requestMatchers("/admin/**").hasRole("ADMIN")
//                         .anyRequest().permitAll()
//                 )
//               .addFilterBefore(jwtTokenValidator(), BasicAuthenticationFilter.class)
//                 .csrf().disable()
//                 .cors().configurationSource(new CorsConfigurationSource() {

//                     @Override
//                     public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {

//                         CorsConfiguration cfg = new CorsConfiguration();

//                         cfg.setAllowedOrigins(Arrays.asList(

//                                         "http://localhost:3000",
//                                         "http://localhost:4000",
//                                         "http://localhost:4200",
//                                         "http://172.20.10.2:3000"

//                                 )
//                         );
//                         cfg.setAllowedMethods(Arrays.asList("GET", "POST","DELETE","PUT"));
//                         cfg.setAllowedMethods(Collections.singletonList("*"));
//                         cfg.setAllowCredentials(true);
//                         cfg.setAllowedHeaders(Collections.singletonList("*"));
//                         cfg.setExposedHeaders(Arrays.asList("Authorization"));
//                         cfg.setMaxAge(3600L);
//                         return cfg;

//                     }
//                 })
//                 .and()
//                 .httpBasic()
//                 .and()
//                 .formLogin();
//         return http.build();
//     }
// }

package com.project.ezimenu.security;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.List;


@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(
        prePostEnabled = true,
        securedEnabled = true,
        jsr250Enabled = true
)
public class SecurityConfiguration {


    @Value("${app.cors.allowed-origins}")
    private String allowedOrigins;


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public JwtTokenValidator jwtTokenValidator() {
        return new JwtTokenValidator();
    }


    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {


        http

            // Không lưu session vì dùng JWT
            .sessionManagement(session ->
                    session.sessionCreationPolicy(
                            SessionCreationPolicy.STATELESS
                    )
            )


            // Tắt CSRF cho REST API
            .csrf(csrf ->
                    csrf.disable()
            )


            // Bật CORS
            .cors(cors ->
                    cors.configurationSource(
                            corsConfigurationSource()
                    )
            )


            // Phân quyền API
            .authorizeHttpRequests(auth -> auth

                    // API public
                    .requestMatchers(
                            "/orders/**",
                            "/auth/**"
                    )
                    .permitAll()


                    // API admin
                    .requestMatchers("/admin/**")
                    .hasRole("ADMIN")


                    // Các API còn lại yêu cầu JWT
                    .anyRequest()
                    .authenticated()
            )


            // JWT Filter chạy trước filter login mặc định
            .addFilterBefore(
                    jwtTokenValidator(),
                    UsernamePasswordAuthenticationFilter.class
            );


        return http.build();
    }



    @Bean
    public CorsConfigurationSource corsConfigurationSource() {


        return new CorsConfigurationSource() {


            @Override
            public CorsConfiguration getCorsConfiguration(
                    HttpServletRequest request
            ) {


                CorsConfiguration cfg =
                        new CorsConfiguration();


                // Lấy origin từ application.properties
                List<String> origins =
                        Arrays.asList(
                                allowedOrigins.split(",")
                        );


                cfg.setAllowedOrigins(origins);


                cfg.setAllowedMethods(
                        Arrays.asList(
                                "GET",
                                "POST",
                                "PUT",
                                "DELETE",
                                "PATCH",
                                "OPTIONS"
                        )
                );


                cfg.setAllowedHeaders(
                        Arrays.asList(
                                "Authorization",
                                "Content-Type",
                                "Accept",
                                "Origin"
                        )
                );


                cfg.setExposedHeaders(
                        List.of(
                                "Authorization"
                        )
                );


                cfg.setAllowCredentials(true);


                cfg.setMaxAge(3600L);


                return cfg;
            }
        };
    }
}