package com.entite_service.service;

import com.entite_service.entity.EntiteLocation;
import java.util.List;

public interface EntiteLocationService {
    List<EntiteLocation> findAll();
    EntiteLocation findById(Long id);
    EntiteLocation findByEntiteId(Long entiteId);
    EntiteLocation save(EntiteLocation entiteLocation);
    EntiteLocation update(Long id, EntiteLocation entiteLocation);
    void deleteById(Long id);
} 