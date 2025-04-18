package com.library_web.library.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.library_web.library.model.User;


public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    //
    Optional<User> findByResetToken(String token);

    // Tìm theo email (cho Google/Facebook login)
    Optional<User> findByEmail(String email);

    // Tìm theo providerId (Google/Facebook ID)
    Optional<User> findByProviderId(String providerId);

}
