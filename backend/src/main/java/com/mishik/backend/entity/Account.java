package com.mishik.backend.entity;

import com.mishik.backend.enums.Role;
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

    private String login;
    private String password;
    private Role role;

   // @Column(name = "id_employee")
  //  private String idEmployee;
}
