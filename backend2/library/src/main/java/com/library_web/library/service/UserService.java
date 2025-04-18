package com.library_web.library.service;

import com.library_web.library.model.User;
import com.library_web.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender;

    // Đăng ký tài khoản mới
    public String register(User user) {
        Optional<User> existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser.isPresent()) {
            return "Username already exists!";
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
        return "User registered successfully!";
    }

    // Đăng nhập
    public boolean login(String username, String rawPassword) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return passwordEncoder.matches(rawPassword, user.getPassword());
        }
        return false;
    }

    // Quên mật khẩu - gửi token
    public String forgotPassword(String email) {
        Optional<User> userOptional = userRepository.findByUsername(email);
        if (!userOptional.isPresent()) {
            return "Email không tồn tại!";
        }

        String token = UUID.randomUUID().toString();
        User user = userOptional.get();
        user.setResetToken(token);
        userRepository.save(user);

        sendResetEmail(email, token);
        return "Đã gửi email đặt lại mật khẩu.";
    }

    // Đặt lại mật khẩu
    public String resetPassword(String token, String newPassword) {
        Optional<User> userOptional = userRepository.findByResetToken(token);
        if (!userOptional.isPresent()) {
            return "Token không hợp lệ!";
        }

        User user = userOptional.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        userRepository.save(user);

        return "Đặt lại mật khẩu thành công!";
    }

    // Gửi mail đặt lại mật khẩu
    public void sendResetEmail(String toEmail, String token) {
        String resetLink = "http://localhost:8080/api/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Đặt lại mật khẩu");
        message.setText("Nhấn vào liên kết để đặt lại mật khẩu: " + resetLink);

        mailSender.send(message);
    }
}
