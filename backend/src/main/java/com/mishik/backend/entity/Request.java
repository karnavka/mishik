package com.mishik.backend.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.mishik.backend.embedded.RequestId;
import com.mishik.backend.enums.RequestStatus;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;

@Entity
@Table(name = "request")
public class Request {

    @EmbeddedId
    private RequestId id;

    @MapsId("userId")
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @MapsId("animalId")
    @ManyToOne
    @JoinColumn(name = "animal_id")
    private Animal animal;

    @Enumerated(EnumType.STRING)
    private RequestStatus status;

    private LocalDateTime createdDate;
}