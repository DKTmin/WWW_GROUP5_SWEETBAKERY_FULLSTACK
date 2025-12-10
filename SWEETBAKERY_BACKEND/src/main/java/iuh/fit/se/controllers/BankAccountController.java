package iuh.fit.se.controllers;

import iuh.fit.se.dtos.response.ApiResponse;
import iuh.fit.se.entities.BankAccount;
import iuh.fit.se.entities.enums.HttpCode;
import iuh.fit.se.repositories.BankAccountRepository;
import iuh.fit.se.repositories.AccountCredentialRepository;
import iuh.fit.se.entities.AccountCredential;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bank-accounts")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class BankAccountController {
    BankAccountRepository bankAccountRepository;
    AccountCredentialRepository accountCredentialRepository;

    static record BankAccountRequest(
            @NotBlank String bankName,
            @NotBlank String accountHolderName,
            @NotBlank String accountNumber,
            Boolean isDefault
    ) {}

    @GetMapping
    ApiResponse<List<BankAccount>> list() {
        AccountCredential account = getCurrentAccount();
        List<BankAccount> list = bankAccountRepository.findByUser_Id(account.getUser().getId());
        return ApiResponse.<List<BankAccount>>builder()
                .code(HttpCode.OK.getCODE())
                .message(HttpCode.OK.getMESSAGE())
                .data(list)
                .build();
    }

    @PostMapping
    ApiResponse<BankAccount> create(@RequestBody BankAccountRequest req) {
        AccountCredential account = getCurrentAccount();
        BankAccount ba = new BankAccount();
        ba.setBankName(req.bankName());
        ba.setAccountHolderName(req.accountHolderName());
        ba.setAccountNumber(req.accountNumber());
        ba.setUser(account.getUser());
        if (Boolean.TRUE.equals(req.isDefault())) {
            // unset previous defaults
            bankAccountRepository.findByUser_Id(account.getUser().getId())
                    .forEach(b -> {
                        if (b.isDefault()) { b.setDefault(false); bankAccountRepository.save(b); }
                    });
            ba.setDefault(true);
        }
        BankAccount saved = bankAccountRepository.save(ba);
        return ApiResponse.<BankAccount>builder()
                .code(HttpCode.CREATED.getCODE())
                .message(HttpCode.CREATED.getMESSAGE())
                .data(saved)
                .build();
    }

    private AccountCredential getCurrentAccount() {
        var auth = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) throw new RuntimeException("Unauthenticated");
        String username = auth.getName();
        AccountCredential account = accountCredentialRepository.findByCredential(username);
        if (account == null || account.getUser() == null)
            throw new RuntimeException("Unauthenticated");
        return account;
    }
}

