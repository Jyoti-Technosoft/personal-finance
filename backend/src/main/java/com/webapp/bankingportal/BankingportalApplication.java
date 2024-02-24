package com.webapp.bankingportal;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableCaching
@EnableAsync
public class BankingportalApplication {

	public static void main(String[] args) {
		SpringApplication.run(BankingportalApplication.class, args);
	}

}

/*

--> document videos:-

* video--1
https://recordit.co/mcnsjCUhRP

* video--2
https://recordit.co/W7Hwi6FoxW

* video--3
https://recordit.co/qBvS3rLH1h

* video--4
https://recordit.co/jeIIJvtGin

*/
