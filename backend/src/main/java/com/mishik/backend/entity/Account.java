package com.mishik.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
@Entity
public class Account {
    @Id
    private String login;
    
    private String password;

}
