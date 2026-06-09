package com.mishik.backend.repository;

import com.mishik.backend.entity.Clinic;
import org.springframework.data.jpa.repository.JpaRepository;





import java.util.List;

public interface ClinicRepository extends JpaRepository<Clinic, Long> {
    boolean existsByName(String name);
    List<Clinic> findByAddress_City(String city);

    List<Clinic> findByAddress_Region(String region);

    List<Clinic> findByAddress_CityAndAddress_Region(String city, String region);
}