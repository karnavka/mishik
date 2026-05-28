package com.mishik.backend.entity;

import java.time.LocalDate;

import com.mishik.backend.embedded.Address;

import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Volonteering {
    @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String description;

    @Embedded
    private Address address;

    @ManyToOne(optional = false)
    @JoinColumn(name = "by_user", nullable = false)
    private User user;

     private LocalDate dateOfEvent;

}
