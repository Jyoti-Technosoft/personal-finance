package com.webapp.bankingportal.dto;

public class UserAccountDTO {

    private String name;
    private String email;
    private String address;
    private String phone_number;
    private String accountNumber;
    private double balance;

    public UserAccountDTO(String name, String email, String address, String phone_number, String accountNumber, double balance) {
        this.name = name;
        this.email = email;
        this.address = address;
        this.phone_number = phone_number;
        this.accountNumber = accountNumber;
        this.balance = balance;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getPhone_number() {
        return phone_number;
    }

    public void setPhone_number(String phone_number) {
        this.phone_number = phone_number;
    }

    public String getAccountNumber() {
        return accountNumber;
    }

    public void setAccountNumber(String accountNumber) {
        this.accountNumber = accountNumber;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

}

