package com.library_web.library.model;

public class UserDTO {
    private String username;
    private String email;
    private String fullname;
    private String phone;
    private String password;
    // Constructor không tham số (bắt buộc cho Spring Boot xài @RequestBody)
public UserDTO() {
}

// Constructor đầy đủ tham số
public UserDTO(String username, String email, String fullname, String phone, String password) {
    this.username = username;
    this.email = email;
    this.fullname = fullname;
    this.phone = phone;
    this.password = password;
}


    // Getters và Setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }
    
    public String getPhone() {
        return phone;
    }

    public void setEmail(String email) {
        this.email = email;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getFullname() {
        return fullname;
    }

    public void setFullname(String fullname) {
        this.fullname = fullname;
    }
    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }
}