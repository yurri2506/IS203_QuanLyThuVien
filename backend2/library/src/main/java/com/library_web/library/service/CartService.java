package com.library_web.library.service;

import java.util.List;


import com.library_web.library.dto.CartItemDTO;
import com.library_web.library.model.Cart;
import com.library_web.library.model.User;

public interface CartService {
    Cart getOrCreateCart(User user);
    void addBookToCart(User user, Long bookId);
    void removeBookFromCart(User user, Long bookId);
    List<CartItemDTO> getCartDetails(User user);
    //void updateQuantity (User user, Long bookId, int quantity);

}
