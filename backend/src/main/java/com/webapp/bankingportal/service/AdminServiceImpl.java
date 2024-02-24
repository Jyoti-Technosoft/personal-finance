package com.webapp.bankingportal.service;

import com.webapp.bankingportal.dto.UserAccountDTO;
import com.webapp.bankingportal.entity.Account;
import com.webapp.bankingportal.entity.Admin;
import com.webapp.bankingportal.entity.User;
import com.webapp.bankingportal.exception.NotFoundException;
import com.webapp.bankingportal.repository.AccountRepository;
import com.webapp.bankingportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;

@Service
public class AdminServiceImpl implements AdminService{

    @Autowired
    private AccountRepository accountRepository;
    @Autowired
    private UserRepository userRepository;


//    @Override
//    public Admin registerAdmin(Admin admin) {
//
//        String encodedPassword = passwordEncoder.encode(user.getPassword());
//        user.setPassword(encodedPassword);
//
//        // Save the user details
//        User savedUser = userRepository.save(user);
//
//        // Create an account for the user
//        Account account = accountService.createAccount(savedUser);
//
//        savedUser.setAccount(account);
//        userRepository.save(savedUser);
//
//        System.out.println(savedUser.getAccount().getAccountNumber());
//        System.out.println(account.getUser().getName());
//
//
//        return savedUser;
//    }

    @Override
    public List<UserAccountDTO> getAllUserAccountDetail() {

        List<Account> accounts =accountRepository.findAll();

        if (accounts.isEmpty()) {
            throw new NotFoundException("No user accounts found!");
        }

        List<UserAccountDTO> userAccountDtos = new ArrayList<>();

        for (Account account : accounts) {
                UserAccountDTO userAccountDTO = new UserAccountDTO(
                        account.getUser().getName(),
                        account.getUser().getEmail(),
                        account.getUser().getAddress(),
                        account.getUser().getPhone_number(),
                        account.getAccountNumber(),
                        account.getBalance()
                );
                userAccountDtos.add(userAccountDTO);
            }
        return userAccountDtos;
    }

    @Override
    public void removeUserByAccountNumber(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber);
        if (account != null) {
            User user = account.getUser();
            accountRepository.delete(account);
            userRepository.delete(user);
        } else {
            throw new NotFoundException("User not found for the provided account number.");
        }
    }
}
