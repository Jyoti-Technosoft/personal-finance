package com.webapp.bankingportal.service;

import com.webapp.bankingportal.entity.User;

public interface UserService {
    public User registerUser(User user);

    User getUserByAccountNumber(String account_no);

    User updateUser(User user);
}
