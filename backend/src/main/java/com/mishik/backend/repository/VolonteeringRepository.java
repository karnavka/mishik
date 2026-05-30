package com.mishik.backend.repository;

import com.mishik.backend.entity.Volonteering;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VolonteeringRepository
        extends JpaRepository<Volonteering, Long> {

}