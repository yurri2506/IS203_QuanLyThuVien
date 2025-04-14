package com.library_web.library.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(name = "reset_token")
    private String resetToken;

     // Nếu không dùng Lombok thì phải viết tay các getter/setter:
    
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getResetToken() {
        return resetToken;
    }

    public void setResetToken(String resetToken) {
        this.resetToken = resetToken;
    }
    
    // Dùng cho login bằng Google / Facebook
    private String email;

    @Column(name = "provider")
    private String provider; // GOOGLE, FACEBOOK

    @Column(name = "provider_id")
    private String providerId; // ID do Google/Facebook cấp

    // Bạn có thể tùy chọn thêm name, avatar URL nếu cần
    private String name;

}
