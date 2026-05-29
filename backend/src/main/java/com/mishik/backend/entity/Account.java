package com.mishik.backend.entity;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Table(name = "account")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String username;
    private String password;
    private String role;

    @Column(name = "id_employee")
    private String idEmployee;
}