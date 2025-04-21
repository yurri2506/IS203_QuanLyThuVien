package com.library_web.library.service;

import com.library_web.library.model.User;
import com.library_web.library.model.UserDTO;
import com.library_web.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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
    public String register(UserDTO userDTO) {
        // In dữ liệu của UserDTO ra console
        System.out.println("Received UserDTO: ");
        System.out.println("Username: " + userDTO.getUsername());
        System.out.println("Email: " + userDTO.getEmail());
        System.out.println("Name: " + userDTO.getName());

        Optional<User> existingUser = userRepository.findByUsername(userDTO.getUsername());
        if (existingUser.isPresent()) {
            
            return "Username already exists!";
        }

        User user = new User(); // Tạo mới đối tượng User
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail());
        user.setName(userDTO.getName());
        user.setPassword(passwordEncoder.encode("default_password")); // Mật khẩu mặc định

        userRepository.save(user);
        return "User registered successfully!";

    }

    // Đăng nhập
    public boolean login(String username, String password) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            return passwordEncoder.matches(password, user.getPassword());
        }
        return false;
    }

    // Quên mật khẩu - gửi token
    public String forgotPassword(String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);
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
