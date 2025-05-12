package com.library_web.library.controller;


import com.library_web.library.dto.UserDTO;
import com.library_web.library.model.User;
import com.library_web.library.dto.UserDTO;

import com.library_web.library.model.GoogleLoginRequest;
import com.library_web.library.repository.UserRepository;
import com.library_web.library.security.JwtUtil;
import com.library_web.library.service.GoogleAuthService;
import com.library_web.library.service.UserService;
import com.library_web.library.service.FacebookAuthService;


import jakarta.servlet.http.HttpServletRequest;


import org.apache.coyote.BadRequestException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.Map;

@RestController

@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    @Autowired
    private GoogleAuthService googleAuthService;

    private final UserService userService;
    private final UserRepository userRepository;

    @Autowired
    private FacebookAuthService facebookAuthService;


    public AuthController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }


    // Đăng nhập bằng Google
    @PostMapping("/auth/google")
    public ResponseEntity<?> loginWithGoogle(@RequestBody Map<String, String> body) {
        String accessToken = body.get("googleAccessToken");

    try {
        Map<String, Object> response = googleAuthService.signInWithGoogle(accessToken);
        return ResponseEntity.ok(response);
    } catch (Exception ex) {
        return ResponseEntity.status(401).body(Map.of("error", "Google Login thất bại: " + ex.getMessage()));
    }
    }

    // Đăng nhập bằng Facebook
    @PostMapping("/auth/facebook")
    public ResponseEntity<?> loginWithFacebook(@RequestBody Map<String, String> body) {
    String accessToken = body.get("accessToken");
    try {
        Map<String, Object> result = facebookAuthService.signInWithFacebook(accessToken);
        return ResponseEntity.ok(result);
    } catch (Exception e) {
        return ResponseEntity.status(401).body(Map.of("status", "FAIL", "message", e.getMessage()));
    }
}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.register(userDTO));
    }

    @PostMapping("/register/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(userService.verifyOtpAndCreate(request.get("email"), request.get("otp")));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(userService.login(request.get("email"), request.get("matKhau")));
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
