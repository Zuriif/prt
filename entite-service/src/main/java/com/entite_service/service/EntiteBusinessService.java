package com.entite_service.service;

import com.entite_service.entity.EntiteBusiness;
import java.util.List;

public interface EntiteBusinessService {
    List<EntiteBusiness> findAll();
    EntiteBusiness findById(Long id);
    EntiteBusiness findByEntiteId(Long entiteId);
    EntiteBusiness save(EntiteBusiness entiteBusiness);
    EntiteBusiness update(Long id, EntiteBusiness entiteBusiness);
    void deleteById(Long id);
} 