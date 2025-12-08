package iuh.fit.se.repositories;

import iuh.fit.se.entities.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BankAccountRepository extends JpaRepository<BankAccount, String> {
    List<BankAccount> findByUser_Id(String userId);
    BankAccount findFirstByUser_IdAndIsDefaultTrue(String userId);
}

