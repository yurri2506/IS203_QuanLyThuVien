package com.library_web.library.service;

import com.library_web.library.model.User;
import com.library_web.library.model.UserDTO;
import com.library_web.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
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

    // Gửi OTP qua email
    private void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Mã OTP xác thực");
        message.setText("Mã OTP của bạn là: " + otp + ". Mã hết hạn sau 5 phút.");
        mailSender.send(message);
    }

    // Gửi OTP qua SMS (giả lập)
    private void sendOtpSms(String phone, String otp) {
        System.out.println("Gửi SMS tới " + phone + ": Mã OTP của bạn là " + otp);
    }

    // Đăng ký tài khoản mới
    public Map<String, String> register(UserDTO userDTO) {
        Map<String, String> response = new HashMap<>();

        // Kiểm tra email hoặc số điện thoại
        if ((userDTO.getEmail() == null || userDTO.getEmail().isBlank()) &&
            (userDTO.getPhone() == null || userDTO.getPhone().isBlank())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phải cung cấp email hoặc số điện thoại");
        }

        // Kiểm tra trùng lặp
        if (userDTO.getEmail() != null && userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email đã tồn tại");
        }
        if (userDTO.getPhone() != null && userRepository.findByPhone(userDTO.getPhone()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số điện thoại đã tồn tại");
        }

        // Sinh OTP
        String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
        LocalDateTime expiredAt = LocalDateTime.now().plusMinutes(5);

        // Gửi OTP
        if (userDTO.getEmail() != null) {
            sendOtpEmail(userDTO.getEmail(), otp);
            System.out.println("OTP gửi tới email " + userDTO.getEmail() + " là: " + otp);
        }
        if (userDTO.getPhone() != null) {
            sendOtpSms(userDTO.getPhone(), otp);
            System.out.println("OTP gửi tới số điện thoại " + userDTO.getPhone() + " là: " + otp);
        }

        // Lưu OTP vào TempStorage
        TempStorage.savePendingUser(userDTO, otp, expiredAt);

        response.put("message", "OTP đã gửi. Vui lòng xác thực!");
        return response;
    }

    // Xác thực và tạo user từ OTP
    public boolean verifyAndCreateUser(String emailOrPhone, String otp) {
        TempStorage.PendingUser pending = TempStorage.getPendingUser(emailOrPhone);
        if (pending == null) {
            return false;
        }

        if (!pending.getOtp().equals(otp) || LocalDateTime.now().isAfter(pending.getExpiredAt())) {
            return false;
        }

        // Đúng OTP -> Tạo user
        User user = new User();
        user.setUsername(pending.getUserDTO().getUsername());
        user.setEmail(Optional.ofNullable(pending.getUserDTO().getEmail()).orElse("unknown"));
        user.setPhone(Optional.ofNullable(pending.getUserDTO().getPhone()).orElse("unknown"));
        user.setFullname(pending.getUserDTO().getFullname());
        user.setPassword(passwordEncoder.encode(pending.getUserDTO().getPassword()));
        userRepository.save(user);

        TempStorage.removePendingUser(emailOrPhone);
        return true;
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
    private void sendResetEmail(String toEmail, String token) {
        String resetLink = "http://localhost:8080/api/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Đặt lại mật khẩu");
        message.setText("Nhấn vào liên kết để đặt lại mật khẩu: " + resetLink);
        mailSender.send(message);
    }
}