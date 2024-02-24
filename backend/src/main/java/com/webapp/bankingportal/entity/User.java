package com.webapp.bankingportal.entity;

import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
public class User {
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    public Long getId() {
        return id;
    }

    @Setter
    @Getter
    private String name;

    @Setter
    @Getter
    private String password;

    @Setter
    @Getter
    @Column(unique = true)
    private String email;

    @Setter
    @Getter
    private String address;

    @Setter
    @Getter
    @Column(unique = true)
    private String phone_number;

    // Establishing a one-to-one relationship with the account
    @Getter
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Account account;

    // Convenience method to set the user's account
    public void setAccount(Account account) {
        this.account = account;
        account.setUser(this);
    }

}
