package com.entite_service.service.impl;

import com.entite_service.entity.EntiteProducts;
import com.entite_service.repository.EntiteProductsRepository;
import com.entite_service.service.EntiteProductsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EntiteProductsServiceImpl implements EntiteProductsService {

    @Autowired
    private EntiteProductsRepository entiteProductsRepository;

    @Override
    public List<EntiteProducts> findAll() {
        return entiteProductsRepository.findAll();
    }

    @Override
    public EntiteProducts findById(Long id) {
        return entiteProductsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("EntiteProducts not found with id: " + id));
    }

    @Override
    public EntiteProducts findByEntiteId(Long entiteId) {
        return entiteProductsRepository.findByEntiteId(entiteId);
    }

    @Override
    public EntiteProducts save(EntiteProducts entiteProducts) {
        return entiteProductsRepository.save(entiteProducts);
    }

    @Override
    public EntiteProducts update(Long id, EntiteProducts entiteProducts) {
        if (!entiteProductsRepository.existsById(id)) {
            throw new RuntimeException("EntiteProducts not found with id: " + id);
        }
        entiteProducts.setId(id);
        return entiteProductsRepository.save(entiteProducts);
    }

    @Override
    public void deleteById(Long id) {
        entiteProductsRepository.deleteById(id);
    }
} 