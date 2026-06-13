package com.mishik.backend.config;

import com.mishik.backend.repository.AccountRepository;
import com.mishik.backend.entity.*;
import com.mishik.backend.enums.Role;
import com.mishik.backend.enums.Sex;
import com.mishik.backend.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner init(
            AccountRepository accountRepository,
            UserRepository userRepository,
            ShelterRepository shelterRepository,
            AnimalRepository animalRepository,
            AnimalTypeRepository animalTypeRepository,
            PasswordEncoder passwordEncoder
    ) {

        return args -> {

            if (accountRepository.count() > 0) {
                return;
            }

            // =========================
            // ANIMAL TYPES
            // =========================
            AnimalType dog = animalTypeRepository.save(new AnimalType("Dog"));
            AnimalType cat = animalTypeRepository.save(new AnimalType("Cat"));
            AnimalType rabbit = animalTypeRepository.save(new AnimalType("Rabbit"));
            AnimalType parrot = animalTypeRepository.save(new AnimalType("Parrot"));

            AnimalType[] types = {dog, cat, rabbit, parrot};

            // =========================
            // USERS
            // =========================
            for (int i = 1; i <= 10; i++) {

                Account account = new Account();
                account.setLogin("user" + i);
                account.setPassword(passwordEncoder.encode("1234"));
                account.setRole(Role.ROLE_USER);

                //   System.out.println("Before save: " + account.getRole());

                account = accountRepository.save(account);

                //   System.out.println("After save: " + account.getRole());

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
            Account shelter1Acc = createAccount(accountRepository, passwordEncoder, "shelter1");
            Account shelter2Acc = createAccount(accountRepository, passwordEncoder, "shelter2");
            Account shelter3Acc = createAccount(accountRepository, passwordEncoder, "shelter3");

            Shelter shelter1 = createShelter(shelter1Acc, "Happy Paws", "+380501111111", "Interview required");
            Shelter shelter2 = createShelter(shelter2Acc, "Kind Hearts", "+380502222222", "Passport required");
            Shelter shelter3 = createShelter(shelter3Acc, "Animal Home", "+380503333333", "Family check");

            shelter1 = shelterRepository.save(shelter1);
            shelter2 = shelterRepository.save(shelter2);
            shelter3 = shelterRepository.save(shelter3);

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

                if(i==0)animal.setImageUrl("/images/dog1.png");
                if(i==0)animal.setImageUrl("/images/cat1.png");

                animal.setAnimalType(types[i % types.length]);
                animal.setShelter(shelters[i % shelters.length]);

                animalRepository.save(animal);
            }

            System.out.println("=== TEST DATA CREATED SUCCESSFULLY ===");
        };
    }

    // =========================
    // HELPERS
    // =========================

    private Account createAccount(
            AccountRepository repo,
            PasswordEncoder encoder,
            String login
    ) {
        Account acc = new Account();
        acc.setLogin(login);
        acc.setPassword(encoder.encode("1234"));
        acc.setRole(Role.ROLE_SHELTER);
        return repo.save(acc);
    }

    private Shelter createShelter(
            Account account,
            String name,
            String phone,
            String conditions
    ) {
        Shelter shelter = new Shelter();
        shelter.setAccount(account);
        shelter.setName(name);
        shelter.setPhoneNumber(phone);
        shelter.setAdoptionConditions(conditions);
        return shelter;
    }
}