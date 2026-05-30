package com.mishik.backend.repository;

import com.mishik.backend.entity.Account;
import com.mishik.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository
        extends JpaRepository<User, Long> {
    Optional<User> findByAccount(Account account);
}