package com.library_web.library.config;

import com.library_web.library.security.JwtAuthenticationFilter;
import com.library_web.library.service.TokenService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.http.HttpMethod;

import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;


import com.library_web.library.security.CustomOAuth2SuccessHandler;
import com.library_web.library.security.JwtAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


@Configuration

@EnableWebSecurity
public class SecurityConfig {

    private final TokenService tokenService;

    public SecurityConfig(TokenService tokenService) {
        this.tokenService = tokenService;
    }


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


//    @Bean
// public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
//     http
//         .csrf(csrf -> csrf.disable())
//         .authorizeHttpRequests(auth -> auth
//             .requestMatchers("/api/auth/**", "/home").permitAll()
//             .requestMatchers("/api/admin/**").hasAuthority("ADMIN")
//             .requestMatchers("/api/user/**").hasAuthority("USER")
//             .anyRequest().authenticated())
//         .exceptionHandling(exception -> exception
//             .authenticationEntryPoint((request, response, authException) -> {
//                 response.setContentType("application/json");
//                 response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//                 response.getWriter().write("{\"message\": \"Unauthorized\"}");
//             }))
//         .sessionManagement(session -> session
//             .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
//         .addFilterBefore(new JwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
//         .formLogin(form -> form.disable())
//         .httpBasic(basic -> basic.disable())
//         .oauth2Login(oauth2 -> oauth2.successHandler(customOAuth2SuccessHandler));

//     return http.build();

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        JwtAuthenticationFilter jwtAuthenticationFilter = new JwtAuthenticationFilter(tokenService);

        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/register",
                    "/api/login",
                    "/api/auth/google",
                    "/api/auth/facebook",
                    "/api/forgot-password",
                    "/api/reset-password",
                    "/api/refresh-token",
                    "/home"
                ).permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // <- Cho phép CORS preflight
                .anyRequest().authenticated()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()));

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return source;
    }

}

