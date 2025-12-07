package iuh.fit.se.repositories;

import iuh.fit.se.entities.PastryCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PastryCategoryRepository extends JpaRepository<PastryCategory, String> {

    // Chỉ lấy Category đang hoạt động (cho khách)
    List<PastryCategory> findAllByIsActiveTrue();

    // Lấy tất cả category và sort theo tên
    @Query("SELECT c FROM PastryCategory c ORDER BY c.name ASC")
    List<PastryCategory> findAllSorted();
    List<PastryCategory> findByIsActiveTrue();

}
