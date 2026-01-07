# 🚗 Rent-a-Car Yönetim Sistemi

React (Frontend) ve NestJS (Backend) kullanılarak geliştirilen, rol bazlı yetkilendirmeye sahip bir Araç Kiralama Yönetim Sistemi.

---

## 📋 Gereksinimler

- Node.js (v18 veya üzeri)
- npm veya yarn
- Microsoft SQL Server

---

## 🚀 Kurulum

### 1. SQL Server Veritabanı Oluşturma

SQL Server Management Studio'da:

```sql
CREATE DATABASE RentACarDB;
```

### 2. Backend Kurulumu

```bash
cd backend
npm install
```

### 3. Backend Ortam Değişkenleri

`backend/.env` dosyası oluşturun:

```env
DB_HOST=localhost
DB_PORT=1433
DB_USERNAME=sa
DB_PASSWORD=your_password
DB_DATABASE=RentACarDB
JWT_SECRET=your_jwt_secret_key
```

### 4. Frontend Kurulumu

```bash
cd frontend
npm install
```

---

## ▶️ Çalıştırma

### Backend'i Başlatma

```bash
cd backend
npm run start:dev
```

Backend `http://localhost:3000` adresinde çalışacaktır.

### Frontend'i Başlatma

Yeni bir terminal penceresinde:

```bash
cd frontend
npm run dev
```

Frontend `http://localhost:5173` adresinde çalışacaktır.

---

## 📁 Proje Yapısı

```
rent-a-car/
├── backend/          # NestJS Backend
│   ├── src/
│   │   ├── app/
│   │   │   └── entity/    # User, Car, Brand, Feature, Reservation
│   │   └── auth/          # JWT Strategy, Guards
│   └── ...
├── frontend/        # React Frontend
│   ├── src/
│   │   ├── components/    # Login, Register, CarList, AdminPanel
│   │   └── services/      # API calls
│   └── ...
└── README.md
```

---

## 🛠 Teknolojiler

### Backend

- NestJS
- TypeORM
- MSSQL (Microsoft SQL Server)
- JWT Authentication
- Passport
- bcryptjs

### Frontend

- React 18
- Vite
- React Router v6
- Axios
- TailwindCSS
- Flowbite React
- Sonner (Toast notifications)

---

## 🔐 Roller

- **ADMIN**: Araç ekleyebilir, güncelleyebilir, silebilir, tüm rezervasyonları görüntüleyebilir
- **USER**: Araçları görüntüleyebilir, kiralama yapabilir, kendi rezervasyonlarını görebilir

---

## 📝 Özellikler

✅ Kullanıcı kayıt ve JWT tabanlı giriş sistemi  
✅ Rol bazlı yetkilendirme (Admin/User)  
✅ Araç marka ve özellik yönetimi  
✅ Araç ekleme, güncelleme ve listeleme  
✅ Araç kiralama ve rezervasyon sistemi  
✅ Admin paneli ile merkezi yönetim

---

## 👤 İlk Admin Kullanıcısı Oluşturma

Uygulama çalıştıktan sonra SSMS'de:

```sql
USE RentACarDB;

UPDATE dbo.users
SET role = 'admin'
WHERE username = 'your_username';
```

---

## 📊 Veritabanı Tabloları

- `users` - Kullanıcı bilgileri
- `brands` - Araç markaları (Mercedes, BMW, Audi vb.)
- `features` - Araç özellikleri (Klima, Navigasyon vb.)
- `cars` - Araç bilgileri
- `reservations` - Kiralama kayıtları

---

## 🎓 CENG 307 Dönem Sonu Projesi

Bu proje, Web Teknolojileri dersi kapsamında geliştirilmiş olup tüm gerekli özellikleri içermektedir.
