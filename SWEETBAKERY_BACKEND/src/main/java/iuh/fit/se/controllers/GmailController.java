package iuh.fit.se.controllers;

import iuh.fit.se.dtos.request.ForgetPasswordRequest;
import iuh.fit.se.dtos.request.OtpForgetPasswordVerificationRequest;
import iuh.fit.se.dtos.request.OtpVerificationRequest;
import iuh.fit.se.dtos.response.ApiResponse;
import iuh.fit.se.dtos.response.ForgetPasswordOTPResponse;
import iuh.fit.se.dtos.response.OtpVerificationResponse;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.services.GmailService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 29/11/2025, Saturday
 **/
@RestController
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
@RequestMapping("gmail-management/api/v1/gmail")
public class GmailController {
    GmailService gmailService;

    @GetMapping("/send-otp")
    ApiResponse<OtpVerificationResponse> sendOtp(){
        OtpVerificationResponse otpVerificationResponse = gmailService.sendOtpTOAdmin();
        return ApiResponse.<OtpVerificationResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(otpVerificationResponse)
                .build();
    }

    @PostMapping("/verify-otp")
    ApiResponse<OtpVerificationResponse> verifyOtp(@RequestBody OtpVerificationRequest request){
        return ApiResponse.<OtpVerificationResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(OtpVerificationResponse.builder().valid(gmailService.verifyOtp(request)).build())
                .build();
    }

    @PostMapping("/otp-forget-password")
    ApiResponse<ForgetPasswordOTPResponse> sendOtp(@RequestBody ForgetPasswordRequest request){
        ForgetPasswordOTPResponse forgetPasswordOTPResponse = gmailService.sendOtpToCustomer(request);
        return ApiResponse.<ForgetPasswordOTPResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(forgetPasswordOTPResponse)
                .build();
    }

    @PostMapping("/verify-otp-forget-password")
    ApiResponse<OtpVerificationResponse> verifyOtp(@RequestBody OtpForgetPasswordVerificationRequest request){
        OtpVerificationResponse otpVerificationResponse = gmailService.verifyOtpForgetPassword(request);
        return ApiResponse.<OtpVerificationResponse>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(otpVerificationResponse)
                .build();
    }
}
