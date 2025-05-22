package com.entite_service.service;

import com.entite_service.entity.Entite;
import java.util.List;

public interface EntiteService {
    List<Entite> findAll();
    Entite findById(Long id);
    Entite save(Entite entite);
    Entite update(Long id, Entite entite);
    void deleteById(Long id);
}
