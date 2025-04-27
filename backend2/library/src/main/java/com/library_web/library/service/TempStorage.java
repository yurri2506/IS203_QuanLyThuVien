package com.library_web.library.service;

import com.library_web.library.model.UserDTO;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

public class TempStorage {

    public static class PendingUser {
        private UserDTO userDTO;
        private String otp;
        private LocalDateTime expiredAt;

        public PendingUser(UserDTO userDTO, String otp, LocalDateTime expiredAt) {
            this.userDTO = userDTO;
            this.otp = otp;
            this.expiredAt = expiredAt;
        }

        public UserDTO getUserDTO() { return userDTO; }
        public String getOtp() { return otp; }
        public LocalDateTime getExpiredAt() { return expiredAt; }
    }

    private static final ConcurrentHashMap<String, PendingUser> pendingUsers = new ConcurrentHashMap<>();

    public static void savePendingUser(UserDTO userDTO, String otp, LocalDateTime expiredAt) {
        pendingUsers.put(userDTO.getEmail(), new PendingUser(userDTO, otp, expiredAt));
    }

    public static PendingUser getPendingUser(String email) {
        return pendingUsers.get(email);
    }

    public static void removePendingUser(String email) {
        pendingUsers.remove(email);
    }
}
