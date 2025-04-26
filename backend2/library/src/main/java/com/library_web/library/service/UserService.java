package com.library_web.library.service;

import com.library_web.library.model.User;
import com.library_web.library.model.UserDTO;
import com.library_web.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.Map;
import java.util.HashMap;
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
    public Map<String, String> register(UserDTO userDTO) {
        Map<String, String> response = new HashMap<>();
    
        // Kiểm tra bắt buộc phải đăng ký bằng email hoặc số điện thoại
        if ((userDTO.getEmail() == null || userDTO.getEmail().isBlank()) &&
            (userDTO.getPhone() == null || userDTO.getPhone().isBlank())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phải cung cấp email hoặc số điện thoại");
        }
    
        // Kiểm tra trùng email
        if (userDTO.getEmail() != null && !userDTO.getEmail().isBlank()) {
            if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email đã tồn tại");
            }
        }
    
        // Kiểm tra trùng số điện thoại
        if (userDTO.getPhone() != null && !userDTO.getPhone().isBlank()) {
            if (userRepository.findByPhone(userDTO.getPhone()).isPresent()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số điện thoại đã tồn tại");
            }
        }
    
        // Tạo user mới
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail() != null ? userDTO.getEmail() : "unknown");
        user.setPhone(userDTO.getPhone() != null ? userDTO.getPhone() : "unknown");
        user.setFullname(userDTO.getFullname());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword())); // dùng password người dùng nhập
    
        userRepository.save(user);
    
        response.put("message", "Đăng ký thành công!");
    
        return response;
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
