package com.mishik.backend.entity;

import com.mishik.backend.embedded.FavoriteId;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "favorite")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Favorite {

    @EmbeddedId
    private FavoriteId id;

    @MapsId("userId")
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @MapsId("animalId")
    @ManyToOne
    @JoinColumn(name = "animal_id")
    private Animal animal;
}