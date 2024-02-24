package com.webapp.bankingportal.service;

import com.webapp.bankingportal.dto.TransactionDTO;

import java.util.List;

public interface TransactionService {

    List<TransactionDTO> getAllTransactionsByAccountNumber(String accountNumber);

}
