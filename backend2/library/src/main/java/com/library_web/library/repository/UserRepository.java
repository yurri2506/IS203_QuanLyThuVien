package com.library_web.library.repository;

import com.library_web.library.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    //
    Optional<User> findByResetToken(String token);

}
