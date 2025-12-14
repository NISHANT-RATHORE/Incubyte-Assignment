package com.example.Backend.Service;

import com.example.Backend.model.Sweet;
import com.example.Backend.repository.SweetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SweetService {
    private final SweetRepository sweetRepository;

    public Sweet addSweet(Sweet sweet) {
        return sweetRepository.save(sweet);
    }

    public List<Sweet> getAllSweets() {
        return sweetRepository.findAll();
    }

    public List<Sweet> searchSweets(String name, String category, BigDecimal min, BigDecimal max) {
        return sweetRepository.searchSweets(name, category, min, max);
    }

    public Sweet updateSweet(Long id, Sweet sweetDetails) {
        Sweet sweet = sweetRepository.findById(id).orElseThrow(() -> new RuntimeException("Sweet not found"));
        sweet.setName(sweetDetails.getName());
        sweet.setPrice(sweetDetails.getPrice());
        sweet.setCategory(sweetDetails.getCategory());
        sweet.setQuantity(sweetDetails.getQuantity());
        return sweetRepository.save(sweet);
    }

    public void deleteSweet(Long id) {
        sweetRepository.deleteById(id);
    }

    public Sweet purchaseSweet(Long id) {
        Sweet sweet = sweetRepository.findById(id).orElseThrow(() -> new RuntimeException("Sweet not found"));
        if (sweet.getQuantity() <= 0) {
            throw new RuntimeException("Out of stock");
        }
        sweet.setQuantity(sweet.getQuantity() - 1);
        return sweetRepository.save(sweet);
    }

    public Sweet restockSweet(Long id, int amount) {
        Sweet sweet = sweetRepository.findById(id).orElseThrow(() -> new RuntimeException("Sweet not found"));
        sweet.setQuantity(sweet.getQuantity() + amount);
        return sweetRepository.save(sweet);
    }
}