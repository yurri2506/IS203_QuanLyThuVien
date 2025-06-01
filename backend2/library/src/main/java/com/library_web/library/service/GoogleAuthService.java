package com.library_web.library.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.library_web.library.model.User;
import com.library_web.library.repository.UserRepository;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class GoogleAuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TokenService tokenService;

    public Map<String, Object> signInWithGoogle(String accessToken) {
        try {
            // Gọi Google API để lấy user info
            OkHttpClient client = new OkHttpClient();
            Request request = new Request.Builder()
                    .url("https://www.googleapis.com/oauth2/v3/userinfo")
                    .addHeader("Authorization", "Bearer " + accessToken)
                    .build();

            Response response = client.newCall(request).execute();
            if (!response.isSuccessful()) {
                throw new RuntimeException("Failed to fetch user info from Google");
            }

            String json = response.body().string();
            ObjectMapper mapper = new ObjectMapper();
            JsonNode userInfo = mapper.readTree(json);

            String email = userInfo.get("email").asText();
            String name = userInfo.get("name").asText();
            String googleId = userInfo.get("sub").asText();

            // Kiểm tra và tạo user nếu chưa có
            Optional<User> optionalUser = userRepository.findByEmail(email);
            User user = optionalUser.orElseGet(() -> {
                User newUser = new User();
                newUser.setEmail(email);
                newUser.setUsername(email);
                newUser.setFullname(name);
                newUser.setProvider("GOOGLE");
                newUser.setProviderId(googleId);
                newUser.setPassword(passwordEncoder.encode("123456")); // Mật khẩu mặc định
                newUser.setRole("USER"); // Gán role mặc định
                userRepository.save(newUser);
                return newUser;
            });

            // Tạo JWT token bằng TokenService
            String accessTokenJwt = tokenService.createAccessToken(user.getId(), user.getRole());
            String refreshTokenJwt = tokenService.createRefreshToken(user.getId());

            Map<String, Object> result = new HashMap<>();
            result.put("status", "OK");
            result.put("message", "Đăng nhập thành công");
            result.put("ACCESS_TOKEN", accessTokenJwt);
            result.put("REFRESH_TOKEN", refreshTokenJwt);

            return result;

        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("status", "FAIL");
            error.put("message", "Đăng nhập thất bại");
            error.put("error", e.getMessage());
            return error;
        }
    }
}