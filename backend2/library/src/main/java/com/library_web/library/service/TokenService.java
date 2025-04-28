package com.library_web.library.service;

import com.library_web.library.security.JwtUtil;
import org.springframework.stereotype.Service;

@Service
public class TokenService {

    // Tạo Access Token
    public String createAccessToken(String username) {
        return JwtUtil.generateAccessToken(username);
    }

    // Tạo Refresh Token
    public String createRefreshToken(String username) {
        return JwtUtil.generateRefreshToken(username);
    }

    // Kiểm tra tính hợp lệ của Access Token
    public boolean validateToken(String token) {
        try {
            JwtUtil.validateToken(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getUsernameFromToken(String token) {
        return JwtUtil.validateToken(token);  // validateToken trả ra username luôn
    }

    // Làm mới Access Token bằng Refresh Token
    public String refreshAccessToken(String refreshToken) {
        if (validateToken(refreshToken)) {
            String username = JwtUtil.validateToken(refreshToken);
            return createAccessToken(username);
        }
        return null; // Nếu Refresh Token không hợp lệ
    }
}
