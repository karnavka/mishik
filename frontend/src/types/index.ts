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
    imageUrl2?: string;
    imageUrl3?: string;
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

export const TYPE_ALIASES: Record<string, string> = {
    'cat': '2', 'кіт': '2', 'котик': '2', 'кітик': '2',
    'dog': '1', 'пес': '1', 'собака': '1',
    'parrot': '4', 'папуга': '4', 'папужка': '4',
    'rabbit': '3', 'кріль': '3', 'кроль': '3', 'кролик': '3',
};