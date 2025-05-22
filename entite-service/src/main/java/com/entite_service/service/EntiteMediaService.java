package com.entite_service.service;

import com.entite_service.entity.EntiteMedia;
import java.util.List;

public interface EntiteMediaService {
    List<EntiteMedia> findAll();
    EntiteMedia findById(Long id);
    EntiteMedia findByEntiteId(Long entiteId);
    EntiteMedia save(EntiteMedia entiteMedia);
    EntiteMedia update(Long id, EntiteMedia entiteMedia);
    void deleteById(Long id);
} 