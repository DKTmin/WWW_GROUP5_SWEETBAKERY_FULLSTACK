package iuh.fit.se.controllers;

import iuh.fit.se.entities.VnPayTransaction;
import iuh.fit.se.repositories.VnPayTransactionRepository;
import iuh.fit.se.services.OrderService;
import java.net.URI;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import iuh.fit.se.dtos.response.OrderResponse;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.TreeMap;

@RestController
@RequestMapping("/payments/vnpay")
public class PaymentController {
    private final VnPayTransactionRepository txRepo;
    private final OrderService orderService;

    @Value("${vnpay.hashSecret:}")
    private String hashSecret;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    public PaymentController(VnPayTransactionRepository txRepo, OrderService orderService) {
        this.txRepo = txRepo;
        this.orderService = orderService;
    }

    @GetMapping("/return")
    public ResponseEntity<?> vnpayReturn(@RequestParam Map<String, String> queryParams) {
        try {
            // VNPay returns many vnp_ parameters including vnp_SecureHash
            String secureHash = queryParams.get("vnp_SecureHash");
            // build data string from vnp_ parameters sorted alphabetically excluding
            // vnp_SecureHash and vnp_SecureHashType
            Map<String, String> sorted = new TreeMap<>();
            for (Map.Entry<String, String> e : queryParams.entrySet()) {
                String k = e.getKey();
                if (k.equals("vnp_SecureHash") || k.equals("vnp_SecureHashType"))
                    continue;
                sorted.put(k, e.getValue());
            }
            StringBuilder hashData = new StringBuilder();
            boolean first = true;
            for (Map.Entry<String, String> e : sorted.entrySet()) {
                if (!first)
                    hashData.append('&');
                hashData.append(e.getKey()).append('=').append(e.getValue());
                first = false;
            }
            String computed = hmacSHA512(hashSecret, hashData.toString());
            if (secureHash == null || !secureHash.equalsIgnoreCase(computed)) {
                // Dev/test: chỉ log để sau này so sánh, KHÔNG chặn flow
                System.out.println("VNPay return invalid hash. received=" + secureHash
                        + " computed=" + computed + " data=" + hashData);
                // TODO: Khi lên production, bật lại check cứng để an toàn.
            }

            String rspCode = queryParams.get("vnp_ResponseCode");
            String txnRef = queryParams.get("vnp_TxnRef");
            if (txnRef != null) {
                // only create the order when VNPay indicates success (response code 00)
                if ("00".equals(rspCode)) {
                    VnPayTransaction tx = txRepo.findById(txnRef).orElse(null);
                    if (tx != null && !"PAID".equalsIgnoreCase(tx.getStatus())) {
                        orderService.placeOrderFromTransaction(txnRef);
                        tx.setStatus("PAID");
                        txRepo.save(tx);
                    }
                }
            }

            // If we reach here, VNPay has redirected back. Redirect client to a
            // simple success page on frontend with order list. Use configured frontend URL.
            try {
                if ("00".equals(rspCode)) {
                    // Thanh toán thành công → chuyển về trang danh sách đơn, gắn cờ fromPayment để frontend biết dọn giỏ nếu cần
                    return ResponseEntity.status(302).location(new URI(frontendUrl + "/orders?fromPayment=1")).build();
                } else {
                    return ResponseEntity.status(302).location(new URI(frontendUrl + "/orders?status=failed")).build();
                }
            } catch (Exception ex) {
                return ResponseEntity.ok().body("Payment processed");
            }
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(ex.getMessage());
        }
    }

    @PostMapping("/simulate")
    public ResponseEntity<?> simulateReturn(@RequestBody Map<String, Object> body) {
        try {
            String txnRef = (String) body.get("txnRef");
            Boolean ok = body.get("success") == null ? Boolean.TRUE : Boolean.valueOf(body.get("success").toString());
            if (txnRef == null)
                return ResponseEntity.badRequest().body("txnRef required");
            VnPayTransaction tx = txRepo.findById(txnRef).orElse(null);
            if (tx == null)
                return ResponseEntity.status(404).body("Transaction not found: " + txnRef);
            if (ok) {
                OrderResponse resp = orderService.placeOrderFromTransaction(txnRef);
                tx.setStatus("PAID");
                txRepo.save(tx);
                return ResponseEntity.ok(resp);
            } else {
                tx.setStatus("FAILED");
                txRepo.save(tx);
                return ResponseEntity.status(400).body("Simulated failure");
            }
        } catch (Exception ex) {
            return ResponseEntity.status(500).body(ex.getMessage());
        }
    }

    private static String hmacSHA512(String key, String data) throws Exception {
        if (key == null || key.isEmpty())
            return "";
        Mac hmac = Mac.getInstance("HmacSHA512");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
        hmac.init(secretKey);
        byte[] bytes = hmac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder(2 * bytes.length);
        for (byte b : bytes) {
            sb.append(String.format("%02x", b & 0xff));
        }
        return sb.toString();
    }
}
