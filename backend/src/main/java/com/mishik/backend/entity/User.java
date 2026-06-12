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

import java.math.BigDecimal;

@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    private String firstName;
    private String lastName;
    private String patronymic;

    @Enumerated(EnumType.STRING)
    private Sex sex;
    private BigDecimal donatedAmount = BigDecimal.ZERO;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getPatronymic() {
        return patronymic;
    }

    public void setPatronymic(String patronymic) {
        this.patronymic = patronymic;
    }

    public Sex getSex() {
        return sex;
    }

    public void setSex(Sex sex) {
        this.sex = sex;
    }

    public BigDecimal getDonatedAmount() {
        return donatedAmount;
    }

    public void setDonatedAmount(BigDecimal donatedAmount) {
        this.donatedAmount = donatedAmount;
    }

    public void addDonation(BigDecimal amount) {
        if (donatedAmount == null) {
            donatedAmount = BigDecimal.ZERO;
        }

        donatedAmount = donatedAmount.add(amount);
    }
}
