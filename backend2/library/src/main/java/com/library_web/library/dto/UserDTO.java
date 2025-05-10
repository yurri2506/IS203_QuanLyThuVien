package com.library_web.library.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.Column;

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


    private String role = "USER"; // mặc định là USER
    private String gender;     

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX")
private LocalDateTime birthdate;




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
    public String getRole() {
        return role;
    }
    public void setRole(String role) {
        this.role = role;
    }
    public String getGender() {
        return gender;
    }
    public void setGender  (String gender){
        this.gender = gender;
    }
    public LocalDateTime getBirthdate() {
        return birthdate;
    }   
    public void setBirthdate(LocalDateTime birthdate) {
        this.birthdate = birthdate;
    }
}