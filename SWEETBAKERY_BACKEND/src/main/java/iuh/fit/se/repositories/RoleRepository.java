package iuh.fit.se.repositories;

import iuh.fit.se.entities.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 21/11/2025, Friday
 **/
@Repository
public interface RoleRepository extends JpaRepository<Role, String> {
}
