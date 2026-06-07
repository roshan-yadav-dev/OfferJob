FROM maven:3.9.6-eclipse-temurin-17 AS builder

WORKDIR /workspace

COPY pom.xml ./
COPY src ./src

RUN mvn -DskipTests package && cp target/*SNAPSHOT.jar app.jar

FROM eclipse-temurin:17-jre

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

COPY --from=builder /workspace/app.jar app.jar

EXPOSE 8082

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8082/health || exit 1

ENTRYPOINT ["java", "-jar", "app.jar"]
