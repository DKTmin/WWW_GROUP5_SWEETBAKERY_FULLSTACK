package iuh.fit.se.controllers;

import iuh.fit.se.services.VnPayService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payments/vnpay")
@RequiredArgsConstructor
@Slf4j
public class PaymentDebugController {
    private final VnPayService vnPayService;
    @org.springframework.beans.factory.annotation.Value("${vnpay.hashSecret:}")
    private String hashSecret;

    @GetMapping("/debug")
    public ResponseEntity<?> debugUrl(@RequestParam(required = false) String orderId,
            @RequestParam(required = false, defaultValue = "10000") long amount,
            @RequestParam(required = false) String ip,
            @RequestParam(required = false) String info) {
        try {
            String id = (orderId == null || orderId.isEmpty()) ? java.util.UUID.randomUUID().toString() : orderId;
            String url = vnPayService.createPaymentUrl(id, amount, ip, info != null ? info : ("Test order " + id));
            log.info("VNPay debug URL created: {}", url);
            return ResponseEntity.ok().body(url);
        } catch (Exception ex) {
            log.error("VNPay debug failed", ex);
            return ResponseEntity.status(500).body(ex.getMessage());
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyHash(@RequestBody java.util.Map<String, String> params) {
        try {
            // copy and remove secure hash keys
            java.util.Map<String, String> copy = new java.util.TreeMap<>();
            for (java.util.Map.Entry<String, String> e : params.entrySet()) {
                String k = e.getKey();
                if ("vnp_SecureHash".equals(k) || "vnp_SecureHashType".equals(k))
                    continue;
                if (e.getValue() != null && !e.getValue().isEmpty())
                    copy.put(k, e.getValue());
            }
            // build hash data string
            StringBuilder hashData = new StringBuilder();
            boolean first = true;
            for (java.util.Map.Entry<String, String> e : copy.entrySet()) {
                if (!first)
                    hashData.append('&');
                hashData.append(e.getKey()).append('=').append(e.getValue());
                first = false;
            }

            String computed = hmacSHA512(hashSecret, hashData.toString());
            java.util.Map<String, String> out = new java.util.HashMap<>();
            out.put("hashData", hashData.toString());
            out.put("computedSecureHash", computed);
            out.put("providedSecureHash", params.getOrDefault("vnp_SecureHash", ""));
            out.put("match", String.valueOf(computed.equalsIgnoreCase(params.getOrDefault("vnp_SecureHash", ""))));
            return ResponseEntity.ok(out);
        } catch (Exception ex) {
            log.error("vnPay verify error", ex);
            return ResponseEntity.status(500).body(ex.getMessage());
        }
    }

    private static String hmacSHA512(String key, String data) throws Exception {
        if (key == null || key.isEmpty())
            return "";
        javax.crypto.Mac hmac = javax.crypto.Mac.getInstance("HmacSHA512");
        javax.crypto.spec.SecretKeySpec secretKey = new javax.crypto.spec.SecretKeySpec(
                key.getBytes(java.nio.charset.StandardCharsets.UTF_8), "HmacSHA512");
        hmac.init(secretKey);
        byte[] bytes = hmac.doFinal(data.getBytes(java.nio.charset.StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder(2 * bytes.length);
        for (byte b : bytes) {
            sb.append(String.format("%02x", b & 0xff));
        }
        return sb.toString();
    }
}
