package com.entite_service.service.impl;

import com.entite_service.entity.EntiteLocation;
import com.entite_service.repository.EntiteLocationRepository;
import com.entite_service.service.EntiteLocationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EntiteLocationServiceImpl implements EntiteLocationService {

    @Autowired
    private EntiteLocationRepository entiteLocationRepository;

    @Override
    public List<EntiteLocation> findAll() {
        return entiteLocationRepository.findAll();
    }

    @Override
    public EntiteLocation findById(Long id) {
        return entiteLocationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("EntiteLocation not found with id: " + id));
    }

    @Override
    public EntiteLocation findByEntiteId(Long entiteId) {
        return entiteLocationRepository.findByEntiteId(entiteId);
    }

    @Override
    public EntiteLocation save(EntiteLocation entiteLocation) {
        return entiteLocationRepository.save(entiteLocation);
    }

    @Override
    public EntiteLocation update(Long id, EntiteLocation entiteLocation) {
        if (!entiteLocationRepository.existsById(id)) {
            throw new RuntimeException("EntiteLocation not found with id: " + id);
        }
        entiteLocation.setId(id);
        return entiteLocationRepository.save(entiteLocation);
    }

    @Override
    public void deleteById(Long id) {
        entiteLocationRepository.deleteById(id);
    }
} 