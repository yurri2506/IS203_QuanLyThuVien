package com.library_web.library.controller;


import com.library_web.library.dto.UserDTO;
import com.library_web.library.service.UserService;


 import com.library_web.library.dto.CartItemDTO;
import com.library_web.library.dto.UserDTO;
import com.library_web.library.model.User;
import com.library_web.library.model.Cart;
import com.library_web.library.model.GoogleLoginRequest;
import com.library_web.library.repository.UserRepository;
import com.library_web.library.security.JwtUtil;
import com.library_web.library.service.GoogleAuthService;
import com.library_web.library.service.UserService;
import com.library_web.library.service.FacebookAuthService;
import com.library_web.library.service.CartService;


// import jakarta.servlet.http.HttpServletRequest;


// import org.apache.coyote.BadRequestException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.List;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class AuthController {

    @Autowired
    private GoogleAuthService googleAuthService;

    private final UserService userService;
    private final UserRepository userRepository;
    private final CartService cartService;


    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> request) {
        String emailOrPhone = request.get("email") != null ? request.get("email") : request.get("phone");
        String password = request.get("password");


        if (emailOrPhone == null || emailOrPhone.isBlank() || password == null || password.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email hoặc số điện thoại và mật khẩu không được để trống");
        }

        return userService.login(emailOrPhone, password);
    }


    public AuthController(UserService userService, UserRepository userRepository, CartService cartService) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.cartService = cartService;
    }


    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody UserDTO userDTO) {
        if (userDTO == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dữ liệu đăng ký không được để trống");
        }
        return userService.register(userDTO);
    }

    @PostMapping("/register/verify-otp")
    public Map<String, Object> verifyOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String otp = payload.get("otp");

        if (email == null || email.isBlank() || otp == null || otp.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email và OTP không được để trống");
        }

        return userService.verifyOtpAndCreate(email, otp);
    }


    @PostMapping("/forgot-password")
    public Map<String, Object> forgotPassword(@RequestBody Map<String, String> request) {
        String emailOrPhone = request.get("emailOrPhone");
        if (emailOrPhone == null || emailOrPhone.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email hoặc số điện thoại không được để trống");
        }

        return userService.forgotPassword(emailOrPhone);

/*
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        return ResponseEntity.ok(userService.login(request.get("email"), request.get("password")));

    }
*/
    // Tui fix lại cái phương thức post, code của ông/bà là cmt ở trên í.
   @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        Map<String, Object> response = userService.login(request.get("email"), request.get("password"));
        // Tạo hoặc lấy giỏ hàng nếu đăng nhập thành công
        if (response.containsKey("accessToken")) {
            User user = userRepository.findByEmail(request.get("email"))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
            cartService.getOrCreateCart(user);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public Map<String, Object> resetPassword(@RequestBody Map<String, String> request) {
        String emailOrPhone = request.get("emailOrPhone");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        if (emailOrPhone == null || emailOrPhone.isBlank() || otp == null || otp.isBlank() || newPassword == null || newPassword.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email/số điện thoại, OTP và mật khẩu mới không được để trống");
        }

        return userService.resetPassword(emailOrPhone, otp, newPassword);
    }

      @PostMapping("/auth/google")
    public ResponseEntity<?> loginWithGoogle(@RequestBody Map<String, String> body) {
        String accessToken = body.get("googleAccessToken");

        try {
            Map<String, Object> response = googleAuthService.signInWithGoogle(accessToken);

            //tạo giỏ hàng tự động
            if (response.containsKey("accessToken")) {
                String email = (String) response.get("email");
                if (email != null) { 
                    User user = userRepository.findByEmail(email)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng sau khi đăng nhập bằng Google"));
                    cartService.getOrCreateCart(user);
                }
            }

            return ResponseEntity.ok(response);
        } catch (Exception ex) {
            return ResponseEntity.status(401).body(Map.of("error", "Google Login thất bại: " + ex.getMessage()));
        }
    }
      
    @PostMapping("/auth/facebook")
    public ResponseEntity<?> loginWithFacebook(@RequestBody Map<String, String> body) {
        String accessToken = body.get("accessToken");
        try {
            Map<String, Object> result = facebookAuthService.signInWithFacebook(accessToken);
            if (result.containsKey("accessToken")) {
                String username = (String) result.get("username");
                if (username != null) {
                    User user = userRepository.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng sau khi đăng nhập bằng Facebook"));
                    cartService.getOrCreateCart(user);
                }
            }

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("status", "FAIL", "message", e.getMessage()));
        }
    }

    @GetMapping("/refresh-token")
    public Map<String, Object> refreshToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Yêu cầu header Authorization với Bearer Token");
        }

        String refreshToken = authHeader.substring(7); // Bỏ "Bearer " (7 ký tự)
        if (refreshToken.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Refresh Token không được để trống");
        }

        return userService.refreshAccessToken(refreshToken);
    }
}