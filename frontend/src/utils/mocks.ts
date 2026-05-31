import type { Animal, Organization } from '../types';

export const MOCK_ANIMALS: Animal[] = [
    { id: 1, name: 'Барсик', species: 'Кіт', breed: 'Мейн-кун', age: '2 роки', gender: 'Хлопчик', size: 'Великий', vaccinated: true, shelterName: 'Лапки', description: 'Дружелюбний і грайливий' },
    { id: 2, name: 'Рекс',   species: 'Пес', breed: 'Лабрадор', age: '4 роки', gender: 'Хлопчик', size: 'Великий', vaccinated: true, shelterName: 'Ноїв Ківчег' },
    { id: 3, name: 'Сніжинка', species: 'Кіт', breed: 'Перська', age: '1 рік', gender: 'Дівчинка', size: 'Маленький', vaccinated: false, shelterName: 'Лапки' },
    { id: 4, name: 'Бублик', species: 'Пес', breed: 'Метис', age: '3 роки', gender: 'Хлопчик', size: 'Середній', vaccinated: true, shelterName: 'Добрі руки' },
    { id: 5, name: 'Мурка',  species: 'Кіт', breed: 'Британська', age: '5 років', gender: 'Дівчинка', size: 'Середній', vaccinated: true, shelterName: 'Ноїв Ківчег' },
];

export const MOCK_ORGS: Organization[] = [
    { id: 1, name: 'Притулок Лапки',              type: 'Притулок', city: 'Київ',   phone: '+380 44 123 4567', schedule: 'Пн–Пт 9:00–18:00', rating: 4.8 },
    { id: 2, name: 'Ноїв Ківчег',                 type: 'Притулок', city: 'Львів',  phone: '+380 32 987 6543', schedule: 'Щодня 10:00–17:00', rating: 4.6 },
    { id: 3, name: 'Вет клініка Доктор Айболить', type: 'Клініка',  city: 'Київ',   phone: '+380 44 555 1234', schedule: 'Цілодобово',         rating: 4.9 },
    { id: 4, name: 'Добрі руки',                  type: 'Фонд',     city: 'Харків', phone: '+380 57 333 2222', schedule: 'Пн–Сб 10:00–19:00', rating: 4.7 },
];
