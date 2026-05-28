package com.mishik.backend.entity;
import com.mishik.backend.embedded.Address;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
@Entity
public class Shelter {
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String phoneNumber;
    @OneToOne(optional = false)
    @JoinColumn(name = "account_login", nullable = false)
    private Account account;
    @Embedded
    private Address address;

    private String adoptionConditions;
}
