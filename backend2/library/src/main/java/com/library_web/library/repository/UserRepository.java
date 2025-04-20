package com.library_web.library.repository;

import com.library_web.library.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username); // Thêm phương thức tìm kiếm theo tên đăng nhập
    Optional<User> findById(Long id); // Thêm phương thức tìm kiếm theo ID
    Optional<User> findByProviderId(String providerId); // Tìm kiếm theo ID của Google/Facebook
    Optional<User> findByProvider(String provider); // Tìm kiếm theo provider (Google, Facebook)
    Optional<User> findByName(String name); // Tìm kiếm theo tên người dùng
    
    Optional<User> findByEmail(String email);
    Optional<User> findByResetToken(String resetToken);
}