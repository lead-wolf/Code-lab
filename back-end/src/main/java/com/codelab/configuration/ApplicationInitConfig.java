package com.codelab.configuration;

import com.codelab.constant.PredefinedLanguage;
import com.codelab.constant.PredefinedLevel;
import com.codelab.constant.PredefinedRole;
import com.codelab.entity.Language;
import com.codelab.entity.Level;
import com.codelab.entity.Role;
import com.codelab.entity.User;
import com.codelab.respository.LanguageRepository;
import com.codelab.respository.LevelRopository;
import com.codelab.respository.RoleRepository;
import com.codelab.respository.UserRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import java.util.HashSet;

@Configuration
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ApplicationInitConfig {
    PasswordEncoder passwordEncoder;

    @NonFinal
    static final String ADMIN_EMAIL = "admin";

    @NonFinal
    static final String ADMIN_PASSWORD = "admin123";

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository, RoleRepository roleRepository,
            LanguageRepository languageRepository, LevelRopository levelRopository){
        log.info("Initializing application.....");
        return args -> {
            createRoleIfNotExists(roleRepository, PredefinedRole.USER_ROLE);
            createRoleIfNotExists(roleRepository, PredefinedRole.TEACHER_ROLE);
            createRoleIfNotExists(roleRepository, PredefinedRole.ADMIN_ROLE);

            for (String[] language : PredefinedLanguage.defaultLanguage)
                createLanguageIfNotExists(languageRepository, language);

            for (String[] level : PredefinedLevel.defaultLevel)
                createLevelIfNotExists(levelRopository, level);

            if (userRepository.findByEmail(ADMIN_EMAIL).isEmpty()) {
                var roles = new HashSet<Role>();
                roles.add(roleRepository.findById(PredefinedRole.ADMIN_ROLE)
                        .orElseThrow(() -> new RuntimeException("Admin role not found")));

                User user = User.builder()
                        .email(ADMIN_EMAIL)
                        .password(passwordEncoder.encode(ADMIN_PASSWORD))
                        .roles(roles)
                        .isActive(true)
                        .build();

                userRepository.save(user);
                log.warn("Admin user has been created with default password: admin, please change it");
            }
            log.info("Application initialization completed.");
        };
    }

    private void createRoleIfNotExists(RoleRepository roleRepository, String roleName) {
        if (roleRepository.findById(roleName).isEmpty()) {
            roleRepository.save(Role.builder()
                    .name(roleName)
                    .description(roleName + "ROLE")
                    .build());
        }
    }

    private void createLanguageIfNotExists(LanguageRepository languageRepository, String[] language){
        if (languageRepository.findByName(language[0]).isEmpty()){
            languageRepository.save(Language.builder()
                    .name(language[0])
                    .value(language[1])
                    .description(language[2])
                    .build());
        }
    }

    private void createLevelIfNotExists(LevelRopository levelRopository, String[] level) {
        if (levelRopository.findByName(level[0]).isEmpty()){
            levelRopository.save(Level.builder()
                            .name(level[0])
                            .description(level[1])
                            .build());
        }
    }
}
