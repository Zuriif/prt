package com.entite_service.service.impl;

import com.entite_service.entity.Entite;
import com.entite_service.repository.EntiteRepository;
import com.entite_service.service.EntiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EntiteServiceImpl implements EntiteService {

    @Autowired
    private EntiteRepository entiteRepository;

    @Override
    public Entite saveEntite(Entite entite) {
        return entiteRepository.save(entite);
    }

    @Override
    public List<Entite> getAllEntites() {
        return entiteRepository.findAll();
    }

    @Override
    public Entite getEntiteById(Long id) {
        return entiteRepository.findById(id).orElse(null);
    }

    @Override
    public void deleteEntite(Long id) {
        entiteRepository.deleteById(id);
    }
}
