package com.mishik.backend.entity;

import com.mishik.backend.enums.Sex;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;


@Entity
public class Animal {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private int height;
    private byte age;
    private String description;

    @Enumerated(EnumType.STRING)
    private Sex sex;

    @ManyToOne(optional = false)
    @JoinColumn(name = "animal_type", nullable = false)
    private AnimalType animalType;

    @ManyToOne(optional = false)
    @JoinColumn(name = "shelter_id", nullable = false)
    private Shelter shelter;

}
