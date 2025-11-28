package iuh.fit.se.repositories;

import iuh.fit.se.entities.Customer;
import iuh.fit.se.entities.Employee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * @author : user664dntp
 * @mailto : phatdang19052004@gmail.com
 * @created : 28/11/2025, Friday
 **/
@Repository
public interface EmployeeRepository  extends JpaRepository<Employee, String> {
}
