package com.library_web.library.controller;

import com.library_web.library.dto.UserDTO;
import com.library_web.library.model.User;
import com.library_web.library.repository.UserRepository;
import com.library_web.library.service.TempStorage;
import com.library_web.library.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/{id}")
    public User layUserTheoId(@PathVariable Long id) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        String currentRole = SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                .iterator().next().getAuthority();

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy người dùng với ID: " + id));

        if (currentRole.equals("USER") && !currentUsername.equals(user.getUsername())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền truy cập thông tin người dùng này");
        }
        // Đảm bảo avatar_url không bao giờ là chuỗi rỗng
        if (user.getAvatar_url() != null && user.getAvatar_url().isEmpty()) {
            user.setAvatar_url(null);
        }

        return user;
    }


    @PutMapping("/{id}")
    public Map<String, Object> updateProfile(@PathVariable Long id, @RequestBody Map<String, String> updates) {
        String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
        String currentRole = SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                .iterator().next().getAuthority();

        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy người dùng với id: " + id));

        if (currentRole.equals("USER") && !currentUsername.equals(user.getUsername())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền cập nhật thông tin người dùng này");
        }

        boolean isEmailChanged = false;
        String newEmail = null;

        // Handle email separately to trigger OTP
        if (updates.containsKey("email")) {
            newEmail = updates.get("email");
            if (newEmail != null && !newEmail.equals(user.getEmail())) {
                if (userRepository.findByEmail(newEmail).isPresent()) {
                    throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email đã tồn tại");
                }
                isEmailChanged = true;
            }
        }

        // Update other fields directly
        if (updates.containsKey("username")) {
            user.setUsername(updates.get("username"));
        }

        if (updates.containsKey("fullname")) {
            user.setFullname(updates.get("fullname"));
        }

        if (updates.containsKey("phone")) {
            String newPhone = updates.get("phone");
            if (newPhone != null && !newPhone.equals(user.getPhone()) &&
                    userRepository.findByPhone(newPhone).isPresent()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số điện thoại đã tồn tại");
            }
            user.setPhone(newPhone);
        }

        if (updates.containsKey("birthdate")) {
            try {
                user.setBirthdate(LocalDate.parse(updates.get("birthdate"), DateTimeFormatter.ISO_LOCAL_DATE));
            } catch (Exception e) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ngày sinh phải có định dạng yyyy-MM-dd");
            }
        }
        if (updates.containsKey("password")) {
            String newPassword = updates.get("password");
            user.setPassword(passwordEncoder.encode(newPassword));
        }

        if (updates.containsKey("avatar_url")) {
            user.setAvatar_url(updates.get("avatar_url"));
        }

        // If email is changed, trigger OTP and return early
        if (isEmailChanged) {
            String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
            LocalDateTime expiredAt = LocalDateTime.now().plusMinutes(5);

            UserDTO dto = new UserDTO();
            dto.setUsername(user.getUsername());
            dto.setEmail(newEmail);

            TempStorage.savePendingUser(dto, otp, expiredAt);
            userService.sendOtpEmail(newEmail, otp);

            // Save other fields before returning
            userRepository.save(user);

            return Map.of("message", "Đã gửi OTP tới email mới, vui lòng xác thực để hoàn tất cập nhật");
        }

        // Save all other changes if no email change
        userRepository.save(user);

        return Map.of(
                "message", "Cập nhật thông tin thành công",
                "data", Map.of(
                        "username", user.getUsername(),
                        "fullname", user.getFullname() != null ? user.getFullname() : "",
                        "phone", user.getPhone() != null ? user.getPhone() : "",
                        "email", user.getEmail() != null ? user.getEmail() : "",
                        "birthdate", user.getBirthdate() != null ? user.getBirthdate().toString() : "",
                        "avatar_url", user.getAvatar_url() != null ? user.getAvatar_url() : ""));
    }

    @PostMapping("/verify-email-update")
    public Map<String, Object> verifyEmailUpdate(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String otp = payload.get("otp");

        var pending = TempStorage.getPendingUser(email);
        if (pending == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không có yêu cầu xác thực nào với email này");
        }
        if (!pending.getOtp().equals(otp)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP không chính xác");
        }
        if (LocalDateTime.now().isAfter(pending.getExpiredAt())) {
            TempStorage.removePendingUser(email);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP đã hết hạn");
        }

        String currentUsername = pending.getUserDTO().getUsername();
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Không tìm thấy người dùng với username: " + currentUsername));

        user.setEmail(email);
        userRepository.save(user);
        TempStorage.removePendingUser(email);

        return Map.of(
                "message", "Xác thực email thành công, thông tin đã được cập nhật",
                "data", Map.of(
                        "username", user.getUsername(),
                        "email", user.getEmail()));
    }

    @PostMapping("/upload-avatar")
public Map<String, Object> uploadAvatar(@RequestParam Long id, @RequestParam("file") MultipartFile file) {
    String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
    String currentRole = SecurityContextHolder.getContext().getAuthentication().getAuthorities()
            .iterator().next().getAuthority();

    User user = userRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "Không tìm thấy người dùng với ID: " + id));

    if (currentRole.equals("USER") && !currentUsername.equals(user.getUsername())) {
        throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Bạn không có quyền upload ảnh cho người khác");
    }

    // Kiểm tra định dạng file
    String contentType = file.getContentType();
    if (contentType == null || !contentType.startsWith("image/")) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chỉ hỗ trợ file ảnh (JPG, PNG, v.v.)");
    }

    // Kiểm tra kích thước file (giới hạn 5MB)
    if (file.getSize() > 5 * 1024 * 1024) {
        throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File ảnh quá lớn, tối đa 5MB");
    }

    // Xóa ảnh cũ nếu có
    if (user.getAvatar_url() != null && !user.getAvatar_url().isEmpty()) {
        try {
            Path oldPath = Paths.get("uploads/avatars/" + user.getAvatar_url().substring(user.getAvatar_url().lastIndexOf("/") + 1));
            Files.deleteIfExists(oldPath);
        } catch (IOException e) {
            System.err.println("Lỗi khi xóa ảnh cũ: " + e.getMessage());
        }
    }

    String avatarUrl = uploadFileToStorage(file);
    user.setAvatar_url(avatarUrl);
    userRepository.save(user);

    return Map.of(
            "message", "Upload ảnh đại diện thành công",
            "data", Map.of(
                    "avatar_url", avatarUrl,
                    "id", user.getId()));
}
    private String uploadFileToStorage(MultipartFile file) {
        try {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path path = Paths.get("uploads/avatars/" + fileName);
            Files.createDirectories(path.getParent());
            Files.write(path, file.getBytes());
            return "/uploads/avatars/" + fileName;
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Lỗi khi upload ảnh: " + e.getMessage());
        }
    }
}