# 🌐 InternAI – README (TR + EN)

---

# 🇹🇷 InternAI

**InternAI**, staj arayan öğrenciler ve şirketler için geliştirilmiş bir kariyer platformudur. Kullanıcılar staj ilanlarını görüntüleyebilir, başvuru yapabilir, CV analizi alabilir ve yapay zekâ destekli kariyer tavsiyeleri edinebilir. Proje üç ana bileşenden oluşmaktadır:

1. **InternAI_WEB** – Web kullanıcı arayüzü  
2. **InternAI_MOBILE** – Mobil uygulama  
3. **InternAI_BACKEND** – Spring Boot tabanlı backend API  

---

## 📂 Proje Yapısı



InternAI/
├── InternAI_WEB/ # Web uygulaması (React + Vite)
├── InternAI_MOBILE/ # Mobil uygulama (React Native + Expo)
└── InternAI_BACKEND/ # Backend (Spring Boot)


---

## ✨ Özellikler

### 🔹 Genel Özellikler
- Staj ilanlarını listeleme ve başvuru yapma  
- Şirket ilan yönetimi  
- Kullanıcı profili ve başvuru geçmişi  
- AI destekli CV analizi  
- GitHub profil dili uyumluluk analizi  
- AI Kariyer Asistanı  

### 🔹 Web (InternAI_WEB)
- Modern React arayüzü  
- CV & GitHub analizi  
- AI asistan etkileşimi  
- Şirket yönetim paneli  

### 🔹 Mobil (InternAI_MOBILE)
- React Native + Expo  
- CV yükleme  
- Başvuru geçmişi  
- AI destekli tavsiye sistemi  

### 🔹 Backend (InternAI_BACKEND)
- Spring Boot REST API  
- Kullanıcı / şirket / başvuru yönetimi  
- CV analiz servisi  
- GitHub entegrasyonu  
- AI servis entegrasyonları  

---

## 🛠 Kurulum

### Gereksinimler
- Node.js (16+)  
- Java JDK (17+)  
- Maven  
- PostgreSQL  
- Expo CLI  

---

## 🔧 1. Backend Kurulumu (InternAI_BACKEND)

cd InternAI_BACKEND/InternAI
./mvnw clean install

Veritabanı Ayarları

application.properties:

spring.datasource.url=jdbc:postgresql://localhost:5432/internai
spring.datasource.username=your_username
spring.datasource.password=your_password

Backend'i Başlat
./mvnw spring-boot:run


➡️ http://localhost:8080

## 🌐 2. Web Kurulum (InternAI_WEB)
cd InternAI_WEB/InternAI
npm install
npm run dev


➡️ http://localhost:5173

## 📱 3. Mobil Kurulum (InternAI_MOBILE)
cd InternAI_MOBILE/InternAI
npm install
expo start


QR kod ile cihazda çalıştırabilirsiniz.

### ▶️ Kullanım
Web

Staj ilanlarını görüntüle

CV analizi

AI kariyer tavsiyesi

Mobil

Profil yönetimi

Başvurularım

AI asistanı

### 🤝 Katkıda Bulunma
git checkout -b yeni-ozellik

git commit -m "Yeni özellik"

git push origin yeni-ozellik

### 📬 İletişim

📧 brkkarahan288@gmail.com

# 🇬🇧 InternAI

InternAI is a career platform designed for students seeking internships and companies managing internship listings. Users can explore job posts, apply, analyze their CV using AI tools, and receive guidance from an AI-powered career assistant.

The project consists of:

InternAI_WEB – Web application (React + Vite)

InternAI_MOBILE – Mobile application (React Native + Expo)

InternAI_BACKEND – Backend API (Spring Boot)

## 📂 Project Structure
InternAI/
├── InternAI_WEB/
├── InternAI_MOBILE/
└── InternAI_BACKEND/

✨ Features
🔹 General Features

Internship listing & application

Company dashboard

User profile & history

AI-powered CV analysis

GitHub language compatibility analysis

AI career assistant

## 🔹 Web

Modern React UI

CV & GitHub analysis

AI assistant

Company management

## 🔹 Mobile

React Native + Expo

CV upload

Application tracker

AI assistant

## 🔹 Backend

Spring Boot REST API

User / company / application management

CV analysis

GitHub integration

AI service integration

🛠 Installation
Requirements

Node.js 16+

Java JDK 17+

Maven

PostgreSQL

Expo CLI

## 🔧 1. Backend Setup
cd InternAI_BACKEND/InternAI

./mvnw clean install

Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/internai
spring.datasource.username=your_username
spring.datasource.password=your_password

Start Backend
./mvnw spring-boot:run

➡️ http://localhost:8080

## 🌐 2. Web Setup
cd InternAI_WEB/InternAI

npm install

npm run dev

➡️ http://localhost:5173

## 📱 3. Mobile Setup
cd InternAI_MOBILE/InternAI

npm install

expo start

Scan QR to run on device.

▶️ Usage
Web

Browse internships

AI CV analysis

Career assistant

Mobile

Manage profile

Application history

AI assistant

### 🤝 Contributing

git checkout -b new-feature

git commit -m "New feature added"

git push origin new-feature

### 📬 Contact

📧 brkkarahan288@gmail.com
