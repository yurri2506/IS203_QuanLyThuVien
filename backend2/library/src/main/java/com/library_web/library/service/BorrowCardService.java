package com.library_web.library.service;

import com.library_web.library.dto.BorrowCardDTO;
import com.library_web.library.dto.BorrowCardDTO.BookInfo;
import com.library_web.library.model.Book;
import com.library_web.library.model.BookChild;
import com.library_web.library.model.User;
import com.library_web.library.model.BorrowCard;
import com.library_web.library.model.Category;
import com.library_web.library.model.CategoryChild;
import com.library_web.library.model.BorrowCard.Status;
import com.library_web.library.repository.BookChildRepository;
import com.library_web.library.repository.BookRepository;
import com.library_web.library.repository.BorrowCardRepository;
import com.library_web.library.repository.CategoryChildRepository;
import com.library_web.library.repository.CategoryRepository;
import com.library_web.library.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BorrowCardService {

  @Autowired
  private BorrowCardRepository repository;
  @Autowired
  private BookRepository BookRepository;
  @Autowired
  private UserRepository UserRepository;
  @Autowired
  private CategoryChildRepository CategoryChildRepository;
  @Autowired
  private BookChildRepository childBookRepo;

  // public List<BorrowCardDTO> getAll() {
  // return repository.findAll().stream()
  // .map(this::toDTO)
  // .collect(Collectors.toList());
  // }

  public BorrowCardDTO getBorrowCardDetails(Long id) {
    BorrowCard borrowCard = repository.findById(id)
        .orElseThrow(() -> new RuntimeException("Phiếu mượn không tồn tại"));

    // Cập nhật trạng thái trước khi trả về
    borrowCard.updateStatus(Status.BORROWED);
    repository.save(borrowCard);
    User user = UserRepository.findById(borrowCard.getUserId())
        .orElseThrow(() -> new RuntimeException("Người dùng không tồn tại"));

    List<Long> bookIds = borrowCard.getBookIds().stream()
        .map(Long::valueOf)
        .collect(Collectors.toList());
    List<Book> books = BookRepository.findAllById(bookIds);

    List<BorrowCardDTO.BookInfo> bookInfos = books.stream().map(book -> {
      CategoryChild categoryChild = CategoryChildRepository.findChildById(book.getCategoryChild().getId())
          .orElseThrow(() -> new RuntimeException("Thể loại không tồn tại"));
      return new BorrowCardDTO.BookInfo(
          book.getHinhAnh().get(0),
          book.getTenSach(),
          book.getTenTacGia(),
          categoryChild.getName(), // Lấy tên thể loại con
          book.getNxb(),
          book.getSoLuongMuon());
    }).toList();

    return new BorrowCardDTO(
        borrowCard.getId(),
        user.getId(),
        user.getUsername(),
        bookInfos,
        borrowCard.getBorrowDate(),
        borrowCard.getGetBookDate(),
        borrowCard.getDueDate(),
        bookInfos.size());
  }

  public BorrowCard create(Long userId, List<String> bookIds) {
    LocalDateTime borrowDate = LocalDateTime.now();
    // int waitingToTake = settingService.getSetting().getWaitingToTake();
    int waitingToTake = 3;
    BorrowCard borrowCard = new BorrowCard(userId, borrowDate, waitingToTake, bookIds);
    for (String bookId : bookIds) {
      Book book = BookRepository.findById(Long.valueOf(bookId))
          .orElseThrow(() -> new RuntimeException("Không tìm thấy sách với id: " + bookId));
      book.setSoLuongMuon(book.getSoLuongMuon() + 1);
      BookRepository.save(book); // lưu lại từng sách
    }
    return repository.save(borrowCard);
  }

  // public BorrowCardDTO update(Long id, BorrowCardDTO dto) {
  // Optional<BorrowCard> optional = repository.findById(id);
  // if (optional.isEmpty())
  // return null;

  // BorrowCard card = optional.get();
  // card.setBookIds(dto.getBookIds());
  // card.setDueDate(dto.getDueDate());
  // card.setGetBookDate(dto.getGetBookDate());
  // card.setStatus(dto.getStatus());

  // return toDTO(repository.save(card));
  // }

  public boolean delete(Long id) {
    if (!repository.existsById(id))
      return false;
    repository.deleteById(id);
    return true;
  }

  // private BorrowCardDTO toDTO(BorrowCard card) {
  // BorrowCardDTO dto = new BorrowCardDTO();
  // dto.setId(card.getId());
  // dto.setUserId(card.getUserId());
  // dto.setBookIds(card.getBookIds());
  // dto.setBorrowDate(card.getBorrowDate());
  // dto.setDueDate(card.getDueDate());
  // dto.setGetBookDate(card.getGetBookDate());
  // dto.setStatus(card.getStatus());
  // return dto;
  // }

  public List<BorrowCard> getBorrowCardsByUserId(Long userId) {
    return repository.findByUserId(userId); // Trả về tất cả phiếu mượn của userId
  }

  public BorrowCard updateBorrowCardToBorrowing(Long id, List<String> childBookIds) {
    BorrowCard borrowCard = repository.findById(id)
        .orElseThrow(() -> new RuntimeException("Phiếu mượn không tồn tại"));

    // Cập nhật trạng thái phiếu mượn thành "Đang mượn"
    borrowCard.setStatus("Đang mượn");
    // Cập nhật ngày mượn
    borrowCard.setGetBookDate(LocalDateTime.now());
    // Tính toán ngày trả sách (theo setting)
    // int borrowDay = settingService.getSetting().getBorrowDay();
    int borrowDay = 7; // Ví dụ: 7 ngày
    borrowCard.setDueDate(LocalDateTime.now().plusDays(borrowDay));
    // Thêm danh sách sách con
    borrowCard.setBookIds(childBookIds);
    // Cập nhật sách con
    for (String childId : childBookIds) {
      BookChild child = childBookRepo.findById(childId)
          .orElseThrow(() -> new RuntimeException("Không tìm thấy sách con với id: " + childId));
      child.setStatus(BookChild.Status.BORROWED);
      childBookRepo.save(child); // lưu lại từng sách con
    }
    // Lưu phiếu mượn đã cập nhật
    return repository.save(borrowCard);
  }
}
