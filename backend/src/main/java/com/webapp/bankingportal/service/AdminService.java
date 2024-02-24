package com.webapp.bankingportal.service;

import com.webapp.bankingportal.dto.UserAccountDTO;
import com.webapp.bankingportal.entity.Admin;
import com.webapp.bankingportal.entity.User;

import java.util.List;

public interface AdminService {

//    public Admin registerAdmin(Admin admin);

    List<UserAccountDTO> getAllUserAccountDetail();

    void removeUserByAccountNumber(String accountNumber);
}
