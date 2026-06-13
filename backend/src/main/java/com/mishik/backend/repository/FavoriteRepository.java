package com.mishik.backend.repository;

import com.mishik.backend.embedded.FavoriteId;
import com.mishik.backend.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FavoriteRepository extends JpaRepository<Favorite, FavoriteId> {
    List<Favorite> findByUser_Id(Long userId);
}