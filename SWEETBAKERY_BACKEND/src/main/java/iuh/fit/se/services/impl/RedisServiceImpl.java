package iuh.fit.se.services.impl;

import iuh.fit.se.services.RedisService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
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
    @Override
    public void setToken(String token, long duration, TimeUnit timeUnit) {
        redisTemplate.opsForValue().set(token, "logout", duration, timeUnit);
    }

    @Override
    public boolean isTokenInvalidated(String token) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(token));
    }
}
