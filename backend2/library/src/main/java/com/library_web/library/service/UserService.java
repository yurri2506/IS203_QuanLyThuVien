package com.library_web.library.service;

import com.library_web.library.dto.UserDTO;
import com.library_web.library.model.User;
import com.library_web.library.repository.UserRepository;
import com.library_web.library.security.JwtUtil;
import com.library_web.library.service.TempStorage.PendingUser;
import org.apache.coyote.BadRequestException;
import com.library_web.library.service.GoogleAuthService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
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

@Service
@Transactional
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private GoogleAuthService googleAuthService;

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

   public Map<String, Object> createUser(UserDTO userDTO) {
        // Check if user already exists
        if (userDTO.getEmail() != null && !userDTO.getEmail().isBlank()) {
            if (userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
                return Map.of("message", "Email đã tồn tại: " + userDTO.getEmail());
            }
        }
        if (userDTO.getPhone() != null && !userDTO.getPhone().isBlank()) {
            if (userRepository.findByPhone(userDTO.getPhone()).isPresent()) {
                return Map.of("message", "Số điện thoại đã tồn tại: " + userDTO.getPhone());
            }
        }

        // If email is provided, require OTP verification
        if (userDTO.getEmail() != null && !userDTO.getEmail().isBlank()) {
            String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
            LocalDateTime expiredAt = LocalDateTime.now().plusMinutes(5);
            TempStorage.savePendingUser(userDTO, otp, expiredAt);
            sendOtpEmail(userDTO.getEmail(), otp);
            return Map.of("message", "Đã gửi OTP tới email, vui lòng xác thực", "email", userDTO.getEmail());
        }

        // Create user directly if no email is provided
        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setEmail(userDTO.getEmail() != null && !userDTO.getEmail().isBlank() ? userDTO.getEmail() : "unknown");
        user.setPhone(userDTO.getPhone());
        user.setGender(userDTO.getGender() != null ? userDTO.getGender() : "Nam"); 
        user.setBirthdate(userDTO.getBirthdate());
        user.setPassword(passwordEncoder.encode("123456")); // Default password
        user.setRole(userDTO.getRole() != null ? userDTO.getRole() : "USER");
        user.setAvatar_url(userDTO.getAvatar_url());
        user.setJoined_date(LocalDate.now());
        userRepository.save(user);

        return Map.of(
                "message", "Tạo người dùng thành công",
                "data", Map.of(
                        "id", user.getId(),
                        "username", user.getUsername(),
                        "email", user.getEmail(),
                        "phone", user.getPhone() != null ? user.getPhone() : "",
                        "birthdate", user.getBirthdate() != null ? user.getBirthdate().toString() : "",
                        "role", user.getRole(),
                        "gender", user.getGender() != null ? user.getGender() : "",
                        "avatar_url", user.getAvatar_url() != null ? user.getAvatar_url() : ""));
    }

    public Map<String, Object> verifyOtpAndCreate(String email, String otp) {
        TempStorage.PendingUser pending = TempStorage.getPendingUser(email);
        if (pending == null || !pending.getOtp().equals(otp) || LocalDateTime.now().isAfter(pending.getExpiredAt())) {
            return null;
        }

        User user = new User();
        user.setUsername(pending.getUserDTO().getUsername());
        user.setEmail(pending.getUserDTO().getEmail());
        user.setGender(pending.getUserDTO().getGender());
        user.setBirthdate(pending.getUserDTO().getBirthdate());
        user.setPassword(passwordEncoder.encode("123456")); // Default password
        user.setRole(pending.getUserDTO().getRole() != null ? pending.getUserDTO().getRole() : "USER");
        user.setAvatar_url(pending.getUserDTO().getAvatar_url());
        user.setJoined_date(LocalDate.now());
        userRepository.save(user);
        TempStorage.removePendingUser(email);

        return Map.of(
                "message", "Đăng ký thành công bằng email",
                "data", Map.of(
                        "id", user.getId(),
                        "username", user.getUsername(),
                        "email", user.getEmail(),
                        "phone", user.getPhone() != null ? user.getPhone() : "",
                        "birthdate", user.getBirthdate() != null ? user.getBirthdate().toString() : "",
                        "role", user.getRole(),
                        "gender", user.getGender() != null ? user.getGender() : "",
                        "avatar_url", user.getAvatar_url() != null ? user.getAvatar_url() : ""));
    }

    public Map<String, Object> login(String emailOrPhone, String password, Boolean isAdmin) {
        Optional<User> userOpt = userRepository.findByEmail(emailOrPhone);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByPhone(emailOrPhone);
        }
        if (userOpt.isEmpty() || !passwordEncoder.matches(password, userOpt.get().getPassword())) {
            return null;
        }

        User user = userOpt.get();
        if (user.getRole().equals("ADMIN") && isAdmin) {
            String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
            LocalDateTime expiredAt = LocalDateTime.now().plusMinutes(5);
            TempStorage.savePendingOtp(user.getEmail(), otp, expiredAt);
            sendOtpEmail(user.getEmail(), otp);
            return Map.of("message", "Đã gửi OTP tới email, vui lòng xác thực", "email", user.getEmail());
        }

        String accessToken = tokenService.createAccessToken(user.getId(), user.getRole());
        String refreshToken = tokenService.createRefreshToken(user.getId());

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
                                "birthdate", user.getBirthdate() != null ? user.getBirthdate().toString() : "",
                                "role", user.getRole())));
    }

    public Map<String, Object> verifyOtpAndLoginForAdmin(String email, String otp) {
        if (!TempStorage.isValidOtp(email, otp)) {
            return null;
        }

        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return null;
        }

        String accessToken = tokenService.createAccessToken(user.getId(), user.getRole());
        String refreshToken = tokenService.createRefreshToken(user.getId());
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
                                "birthdate", user.getBirthdate() != null ? user.getBirthdate().toString() : "",
                                "role", user.getRole())));
    }

    public Map<String, Object> updateUser(Long id, UserDTO userDTO) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return null;
        }

        User user = userOpt.get();
        if (userDTO.getUsername() != null) {
            user.setUsername(userDTO.getUsername());
        }
        if (userDTO.getEmail() != null && !userDTO.getEmail().isBlank()) {
            if (!userDTO.getEmail().equals(user.getEmail())
                    && userRepository.findByEmail(userDTO.getEmail()).isPresent()) {
                return null; // Email already exists
            }
            user.setEmail(userDTO.getEmail());
        }
        if (userDTO.getPhone() != null && !userDTO.getPhone().isBlank()) {
            if (!userDTO.getPhone().equals(user.getPhone())
                    && userRepository.findByPhone(userDTO.getPhone()).isPresent()) {
                return null; // Phone already exists
            }
            user.setPhone(userDTO.getPhone());
        }
        if (userDTO.getBirthdate() != null) {
            user.setBirthdate(userDTO.getBirthdate());
        }
        if (userDTO.getRole() != null) {
            user.setRole(userDTO.getRole());
        }
        if (userDTO.getAvatar_url() != null) {
            user.setAvatar_url(userDTO.getAvatar_url());
        }
        userRepository.save(user);

        return Map.of(
                "message", "Cập nhật người dùng thành công",
                "data", Map.of(
                        "id", user.getId(),
                        "username", user.getUsername(),
                        "email", user.getEmail(),
                        "phone", user.getPhone() != null ? user.getPhone() : "",
                        "birthdate", user.getBirthdate() != null ? user.getBirthdate().toString() : "",
                        "role", user.getRole(),
                        "avatar_url", user.getAvatar_url() != null ? user.getAvatar_url() : ""));
    }

    public Map<String, Object> refreshAccessToken(String refreshToken) {
        Long id = tokenService.getIdFromToken(refreshToken);
        if (id == null) {
            return null;
        }
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return null;
        }
        String newAccessToken = tokenService.createAccessToken(user.getId(), user.getRole());
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

    public Map<String, Object> loginWithGoogle(String accessToken) {
    Map<String, Object> googleResponse = googleAuthService.signInWithGoogle(accessToken);

    if (!"OK".equals(googleResponse.get("status"))) {
        return Map.of(
                "status", "FAIL",
                "message", googleResponse.getOrDefault("message", "Đăng nhập thất bại"),
                "error", googleResponse.getOrDefault("error", "Không rõ lỗi")
        );
    }

    Map<String, Object> userInfo = (Map<String, Object>) googleResponse.get("userInfo");
    if (userInfo == null) {
        return Map.of(
                "status", "FAIL",
                "message", "Không lấy được thông tin người dùng từ Google"
        );
    }

    String email = (String) userInfo.get("email");
    String name = (String) userInfo.get("name");

    if (email == null) {
        return Map.of(
                "status", "FAIL",
                "message", "Không lấy được email từ Google"
        );
    }

    Optional<User> userOpt = userRepository.findByEmail(email);
    User user;
    if (userOpt.isEmpty()) {
        user = new User();
        user.setUsername(email.split("@")[0]);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode("google_" + email));
        user.setRole("USER");
        user.setFullname(name != null ? name : "");
        user.setJoined_date(LocalDate.now());
        userRepository.save(user);
    } else {
        user = userOpt.get();
    }

    String accessTokenJwt = tokenService.createAccessToken(user.getId(), user.getRole());
    String refreshTokenJwt = tokenService.createRefreshToken(user.getId());

    return Map.of(
            "status", "OK",
            "message", "Đăng nhập bằng Google thành công",
            "data", Map.of(
                    "accessToken", accessTokenJwt,
                    "refreshToken", refreshTokenJwt,
                    "user", Map.of(
                            "id", user.getId(),
                            "username", user.getUsername(),
                            "email", user.getEmail() != null ? user.getEmail() : "",
                            "phone", user.getPhone() != null ? user.getPhone() : "",
                            "fullname", user.getFullname() != null ? user.getFullname() : "",
                            "birthdate", user.getBirthdate() != null ? user.getBirthdate().toString() : "",
                            "role", user.getRole()
                    )
            )
    );
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