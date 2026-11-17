# Stage 1: Build the Spring Boot application using Maven and Temurin JDK 21
FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app

# Copy Maven POM and source files
COPY pom.xml .
COPY src ./src

# Build the executable jar without running tests
RUN mvn clean package -DskipTests

# Stage 2: Minimal runtime image
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy the built jar from Stage 1
COPY --from=build /app/target/*.jar app.jar

# Expose port 8080 (standard Spring Boot port)
EXPOSE 8080

# Run Spring Boot with memory optimization for free-tier hosting (512MB RAM)
ENTRYPOINT ["java", "-Xmx384m", "-jar", "app.jar"]
