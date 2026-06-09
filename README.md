# BAS World - Product Management System

## Context

BAS World is a Dutch B2B platform that specializes in global vehicle trading and offering a wide range of cross-selling products and services such as tyres, maintenance packages and cleaning services. All cross-selling products are stored in multiple systems - there is no one source of truth, which leads to different problems, such as no clear distinction between which products are stored in which depot and products being offered even when they are out of stock. Additionally, as the company grows internationally, the complexity increases.

This project aims to solve these problems by developing a Product Management System that allows BAS World employees to manage the cross-selling products and their availability in a controlled and intelligent way. Additionally, the system must provide product offers based on multiple conditions, such as product availability, pricing rules and vehicle location

---

## Project Structure

The project is split across three GitLab repositories:

- Backend - bas-world-group-3-be
- Frontend - bas-world-group-3-fe
- Docker compose and deployment scripts- bas-world-group-3-infra

On the virtual machine (VM), the repositories are cloned under:

/projects/group-be/

/projects/group-fe/

/projects/group-infra/

---

## Tech Stack

- Backend - Java 25, Spring Boot, Gradle
- Frontend - React, Vite, Node.js
- Database - PostgreSQL (Supabase)
- Proxy - Nginx
- Container - Docker, Docker Compose
- CI/CD - Gitlab CI (shell executer)
- Code Quality - SonarQube (port 9000 on the VM)
- VM - EduCloud Ubuntu (145.220.72.89)

---

## Prerequisites

This section is for documentation purposes only. The EduCloud VM already has all prerequisites configured.

- Docker and Docker Compose are installed on the VM
- GitLab runner registered on the VM
- Access to the three GitLab repositories
- Supabase project with a PostgreSQL database
- SSH key added to GitLab for the VM's root user

---

## Environment Variables

Path on the VM: /opt/group/.env

This file is used by Docker Compose at runtime and is not committed to Git.

#Backend

Db_Url=jdbc:postgresql://aws-1-eu-central-1-pooler.supabase.com:6543/postgres?sslmode=require&prepareThreshold=0

Db_Username=postgres.yourprojectref

Db_Password=your-db-password

#Frontend

VITE_SUPABASE_URL=https://yourprojectref.supabase.co

VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

VITE_API_BASE_URL=http://145.220.72.89:8080/api

VITE_WS_URL=ws://145.220.72.89:8080/ws

---

## Local Development Setup

### Backend - runs on the http://localhost:8080

**Swagger UI (local):** http://localhost:8080/swagger-ui/index.html
**Swagger UI (deployed):** http://145.220.72.89:8080/swagger-ui/index.html

```bash
cd group-be
./gradlew bootRun
```

### Frontend - runs on the http://localhost:5173

```bash
cd group-fe
npm install
npm run dev
```

---

## Docker Configuration

Each repository contains its own Dockerfile. The docker-compose.yml in group-infra orchestrates all services together on the VM. Each service runs in its own Docker container.  The docker-compose.yml  builds and starts all three containers together on the VM.

### Port mapping

| Service | Internal port | Exposed port | Accessible at |
| --- | --- | --- | --- |
| Backend | 8080 | 8080 | `http://145.220.72.89:8080` |
| Frontend | 80 | 3000 | `http://145.220.72.89:3000` |
| SonarQube | 9000 | 9000 | `http://145.220.72.89:9000` |

---

## CI/CD Pipeline

Each repository has its own pipeline. When a push is made to main on group-be or group-fe, their pipeline runs its stages (build, test, package) and at the end triggers the group-infra pipeline. The infra pipeline is the one that actually deploys - it pulls the latest code from the backend and frontend repos and restarts the containers on the VM.

---

![CI/CD Pipeline](https://projects.fhict.nl/s3-cb/spring-26/fsd1-basworld/group-project-3/bas-world-group-3-infra/-/raw/main/assets/cicd.svg)

---

## Contributors

- Amalia Gorgan
- Preslava Gocheva
- Adelina Prosheva
- Clara Cahyanintyas
- Katerina Slavova

This project was developed by 5 software development students under the guidance of 3 experts from Fontys University of Applied Sciences - Andreea Maican, Martín Roa Villescas and Jacco Snoeren.