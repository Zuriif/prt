package com.entite_service.service.impl;

import com.entite_service.entity.EntiteMedia;
import com.entite_service.repository.EntiteMediaRepository;
import com.entite_service.service.EntiteMediaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EntiteMediaServiceImpl implements EntiteMediaService {

    @Autowired
    private EntiteMediaRepository entiteMediaRepository;

    @Override
    public List<EntiteMedia> findAll() {
        return entiteMediaRepository.findAll();
    }

    @Override
    public EntiteMedia findById(Long id) {
        return entiteMediaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("EntiteMedia not found with id: " + id));
    }

    @Override
    public EntiteMedia findByEntiteId(Long entiteId) {
        return entiteMediaRepository.findByEntiteId(entiteId);
    }

    @Override
    public EntiteMedia save(EntiteMedia entiteMedia) {
        return entiteMediaRepository.save(entiteMedia);
    }

    @Override
    public EntiteMedia update(Long id, EntiteMedia entiteMedia) {
        if (!entiteMediaRepository.existsById(id)) {
            throw new RuntimeException("EntiteMedia not found with id: " + id);
        }
        entiteMedia.setId(id);
        return entiteMediaRepository.save(entiteMedia);
    }

    @Override
    public void deleteById(Long id) {
        entiteMediaRepository.deleteById(id);
    }
} 