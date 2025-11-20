package iuh.fit.se.repositories;

import iuh.fit.se.entities.Pastry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PastryRepository extends JpaRepository<Pastry, String> {

}
