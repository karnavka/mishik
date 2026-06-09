package com.mishik.backend.repository;

import com.mishik.backend.entity.Animal;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;



import com.mishik.backend.enums.Sex;


public interface AnimalRepository extends JpaRepository<Animal, Long> {

    List<Animal> findByShelter_Id(Long id);

    List<Animal> findBySex(Sex sex);

    List<Animal> findByAnimalType_Id(Long typeId);

    List<Animal> findBySexAndAnimalType_Id(Sex sex, Long typeId);

    List<Animal> findByShelterId(Long shelterId);

}