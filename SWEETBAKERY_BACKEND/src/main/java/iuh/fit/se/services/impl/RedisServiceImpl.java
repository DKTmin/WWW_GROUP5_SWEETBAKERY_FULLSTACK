package iuh.fit.se.services.impl;

import iuh.fit.se.services.RedisService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 22/11/2025, Saturday
 **/
@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RedisServiceImpl implements RedisService {
    StringRedisTemplate redisTemplate;
    @NonFinal
    @Value("${reris.value.logout-token}")
    String LOGOUT;
    @NonFinal
    @Value("${reris.value.otp-value}")
    String OTP_VALUE;
    @Override
    public void setToken(String token, long duration, TimeUnit timeUnit) {
        redisTemplate.opsForValue().set(token, LOGOUT, duration, timeUnit);
    }

    @Override
    public boolean isTokenInvalidated(String token) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(token));
    }

    @Override
    public void setOtpAdmin(String otp, long duration, TimeUnit timeUnit) {
        redisTemplate.opsForValue().set(otp, OTP_VALUE, duration, timeUnit);
    }

    @Override
    public void setOtpCustomer(String email, String otp, long duration, TimeUnit timeUnit) {
        redisTemplate.opsForValue().set(email, otp, duration, timeUnit);
    }

    @Override
    public String getByKey(String key) {
        return redisTemplate.opsForValue().get(key);
    }

    @Override
    public void deleteByKey(String key) {
        redisTemplate.delete(key);
    }
}
