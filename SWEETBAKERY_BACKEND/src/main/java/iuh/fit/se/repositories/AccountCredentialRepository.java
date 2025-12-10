package iuh.fit.se.repositories;

import iuh.fit.se.entities.AccountCredential;
import iuh.fit.se.entities.enums.AccountType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Set;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 20/11/2025, Thursday
 **/

@Repository
public interface AccountCredentialRepository extends JpaRepository<AccountCredential, String> {
    AccountCredential findByCredential(String identifier);

    @Query("select a from AccountCredential a where a.user.id = :userId")
    Set<AccountCredential> findAllByUserId(@Param("userId") String userId);

    @Query("select a from AccountCredential a where a.user.id = :userId and a.type = :accountType")
    AccountCredential findByUserIdAndAccountType(
            @Param("userId") String userId,
            @Param("accountType") AccountType accountType);
}
