package com.entite_service.service.impl;

import com.entite_service.entity.EntiteBusiness;
import com.entite_service.repository.EntiteBusinessRepository;
import com.entite_service.service.EntiteBusinessService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EntiteBusinessServiceImpl implements EntiteBusinessService {

    @Autowired
    private EntiteBusinessRepository entiteBusinessRepository;

    @Override
    public List<EntiteBusiness> findAll() {
        return entiteBusinessRepository.findAll();
    }

    @Override
    public EntiteBusiness findById(Long id) {
        return entiteBusinessRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("EntiteBusiness not found with id: " + id));
    }

    @Override
    public EntiteBusiness findByEntiteId(Long entiteId) {
        return entiteBusinessRepository.findByEntiteId(entiteId);
    }

    @Override
    public EntiteBusiness save(EntiteBusiness entiteBusiness) {
        return entiteBusinessRepository.save(entiteBusiness);
    }

    @Override
    public EntiteBusiness update(Long id, EntiteBusiness entiteBusiness) {
        if (!entiteBusinessRepository.existsById(id)) {
            throw new RuntimeException("EntiteBusiness not found with id: " + id);
        }
        entiteBusiness.setId(id);
        return entiteBusinessRepository.save(entiteBusiness);
    }

    @Override
    public void deleteById(Long id) {
        entiteBusinessRepository.deleteById(id);
    }
} 