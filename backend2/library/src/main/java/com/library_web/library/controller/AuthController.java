package com.library_web.library.controller;

import com.library_web.library.model.UserDTO;
import com.library_web.library.security.JwtUtil;
import com.library_web.library.service.UserService;

import jakarta.servlet.http.HttpServletRequest;

import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/user-signup")
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.register(userDTO));
    }

    @PostMapping("/register/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(userService.verifyOtpAndCreate(request.get("email"), request.get("otp")));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(userService.login(request.get("username"), request.get("password")));
    }

    @GetMapping("/refresh-token")
    public ResponseEntity<?> refreshAccessToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("message", "Missing or invalid Authorization header"));
        }

        String refreshToken = authHeader.substring(7); // Bỏ "Bearer "
        try {
            Map<String, Object> response = userService.refreshAccessToken(refreshToken);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(Map.of("message", e.getMessage()));
        }
    }

    @PostMapping("/password/forgot")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(userService.forgotPassword(request.get("emailOrPhone")));
    }

    @PostMapping("/password/reset")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(userService.resetPassword(
                request.get("emailOrPhone"),
                request.get("otp"),
                request.get("newPassword")));
    }
}
