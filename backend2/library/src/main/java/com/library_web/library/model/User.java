package com.library_web.library.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    @JsonIgnore // không trả về JSON
    private String password;


    @Column(nullable = true, unique = true)

    private String phone;

    @Column(nullable = true, unique = true)
    private String email;

    @Column(nullable = false)
    private String role = "USER"; // mặc định là USER

    private String fullname;

    @Column(nullable = true)
    private String gender;

    
    @Column(nullable = true)
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSX") // Cập nhật để khớp với frontend
    private LocalDateTime birthdate;
    

    @Column(name = "provider")
     private String provider; // GOOGLE, FACEBOOK
 
     @Column(name = "provider_id")
     private String providerId; // ID do Google/Facebook cấp

    // Getters và Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalDateTime getBirthdate() {
        return birthdate;
    }  
    public void setBirthdate(LocalDateTime birthdate) {
        this.birthdate = birthdate;
    }
    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getProviderId() {
        return providerId;
    }

    public void setProviderId(String providerId) {
        this.providerId = providerId;
    }

}