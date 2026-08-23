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
                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                        SessionCreationPolicy.STATELESS
                        )
                )

                        .csrf(csrf -> csrf.disable())

                        .cors(cors ->
                                cors.configurationSource(
                                corsConfigurationSource()
                                )
                        )

                        .authorizeHttpRequests(auth -> auth

                                // ==========================================
                                // 1. LOGIN
                                // ==========================================
                                .requestMatchers("/auth/**")
                                .permitAll()


                        // ==========================================
                        // 2. KHÁCH HÀNG - XEM BÀN
                        // ==========================================
                        .requestMatchers(
                        HttpMethod.GET,
                        "/tables/{tableId}"
                        )
                        .permitAll()


                        // ==========================================
                        // 3. KHÁCH HÀNG - XEM MÓN
                        // ==========================================
                        .requestMatchers(
                        HttpMethod.GET,
                        "/dishes",
                        "/dishes/**"
                        )
                        .permitAll()


                        // ==========================================
                        // 4. KHÁCH HÀNG - VÀO MENU CỦA BÀN
                        // GET /1/menus?customerName=...
                        // ==========================================
                        .requestMatchers(
                        HttpMethod.GET,
                        "/{tableId}/menus"
                        )
                        .permitAll()


                        // ==========================================
                        // 5. KHÁCH HÀNG - XEM MENU
                        // ==========================================
                        .requestMatchers(
                        HttpMethod.GET,
                        "/menus",
                        "/menus/**"
                        )
                        .permitAll()


                        // ==========================================
                        // 6. KHÁCH HÀNG - TẠO ORDER
                        // POST /orders/{tableId}
                        // ==========================================
                        .requestMatchers(
                        HttpMethod.POST,
                        "/orders/{tableId}"
                        )
                        .permitAll()


                        // ==========================================
                        // 7. KHÁCH HÀNG - THÊM MÓN VÀO ORDER
                        // POST /orders/{orderId}/items
                        // ==========================================
                        .requestMatchers(
                        HttpMethod.POST,
                        "/orders/{orderId}/items"
                        )
                        .permitAll()


                        // ==========================================
                        // 8. KHÁCH HÀNG - SỬA MÓN TRONG ORDER
                        // PUT /orders/{orderId}/items/{orderItemId}
                        // ==========================================
                        .requestMatchers(
                        HttpMethod.PUT,
                        "/orders/{orderId}/items/{orderItemId}"
                        )
                        .permitAll()


                        // ==========================================
                        // 9. KHÁCH HÀNG - XÓA MÓN KHỎI ORDER
                        // DELETE /orders/{orderId}/items/{orderItemId}
                        // ==========================================
                        .requestMatchers(
                        HttpMethod.DELETE,
                        "/orders/{orderId}/items/{orderItemId}"
                        )
                        .permitAll()


                        // ==========================================
                        // 10. KHÁCH HÀNG - XEM ORDER CỦA BÀN
                        // GET /orders/tables/{tableId}
                        // ==========================================
                        .requestMatchers(
                        HttpMethod.GET,
                        "/orders/tables/{tableId}"
                        )
                        .permitAll()


                        // ==========================================
                        // 11. KHÁCH HÀNG - YÊU CẦU HỖ TRỢ MÓN
                        // POST /orders/{orderId}/items/{orderItemId}/request
                        // ==========================================
                        .requestMatchers(
                        HttpMethod.POST,
                        "/orders/{orderId}/items/{orderItemId}/request"
                        )
                        .permitAll()


                        // ==========================================
                        // 12. KHÁCH HÀNG - YÊU CẦU THANH TOÁN
                        // POST /tables/{tableId}/payment/request
                        // ==========================================
                        .requestMatchers(
                        HttpMethod.POST,
                        "/tables/{tableId}/payment/request"
                        )
                        .permitAll()


                        // ==========================================
                        // 13. KHÁCH HÀNG - THEO DÕI UPDATE ORDER
                        // ==========================================
                        .requestMatchers(
                        HttpMethod.GET,
                        "/orders/updates"
                        )
                        .permitAll()


                        // ==========================================
                        // 14. ADMIN
                        // ==========================================
                        .requestMatchers("/admin/**")
                        .hasRole("ADMIN")


                        // ==========================================
                        // 15. CÒN LẠI
                        // ==========================================
                        .anyRequest()
                        .authenticated()
                )

                        .addFilterBefore(
                                jwtTokenValidator(),
                                UsernamePasswordAuthenticationFilter.class
                        );

                        return http.build();
                }
        @Bean
        public CorsConfigurationSource corsConfigurationSource() {

                return request -> {

                CorsConfiguration cfg =
                        new CorsConfiguration();

                List<String> origins =
                        Arrays.stream(
                        allowedOrigins.split(",")
                        )
                        .map(String::trim)
                        .filter(origin -> !origin.isEmpty())
                        .toList();

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
                        List.of("Authorization")
                );

                cfg.setAllowCredentials(true);

                cfg.setMaxAge(3600L);

                return cfg;
                };
        }
        }