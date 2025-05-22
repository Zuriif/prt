package com.entite_service.service;

import com.entite_service.entity.EntiteProducts;
import java.util.List;

public interface EntiteProductsService {
    List<EntiteProducts> findAll();
    EntiteProducts findById(Long id);
    EntiteProducts findByEntiteId(Long entiteId);
    EntiteProducts save(EntiteProducts entiteProducts);
    EntiteProducts update(Long id, EntiteProducts entiteProducts);
    void deleteById(Long id);
} 