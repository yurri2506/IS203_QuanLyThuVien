package com.library_web.library.controller;

import com.library_web.library.dto.BorrowCardDTO;
import com.library_web.library.model.BorrowCard;
import com.library_web.library.service.BorrowCardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrow-cards")
public class BorrowCardController {

  @Autowired
  private BorrowCardService service;

  @GetMapping
  public ResponseEntity<List<BorrowCardDTO>> getAll() {
    return ResponseEntity.ok(service.getAll());
  }

  @GetMapping("/{id}")
  public ResponseEntity<BorrowCardDTO> getById(@PathVariable Long id) {
    BorrowCardDTO dto = service.getById(id);
    return dto != null ? ResponseEntity.ok(dto) : ResponseEntity.notFound().build();
  }

  @PostMapping
  public ResponseEntity<BorrowCardDTO> create(@RequestBody BorrowCardDTO dto) {
    return ResponseEntity.ok(service.create(dto));
  }

  @PutMapping("/{id}")
  public ResponseEntity<BorrowCardDTO> update(@PathVariable Long id, @RequestBody BorrowCardDTO dto) {
    BorrowCardDTO updated = service.update(id, dto);
    return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    return service.delete(id) ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
  }

  @PostMapping("/user/{userId}")
   public ResponseEntity<List<BorrowCard>> getBorrowCardsByUserId(@PathVariable Long userId) {
        List<BorrowCard> borrowCards = service.getBorrowCardsByUserId(userId);
        if (borrowCards.isEmpty()) {
            return ResponseEntity.status(204).build(); // Trả về trạng thái 204 nếu không có dữ liệu
        }
        return ResponseEntity.ok(borrowCards); // Trả về danh sách phiếu mượn của người dùng
    }
}
