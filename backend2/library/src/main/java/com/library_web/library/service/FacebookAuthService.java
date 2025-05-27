package com.library_web.library.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.library_web.library.model.User;
import com.library_web.library.repository.UserRepository;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class FacebookAuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TokenService tokenService;

    public Map<String, Object> signInWithFacebook(String accessToken) throws Exception {
        OkHttpClient client = new OkHttpClient();

        Request request = new Request.Builder()
            .url("https://graph.facebook.com/me?fields=id,name,email&access_token=" + accessToken)
            .build();

        Response response = client.newCall(request).execute();

        if (!response.isSuccessful()) {
            throw new RuntimeException("Không lấy được user info từ Facebook");
        }

        String body = response.body().string();
        ObjectMapper mapper = new ObjectMapper();
        JsonNode jsonNode = mapper.readTree(body);

        String email = jsonNode.has("email") ? jsonNode.get("email").asText() : null;
        String name = jsonNode.get("name").asText();
        String facebookId = jsonNode.get("id").asText();

        // Tạo user nếu chưa có
        Optional<User> optionalUser = userRepository.findByEmail(email);
        User user = optionalUser.orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setUsername(email);
            newUser.setFullname(name);
            newUser.setProvider("FACEBOOK");
            newUser.setProviderId(facebookId);
            newUser.setPassword(""); // Không cần
            newUser.setRole("USER"); // Gán role mặc định
            userRepository.save(newUser);
            return newUser;
        });

        // Tạo token JWT bằng TokenService
        String accessTokenJwt = tokenService.createAccessToken(user.getId(), user.getRole());
        String refreshTokenJwt = tokenService.createRefreshToken(user.getId());

        Map<String, Object> result = new HashMap<>();
        result.put("status", "OK");
        result.put("ACCESS_TOKEN", accessTokenJwt);
        result.put("REFRESH_TOKEN", refreshTokenJwt);
        return result;
    }
}