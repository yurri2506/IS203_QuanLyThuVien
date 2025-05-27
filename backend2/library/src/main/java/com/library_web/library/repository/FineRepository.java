package com.library_web.library.repository;

import com.library_web.library.model.BorrowCard;
import com.library_web.library.model.Fine;
import com.library_web.library.model.User;

import java.util.*;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FineRepository extends JpaRepository<Fine, Long> {
  List<Fine> findByUserId(User user);

  Optional<Fine> findByCardId(BorrowCard card);
}