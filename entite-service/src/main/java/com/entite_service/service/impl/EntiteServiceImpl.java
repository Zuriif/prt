package com.entite_service.service.impl;

import com.entite_service.dto.EntiteFullDTO;
import com.entite_service.entity.Entite;
import com.entite_service.repository.EntiteRepository;
import com.entite_service.service.EntiteService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class EntiteServiceImpl implements EntiteService {

    private final EntiteRepository entiteRepository;
    private final ModelMapper mapper;

    @Override
    public EntiteFullDTO save(EntiteFullDTO dto) {
        Entite entite = mapper.map(dto, Entite.class);
        if (entite.getEntiteBusiness() != null) {
            entite.getEntiteBusiness().setEntite(entite);
        }
        if (entite.getEntiteContact() != null) {
            entite.getEntiteContact().setEntite(entite);
        }
        if (entite.getEntiteProducts() != null) {
            entite.getEntiteProducts().setEntite(entite);
        }
        if (entite.getEntiteMedia() != null) {
            entite.getEntiteMedia().setEntite(entite);
        }
        if (entite.getEntiteLocation() != null) {
            entite.getEntiteLocation().setEntite(entite);
        }
        if (entite.getEntiteAdditional() != null) {
            entite.getEntiteAdditional().setEntite(entite);
        }

        Entite saved = entiteRepository.save(entite);
        return mapper.map(saved, EntiteFullDTO.class);
    }

    @Override
    public EntiteFullDTO update(Long id, EntiteFullDTO dto) {
        Entite existing = entiteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entite not found"));

        mapper.map(dto, existing);

        if (existing.getEntiteBusiness() != null) {
            existing.getEntiteBusiness().setEntite(existing);
        }
        if (existing.getEntiteContact() != null) {
            existing.getEntiteContact().setEntite(existing);
        }
        if (existing.getEntiteProducts() != null) {
            existing.getEntiteProducts().setEntite(existing);
        }
        if (existing.getEntiteMedia() != null) {
            existing.getEntiteMedia().setEntite(existing);
        }
        if (existing.getEntiteLocation() != null) {
            existing.getEntiteLocation().setEntite(existing);
        }
        if (existing.getEntiteAdditional() != null) {
            existing.getEntiteAdditional().setEntite(existing);
        }

        Entite updated = entiteRepository.save(existing);
        return mapper.map(updated, EntiteFullDTO.class);
    }

    @Override
    public void deleteById(Long id) {
        entiteRepository.deleteById(id);
    }

    @Override
    public List<EntiteFullDTO> findAll() {
        return entiteRepository.findAll().stream()
                .map(e -> mapper.map(e, EntiteFullDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public EntiteFullDTO findById(Long id) {
        Entite entite = entiteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Entite not found"));
        return mapper.map(entite, EntiteFullDTO.class);
    }
}
