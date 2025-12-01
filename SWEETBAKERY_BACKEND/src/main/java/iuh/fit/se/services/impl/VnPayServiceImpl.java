package iuh.fit.se.services.impl;

import iuh.fit.se.services.VnPayService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class VnPayServiceImpl implements VnPayService {
    @Value("${vnpay.url:https://sandbox.vnpayment.vn/paymentv2/vpcpay.html}")
    private String vnpayUrl;

    @Value("${vnpay.tmnCode:}")
    private String tmnCode;

    @Value("${vnpay.hashSecret:}")
    private String hashSecret;

    @Value("${vnpay.returnUrl:http://localhost:8082/payments/vnpay/return}")
    private String returnUrl;

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");

    @Override
    public String createPaymentUrl(String orderId, long amount, String clientIp, String orderInfo) {
        try {
            Map<String, String> params = new HashMap<>();
            params.put("vnp_Version", "2.1.0");
            params.put("vnp_Command", "pay");
            params.put("vnp_TmnCode", tmnCode);
            // VNPay expects amount in smallest currency unit (multiply by 100)
            params.put("vnp_Amount", String.valueOf(amount * 100));
            params.put("vnp_CurrCode", "VND");
            params.put("vnp_OrderType", "other");
            params.put("vnp_TxnRef", orderId);
            params.put("vnp_OrderInfo", orderInfo != null ? orderInfo : ("Payment for order " + orderId));
            params.put("vnp_Locale", "vn");
            params.put("vnp_ReturnUrl", returnUrl);
            LocalDateTime now = LocalDateTime.now();
            params.put("vnp_CreateDate", now.format(DATE_FORMAT));
            params.put("vnp_ExpireDate", now.plusMinutes(15).format(DATE_FORMAT));
            params.put("vnp_IpAddr", clientIp != null && !clientIp.isBlank() ? clientIp : "127.0.0.1");

            // validate credentials
            if (tmnCode == null || tmnCode.isEmpty()) {
                throw new IllegalStateException("VNPay tmnCode not configured (vnpay.tmnCode)");
            }
            if (hashSecret == null || hashSecret.isEmpty()) {
                throw new IllegalStateException("VNPay hashSecret not configured (vnpay.hashSecret)");
            }

            // sort params
            List<String> fieldNames = new ArrayList<>(params.keySet());
            Collections.sort(fieldNames);

            StringBuilder hashData = new StringBuilder();
            StringBuilder query = new StringBuilder();
            for (String fieldName : fieldNames) {
                String fieldValue = params.get(fieldName);
                if (fieldValue != null && fieldValue.length() > 0) {
                    String encodedValue = URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString());
                    if (hashData.length() > 0) {
                        hashData.append('&');
                        query.append('&');
                    }
                    // hashData: key = plain, value = encoded (giống demo ajaxServlet)
                    hashData.append(fieldName).append('=').append(encodedValue);
                    // query: cả key và value đều encoded
                    query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()))
                            .append('=')
                            .append(encodedValue);
                }
            }

            String secureHash = hmacSHA512(hashSecret, hashData.toString());

            // Log hash data and computed secure hash (do NOT log secret)
            // Use INFO here temporarily so it's visible in typical dev logs.
            org.slf4j.LoggerFactory.getLogger(VnPayServiceImpl.class).info("VNPay hashData={}", hashData.toString());
            org.slf4j.LoggerFactory.getLogger(VnPayServiceImpl.class).info("VNPay secureHash={}", secureHash);

            // append secure hash type and secure hash (both URL-encoded)
            query.append("&vnp_SecureHashType=").append(URLEncoder.encode("SHA512", StandardCharsets.UTF_8.toString()));
            query.append("&vnp_SecureHash=").append(URLEncoder.encode(secureHash, StandardCharsets.UTF_8.toString()));

            String fullUrl = vnpayUrl + "?" + query.toString();
            org.slf4j.LoggerFactory.getLogger(VnPayServiceImpl.class).info("VNPay fullUrl={}", fullUrl);
            return fullUrl;
        } catch (Exception ex) {
            throw new RuntimeException("Failed to create VNPay URL", ex);
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
