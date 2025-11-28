package iuh.fit.se.repositories;

import iuh.fit.se.entities.PastryCategory;
import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

@Repository
public interface PastryCategoryRepository extends JpaRepository<PastryCategory, String> {
}
