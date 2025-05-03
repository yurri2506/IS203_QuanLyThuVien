package com.library_web.library.security;

import com.library_web.library.model.User;
import com.library_web.library.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.util.Map;
import java.util.Optional;

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

        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");

        Optional<User> userOpt = userRepository.findByEmail(email);
        User user;

        if (userOpt.isEmpty()) {
            user = new User();
            user.setEmail(email);
            user.setFullname(name);
            user.setUsername(email);
            user.setPhone("");
            user.setPassword("");
            user.setRole("USER");
            userRepository.save(user);
        } else {
            user = userOpt.get();
        }

        String accessToken = JwtUtil.generateAccessToken(user);
        String refreshToken = JwtUtil.generateRefreshToken(user.getUsername());

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"accessToken\":\"" + accessToken + "\", \"refreshToken\":\"" + refreshToken + "\"}");
    }
}
