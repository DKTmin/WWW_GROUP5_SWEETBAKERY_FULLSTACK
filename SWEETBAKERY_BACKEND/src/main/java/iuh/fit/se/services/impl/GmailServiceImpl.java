package iuh.fit.se.services.impl;

import iuh.fit.se.dtos.request.OtpVerificationRequest;
import iuh.fit.se.dtos.response.OtpVerificationResponse;
import iuh.fit.se.services.GmailService;
import iuh.fit.se.services.RedisService;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Random;
import java.util.concurrent.TimeUnit;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 29/11/2025, Saturday
 **/
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GmailServiceImpl implements GmailService {
    @NonFinal
    @Value("${admin.gmail}")
    String ADMIN_GMAIL;

    JavaMailSender javaMailSender;
    RedisService redisService;

    @NonFinal
    @Value("${spring.valid-time}")
    long OTP_VALID_TIME;

    @NonFinal
    @Value("${reris.value.otp-value}")
    String OTP_VALUE;

    TemplateEngine templateEngine;
    @Override
    public OtpVerificationResponse sendOtpTOAdmin() {
        SecureRandom random = new SecureRandom();
        String otp = String.format("%06d", random.nextInt(1_000_000));

        redisService.setOtpAdmin(otp, OTP_VALID_TIME, TimeUnit.MINUTES);

        Context context = new Context();
        context.setVariable("otp", otp);
        context.setVariable("expiry", OTP_VALID_TIME);

        String htmlContent = templateEngine.process("email/admin-otp.html", context);

        MimeMessage mime = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = null;
        try {
            helper = new MimeMessageHelper(mime, true);
            helper.setFrom(ADMIN_GMAIL);
            helper.setTo(ADMIN_GMAIL);
            helper.setSubject("OTP Verification");
            helper.setText(htmlContent, true);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
        javaMailSender.send(mime);

        return OtpVerificationResponse.builder()
                .otp(otp)
                .valid(true)
                .build();
    }

    @Override
    public boolean verifyOtp(OtpVerificationRequest request) {
        String savedOtp = redisService.getByKey(request.getOtp());

        if (savedOtp == null) return false;
        return savedOtp.equals(OTP_VALUE);
    }
}
