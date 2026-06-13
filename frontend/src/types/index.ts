export interface Animal {
    id: number;
    name: string;
    age: number;
    height: number;
    sex: 'MALE' | 'FEMALE' | 'UNKNOWN';
    description?: string;
    animalTypeId: number;
    animalType: string;
    shelterId: number;
    shelterName: string;
    imageUrl: string;
    city: string;
}

export interface DonationDetails {
    donationUrl?: string;
    recipientName?: string;
    iban?: string;
    edrpou?: string;
    paymentPurpose?: string;
}

export interface Organization {
    id: number;
    name: string;
    phoneNumber?: string;
    adoptionConditions?: string;
    login?: string;
    type?: string;
    city?: string;
    region?: string;
    street?: string;
    latitude?: number;
    longitude?: number;
    imageUrl: string;
    hoursOfOperation?: string;
    donationDetails?: DonationDetails | null;
}