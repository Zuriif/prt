package com.entite_service.service.impl;

import com.entite_service.entity.EntiteContact;
import com.entite_service.repository.EntiteContactRepository;
import com.entite_service.service.EntiteContactService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EntiteContactServiceImpl implements EntiteContactService {

    @Autowired
    private EntiteContactRepository entiteContactRepository;

    @Override
    public List<EntiteContact> findAll() {
        return entiteContactRepository.findAll();
    }

    @Override
    public EntiteContact findById(Long id) {
        return entiteContactRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("EntiteContact not found with id: " + id));
    }

    @Override
    public EntiteContact findByEntiteId(Long entiteId) {
        return entiteContactRepository.findByEntiteId(entiteId);
    }

    @Override
    public EntiteContact save(EntiteContact entiteContact) {
        return entiteContactRepository.save(entiteContact);
    }

    @Override
    public EntiteContact update(Long id, EntiteContact entiteContact) {
        if (!entiteContactRepository.existsById(id)) {
            throw new RuntimeException("EntiteContact not found with id: " + id);
        }
        entiteContact.setId(id);
        return entiteContactRepository.save(entiteContact);
    }

    @Override
    public void deleteById(Long id) {
        entiteContactRepository.deleteById(id);
    }
} 