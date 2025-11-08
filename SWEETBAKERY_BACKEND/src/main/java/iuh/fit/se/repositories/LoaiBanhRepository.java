package iuh.fit.se.repositories;

import iuh.fit.se.entities.LoaiBanh;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LoaiBanhRepository extends JpaRepository<LoaiBanh, String> {
}
