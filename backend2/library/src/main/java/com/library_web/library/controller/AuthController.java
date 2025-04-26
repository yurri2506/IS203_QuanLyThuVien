package com.library_web.library.controller;

import com.library_web.library.model.UserDTO;
import com.library_web.library.security.JwtUtil;
import com.library_web.library.service.UserService;

import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserService userService;

    // Đăng ký
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
        System.out.println("API /register được gọi với dữ liệu: " + userDTO);
    
        // Kiểm tra username
        if (userDTO.getUsername() == null || userDTO.getUsername().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username không được để trống"));
        }
    
        // Kiểm tra password
        if (userDTO.getPassword() == null || userDTO.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password không được để trống"));
        }
    
        // Kiểm tra email hoặc phone (chỉ cần một trong hai)
        if ((userDTO.getEmail() == null || userDTO.getEmail().isBlank()) &&
            (userDTO.getPhone() == null || userDTO.getPhone().isBlank())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Phải cung cấp email hoặc số điện thoại"));
        }
    
        try {
            Map<String, String> result = userService.register(userDTO);
            return ResponseEntity.ok(result);
        } catch (ResponseStatusException ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getReason());
            return ResponseEntity.status(ex.getStatusCode()).body(error);
        } catch (Exception ex) {
            Map<String, String> error = new HashMap<>();
            error.put("error", ex.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }

    // Đăng nhập
    @PostMapping("/login")
    public Map<String, String> login(@RequestParam String username, @RequestParam String password) {
        boolean isAuthenticated = userService.login(username, password);
        if (!isAuthenticated) {
            throw new RuntimeException("Sai tài khoản hoặc mật khẩu!");
        }

        // Tạo Access Token và Refresh Token
        String accessToken = JwtUtil.generateAccessToken(username);
        String refreshToken = JwtUtil.generateRefreshToken(username);

        // Trả về token dưới dạng JSON
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);

        return tokens;
    }

    @PostMapping("/refresh-token")
    public Map<String, String> refreshToken(@RequestParam String refreshToken) {
        // Xác thực Refresh Token
        String username = JwtUtil.validateToken(refreshToken);

        // Tạo Access Token mới
        String newAccessToken = JwtUtil.generateAccessToken(username);

        // Trả về Access Token mới
        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", newAccessToken);

        return tokens;
    }

    // Quên mật khẩu
    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestParam String email) {
        return userService.forgotPassword(email);
    }

    // Đặt lại mật khẩu
    @PostMapping("/reset-password")
    public String resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        return userService.resetPassword(token, newPassword);
    }
}
