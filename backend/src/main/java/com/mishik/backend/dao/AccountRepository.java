package com.mishik.backend.dao;

import com.mishik.backend.entity.Account;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    Optional<Account> findByLogin(String login); // JPA сам генерує SQL
}