package com.parametrage_service.service;

import com.parametrage_service.entity.SousSecteur;
import java.util.List;

public interface SousSecteurService {
    SousSecteur saveSousSecteur(SousSecteur sousSecteur);
    List<SousSecteur> getAllSousSecteurs();
    SousSecteur getSousSecteurById(Long id);
    void deleteSousSecteur(Long id);
}
