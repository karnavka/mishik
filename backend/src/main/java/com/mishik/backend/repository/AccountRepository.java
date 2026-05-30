package com.mishik.backend.repository;


import com.mishik.backend.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository
        extends JpaRepository<Account, String> {

}