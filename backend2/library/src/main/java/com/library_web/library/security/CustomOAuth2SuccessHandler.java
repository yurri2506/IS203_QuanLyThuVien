package com.library_web.library.security;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.library_web.library.model.User;
import com.library_web.library.repository.UserRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomOAuth2SuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;

    public CustomOAuth2SuccessHandler(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        OAuth2AuthenticationToken oauthToken = (OAuth2AuthenticationToken) authentication;
        OAuth2User oauthUser = oauthToken.getPrincipal();
        Map<String, Object> attributes = oauthUser.getAttributes();

        String provider = oauthToken.getAuthorizedClientRegistrationId(); // google hoặc facebook
        String providerId = (String) attributes.get("sub"); // Google dùng "sub"
        if (providerId == null) providerId = (String) attributes.get("id"); // Facebook dùng "id"

        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");

        // Kiểm tra email có tồn tại không
        Optional<User> existingUserOpt = userRepository.findByEmail(email);

        if (existingUserOpt.isEmpty()) {
            // Nếu chưa có, tạo mới user
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            newUser.setProvider(provider.toUpperCase());
            newUser.setProviderId(providerId);
            newUser.setUsername(email); // Dùng email làm username
            newUser.setPassword("");    // Không cần mật khẩu với OAuth2

            userRepository.save(newUser);
        }

        // Sau khi login xong, chuyển hướng về /home
        response.sendRedirect("/home");
    }
}
