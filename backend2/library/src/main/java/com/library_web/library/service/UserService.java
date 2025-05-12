package com.library_web.library.service;

import com.library_web.library.dto.UserDTO;
import com.library_web.library.model.User;
import com.library_web.library.repository.UserRepository;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import com.library_web.library.security.JwtUtil;
import com.library_web.library.service.TempStorage.PendingUser;

import jakarta.transaction.Transactional;

import org.apache.coyote.BadRequestException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import org.springframework.web.server.ResponseStatusException;

import java.util.NoSuchElementException;

import java.time.LocalDateTime;
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
        if (userDTO.getUsername() == null || userDTO.getUsername().isBlank())
            throw new IllegalArgumentException("Username không được để trống");
        if (userDTO.getPassword() == null || userDTO.getPassword().isBlank())
            throw new IllegalArgumentException("Password không được để trống");
        if (userDTO.getPassword().length() < 6)
            throw new IllegalArgumentException("Password phải có ít nhất 6 ký tự");
        if (userDTO.getBirthdate() == null || userDTO.getBirthdate().isBlank())
            throw new IllegalArgumentException("Ngày sinh không được để trống");
        if (userDTO.getGender() == null || userDTO.getGender().isBlank())
            throw new IllegalArgumentException("Giới tính không được để trống");

        if ((userDTO.getEmail() == null || userDTO.getEmail().isBlank()) &&
                (userDTO.getPhone() == null || userDTO.getPhone().isBlank()))
            throw new IllegalArgumentException("Phải cung cấp email hoặc số điện thoại");

        if (userDTO.getEmail() != null && userRepository.findByEmail(userDTO.getEmail()).isPresent())
            throw new IllegalArgumentException("Email đã tồn tại");
        if (userDTO.getPhone() != null && userRepository.findByPhone(userDTO.getPhone()).isPresent())
            throw new IllegalArgumentException("Số điện thoại đã tồn tại");
        if (userRepository.findByUsername(userDTO.getUsername()).isPresent())
            throw new IllegalArgumentException("Tên đăng nhập đã tồn tại");
            if (userDTO.getPhone() != null && (userDTO.getEmail() == null || userDTO.getEmail().isBlank())) {
                User user = new User();
                user.setUsername(userDTO.getUsername());
                user.setPhone(userDTO.getPhone());
                user.setEmail("unknown");
                user.setGender(userDTO.getGender());
                user.setBirthdate(userDTO.getBirthdate());
                user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
                user.setRole(userDTO.getRole() != null ? userDTO.getRole() : "USER");
    
                userRepository.save(user);
                return Map.of("message", "Đăng ký thành công bằng số điện thoại");
            }
    
            String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
            LocalDateTime expiredAt = LocalDateTime.now().plusMinutes(5);
            TempStorage.savePendingUser(userDTO, otp, expiredAt);
    
            sendOtpEmail(userDTO.getEmail(), otp);
            return Map.of("message", "Đã gửi OTP tới email, vui lòng xác thực");
        }
    
        public Map<String, String> verifyOtpAndCreate(String email, String otp) {
            TempStorage.PendingUser pending = TempStorage.getPendingUser(email);
            if (pending == null || !pending.getOtp().equals(otp) || LocalDateTime.now().isAfter(pending.getExpiredAt()))
                throw new IllegalArgumentException("OTP không chính xác hoặc đã hết hạn");
    
            User user = new User();
            user.setUsername(pending.getUserDTO().getUsername());
            user.setEmail(pending.getUserDTO().getEmail());
            user.setGender(pending.getUserDTO().getGender());
            user.setBirthdate(pending.getUserDTO().getBirthdate());
            user.setPassword(passwordEncoder.encode(pending.getUserDTO().getPassword()));
            user.setRole(pending.getUserDTO().getRole() != null ? pending.getUserDTO().getRole() : "USER");
            userRepository.save(user);
            TempStorage.removePendingUser(email);
    
            return Map.of("message", "Đăng ký thành công bằng email");
        }
    
        public Map<String, Object> login(String email, String matKhau) {
            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty() || !passwordEncoder.matches(matKhau, userOpt.get().getPassword()))
            {   
                if (userOpt.isEmpty()) {
                    System.out.println("Không tìm thấy email: " + email);
                }
                if (!passwordEncoder.matches(matKhau, userOpt.get().getPassword())) {
                    System.out.println("Sai mật khẩu cho email: " + email);
                }
                throw new IllegalArgumentException("Sai tài khoản hoặc mật khẩu");
            }
    
            User user = userOpt.get();
            String accessToken = JwtUtil.generateAccessToken(user.getUsername());
            String refreshToken = JwtUtil.generateRefreshToken(user.getUsername());
    
            return Map.of(
                "message", "Đăng nhập thành công",
                "accessToken", accessToken,
                "refreshToken", refreshToken,
                "data", user
            );
        }
        public Map<String, Object> refreshAccessToken(String refreshToken) {
            try {
                String username = JwtUtil.validateToken(refreshToken);
                User user = userRepository.findByUsername(username).orElseThrow();
                String newAccessToken = JwtUtil.generateAccessToken(user.getUsername());
                return Map.of("accessToken", newAccessToken);
            } catch (Exception e) {
                throw new IllegalArgumentException("Refresh Token không hợp lệ hoặc đã hết hạn");
            }
        }
    
        public Map<String, String> forgotPassword(String emailOrPhone) {
            Optional<User> userOpt = userRepository.findByEmail(emailOrPhone);
            if (userOpt.isEmpty()) userOpt = userRepository.findByPhone(emailOrPhone);
            if (userOpt.isEmpty())
                throw new NoSuchElementException("Không tìm thấy người dùng");
        
            String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
            TempStorage.savePendingOtp(emailOrPhone, otp, LocalDateTime.now().plusMinutes(5));
        
            if (emailOrPhone.contains("@")) {
                // Nếu là email
                sendOtpEmail(emailOrPhone, otp);
            } else {
                // Nếu là số điện thoại ➔ log OTP ra console
                System.out.println("Gửi SMS tới số " + emailOrPhone + ": Mã OTP của bạn là " + otp);
            }
        
            return Map.of("message", "Đã gửi OTP để đặt lại mật khẩu");
        }
        
        public Map<String, String> resetPassword(String emailOrPhone, String otp, String newPassword) {
            if (!TempStorage.isValidOtp(emailOrPhone, otp))
                throw new IllegalArgumentException("OTP không chính xác hoặc đã hết hạn");
    
            Optional<User> userOpt = userRepository.findByEmail(emailOrPhone);
            if (userOpt.isEmpty()) userOpt = userRepository.findByPhone(emailOrPhone);
            if (userOpt.isEmpty())
                throw new NoSuchElementException("Không tìm thấy người dùng");
    
            User user = userOpt.get();
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            TempStorage.removeOtp(emailOrPhone);
    
            return Map.of("message", "Đặt lại mật khẩu thành công");
        }

    
    // Đăng nhập bằng Google
    public String getEmailFromGoogleIdToken(String idToken) {
        try {
            // Sử dụng GoogleIdTokenVerifier để xác thực idToken
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(),
                    new GsonFactory())
                    .setAudience(Collections
                            .singletonList("376530680599-mlb7pbrp0inmjnfqmit5q6v4a38e6t09.apps.googleusercontent.com")) // Thay
                                                                                                                        // bằng
                                                                                                                        // client
                                                                                                                        // ID
                                                                                                                        // của
                                                                                                                        // bạn
                    .build();

            GoogleIdToken idTokenObj = verifier.verify(idToken);
            if (idTokenObj != null) {
                GoogleIdToken.Payload payload = idTokenObj.getPayload();
                return payload.getEmail();
            }
            return null;
        } catch (Exception e) {
            System.out.println("Lỗi xác thực idToken: " + e.getMessage());
            return null;
        }
    }

}
