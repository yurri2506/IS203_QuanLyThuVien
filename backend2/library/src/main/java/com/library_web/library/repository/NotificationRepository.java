package com.library_web.library.repository;

import com.library_web.library.model.Notification;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    // Thêm các phương thức truy vấn theo nhu cầu, ví dụ:
    List<Notification> findByUserIdAndIsRead(Long userId, boolean isRead);
    List<Notification> findByUserId(Long userId);
}