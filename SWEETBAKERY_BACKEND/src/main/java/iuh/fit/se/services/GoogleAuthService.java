package iuh.fit.se.services;

import java.util.Map;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 10/12/2025, Wednesday
 **/
public interface GoogleAuthService {
    Map<String, Object> authenticateGoogle(String code);
    Map<String, Object> getUserInfo(String googleAccessToken);
}
