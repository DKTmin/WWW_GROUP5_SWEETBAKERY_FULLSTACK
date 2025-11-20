package iuh.fit.se.repositories;

import iuh.fit.se.entities.AccountCredential;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 20/11/2025, Thursday
 **/

@Repository
public interface AccountRepository extends JpaRepository<AccountCredential, String> {
}
