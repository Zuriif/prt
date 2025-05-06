package com.entite_service.service;

import com.entite_service.entity.Entite;
import java.util.List;

public interface EntiteService {
    Entite saveEntite(Entite entite);
    List<Entite> getAllEntites();
    Entite getEntiteById(Long id);
    void deleteEntite(Long id);
}
