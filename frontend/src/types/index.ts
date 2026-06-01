export interface Animal {
    id: number;
    name: string;
    age: number;
    height: number;
    sex: 'MALE' | 'FEMALE';
    description?: string;
    animalTypeId: number;
    animalType: string;
    shelterId: number;
    shelterName: string;
}

export interface Organization {
    id: number;
    name: string;
    type?: string;
    city?: string;
    phone?: string;
    schedule?: string;
    rating?: number;
    description?: string;
    logoUrl?: string;
}


// // Base type returned from Spring Boot: List<Map<String,Object>>
// export type ApiRecord = Record<string, unknown>;
//
// // Normalized Animal — field names match what your backend returns
// export interface Animal {
//     id: string | number;
//     name: string;
//     species?: string;   // кіт, пес, кролик...
//     breed?: string;
//     age?: string;
//     gender?: string;
//     size?: string;
//     status?: string;    // available, adopted...
//     description?: string;
//     imageUrl?: string;
//     shelterName?: string;
//     vaccinated?: boolean;
// }
//
// // Normalized Organization
// export interface Organization {
//     id: string | number;
//     name: string;
//     type?: string;// притулок | клініка ...
//     city?: string;
//     address?: string;
//     phone?: string;
//     email?: string;
//     website?: string;
//     description?: string;
//     logoUrl?: string;
//     rating?: number;
//     schedule?: string;
// }
//
// // filter option used by Sidebar
// export interface FilterOption {
//     value: string;
//     label: string;
// }
//
// export interface FilterGroup {
//     key: string;
//     label: string;
//     options: FilterOption[];
// }