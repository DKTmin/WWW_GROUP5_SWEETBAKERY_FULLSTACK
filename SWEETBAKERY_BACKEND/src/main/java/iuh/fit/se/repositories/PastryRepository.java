package iuh.fit.se.repositories;

import iuh.fit.se.entities.Pastry;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PastryRepository extends JpaRepository<Pastry, String> {
    List<Pastry> findAllByCategory_Id(String categoryId);
    List<Pastry> findAllByCategory_Id(String categoryId, Pageable pageable);
}
