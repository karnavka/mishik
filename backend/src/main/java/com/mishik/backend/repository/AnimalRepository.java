package com.mishik.backend.repository;

import com.mishik.backend.entity.Animal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnimalRepository
        extends JpaRepository<Animal, Long> {

}