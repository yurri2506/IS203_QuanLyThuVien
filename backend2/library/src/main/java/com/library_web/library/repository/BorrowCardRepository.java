package com.library_web.library.repository;

import com.library_web.library.model.BorrowCard;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BorrowCardRepository extends JpaRepository<BorrowCard, Long> {
}