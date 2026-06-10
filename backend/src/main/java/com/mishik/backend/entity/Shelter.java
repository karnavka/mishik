package com.mishik.backend.entity;
import com.mishik.backend.embedded.Address;
import com.mishik.backend.embedded.DonationDetails;
import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
@Entity
public class Shelter {
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String phoneNumber;
    @OneToOne(optional = false)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;
    @Embedded
    private Address address;

    private String adoptionConditions;
    @Embedded
    private DonationDetails donationDetails;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public Account getAccount() {
        return account;
    }

    public void setAccount(Account account) {
        this.account = account;
    }

    public Address getAddress() {
        return address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public String getAdoptionConditions() {
        return adoptionConditions;
    }

    public void setAdoptionConditions(String adoptionConditions) {
        this.adoptionConditions = adoptionConditions;
    }

    public DonationDetails getDonationDetails() {
        return donationDetails;
    }

    public void setDonationDetails(DonationDetails donationDetails) {
        this.donationDetails = donationDetails;
    }
}
