package com.mishik.backend.entity;

import com.mishik.backend.enums.Sex;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;

@Entity
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @OneToOne(optional = false)
    @JoinColumn(name = "account_login", nullable = false)
    private Account account;
    private String firstName;
    private String lastName;
    private String patronymic;
    @Enumerated(EnumType.STRING)
    private Sex sex;

}
