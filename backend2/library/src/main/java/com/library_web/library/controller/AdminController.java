package com.library_web.library.controller;

import com.library_web.library.dto.UserDTO;
import com.library_web.library.model.User;
import com.library_web.library.repository.UserRepository;
import com.library_web.library.service.TempStorage;
import com.library_web.library.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;



    @PostMapping("/verify-otp")
    public Map<String, Object> verifyOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        Map<String, Object> response = userService.verifyOtpAndLoginForAdmin(email, otp);
        if (response == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP không hợp lệ hoặc đã hết hạn");
        }
        return response;
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/users")
    public Map<String, Object> getAllUsers() {
        List<User> users = userRepository.findAll();
        return Map.of(
                "message", "Danh sách người dùng",
                "data", users);
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping("/users")
    public Map<String, Object> createUser(@RequestBody UserDTO userDTO) {
        Map<String, Object> response = userService.createUser(userDTO);
        if (response == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tạo người dùng không thành công");
        }
        if (response.containsKey("email")) {
            // OTP verification required
            return response; // Returns {"message": "Đã gửi OTP tới email, vui lòng xác thực", "email": "..."}
        }
        return response; // Returns user creation success response
    }

     @PostMapping("/verify-otp-create")
    public Map<String, Object> verifyOtpCreate(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");

        Map<String, Object> response = userService.verifyOtpAndCreate(email, otp);
        if (response == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "OTP không hợp lệ hoặc đã hết hạn");
        }
        return response;
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping("/users/{id}")
    public Map<String, Object> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng với ID: " + id);
        }
        Map<String, Object> response = userService.updateUser(id, userDTO);
        if (response == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cập nhật người dùng không thành công");
        }
        return response;
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/users/{id}")
    public Map<String, Object> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng với ID: " + id);
        }
        userRepository.deleteById(id);
        return Map.of(
                "message", "Xóa người dùng với ID " + id + " thành công",
                "data", Map.of("id", id));
    }
}