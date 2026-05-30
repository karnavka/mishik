package com.mishik.backend.config;

import com.mishik.backend.entity.*;
import com.mishik.backend.enums.Role;
import com.mishik.backend.enums.Sex;
import com.mishik.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner init(
            AccountRepository accountRepository,
            UserRepository userRepository,
            ShelterRepository shelterRepository,
            AnimalRepository animalRepository,
            AnimalTypeRepository animalTypeRepository) {

        return args -> {

            if (accountRepository.count() > 0) {
                return;
            }

            // =========================
            // ANIMAL TYPES
            // =========================

            AnimalType dog = new AnimalType();
            dog.setUsefulInfo("Dog");

            AnimalType cat = new AnimalType();
            cat.setUsefulInfo("Cat");

            AnimalType rabbit = new AnimalType();
            rabbit.setUsefulInfo("Rabbit");

            AnimalType parrot = new AnimalType();
            parrot.setUsefulInfo("Parrot");

            animalTypeRepository.save(dog);
            animalTypeRepository.save(cat);
            animalTypeRepository.save(rabbit);
            animalTypeRepository.save(parrot);

            AnimalType[] types = {dog, cat, rabbit, parrot};

            // =========================
            // USERS
            // =========================

            for (int i = 1; i <= 10; i++) {

                Account account = new Account();
                account.setLogin("user" + i);
                account.setPassword("1234");
                account.setRole(Role.ROLE_USER);

                accountRepository.save(account);

                User user = new User();
                user.setAccount(account);
                user.setFirstName("User" + i);
                user.setLastName("LastName" + i);
                user.setPatronymic("Patronymic" + i);
                user.setSex(i % 2 == 0 ? Sex.FEMALE : Sex.MALE);

                userRepository.save(user);
            }

            // =========================
            // SHELTERS
            // =========================

            Account shelterAcc1 = createShelterAccount(accountRepository, "shelter1");
            Account shelterAcc2 = createShelterAccount(accountRepository, "shelter2");
            Account shelterAcc3 = createShelterAccount(accountRepository, "shelter3");

            Shelter shelter1 = createShelter(shelterAcc1, "Happy Paws", "+380501111111", "Interview required");
            Shelter shelter2 = createShelter(shelterAcc2, "Kind Hearts", "+380502222222", "Passport required");
            Shelter shelter3 = createShelter(shelterAcc3, "Animal Home", "+380503333333", "Family check");

            shelterRepository.save(shelter1);
            shelterRepository.save(shelter2);
            shelterRepository.save(shelter3);

            Shelter[] shelters = {shelter1, shelter2, shelter3};

            // =========================
            // ANIMALS
            // =========================

            String[] names = {
                    "Rex", "Max", "Bella", "Lucy", "Charlie",
                    "Luna", "Rocky", "Milo", "Oscar", "Simba",
                    "Murka", "Barsik", "Snow", "Lucky", "Tom",
                    "Jerry", "Kiwi", "Kesha", "Bunny", "Fluffy"
            };

            for (int i = 0; i < names.length; i++) {

                Animal animal = new Animal();

                animal.setName(names[i]);
                animal.setAge((byte) (1 + i % 12));
                animal.setHeight(20 + i * 2);
                animal.setDescription("Friendly animal looking for a home");

                animal.setSex(
                        i % 3 == 0 ? Sex.MALE :
                        i % 3 == 1 ? Sex.FEMALE :
                                Sex.UNKNOWN
                );

                animal.setAnimalType(types[i % types.length]);
                animal.setShelter(shelters[i % shelters.length]);

                animalRepository.save(animal);
            }

            System.out.println("=== TEST DATA CREATED ===");
        };
    }

    // =========================
    // HELPERS
    // =========================

    private Account createShelterAccount(AccountRepository repo, String login) {
        Account acc = new Account();
        acc.setLogin(login);
        acc.setPassword("1234");
        acc.setRole(Role.ROLE_SHELTER);
        return repo.save(acc);
    }

    private Shelter createShelter(Account account, String name, String phone, String conditions) {
        Shelter shelter = new Shelter();
        shelter.setAccount(account);
        shelter.setName(name);
        shelter.setPhoneNumber(phone);
        shelter.setAdoptionConditions(conditions);
        return shelter;
    }
}