package com.mishik.backend.repository;

import com.mishik.backend.embedded.RequestId;
import com.mishik.backend.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RequestRepository
        extends JpaRepository<Request, RequestId> {
    List<Request> findByUser_Id(Long userId);
    List<Request> findByAnimal_Shelter_Id(Long shelterId);

}