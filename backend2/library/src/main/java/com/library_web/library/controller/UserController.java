package com.library_web.library.controller;

import com.library_web.library.model.User;
import com.library_web.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.NoSuchElementException;
@RestController
@RequestMapping("/api/user")
@PreAuthorize("hasAnyAuthority('USER', 'ADMIN')")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PutMapping("")
    public ResponseEntity<?> updateProfile(@RequestParam String username, @RequestBody Map<String, String> updates) {
        try {
            String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
            String currentRole = SecurityContextHolder.getContext().getAuthentication().getAuthorities()
                    .iterator().next().getAuthority();

            if (currentRole.equals("USER") && !currentUsername.equals(username)) {
                return ResponseEntity.status(403).body(Map.of("message", "Bạn không có quyền sửa thông tin người khác"));
            }

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new NoSuchElementException("Không tìm thấy người dùng"));

            if (updates.get("fullname") != null) {
                user.setFullname(updates.get("fullname"));
            }
            if (updates.get("phone") != null) {
                user.setPhone(updates.get("phone"));
            }
            if (updates.get("email") != null) {
                user.setEmail(updates.get("email"));
            }
            if (updates.get("password") != null) {
                user.setPassword(updates.get("password"));
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
}
