package com.example.Backend.service;

import com.example.Backend.Service.SweetService;
import com.example.Backend.model.Sweet;
import com.example.Backend.repository.SweetRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SweetServiceTest {

    @Mock
    private SweetRepository sweetRepository;

    @InjectMocks
    private SweetService sweetService;

    @Test
    void testAddSweet() {
        Sweet sweet = new Sweet(1L, "Candy", "Sugar", new BigDecimal("1.00"), 5);
        when(sweetRepository.save(sweet)).thenReturn(sweet);

        Sweet result = sweetService.addSweet(sweet);

        assertNotNull(result);
        assertEquals(sweet.getId(), result.getId());
        verify(sweetRepository).save(sweet);
    }

    @Test
    void testGetAllSweets() {
        Sweet s1 = new Sweet(1L, "Candy", "Sugar", new BigDecimal("1.00"), 5);
        Sweet s2 = new Sweet(2L, "Choco", "Chocolate", new BigDecimal("2.00"), 3);
        when(sweetRepository.findAll()).thenReturn(List.of(s1, s2));

        List<Sweet> result = sweetService.getAllSweets();

        assertEquals(2, result.size());
        assertTrue(result.contains(s1));
        assertTrue(result.contains(s2));
        verify(sweetRepository).findAll();
    }

    @Test
    void testSearchSweets() {
        Sweet s = new Sweet(1L, "Candy", "Sugar", new BigDecimal("1.00"), 5);
        when(sweetRepository.searchSweets("Candy", "Sugar", new BigDecimal("0.50"), new BigDecimal("2.00")))
                .thenReturn(List.of(s));

        List<Sweet> result = sweetService.searchSweets("Candy", "Sugar", new BigDecimal("0.50"), new BigDecimal("2.00"));

        assertEquals(1, result.size());
        assertEquals("Candy", result.get(0).getName());
        verify(sweetRepository).searchSweets("Candy", "Sugar", new BigDecimal("0.50"), new BigDecimal("2.00"));
    }

    @Test
    void testUpdateSweetSuccess() {
        Sweet existing = new Sweet(1L, "Candy", "Sugar", new BigDecimal("1.00"), 5);
        Sweet details = new Sweet(null, "CandyUpdated", "Sweet", new BigDecimal("1.50"), 10);

        when(sweetRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(sweetRepository.save(any(Sweet.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Sweet updated = sweetService.updateSweet(1L, details);

        assertEquals("CandyUpdated", updated.getName());
        assertEquals("Sweet", updated.getCategory());
        assertEquals(new BigDecimal("1.50"), updated.getPrice());
        assertEquals(10, updated.getQuantity());
        verify(sweetRepository).findById(1L);
        verify(sweetRepository).save(existing);
    }

    @Test
    void testUpdateSweetNotFound() {
        when(sweetRepository.findById(1L)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> sweetService.updateSweet(1L, new Sweet()));
        assertEquals("Sweet not found", ex.getMessage());
        verify(sweetRepository).findById(1L);
        verify(sweetRepository, never()).save(any());
    }

    @Test
    void testDeleteSweet() {
        doNothing().when(sweetRepository).deleteById(1L);
        sweetService.deleteSweet(1L);
        verify(sweetRepository).deleteById(1L);
    }

    @Test
    void testPurchaseDecreasesQuantity() {
        Sweet sweet = new Sweet(1L, "Candy", "Sugar", new BigDecimal("1.00"), 10);
        when(sweetRepository.findById(1L)).thenReturn(Optional.of(sweet));
        when(sweetRepository.save(sweet)).thenReturn(sweet);

        Sweet result = sweetService.purchaseSweet(1L);

        assertNotNull(result);
        assertEquals(9, result.getQuantity());
        verify(sweetRepository).findById(1L);
        verify(sweetRepository).save(sweet);
    }

    @Test
    void testPurchaseOutOfStock() {
        Sweet sweet = new Sweet(1L, "Candy", "Sugar", new BigDecimal("1.00"), 0);
        when(sweetRepository.findById(1L)).thenReturn(Optional.of(sweet));

        RuntimeException ex = assertThrows(RuntimeException.class, () -> sweetService.purchaseSweet(1L));
        assertEquals("Out of stock", ex.getMessage());
        verify(sweetRepository).findById(1L);
        verify(sweetRepository, never()).save(any());
    }

    @Test
    void testPurchaseNotFound() {
        when(sweetRepository.findById(1L)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> sweetService.purchaseSweet(1L));
        assertEquals("Sweet not found", ex.getMessage());
        verify(sweetRepository).findById(1L);
    }

    @Test
    void testRestockSweetSuccess() {
        Sweet sweet = new Sweet(1L, "Candy", "Sugar", new BigDecimal("1.00"), 2);
        when(sweetRepository.findById(1L)).thenReturn(Optional.of(sweet));
        when(sweetRepository.save(sweet)).thenReturn(sweet);

        Sweet result = sweetService.restockSweet(1L, 5);

        assertEquals(7, result.getQuantity());
        verify(sweetRepository).findById(1L);
        verify(sweetRepository).save(sweet);
    }

    @Test
    void testRestockSweetNotFound() {
        when(sweetRepository.findById(1L)).thenReturn(Optional.empty());
        RuntimeException ex = assertThrows(RuntimeException.class, () -> sweetService.restockSweet(1L, 3));
        assertEquals("Sweet not found", ex.getMessage());
        verify(sweetRepository).findById(1L);
        verify(sweetRepository, never()).save(any());
    }
}