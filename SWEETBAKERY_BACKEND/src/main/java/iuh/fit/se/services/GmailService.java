package iuh.fit.se.services;

import iuh.fit.se.dtos.request.OtpVerificationRequest;
import iuh.fit.se.dtos.response.OtpVerificationResponse;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 29/11/2025, Saturday
 **/
public interface GmailService {
    OtpVerificationResponse sendOtpTOAdmin();
    boolean verifyOtp(OtpVerificationRequest request);
}
