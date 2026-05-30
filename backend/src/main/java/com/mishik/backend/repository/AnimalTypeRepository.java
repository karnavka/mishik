package com.mishik.backend.repository;

import com.mishik.backend.entity.AnimalType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AnimalTypeRepository
        extends JpaRepository<AnimalType, Long> {

}