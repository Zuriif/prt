package com.entite_service.service.impl;

import com.entite_service.entity.EntiteAdditional;
import com.entite_service.repository.EntiteAdditionalRepository;
import com.entite_service.service.EntiteAdditionalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EntiteAdditionalServiceImpl implements EntiteAdditionalService {

    @Autowired
    private EntiteAdditionalRepository entiteAdditionalRepository;

    @Override
    public List<EntiteAdditional> findAll() {
        return entiteAdditionalRepository.findAll();
    }

    @Override
    public EntiteAdditional findById(Long id) {
        return entiteAdditionalRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("EntiteAdditional not found with id: " + id));
    }

    @Override
    public EntiteAdditional findByEntiteId(Long entiteId) {
        return entiteAdditionalRepository.findByEntiteId(entiteId);
    }

    @Override
    public EntiteAdditional save(EntiteAdditional entiteAdditional) {
        return entiteAdditionalRepository.save(entiteAdditional);
    }

    @Override
    public EntiteAdditional update(Long id, EntiteAdditional entiteAdditional) {
        if (!entiteAdditionalRepository.existsById(id)) {
            throw new RuntimeException("EntiteAdditional not found with id: " + id);
        }
        entiteAdditional.setId(id);
        return entiteAdditionalRepository.save(entiteAdditional);
    }

    @Override
    public void deleteById(Long id) {
        entiteAdditionalRepository.deleteById(id);
    }
} 