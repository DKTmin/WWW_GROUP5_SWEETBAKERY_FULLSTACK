package iuh.fit.se.repositories;

import iuh.fit.se.entities.VnPayTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VnPayTransactionRepository extends JpaRepository<VnPayTransaction, String> {
}
