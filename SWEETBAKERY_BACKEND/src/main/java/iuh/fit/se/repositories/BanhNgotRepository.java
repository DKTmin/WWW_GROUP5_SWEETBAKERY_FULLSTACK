package iuh.fit.se.repositories;

import iuh.fit.se.entities.BanhNgot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BanhNgotRepository extends JpaRepository<BanhNgot, String> {

}
