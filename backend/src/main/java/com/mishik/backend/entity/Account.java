package com.mishik.backend.entity;

import com.mishik.backend.enums.Role;
import jakarta.persistence.*;

import lombok.*;

@Getter
@Setter
@Entity
@Table(name = "account")
@Builder
@NoArgsConstructor
@AllArgsConstructor

public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String login;
    private String password;
    @Enumerated(EnumType.STRING)
    private Role role;
    @Column(name = "id_employee")
    private String idEmployee;
}
