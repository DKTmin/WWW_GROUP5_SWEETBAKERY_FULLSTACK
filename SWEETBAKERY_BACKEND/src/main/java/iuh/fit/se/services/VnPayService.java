package iuh.fit.se.services;

public interface VnPayService {
    /**
     * Create a VNPay payment URL for the given order id and amount (VND).
     * Amount should be in VND (no decimals); the implementation will convert
     * to VNPay expected unit if necessary.
     */
    String createPaymentUrl(String orderId, long amount, String clientIp, String orderInfo);
}
