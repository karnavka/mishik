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


    List<Animal> findByShelterId(Long shelterId);

    @Query("SELECT a FROM Animal a WHERE " +
            "(:shelterId IS NULL OR a.shelter.id = :shelterId) AND " +
            "(:sex IS NULL OR a.sex = :sex) AND " +
            "(:typeId IS NULL OR a.animalType.id = :typeId) AND" +
            "(:city IS NULL OR a.shelter.address.city = :city) ORDER BY a.id DESC")
    List<Animal> findFiltered(
            @Param("shelterId") Long shelterId,
            @Param("sex") Sex sex,
            @Param("typeId") Long typeId,
            @Param("city") String city
    );

}