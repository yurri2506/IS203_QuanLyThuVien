package com.library_web.library.controller;

import com.library_web.library.model.UserDTO;
import com.library_web.library.model.User; // THÊM IMPORT NÀY
import com.library_web.library.security.JwtUtil;
import com.library_web.library.service.UserService;
import com.library_web.library.repository.UserRepository; // THÊM IMPORT NÀY

import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository; // AUTOWIRE UserRepository ĐÚNG

    // Đăng ký
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
        System.out.println("API /register được gọi với dữ liệu: " + userDTO);

        if (userDTO.getUsername() == null || userDTO.getUsername().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Username không được để trống"));
        }

        if (userDTO.getPassword() == null || userDTO.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password không được để trống"));
        }

        if ((userDTO.getEmail() == null || userDTO.getEmail().isBlank()) &&
            (userDTO.getPhone() == null || userDTO.getPhone().isBlank())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Phải cung cấp email hoặc số điện thoại"));
        }

        try {
            Map<String, String> result = userService.register(userDTO);
            return ResponseEntity.ok(result);
        } catch (ResponseStatusException ex) {
            return ResponseEntity.status(ex.getStatusCode()).body(Map.of("error", ex.getReason()));
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(Map.of("error", ex.getMessage()));
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

    // Lấy thông tin người dùng từ token
    @GetMapping("/user-info")
    public ResponseEntity<?> getUserInfo(@RequestHeader("Authorization") String token) {
        try {
            String username = JwtUtil.validateToken(token.substring(7)); // "Bearer ..."
            UserDTO user = userService.getUserInfo(username);
            return ResponseEntity.ok(user);
        } catch (Exception ex) {
            return ResponseEntity.status(401).body(Map.of("error", "Token không hợp lệ"));
        }
    }

    // Đăng ký bằng OAuth
    @PostMapping("/oauth-register")
    public ResponseEntity<?> oauthRegister(@RequestBody UserDTO userDTO) {
        // Kiểm tra xem người dùng có tồn tại chưa
        Optional<User> existingUser = userRepository.findByEmail(userDTO.getEmail());
        if (existingUser.isPresent()) {
            return ResponseEntity.status(400).body(Map.of("error", "Email đã được sử dụng"));
        }

        try {
            userService.register(userDTO);
            return ResponseEntity.ok(Map.of("message", "Đăng ký thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Làm mới token
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
