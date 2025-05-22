package com.entite_service.service;

import com.entite_service.entity.EntiteAdditional;
import java.util.List;

public interface EntiteAdditionalService {
    List<EntiteAdditional> findAll();
    EntiteAdditional findById(Long id);
    EntiteAdditional findByEntiteId(Long entiteId);
    EntiteAdditional save(EntiteAdditional entiteAdditional);
    EntiteAdditional update(Long id, EntiteAdditional entiteAdditional);
    void deleteById(Long id);
} 