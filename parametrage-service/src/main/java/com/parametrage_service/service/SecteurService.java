package com.parametrage_service.service;

import com.parametrage_service.entity.Secteur;
import java.util.List;

public interface SecteurService {
    Secteur saveSecteur(Secteur secteur);
    List<Secteur> getAllSecteurs();
    Secteur getSecteurById(Long id);
    void deleteSecteur(Long id);
}
