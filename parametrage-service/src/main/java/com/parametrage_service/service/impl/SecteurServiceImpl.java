package com.parametrage_service.service.impl;

import com.parametrage_service.entity.Secteur;
import com.parametrage_service.repository.SecteurRepository;
import com.parametrage_service.service.SecteurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SecteurServiceImpl implements SecteurService {

    @Autowired
    private SecteurRepository secteurRepository;

    @Override
    public Secteur saveSecteur(Secteur secteur) {
        return secteurRepository.save(secteur);
    }

    @Override
    public List<Secteur> getAllSecteurs() {
        return secteurRepository.findAll();
    }

    @Override
    public Secteur getSecteurById(Long id) {
        return secteurRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteSecteur(Long id) {
        secteurRepository.deleteById(id);
    }
}
