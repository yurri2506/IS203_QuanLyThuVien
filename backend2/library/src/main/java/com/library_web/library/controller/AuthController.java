package com.library_web.library.controller;

import com.library_web.library.model.UserDTO;
import com.library_web.library.security.JwtUtil;
import com.library_web.library.service.UserService;

import java.util.Map;
import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
        System.out.println("API /register đuoc goi voi du lieu: " + userDTO);

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

    // Xác thực OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        System.out.println("Xác thực OTP cho email: " + email + " với OTP: " + otp);
        boolean verified = userService.verifyAndCreateUser(email, otp);

        if (verified) {
            // 🎯 Nếu xác thực xong, tạo access token luôn
            String accessToken = JwtUtil.generateAccessToken(email);
            String refreshToken = JwtUtil.generateRefreshToken(email);

            return ResponseEntity.ok(Map.of(
                "message", "Đăng ký thành công!",
                "accessToken", accessToken,
                "refreshToken", refreshToken
            ));
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "OTP không chính xác hoặc đã hết hạn"));
        }
    }

    // Đăng nhập
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        boolean isAuthenticated = userService.login(username, password);
        if (!isAuthenticated) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Sai tài khoản hoặc mật khẩu!"));
        }

        String accessToken = JwtUtil.generateAccessToken(username);
        String refreshToken = JwtUtil.generateRefreshToken(username);

        return ResponseEntity.ok(Map.of(
            "accessToken", accessToken,
            "refreshToken", refreshToken
        ));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestParam String refreshToken) {
        try {
            String username = JwtUtil.validateToken(refreshToken);
            String newAccessToken = JwtUtil.generateAccessToken(username);
            return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Refresh Token không hợp lệ hoặc đã hết hạn"));
        }
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
