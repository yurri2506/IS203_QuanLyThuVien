package com.library_web.library.service;

import com.library_web.library.dto.BorrowCardDTO;
import com.library_web.library.model.BorrowCard;
import com.library_web.library.model.BorrowCard.Status;
import com.library_web.library.repository.BorrowCardRepository;
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

  public List<BorrowCardDTO> getAll() {
    return repository.findAll().stream()
        .map(this::toDTO)
        .collect(Collectors.toList());
  }

  public BorrowCardDTO getById(Long id) {
    return repository.findById(id).map(this::toDTO).orElse(null);
  }

  public BorrowCardDTO create(BorrowCardDTO dto) {
    BorrowCard borrowCard = new BorrowCard(
      dto.getUserId(),
      dto.getBorrowDate() != null ? dto.getBorrowDate() : LocalDateTime.now(),
      dto.getBookIds());
    BorrowCard saved = repository.save(borrowCard);
    return toDTO(saved);
  }

  public BorrowCardDTO update(Long id, BorrowCardDTO dto) {
    Optional<BorrowCard> optional = repository.findById(id);
    if (optional.isEmpty())
      return null;

    BorrowCard card = optional.get();
    card.setBookIds(dto.getBookIds());
    card.setDueDate(dto.getDueDate());
    card.setGetBookDate(dto.getGetBookDate());
    card.setStatus(dto.getStatus());

    return toDTO(repository.save(card));
  }

  public boolean delete(Long id) {
    if (!repository.existsById(id))
      return false;
    repository.deleteById(id);
    return true;
  }

  private BorrowCardDTO toDTO(BorrowCard card) {
    BorrowCardDTO dto = new BorrowCardDTO();
    dto.setId(card.getId());
    dto.setUserId(card.getUserId());
    dto.setBookIds(card.getBookIds());
    dto.setBorrowDate(card.getBorrowDate());
    dto.setDueDate(card.getDueDate());
    dto.setGetBookDate(card.getGetBookDate());
    dto.setStatus(card.getStatus());
    return dto;
  }
}
