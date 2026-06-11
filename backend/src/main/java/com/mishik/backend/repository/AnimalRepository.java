package com.mishik.backend.repository;

import com.mishik.backend.entity.Animal;
import org.springframework.data.jpa.repository.JpaRepository;


import java.util.List;



import com.mishik.backend.enums.Sex;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface AnimalRepository extends JpaRepository<Animal, Long> {

    List<Animal> findByShelter_Id(Long id);

    List<Animal> findBySex(Sex sex);

//    List<Animal> findByAnimalType_Id(Long typeId);
//
//    List<Animal> findBySexAndAnimalType_Id(Sex sex, Long typeId);

    List<Animal> findByShelterId(Long shelterId);

//    List<Animal> findByShelterIdAndSex(Long id, Sex sex);
//
//    List<Animal> findByShelterIdAndSexAndAnimalType_Id(Long id, Sex sex, Long typeId);

    @Query("SELECT a FROM Animal a WHERE " +
            "(:shelterId IS NULL OR a.shelter.id = :shelterId) AND " +
            "(:sex IS NULL OR a.sex = :sex) AND " +
            "(:typeId IS NULL OR a.animalType.id = :typeId)")
    List<Animal> findFiltered(
            @Param("shelterId") Long shelterId,
            @Param("sex") Sex sex,
            @Param("typeId") Long typeId
    );

}