package com.mishik.backend.repository;

import com.mishik.backend.entity.Shelter;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ShelterRepository
        extends JpaRepository<Shelter, Long> {

}