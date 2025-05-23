package com.library_web.library.service;

import com.library_web.library.dto.UserDTO;
import com.library_web.library.model.User;
import com.library_web.library.repository.UserRepository;
import com.library_web.library.security.JwtUtil;
import com.library_web.library.service.TempStorage.PendingUser;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.Map;
import java.util.Optional;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Mã OTP xác thực");
        message.setText("Mã OTP của bạn là: " + otp + ". Mã hết hạn sau 5 phút.");
        mailSender.send(message);
    }

    public Map<String, String> register(UserDTO userDTO) {
        if (userDTO.getPhone() != null && (userDTO.getEmail() == null || userDTO.getEmail().isBlank())) {
            User user = new User();
            user.setUsername(userDTO.getUsername());
            user.setPhone(userDTO.getPhone());
            user.setEmail("unknown");
            user.setGender(userDTO.getGender());
            user.setBirthdate(userDTO.getBirthdate());
            user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
            user.setRole(userDTO.getRole() != null ? userDTO.getRole() : "USER");
            user.setAvatar_url(userDTO.getAvatar_url());
            user.setJoined_date(LocalDate.now());
            userRepository.save(user);
            return Map.of("message", "Đăng ký thành công bằng số điện thoại");
        }

        String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
        LocalDateTime expiredAt = LocalDateTime.now().plusMinutes(5);
        TempStorage.savePendingUser(userDTO, otp, expiredAt);
        sendOtpEmail(userDTO.getEmail(), otp);
        return Map.of("message", "Đã gửi OTP tới email, vui lòng xác thực");
    }

    public Map<String, Object> verifyOtpAndCreate(String email, String otp) {
        PendingUser pending = TempStorage.getPendingUser(email);
        if (pending == null || !pending.getOtp().equals(otp) || LocalDateTime.now().isAfter(pending.getExpiredAt())) {
            return null;
        }

        User user = new User();
        user.setUsername(pending.getUserDTO().getUsername());
        user.setEmail(pending.getUserDTO().getEmail());
        user.setGender(pending.getUserDTO().getGender());
        user.setBirthdate(pending.getUserDTO().getBirthdate());
        user.setPassword(passwordEncoder.encode(pending.getUserDTO().getPassword()));
        user.setRole(pending.getUserDTO().getRole() != null ? pending.getUserDTO().getRole() : "USER");
        user.setAvatar_url(pending.getUserDTO().getAvatar_url());
        user.setJoined_date(LocalDate.now());
        userRepository.save(user);
        TempStorage.removePendingUser(email);

        return Map.of("message", "Đăng ký thành công bằng email");
    }

    public Map<String, Object> login(String emailOrPhone, String password) {
        Optional<User> userOpt = userRepository.findByEmail(emailOrPhone);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByPhone(emailOrPhone);
        }
        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return null;
        }

        User user = userOpt.get();
        if (user.getRole().equals("ADMIN")) {
            String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
            LocalDateTime expiredAt = LocalDateTime.now().plusMinutes(5);
            TempStorage.savePendingOtp(user.getEmail(), otp, expiredAt);
            sendOtpEmail(user.getEmail(), otp);
            return Map.of("message", "Đã gửi OTP tới email, vui lòng xác thực", "email", user.getEmail());
        }

        String accessToken = JwtUtil.generateAccessToken(user.getUsername());
        String refreshToken = JwtUtil.generateRefreshToken(user.getUsername());

        // Đảm bảo avatar_url không là chuỗi rỗng
        String avatarUrl = user.getAvatar_url() != null && !user.getAvatar_url().isEmpty() ? user.getAvatar_url()
                : null;

        return Map.of(
                "message", "Đăng nhập thành công",
                "data", Map.of(
                        "accessToken", accessToken,
                        "refreshToken", refreshToken,
                        "user", Map.of(
                                "id", user.getId(),
                                "username", user.getUsername(),
                                "email", user.getEmail() != null ? user.getEmail() : "",
                                "phone", user.getPhone() != null ? user.getPhone() : "",
                                "fullname", user.getFullname() != null ? user.getFullname() : "",

                                "birthdate", user.getBirthdate() != null ? user.getBirthdate().toString() : "")));

    }

    public Map<String, Object> verifyOtpAndLoginForAdmin(String email, String otp) {
        if (!TempStorage.isValidOtp(email, otp)) {
            return null;
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return null;
        }

        String accessToken = JwtUtil.generateAccessToken(user.getUsername());
        String refreshToken = JwtUtil.generateRefreshToken(user.getUsername());
        TempStorage.removePendingUser(email);

        return Map.of(
                "message", "Đăng nhập thành công",
                "data", Map.of(
                        "accessToken", accessToken,
                        "refreshToken", refreshToken,
                        "admin", Map.of(
                                "id", user.getId(),
                                "username", user.getUsername(),
                                "email", user.getEmail() != null ? user.getEmail() : "",
                                "phone", user.getPhone() != null ? user.getPhone() : "",
                                "fullname", user.getFullname() != null ? user.getFullname() : "",
                                "birthdate", user.getBirthdate() != null ? user.getBirthdate().toString() : "")));

    }

    public Map<String, Object> refreshAccessToken(String refreshToken) {
        String username = JwtUtil.validateToken(refreshToken);
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return null;
        }
        String newAccessToken = JwtUtil.generateAccessToken(user.getUsername());
        return Map.of(
                "message", "Làm mới access token thành công",
                "data", Map.of("accessToken", newAccessToken));
    }

    public Map<String, Object> forgotPassword(String emailOrPhone) {
        Optional<User> userOpt = userRepository.findByEmail(emailOrPhone);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByPhone(emailOrPhone);
        }
        if (userOpt.isEmpty()) {
            return null;
        }

        String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
        TempStorage.savePendingOtp(emailOrPhone, otp, LocalDateTime.now().plusMinutes(5));

        if (emailOrPhone.contains("@")) {
            sendOtpEmail(emailOrPhone, otp);
        } else {
            System.out.println("Gửi SMS tới số " + emailOrPhone + ": Mã OTP của bạn là " + otp);
        }

        return Map.of(
                "message", "Đã gửi OTP để đặt lại mật khẩu",
                "data", Map.of("emailOrPhone", emailOrPhone));
    }

    public Map<String, Object> resetPassword(String emailOrPhone, String otp, String newPassword) {
        if (!TempStorage.isValidOtp(emailOrPhone, otp)) {
            return null;
        }

        Optional<User> userOpt = userRepository.findByEmail(emailOrPhone);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByPhone(emailOrPhone);
        }
        if (userOpt.isEmpty()) {
            return null;
        }

        User user = userOpt.get();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        TempStorage.removeOtp(emailOrPhone);

        return Map.of(
                "message", "Đặt lại mật khẩu thành công",
                "data", Map.of("username", user.getUsername()));
    }

    public Map<String, Object> loginWithGoogle(String idToken) {
        String email = getEmailFromGoogleIdToken(idToken);
        if (email == null) {
            return null;
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        User user;
        if (userOpt.isEmpty()) {
            user = new User();
            user.setUsername(email.split("@")[0]);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode("google_" + email));
            user.setRole("USER");
            user.setJoined_date(LocalDate.now());
            userRepository.save(user);
        } else {
            user = userOpt.get();
        }

        String accessToken = JwtUtil.generateAccessToken(user.getUsername());
        String refreshToken = JwtUtil.generateRefreshToken(user.getUsername());

        return Map.of(
                "message", "Đăng nhập bằng Google thành công",
                "data", Map.of(
                        "accessToken", accessToken,
                        "refreshToken", refreshToken,
                        "user", Map.of(
                                "id", user.getId(),
                                "username", user.getUsername(),
                                "email", user.getEmail() != null ? user.getEmail() : "",
                                "phone", user.getPhone() != null ? user.getPhone() : "",
                                "fullname", user.getFullname() != null ? user.getFullname() : "",
                                "birthdate", user.getBirthdate() != null ? user.getBirthdate().toString() : "")));
    }

    public String getEmailFromGoogleIdToken(String idToken) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(),
                    new GsonFactory())
                    .setAudience(Collections
                            .singletonList("376530680599-mlb7pbrp0inmjnfqmit5q6v4a38e6t09.apps.googleusercontent.com"))
                    .build();

            GoogleIdToken idTokenObj = verifier.verify(idToken);
            if (idTokenObj != null) {
                GoogleIdToken.Payload payload = idTokenObj.getPayload();
                return payload.getEmail();
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }
}