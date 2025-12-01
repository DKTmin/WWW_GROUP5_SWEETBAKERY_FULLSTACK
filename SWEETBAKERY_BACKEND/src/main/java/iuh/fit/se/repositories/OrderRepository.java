package iuh.fit.se.repositories;

import iuh.fit.se.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<Order, String> {
	java.util.List<Order> findByCustomer_Id(String userId);
}
