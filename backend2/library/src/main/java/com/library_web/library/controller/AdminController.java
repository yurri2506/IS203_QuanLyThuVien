package com.library_web.library.controller;

import com.library_web.library.model.User;
import com.library_web.library.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ADMIN')")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/users")
    public Map<String, Object> getAllUsers() {
        List<User> users = userRepository.findAll();
        return Map.of(
            "message", "Danh sách người dùng",
            "data", users
        );
    }

    @DeleteMapping("/users/{id}")
    public Map<String, Object> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy người dùng với ID: " + id);
        }
        userRepository.deleteById(id);
        return Map.of(
            "message", "Xóa người dùng với ID " + id + " thành công",
            "data", Map.of("id", id)
        );
    }
}