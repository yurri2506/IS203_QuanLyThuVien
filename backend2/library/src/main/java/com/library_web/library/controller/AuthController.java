package com.library_web.library.controller;

import com.library_web.library.model.User;
import com.library_web.library.model.UserDTO;
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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;


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

    // Đăng ký tài khoản
//     @PostMapping("/register")
//     public ResponseEntity<?> register(@RequestBody UserDTO userDTO) {
//         if (userDTO.getUsername() == null || userDTO.getUsername().isBlank()) {
//             return ResponseEntity.badRequest().body(Map.of("error", "Username không được để trống"));
//         }
//         if (userDTO.getPassword() == null || userDTO.getPassword().isBlank()) {
//             return ResponseEntity.badRequest().body(Map.of("error", "Password không được để trống"));
//         }
//         if ((userDTO.getEmail() == null || userDTO.getEmail().isBlank()) &&
//             (userDTO.getPhone() == null || userDTO.getPhone().isBlank())) {
//             return ResponseEntity.badRequest().body(Map.of("error", "Phải cung cấp email hoặc số điện thoại"));
//         }

//         try {
//             Map<String, String> result = userService.register(userDTO);
//             return ResponseEntity.ok(result);
//         } catch (ResponseStatusException ex) {
//             return ResponseEntity.status(ex.getStatusCode()).body(Map.of("error", ex.getReason()));
//         } catch (Exception ex) {
//             return ResponseEntity.internalServerError().body(Map.of("error", "Đăng ký thất bại: " + ex.getMessage()));
//         }
//     }

    // Đăng nhập
//     @PostMapping("/login")
//     public ResponseEntity<?> login(@RequestParam String username, @RequestParam String password) {
//         if (username == null || password == null) {
//             return ResponseEntity.badRequest().body(Map.of("error", "Username và Password là bắt buộc"));
//         }

//         boolean isAuthenticated = userService.login(username, password);
//         if (!isAuthenticated) {
//             return ResponseEntity.status(401).body(Map.of("error", "Sai tài khoản hoặc mật khẩu"));
//         }

//         String accessToken = JwtUtil.generateAccessToken(username);
//         String refreshToken = JwtUtil.generateRefreshToken(username);

//         return ResponseEntity.ok(Map.of(
//                 "accessToken", accessToken,
//                 "refreshToken", refreshToken
//         ));
//     }

    // Lấy thông tin người dùng từ token
//     @GetMapping("/user-info")
//     public ResponseEntity<?> getUserInfo(@RequestHeader("Authorization") String authorizationHeader) {
//         if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
//             return ResponseEntity.status(401).body(Map.of("error", "Authorization header không hợp lệ"));
//         }

//         try {
//             String token = authorizationHeader.substring(7);
//             String userId = JwtUtil.validateToken(token);
//             UserDTO user = userService.getUserInfo(userId);
//             return ResponseEntity.ok(user);
//         } catch (Exception ex) {
//             return ResponseEntity.status(401).body(Map.of("error", "Token không hợp lệ hoặc hết hạn"));
//         }
//     }

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


    // Làm mới Access Token
//     @PostMapping("/refresh-token")
//     public ResponseEntity<?> refreshAccessToken(@RequestParam String refreshToken) {
//         try {
//             String userId = JwtUtil.validateToken(refreshToken);
//             String newAccessToken = JwtUtil.generateAccessToken(userId);

//             return ResponseEntity.ok(Map.of("accessToken", newAccessToken));
//         } catch (Exception ex) {
//             return ResponseEntity.status(401).body(Map.of("error", "Refresh Token không hợp lệ hoặc hết hạn"));
//         }
//     }

    // Yêu cầu quên mật khẩu
//     @PostMapping("/forgot-password")
//     public ResponseEntity<?> forgotPassword(@RequestParam String email) {
//         if (email == null || email.isBlank()) {
//             return ResponseEntity.badRequest().body(Map.of("error", "Email là bắt buộc"));
//         }

//         String response = userService.forgotPassword(email);
//         return ResponseEntity.ok(Map.of("message", response));
//     }

    // Đặt lại mật khẩu
//     @PostMapping("/reset-password")
//     public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
//         if (token == null || newPassword == null) {
//             return ResponseEntity.badRequest().body(Map.of("error", "Token và mật khẩu mới là bắt buộc"));
//         }

//         String response = userService.resetPassword(token, newPassword);
//         return ResponseEntity.ok(Map.of("message", response));
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
