package com.webapp.bankingportal.controller;

//import com.webapp.bankingportal.dto.AdminResponse;
import com.webapp.bankingportal.dto.UserAccountDTO;
import com.webapp.bankingportal.entity.Admin;
import com.webapp.bankingportal.repository.AccountRepository;
import com.webapp.bankingportal.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;


@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @Autowired
    private AdminService adminService;

    private AccountRepository accountRepository;

//    @PostMapping("/registerAdmin")
//    public ResponseEntity<AdminResponse> registerAdmin(@RequestBody Admin admin){
//        Admin registeredAdmin =
//    }

    @GetMapping("/getUsers")
    public ResponseEntity<List<UserAccountDTO>> getAllUserAccountDetail(){
        List<UserAccountDTO> UsersAccounts = adminService.getAllUserAccountDetail();
        return ResponseEntity.ok(UsersAccounts);
    }

    @DeleteMapping("/removeUser/{accountNumber}")
    public ResponseEntity<String> removeUser(@PathVariable String accountNumber) {
        adminService.removeUserByAccountNumber(accountNumber);
        return ResponseEntity.ok("User removed successfully");
    }
}
