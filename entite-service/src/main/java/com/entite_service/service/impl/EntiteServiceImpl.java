package com.entite_service.service.impl;

import com.entite_service.entity.Entite;
import com.entite_service.repository.EntiteRepository;
import com.entite_service.service.EntiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EntiteServiceImpl implements EntiteService {

    @Autowired
    private EntiteRepository entiteRepository;

    @Override
    public List<Entite> findAll() {
        return entiteRepository.findAll();
    }

    @Override
    public Entite findById(Long id) {
        return entiteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entite not found with id: " + id));
    }

    @Override
    public Entite save(Entite entite) {
        return entiteRepository.save(entite);
    }

    @Override
    public Entite update(Long id, Entite entite) {
        if (!entiteRepository.existsById(id)) {
            throw new RuntimeException("Entite not found with id: " + id);
        }
        entite.setId(id);
        return entiteRepository.save(entite);
    }

    @Override
    public void deleteById(Long id) {
        entiteRepository.deleteById(id);
    }
}
