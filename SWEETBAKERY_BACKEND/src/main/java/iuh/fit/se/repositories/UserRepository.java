package iuh.fit.se.repositories;

import iuh.fit.se.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 20/11/2025, Thursday
 **/
@Repository
public interface UserRepository extends JpaRepository<User, String> {
    User findUserByEmail(String email);
}
