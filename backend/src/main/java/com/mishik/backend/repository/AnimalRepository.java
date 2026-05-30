package com.mishik.backend.repository;

import com.mishik.backend.entity.Animal;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;

public interface AnimalRepository extends JpaRepository<Animal, Long> {

    List<Animal> findByShelter_Id(Long shelterId);
}