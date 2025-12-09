package iuh.fit.se.services;

import java.util.concurrent.TimeUnit;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 22/11/2025, Saturday
 **/
public interface RedisService {
    void setToken(String token, long duration, TimeUnit timeUnit);
    boolean isTokenInvalidated(String token);
    void setOtpAdmin(String otp, long duration, TimeUnit timeUnit);
    void setOtpCustomer(String email, String otp, long duration, TimeUnit timeUnit);
    String getByKey(String key);

    void deleteByKey(String key);
}
