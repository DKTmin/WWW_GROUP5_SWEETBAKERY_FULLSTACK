package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.request.CartItemSyncRequest;
import iuh.fit.se.entities.AccountCredential;
import iuh.fit.se.entities.Cart;
import iuh.fit.se.entities.CartItem;
import iuh.fit.se.entities.Pastry;
import iuh.fit.se.repositories.AccountCredentialRepository;
import iuh.fit.se.repositories.CartRepository;
import iuh.fit.se.repositories.PastryRepository;
import iuh.fit.se.services.CartService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {
    CartRepository cartRepository;
    PastryRepository pastryRepository;
    AccountCredentialRepository accountCredentialRepository;

    @Override
    @Transactional
    public void syncCartForCurrentUser(List<CartItemSyncRequest> items, boolean replace) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null)
            return;
        String username = authentication.getName();
        AccountCredential account = accountCredentialRepository.findByCredential(username);
        if (account == null || account.getUser() == null)
            return;
        String userId = account.getUser().getId();

        Cart cart = cartRepository.findByUser_Id(userId).orElseGet(() -> {
            Cart c = new Cart();
            c.setUser(account.getUser());
            c.setCartItems(new ArrayList<>());
            return c;
        });

        if (replace) {
            // Replace server cart with provided items — this ensures client deletions are
            // persisted
            List<CartItem> next = new ArrayList<>();
            if (items != null) {
                for (CartItemSyncRequest req : items) {
                    if (req == null || req.getPastryId() == null)
                        continue;
                    Optional<Pastry> pastryOpt = pastryRepository.findById(req.getPastryId());
                    if (!pastryOpt.isPresent())
                        continue;
                    Pastry pastry = pastryOpt.get();
                    int qty = req.getQty() == null ? 0 : req.getQty();
                    if (qty <= 0)
                        continue;
                    CartItem ci = new CartItem();
                    ci.setSoLuong(qty);
                    ci.setPastry(pastry);
                    ci.setCart(cart);
                    next.add(ci);
                }
            }

            // Replace existing items atomically
            cart.getCartItems().clear();
            cart.getCartItems().addAll(next);
            cartRepository.save(cart);
            return;
        }

        // Merge mode: add quantities of incoming items into existing cart items (by
        // pastry id)
        if (items == null || items.isEmpty()) {
            // nothing to merge
            return;
        }

        // Build map of existing items by pastry id
        java.util.Map<String, CartItem> existing = new java.util.HashMap<>();
        if (cart.getCartItems() != null) {
            for (CartItem ci : cart.getCartItems()) {
                if (ci.getPastry() != null && ci.getPastry().getId() != null) {
                    existing.put(ci.getPastry().getId(), ci);
                }
            }
        } else {
            cart.setCartItems(new ArrayList<>());
        }

        for (CartItemSyncRequest req : items) {
            if (req == null || req.getPastryId() == null)
                continue;
            Optional<Pastry> pastryOpt = pastryRepository.findById(req.getPastryId());
            if (!pastryOpt.isPresent())
                continue;
            Pastry pastry = pastryOpt.get();
            int qty = req.getQty() == null ? 0 : req.getQty();
            if (qty <= 0)
                continue;

            CartItem existingItem = existing.get(pastry.getId());
            if (existingItem != null) {
                // overwrite existing quantity with incoming desired quantity
                existingItem.setSoLuong(qty);
            } else {
                CartItem ci = new CartItem();
                ci.setSoLuong(qty);
                ci.setPastry(pastry);
                ci.setCart(cart);
                cart.getCartItems().add(ci);
            }
        }

        cartRepository.save(cart);
    }

    @Override
    public java.util.List<iuh.fit.se.dtos.response.CartItemResponse> getCartForCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null)
            return java.util.List.of();
        String username = authentication.getName();
        AccountCredential account = accountCredentialRepository.findByCredential(username);
        if (account == null || account.getUser() == null)
            return java.util.List.of();
        String userId = account.getUser().getId();

        Cart cart = cartRepository.findByUser_Id(userId).orElse(null);
        if (cart == null || cart.getCartItems() == null)
            return java.util.List.of();

        java.util.List<iuh.fit.se.dtos.response.CartItemResponse> out = new java.util.ArrayList<>();
        for (CartItem ci : cart.getCartItems()) {
            if (ci.getPastry() == null)
                continue;
            iuh.fit.se.dtos.response.CartItemResponse r = new iuh.fit.se.dtos.response.CartItemResponse();
            r.setPastryId(ci.getPastry().getId());
            r.setName(ci.getPastry().getName());
            r.setPrice(ci.getPastry().getPrice());
            r.setQty(ci.getSoLuong());
            r.setImageUrl(ci.getPastry().getImageUrl());
            r.setSize(null);
            out.add(r);
        }
        return out;
    }
}
