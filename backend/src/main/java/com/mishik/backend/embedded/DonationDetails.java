package com.mishik.backend.embedded;

import jakarta.persistence.Embeddable;

@Embeddable
public class DonationDetails {
    private String donationUrl;

    public String getDonationUrl() {
        return donationUrl;
    }

    public void setDonationUrl(String donationUrl) {
        this.donationUrl = donationUrl;
    }
}
