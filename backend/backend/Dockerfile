# 1. Build-Phase mit Maven
FROM eclipse-temurin:21-jdk-alpine AS build
WORKDIR /app
COPY . .

# Ausführungsrechte für den Maven Wrapper vergeben
RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

# 2. Ausführungs-Phase (nur die fertige JAR-Datei)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]