package iuh.fit.se.entities.enums;

import lombok.AccessLevel;
import lombok.ToString;
import lombok.experimental.FieldDefaults;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 19/11/2025, Wednesday
 **/
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public enum AccountType {
    USERNAME("Username"),
    EMAIL("Email"),
    GOOGLE("Google");

    String enumType;

    AccountType(String enumType) {
        this.enumType = enumType;
    }
}
