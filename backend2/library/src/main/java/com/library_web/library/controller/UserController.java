package com.library_web.library.controller;

import com.library_web.library.dto.UserDTO;
import com.library_web.library.model.User;
import com.library_web.library.repository.UserRepository;
import com.library_web.library.service.TempStorage;
import com.library_web.library.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/user")
@PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @PutMapping("/")
    public ResponseEntity<?> updateProfile(@RequestParam String username, @RequestBody Map<String, String> updates) {
        try {
            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            String currentRole = SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                    .iterator().next().getAuthority();

            if (currentRole.equals("USER") && !currentUsername.equals(username)) {
                return ResponseEntity.status(403)
                        .body(Map.of("message", "Bạn không có quyền sửa thông tin người khác"));
            }

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

            if (updates.get("username") != null) {
                String newUsername = updates.get("username");
                if (userRepository.findByUsername(newUsername).isPresent() && !newUsername.equals(user.getUsername())) {
                    throw new IllegalArgumentException("Tên đăng nhập đã tồn tại");
                }
                user.setUsername(newUsername);
            }

            if (updates.get("fullname") != null) {
                user.setFullname(updates.get("fullname"));
            }

            if (updates.get("phone") != null) {
                String newPhone = updates.get("phone");
                if (userRepository.findByPhone(newPhone).isPresent() && !newPhone.equals(user.getPhone())) {
                    throw new IllegalArgumentException("Số điện thoại đã tồn tại");
                }
                user.setPhone(newPhone);
            }

            if (updates.get("email") != null) {
                String newEmail = updates.get("email");
                if (userRepository.findByEmail(newEmail).isPresent()) {
                    throw new IllegalArgumentException("Email đã tồn tại");
                }

                String otp = String.valueOf((int) (Math.random() * 900000) + 100000);
                LocalDateTime expiredAt = LocalDateTime.now().plusMinutes(5);

                UserDTO dto = new UserDTO();
                dto.setUsername(user.getUsername());
                dto.setEmail(newEmail);

                TempStorage.savePendingUser(dto, otp, expiredAt);
                userService.sendOtpEmail(newEmail, otp);

                return ResponseEntity
                        .ok(Map.of("message", "Đã gửi OTP tới email mới, vui lòng xác thực để hoàn tất cập nhật"));
            }

            if (updates.get("password") != null) {
                user.setPassword(updates.get("password")); // Nên mã hóa nếu dùng encoder
            }

            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "Cập nhật thông tin thành công"));

        } catch (NoSuchElementException ex) {
            return ResponseEntity.status(404).body(Map.of("message", ex.getMessage()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Đã xảy ra lỗi"));
        }
    }

    @PostMapping("/verify-email-update")
    public ResponseEntity<?> verifyEmailUpdate(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String otp = payload.get("otp");

        var pending = TempStorage.getPendingUser(email);
        if (pending == null) {
            return ResponseEntity.status(404).body(Map.of("message", "Không có yêu cầu xác thực nào với email này"));
        }

        if (!pending.getOtp().equals(otp)) {
            return ResponseEntity.badRequest().body(Map.of("message", "OTP không chính xác"));
        }

        if (LocalDateTime.now().isAfter(pending.getExpiredAt())) {
            TempStorage.removePendingUser(email);
            return ResponseEntity.badRequest().body(Map.of("message", "OTP đã hết hạn"));
        }

        // Xác thực đúng → cập nhật email
        String currentUsername = ((UserDTO) pending.getUserDTO()).getUsername(); // Lấy username từ TempStorage
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

        user.setEmail(email);
        userRepository.save(user);
        TempStorage.removePendingUser(email);

        return ResponseEntity.ok(Map.of("message", "Xác thực email thành công, thông tin đã được cập nhật"));
    }

}
