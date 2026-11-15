package com.example.rep_max.controller;


import com.example.rep_max.DTO.request.ItemRotinaRequest;
import com.example.rep_max.DTO.response.ItemRotinaResponse;
import com.example.rep_max.service.ItemRotinaTreinoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/rotinas/{rotinaId}/itens")
public class ItemRotinaController {

    private final ItemRotinaTreinoService service;
    @PostMapping
    public ResponseEntity<ItemRotinaResponse> create(Authentication authentication,
                                                     @Valid @RequestBody ItemRotinaRequest request,
                                                     @PathVariable Long rotinaId){

        ItemRotinaResponse response =  service.create(request, authentication.getName(), rotinaId);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);

    }

    @GetMapping
    public ResponseEntity<List<ItemRotinaResponse>> getAll(@PathVariable Long rotinaId, Authentication authentication) {

        return ResponseEntity.ok(service.findAllByRotina(rotinaId, authentication.getName()));
    }
    @GetMapping("/{itemId}")
    public ResponseEntity<ItemRotinaResponse> getById(@PathVariable Long rotinaId, Authentication authentication,@PathVariable Long itemId){
        return ResponseEntity.ok(service.getById(rotinaId, authentication.getName(), itemId));
    }
    @PutMapping("/{itemId}")
    public ResponseEntity<ItemRotinaResponse> update(@PathVariable Long rotinaId,
                                                     @PathVariable Long itemId,
                                                    @Valid @RequestBody ItemRotinaRequest request,
                                                     Authentication authentication){

        ItemRotinaResponse response = service.update(rotinaId, itemId, request, authentication.getName());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<Void> delete(@PathVariable Long rotinaId, Authentication authentication,@PathVariable Long itemId) {
        service.delete(rotinaId, itemId, authentication.getName());
        return ResponseEntity.noContent().build();
    }


}
