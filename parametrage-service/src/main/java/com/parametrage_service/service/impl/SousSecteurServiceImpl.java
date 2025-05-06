package com.parametrage_service.service.impl;

import com.parametrage_service.entity.SousSecteur;
import com.parametrage_service.repository.SousSecteurRepository;
import com.parametrage_service.service.SousSecteurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SousSecteurServiceImpl implements SousSecteurService {

    @Autowired
    private SousSecteurRepository sousSecteurRepository;

    @Override
    public SousSecteur saveSousSecteur(SousSecteur sousSecteur) {
        return sousSecteurRepository.save(sousSecteur);
    }

    @Override
    public List<SousSecteur> getAllSousSecteurs() {
        return sousSecteurRepository.findAll();
    }

    @Override
    public SousSecteur getSousSecteurById(Long id) {
        return sousSecteurRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteSousSecteur(Long id) {
        sousSecteurRepository.deleteById(id);
    }
}
