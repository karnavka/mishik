package com.mishik.backend.repository;

import com.mishik.backend.embedded.RequestId;
import com.mishik.backend.entity.Request;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RequestRepository
        extends JpaRepository<Request, RequestId> {

}