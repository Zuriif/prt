package com.entite_service.service;

import com.entite_service.entity.EntiteContact;
import java.util.List;

public interface EntiteContactService {
    List<EntiteContact> findAll();
    EntiteContact findById(Long id);
    EntiteContact findByEntiteId(Long entiteId);
    EntiteContact save(EntiteContact entiteContact);
    EntiteContact update(Long id, EntiteContact entiteContact);
    void deleteById(Long id);
} 