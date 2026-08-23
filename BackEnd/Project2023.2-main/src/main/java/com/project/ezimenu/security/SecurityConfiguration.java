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

import org.springframework.http.HttpMethod;

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
import java.util.stream.Stream;


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


    // =========================================================
    // PASSWORD ENCODER
    // =========================================================

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    // =========================================================
    // JWT VALIDATOR
    // =========================================================

    @Bean
    public JwtTokenValidator jwtTokenValidator() {
        return new JwtTokenValidator();
    }


    // =========================================================
    // SECURITY FILTER CHAIN
    // =========================================================

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http

                // -------------------------------------------------
                // JWT -> STATELESS
                // -------------------------------------------------
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )


                // -------------------------------------------------
                // REST API -> DISABLE CSRF
                // -------------------------------------------------
                .csrf(csrf -> csrf.disable())


                // -------------------------------------------------
                // CORS
                // -------------------------------------------------
                .cors(cors ->
                        cors.configurationSource(
                                corsConfigurationSource()
                        )
                )


                // -------------------------------------------------
                // AUTHORIZATION
                // -------------------------------------------------
                .authorizeHttpRequests(auth -> auth


                        // =================================================
                        // 1. AUTH
                        // =================================================

                        .requestMatchers("/auth/**")
                        .permitAll()


                        // =================================================
                        // 2. CUSTOMER - TABLE
                        // =================================================

                        // GET /tables/{tableId}
                        //
                        // Ví dụ:
                        // GET /tables/49
                        //
                        .requestMatchers(
                                HttpMethod.GET,
                                "/tables/**"
                        )
                        .permitAll()


                        // POST /tables/{tableId}/payment/request
                        //
                        // Khách yêu cầu thanh toán
                        //
                        .requestMatchers(
                                HttpMethod.POST,
                                "/tables/**"
                        )
                        .permitAll()


                        // =================================================
                        // 3. CUSTOMER - MENU
                        // =================================================

                        // GET /menus
                        // GET /menus/{menuId}
                        //
                        .requestMatchers(
                                HttpMethod.GET,
                                "/menus/**"
                        )
                        .permitAll()


                        // GET /{tableId}/menus
                        //
                        // Ví dụ:
                        // GET /49/menus?customerName=Duc%20Anh
                        //
                        .requestMatchers(
                                HttpMethod.GET,
                                "/*/menus"
                        )
                        .permitAll()


                        // =================================================
                        // 4. CUSTOMER - DISH
                        // =================================================

                        // GET /dishes
                        // GET /dishes/{dishId}
                        //
                        .requestMatchers(
                                HttpMethod.GET,
                                "/dishes/**"
                        )
                        .permitAll()


                        // =================================================
                        // 5. CUSTOMER - ORDER
                        // =================================================

                        // Toàn bộ API /orders/** là API phía khách hàng
                        //
                        // Bao gồm:
                        //
                        // GET  /orders/tables/{tableId}
                        // POST /orders/{tableId}
                        // GET  /orders/updates
                        // GET  /orders/{orderId}/bill
                        //
                        // và các API order item bên dưới
                        //
                        .requestMatchers(
                                "/orders/**"
                        )
                        .permitAll()


                        // =================================================
                        // 6. ADMIN
                        // =================================================

                        // TẤT CẢ API /admin/** bắt buộc ADMIN
                        //
                                .requestMatchers(
                                        "/admin/**"
                                )
                                .hasRole("ADMIN")


                                // =================================================
                                // 7. CÁC API CÒN LẠI
                                // =================================================

                                .anyRequest()
                                .authenticated()
                        )


                // -------------------------------------------------
                // JWT FILTER
                // -------------------------------------------------

                .addFilterBefore(
                        jwtTokenValidator(),
                        UsernamePasswordAuthenticationFilter.class
                );


        return http.build();
    }


    // =========================================================
    // CORS CONFIGURATION
    // =========================================================

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        return new CorsConfigurationSource() {

            @Override
            public CorsConfiguration getCorsConfiguration(
                    HttpServletRequest request
            ) {

                CorsConfiguration cfg =
                        new CorsConfiguration();


                // -------------------------------------------------
                // ALLOWED ORIGINS
                // Lấy từ application.properties
                // hoặc Environment Variables trên Render
                // -------------------------------------------------

                List<String> origins =
                        Stream.concat(
                                Arrays.stream(allowedOrigins.split(",")),
                                Stream.of("https://menuorder-2.onrender.com")
                        )
                        .map(String::trim)
                        .filter(origin -> !origin.isEmpty())
                        .distinct()
                        .toList();

                cfg.setAllowedOrigins(origins);


                // -------------------------------------------------
                // ALLOWED METHODS
                // -------------------------------------------------

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


                // -------------------------------------------------
                // ALLOWED HEADERS
                // -------------------------------------------------

                cfg.setAllowedHeaders(
                        Arrays.asList(
                                "Authorization",
                                "Content-Type",
                                "Accept",
                                "Origin"
                        )
                );


                // -------------------------------------------------
                // EXPOSED HEADERS
                // -------------------------------------------------

                cfg.setExposedHeaders(
                        List.of(
                                "Authorization"
                        )
                );


                // -------------------------------------------------
                // CREDENTIALS
                // -------------------------------------------------

                cfg.setAllowCredentials(true);


                // -------------------------------------------------
                // PREFLIGHT CACHE
                // -------------------------------------------------

                cfg.setMaxAge(3600L);


                return cfg;
            }
        };
    }
}
