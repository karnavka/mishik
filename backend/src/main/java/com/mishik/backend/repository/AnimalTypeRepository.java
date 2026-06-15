package com.mishik.backend.repository;

import com.mishik.backend.entity.AnimalType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AnimalTypeRepository
        extends JpaRepository<AnimalType, Long> {

    Optional<AnimalType> findByUsefulInfoIgnoreCase(String usefulInfo);
}
