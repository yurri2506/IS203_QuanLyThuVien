package com.library_web.library.model;

import java.time.LocalDateTime;

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
    private String password;

    @Column(nullable = true, unique = true, columnDefinition = "VARCHAR(255) DEFAULT 'unknown'")
    private String phone;

    @Column(nullable = false, unique = true, columnDefinition = "VARCHAR(255) DEFAULT 'unknown'")
    private String email;

    @Column(nullable = false)
    private String role = "USER"; // mặc định là USER

    private String fullname;

    @Column(name = "provider")
     private String provider; // GOOGLE, FACEBOOK
 
     @Column(name = "provider_id")
     private String providerId; // ID do Google/Facebook cấp

     @Column(nullable = false)
     private String gender; // Giới tính của người dùng (nam, nữ, khác)

     @Column(nullable = false)
     private String birthdate; // Ngày sinh của người dùng (định dạng YYYY-MM-DD)

     public String getGender() {
        return gender;
    }
    
    public void setGender(String gender){
        this.gender = gender;
    }


    public String getBirthdate() {
        return birthdate;
    }

    public void setBirthdate(String birthdate) {
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
    
}