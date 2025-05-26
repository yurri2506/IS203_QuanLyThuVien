package com.library_web.library.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.library_web.library.model.Book;
import com.library_web.library.model.BookChild;
import com.library_web.library.model.BorrowCard;
import com.library_web.library.model.Fine;
import com.library_web.library.model.User;
import com.library_web.library.repository.BookRepository;
import com.library_web.library.repository.BorrowCardRepository;
import com.library_web.library.repository.BookChildRepository;
import com.library_web.library.repository.FineRepository;
import com.library_web.library.repository.UserRepository;
import com.library_web.library.dto.FineDTO;

@Service
public class FineService {

  @Autowired
  private BookChildRepository childBookRepo;
  @Autowired
  private FineRepository fineRepo;
  @Autowired
  private UserRepository userRepo;
  @Autowired
  private EmailService mailService;
  @Autowired
  private BookChildService childBookService;
  @Autowired
  private BorrowCardRepository borrowCardRepo;
  @Autowired
  private BookRepository bookRepo;
  @Autowired
  private NotificationService notificationService;
  @Autowired
  private UserRepository userRepository;

  // public Fine addFine(Fine fine) {
  // fine.setTrangThai(Fine.TrangThai.CHUA_THANH_TOAN);
  // Fine savedFine = fineRepo.save(fine);
  // if (savedFine.getNoiDung().toString().equals("Làm mất sách")) {
  // BookChild child =
  // childBookRepo.findById(String.valueOf(savedFine.getCardId()))
  // .orElseThrow(
  // () -> new RuntimeException("Không tìm thấy sách con với id: " +
  // savedFine.getCardId()));
  // child.setStatus(BookChild.Status.NOT_AVAILABLE);
  // childBookRepo.save(child);
  // Book book = bookRepo.findById(child.getBook().getMaSach())
  // .orElseThrow(() -> new RuntimeException("Không tìm thấy sách với id: " +
  // child.getBook().getMaSach()));
  // book.setSoLuongXoa(book.getSoLuongXoa() + 1);
  // bookRepo.save(book);
  // }

  // mailService.mailFine(savedFine);
  // String message = "Bạn đã bị phạt " + fine.getSoTien()
  // + "VND. Vui lòng thanh toán tiền phạt sớm nhất.\nID Phiếu phạt: " +
  // savedFine.getId();
  // notificationService.sendNotification(savedFine.getUserId().getId(), message);
  // return savedFine;
  // }
  public Fine addFine(FineDTO dto) {
    dto.setTrangThai(FineDTO.TrangThai.CHUA_THANH_TOAN);
    Fine fine = new Fine();
    fine.setNoiDung(dto.getNoiDung());
    fine.setSoTien(dto.getSoTien());
    fine.setTrangThai(Fine.TrangThai.CHUA_THANH_TOAN);
    fine.setNgayThanhToan(null);

    // Gán User
    User user = userRepository.findById(dto.getUserId())
        .orElseThrow(() -> new RuntimeException("User không tồn tại"));
    fine.setUserId(user);

    // Gán BorrowCard
    BorrowCard card = borrowCardRepo.findById(dto.getBorrowCardId())
        .orElseThrow(() -> new RuntimeException("Borrow card không tồn tại"));
    fine.setCardId(card);

    Fine savedFine = fineRepo.save(fine);

    // Nếu lý do là mất sách, xử lý cập nhật sách
    if ("Làm mất sách".equals(savedFine.getNoiDung())) {
      BookChild child = childBookRepo.findById(String.valueOf(savedFine.getCardId().getId()))
          .orElseThrow(() -> new RuntimeException("Không tìm thấy sách con"));

      child.setStatus(BookChild.Status.NOT_AVAILABLE);
      childBookRepo.save(child);

      Book book = bookRepo.findById(child.getBook().getMaSach())
          .orElseThrow(() -> new RuntimeException("Không tìm thấy sách"));
      book.setSoLuongXoa(book.getSoLuongXoa() + 1);
      bookRepo.save(book);
    }

    mailService.mailFine(savedFine);

    String message = "Bạn đã bị phạt " + fine.getSoTien()
        + "VND. Vui lòng thanh toán tiền phạt sớm nhất.\nID Phiếu phạt: " + savedFine.getId();

    notificationService.sendNotification(savedFine.getUserId().getId(), message);

    return savedFine;
  }

  public List<Fine> getAllFines() {
    return fineRepo.findAll();
  }

  public Map<String, Object> getById(Long id) {
    Fine fine = fineRepo.findById(id)
        .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu phạt với id: " + id));
    User user = userRepo.findById(fine.getUserId().getId())
        .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
    Object cardId;
    if (fine.getNoiDung().toString().equals("Khác")) {
      cardId = fine.getCardId(); // String
    } else if (fine.getNoiDung().toString().equals("Làm mất sách")) {
      cardId = childBookService.getChildAndParent(String.valueOf(fine.getCardId())); // Map<String,Object>
                                                                                     // childbook+parentBook
    } else {
      cardId = borrowCardRepo.findById(fine.getCardId().getId());
    }
    Map<String, Object> data = Map.of(
        "id", fine.getId(),
        "userId", fine.getUserId(),
        "soTien", fine.getSoTien(),
        "noiDung", fine.getNoiDung(),
        "cardId", cardId,
        "trangThai", fine.getTrangThai(),
        "ngayThanhToan", fine.getNgayThanhToan() != null ? fine.getNgayThanhToan() : "",
        "tenND", user.getFullname(),
        "email", user.getEmail());

    return data;
  }

  public String thanhToan(Long id) {
    try {
      Fine fine = fineRepo.findById(id)
          .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu phạt với id: " + id));
      fine.setNgayThanhToan(LocalDateTime.now());
      fine.setTrangThai(Fine.TrangThai.DA_THANH_TOAN);
      fineRepo.save(fine);
      mailService.mailPay(fine); // gửi mail thông báo
      return "ok";
    } catch (Exception e) {
      e.printStackTrace();
      return e.toString();
    }
  }

  public List<Fine> getFinesByUserId(Long userId) {
    User user = userRepo.findById(userId)
        .orElseThrow(() -> new RuntimeException("User not found with id " + userId));
    return fineRepo.findByUserId(user); // ✅
  }
}