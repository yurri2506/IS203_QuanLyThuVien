package com.library_web.library.controller;

import com.library_web.library.dto.CartItemDTO;
import com.library_web.library.model.User;
import com.library_web.library.repository.UserRepository;
import com.library_web.library.service.CartService;


import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin
public class CartController {
    private final CartService cartService;
    private final UserRepository userRepository;

    public CartController(CartService cartService, UserRepository userRepository) {
        this.cartService = cartService;
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = authService.authenticate(request.getUsername(), request.getPassword());
        if (user != null) {
            // Tạo hoặc lấy giỏ hàng tự động khi đăng nhập thành công
            cartService.getOrCreateCart(user);
            return ResponseEntity.ok("Đăng nhập thành công");
        }
        return ResponseEntity.status(401).body("Đăng nhập thất bại");
    }
    
/*
    private User getCurrentUser() {
        org.springframework.security.core.Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy user"));
    }
*/
    @PostMapping("/{userId}/add/{bookId}")
    public ResponseEntity<?> addBookToCart(
            @PathVariable Long userId,
            @PathVariable Long bookId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        cartService.addBookToCart(user, bookId);
        return ResponseEntity.ok("Đã thêm sách vào giỏ");
    }

    @DeleteMapping("/{userId}/remove/{bookId}")
    public ResponseEntity<?> removeBookFromCart(
            @PathVariable Long userId,
            @PathVariable Long bookId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        cartService.removeBookFromCart(user, bookId);
        return ResponseEntity.ok("Đã xóa sách khỏi giỏ");
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<CartItemDTO>> getCartDetails(
            @PathVariable Long userId) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        List<CartItemDTO> items = cartService.getCartDetails(user);
        return ResponseEntity.ok(items);
    }

}
