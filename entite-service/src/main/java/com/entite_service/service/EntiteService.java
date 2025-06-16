package com.entite_service.service;

import com.entite_service.dto.EntiteFullDTO;
import java.util.List;

public interface EntiteService {
    List<EntiteFullDTO> findAll();
    EntiteFullDTO findById(Long id);
    EntiteFullDTO save(EntiteFullDTO entiteDTO);
    EntiteFullDTO update(Long id, EntiteFullDTO entiteDTO);
    void deleteById(Long id);
}
