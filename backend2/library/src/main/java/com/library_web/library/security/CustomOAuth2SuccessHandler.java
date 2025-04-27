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

        String provider = oauthToken.getAuthorizedClientRegistrationId(); 
        String providerId = (String) attributes.get("sub");
        if (providerId == null) {
            providerId = (String) attributes.get("id");
        }

        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");

        Optional<User> existingUserOpt = userRepository.findByEmail(email);

        if (existingUserOpt.isEmpty()) {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setFullname(name);
            newUser.setProvider(provider.toUpperCase());
            newUser.setProviderId(providerId);
            newUser.setUsername(email);
            newUser.setPassword("");

            userRepository.save(newUser);
        }

        String accessToken = JwtUtil.generateAccessToken(email);
        String refreshToken = JwtUtil.generateRefreshToken(email);

        response.setContentType("application/json");
        response.getWriter().write("{\"accessToken\": \"" + accessToken + "\", \"refreshToken\": \"" + refreshToken + "\"}");
        response.getWriter().flush(); // Ghi dữ liệu xong, không redirect nữa
    }
}
