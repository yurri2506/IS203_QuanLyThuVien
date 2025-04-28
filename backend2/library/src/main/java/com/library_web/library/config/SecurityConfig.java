package com.library_web.library.config;

import com.library_web.library.security.CustomOAuth2SuccessHandler;
import com.library_web.library.security.JwtAuthenticationFilter;
import com.library_web.library.service.TokenService;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    private final CustomOAuth2SuccessHandler customOAuth2SuccessHandler;
    private final TokenService tokenService; // Thêm TokenService

    public SecurityConfig(CustomOAuth2SuccessHandler customOAuth2SuccessHandler, TokenService tokenService) {
        this.customOAuth2SuccessHandler = customOAuth2SuccessHandler;
        this.tokenService = tokenService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        JwtAuthenticationFilter jwtAuthenticationFilter = new JwtAuthenticationFilter(tokenService); // Khởi tạo filter

        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/register", 
                    "/api/login", 
                    "/api/forgot-password", 
                    "/api/reset-password", 
                    "/api/refresh-token",
                    "/home",
                    "/oauth2/**"  // thêm nếu bạn xài OAuth2 login
                ).permitAll()
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class) // thêm filter vào trước UsernamePasswordAuthenticationFilter
            .oauth2Login(oauth2 -> oauth2
                .successHandler(customOAuth2SuccessHandler)
            );

        return http.build();
    }
}
