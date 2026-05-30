package com.mishik.backend.repository;

import com.mishik.backend.entity.Clinic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClinicRepository
        extends JpaRepository<Clinic, Long> {

}