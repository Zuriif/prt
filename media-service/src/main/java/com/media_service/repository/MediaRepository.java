package com.media_service.repository;

import com.media_service.entity.Media;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MediaRepository extends JpaRepository<Media, Long> {
    List<Media> findByEntiteId(Long entiteId);
}
