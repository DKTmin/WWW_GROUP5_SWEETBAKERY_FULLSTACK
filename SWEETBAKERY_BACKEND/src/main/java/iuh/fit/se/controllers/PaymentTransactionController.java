package iuh.fit.se.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import iuh.fit.se.dtos.request.OrderRequest;
import iuh.fit.se.entities.VnPayTransaction;
import iuh.fit.se.repositories.VnPayTransactionRepository;
import iuh.fit.se.repositories.PastryRepository;
import iuh.fit.se.entities.Pastry;
import iuh.fit.se.services.VnPayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/payments/vnpay")
@RequiredArgsConstructor
@Slf4j
public class PaymentTransactionController {
    private final VnPayService vnPayService;
    private final VnPayTransactionRepository txRepo;
    private final PastryRepository pastryRepository;
    private final ObjectMapper objectMapper;

    @PostMapping("/create")
    public ResponseEntity<?> createTransaction(@RequestBody OrderRequest request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null)
                return ResponseEntity.status(401).body("Unauthorized");
            String username = auth.getName();
            // assume AccountCredentialRepository can find account by credential; we'll
            // store username as userId for now

            String txnRef = UUID.randomUUID().toString();
            // compute amount server-side from item ids to avoid client tampering
            long amount = 0L;
            if (request.getItems() != null) {
                for (var it : request.getItems()) {
                    if (it == null || it.getPastryId() == null || it.getQty() == null)
                        continue;
                    Pastry p = pastryRepository.findById(it.getPastryId()).orElse(null);
                    if (p == null) {
                        return ResponseEntity.status(400)
                                .body(java.util.Map.of("error", "Invalid pastry id: " + it.getPastryId()));
                    }
                    amount += Math.round(p.getPrice() * it.getQty());
                }
            }
            String clientIp = null;
            String orderInfo = "Thanh toan txn " + txnRef;
            String url;
            try {
                // Attempt to create the VNPay URL first. If credentials are missing
                // this will throw and we should not persist the transaction.
                url = vnPayService.createPaymentUrl(txnRef, amount, clientIp, orderInfo);
            } catch (IllegalStateException ise) {
                log.error("VNPay configuration error: {}", ise.getMessage());
                return ResponseEntity.status(500).body(java.util.Map.of("error", ise.getMessage()));
            }

            VnPayTransaction tx = new VnPayTransaction();
            tx.setId(txnRef);
            tx.setUserId(username);
            tx.setPayload(objectMapper.writeValueAsString(request));
            tx.setAmount((double) amount);
            tx.setStatus("PENDING");
            tx.setCreatedAt(LocalDateTime.now());
            txRepo.save(tx);

            log.info("Created VNPay txn {} url {}", txnRef, url);
            return ResponseEntity.ok().body(java.util.Map.of("paymentUrl", url, "txnRef", txnRef));
        } catch (Exception ex) {
            log.error("Failed to create VNPay transaction", ex);
            return ResponseEntity.status(500).body(ex.getMessage());
        }
    }
}
