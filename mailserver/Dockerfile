FROM gradle:jdk17

WORKDIR /app
ADD build.gradle .
RUN #gradle build -x test --parallel --continue > /dev/null 2>&1 || true

COPY . .
RUN gradle build -x test

WORKDIR /app/build/libs

ENTRYPOINT ["java", "-jar", "mail.jar", "--spring.profiles.active=docker"]