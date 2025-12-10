package iuh.fit.se.repositories;

import iuh.fit.se.entities.Pastry;
import iuh.fit.se.entities.enums.PastryStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PastryRepository extends JpaRepository<Pastry, String> {

    // Lấy tất cả theo category (dùng cho Admin hoặc logic nội bộ)
    List<Pastry> findAllByCategory_Id(String categoryId);
    List<Pastry> findAllByCategory_Id(String categoryId, Pageable pageable);

    // Search theo tên hoặc mô tả (Standard JPA - dùng cho Admin nếu cần tìm tất cả trạng thái)
    List<Pastry> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);

    // 1. Chỉ lấy bánh ACTIVE + Category Active (dùng cho khách hàng - Trang chủ/Menu)
    @Query("""
            SELECT p FROM Pastry p
            WHERE p.status = :status
              AND p.category.isActive = true
            """)
    List<Pastry> findAllAvailablePastries(@Param("status") PastryStatus status);

    // 2. Tìm kiếm bánh cho khách hàng (Chỉ tìm trong số bánh đang bán)
    // Tìm theo Tên HOẶC Mô tả
    @Query("""
            SELECT p FROM Pastry p
            WHERE p.status = :status
              AND p.category.isActive = true
              AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) 
                   OR LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')))
            """)
    List<Pastry> searchAvailablePastries(@Param("status") PastryStatus status,
                                         @Param("keyword") String keyword);

    // Soft-delete → tìm các bánh chưa bị DISCONTINUED (dùng cho Admin quản lý)
    List<Pastry> findAllByStatusNot(PastryStatus status);
    boolean existsByCategory_Id(String categoryId);

}