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
import jakarta.servlet.http.HttpServletRequest;
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
    public ResponseEntity<?> createTransaction(@RequestBody OrderRequest request, HttpServletRequest servletRequest) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth == null)
                return ResponseEntity.status(401).body("Unauthorized");
            String username = auth.getName();
            // assume AccountCredentialRepository can find account by credential; we'll
            // store username as userId for now

            String txnRef = generateTxnRef();
            // compute amount server-side from item ids to avoid client tampering
            long amount = 0L;
            if (request.getItems() != null) {
                for (var it : request.getItems()) {
                    if (it == null)
                        continue;
                    String pastryId = it.getPastryId();
                    Integer qty = it.getQty();
                    if (pastryId == null || qty == null)
                        continue;
                    Pastry p = pastryRepository.findById(pastryId).orElse(null);
                    if (p == null) {
                        return ResponseEntity.status(400)
                                .body(java.util.Map.of("error", "Invalid pastry id: " + pastryId));
                    }
                    amount += Math.round(p.getPrice() * qty);
                }
            }
            if (amount <= 0) {
                return ResponseEntity.status(400)
                        .body(java.util.Map.of("error", "Invalid order amount"));
            }

            String clientIp = extractClientIp(servletRequest);
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

    private String generateTxnRef() {
        // VNPay chỉ chấp nhận ký tự chữ/số, độ dài 8-20; dùng thời gian để tránh trùng
        String timestamp = java.time.LocalDateTime.now()
                .format(java.time.format.DateTimeFormatter.ofPattern("yyMMddHHmmss"));
        String suffix = String.valueOf(Math.abs(UUID.randomUUID().getMostSignificantBits()));
        String raw = (timestamp + suffix);
        if (raw.length() > 18) {
            raw = raw.substring(0, 18);
        }
        return raw;
    }

    private String extractClientIp(HttpServletRequest request) {
        if (request == null) {
            return "127.0.0.1";
        }
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
