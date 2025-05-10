package com.library_web.library.controller;

import com.library_web.library.dto.UserDTO;
import com.library_web.library.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

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

    @PostMapping("/login/google")
    public Map<String, Object> loginWithGoogle(@RequestBody Map<String, String> request) {
        String idToken = request.get("idToken");
        if (idToken == null || idToken.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "IdToken không được để trống");
        }

        return userService.loginWithGoogle(idToken);
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