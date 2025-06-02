# [IS210.P12] - ĐỒ ÁN XÂY DỰNG WEBSITE QUẢN LÝ THƯ VIỆN

Website quản lý thư viện hỗ trợ quản lý sách, người dùng, và các giao dịch mượn trả sách một cách hiệu quả, với giao diện riêng cho người dùng và quản trị viên.

> 🔗 Link GitHub repository: [https://github.com/yurri2506/IS203_QuanLyThuVien](https://github.com/yurri2506/IS203_QuanLyThuVien)

---

## 📋 Mục lục

- Giới thiệu nhóm
- Thành viên
- Công nghệ sử dụng
- Yêu cầu trước khi cài đặt
- Hướng dẫn cài đặt
- Cấu hình cơ sở dữ liệu
- Cấu hình bổ sung
- Lưu ý khi chạy project

---

## 🎓 Giới thiệu nhóm

- **Trường**: Đại học Công nghệ Thông tin, Đại học Quốc gia TP. HCM (ĐHQG-HCM)
- **Khoa**: Hệ Thống Thông Tin
- **GVHD**: ThS. Tạ Việt Phương
- **Nhóm sinh viên thực hiện**: Nhóm 8386

---

## 👥 Thành viên

| STT | Họ tên                | MSSV     | Chức vụ       |
|-----|-----------------------|----------|---------------|
| 1   | Nguyễn Lê Thanh Huyền | 22520590 | Nhóm trưởng   |
| 2   | Lê Thị Phương Thảo    | 23521468 | Thành viên    |
| 3   | Lê Thị Thùy Trang     | 23521627 | Thành viên    |
| 4   | Nguyễn Thanh Trí      | 23521645 | Thành viên    |

---

## 🛠️ Công nghệ sử dụng

- **Frontend**: React.js (Next.js + Tailwind)
- **Backend**: Java 17+ (Spring Boot), Maven
- **Database**: Supabase (PostgreSQL)
- **Dịch vụ bên thứ ba**: Cloudinary (lưu trữ hình ảnh), Gmail SMTP (gửi email)
- **Công cụ**: Git, VS Code
- **Tích hợp**: Google OAuth2 (đăng nhập, tùy chọn)

---

## 📦 Yêu cầu trước khi cài đặt

Trước khi bắt đầu, hãy đảm bảo đã cài đặt các phần mềm sau:

- [Node.js](https://nodejs.org/) (phiên bản ≥ 18)
- [Java](https://www.oracle.com/java/technologies/javase-jdk17-downloads.html) (phiên bản 17+)
- [Maven](https://maven.apache.org/download.cgi)
- [Git](https://git-scm.com/downloads)
- [VS Code](https://code.visualstudio.com/) (khuyến nghị)
- Tài khoản [Supabase](https://supabase.com/) để cấu hình cơ sở dữ liệu
- Tài khoản [Cloudinary](https://cloudinary.com/) để lưu trữ hình ảnh

---

## ⚙️ Hướng dẫn cài đặt

### 1. Clone project về máy

```bash
git clone https://github.com/yurri2506/IS203_QuanLyThuVien.git
cd IS203_QuanLyThuVien
```

### 2. Cài đặt và chạy backend (Spring Boot)

- Mở thư mục `backend2/library`
- Chạy lệnh sau để khởi động backend:
  ```bash
  ./mvnw spring-boot:run
  ```

### 3. Cài đặt và chạy frontend

#### 🖥 Frontend cho người dùng (frontend-user)

```bash
cd frontend-user
npm install
npm run dev
```
- Truy cập: [http://localhost:3000](http://localhost:3000)

#### 🛠 Frontend cho quản trị viên (frontend-admin)

```bash
cd ../frontend-admin
npm install
npm run dev
```
- Truy cập: [http://localhost:3001](http://localhost:3001)

### 🗂️ Cấu hình môi trường Frontend

- Dự án sử dụng biến môi trường `.env.local` để kết nối Supabase và cấu hình Google OAuth. Tạo file `.env.local` trong thư mục `frontend-user` và `frontend-admin` với nội dung:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=<YOUR_SUPABASE_URL>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<YOUR_SUPABASE_ANON_KEY>

# OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
```
### 📌 Hướng dẫn lấy thông tin:
 - `Supabase URL & Anon Key`: Vào Supabase → chọn dự án → Settings > API → mục Project API keys.
 - `Google Client ID`: Vào Google Cloud Console → API & Services → Credentials → tạo OAuth Client ID.

---

## 🗄️ Cấu hình cơ sở dữ liệu

Dự án sử dụng **Supabase** (dựa trên PostgreSQL) làm cơ sở dữ liệu. Để cấu hình:

1. **Kiểm tra file cấu hình**:
   - File `application.properties` đã có sẵn trong thư mục `backend2/library/src/main/resources/` khi clone project. File này chứa thông tin kết nối Supabase:
    ```properties
    # URL kết nối đến Supabase
    spring.datasource.url=<YOUR_SUPABASE_URL>
    # Tên người dùng Supabase
    spring.datasource.username=<YOUR_SUPABASE_USERNAME>
    # Mật khẩu Supabase
    spring.datasource.password=<YOUR_SUPABASE_PASSWORD>

    # Cấu hình driver và Hibernate
    spring.datasource.driver-class-name=org.postgresql.Driver
    spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
    spring.jpa.hibernate.ddl-auto=update
    ```
   - Lưu ý: Nếu sử dụng tài khoản Supabase khác, hãy đăng ký tại [Supabase](https://supabase.com/), tạo dự án mới, và cập nhật các thông tin trên (URL, username, password) trong file `application.properties`.

2. **Tạo bảng tự động**:
   - SBackend đã được cấu hình để tự động tạo và cập nhật bảng (với `spring.jpa.hibernate.ddl-auto=update`).
   - Nếu bạn cần chỉnh sửa bảng thủ công, có thể vào giao diện Supabase (**Settings > Database**) để xem và quản lý.

**Lưu ý**: Kiểm tra kết nối database trước khi chạy backend bằng cách chạy lệnh (ví dụ sử dụng psql):
```bash
psql -h <YOUR_SUPABASE_HOST> -p <YOUR_SUPABASE_PORT> -U <YOUR_SUPABASE_USERNAME> -d <YOUR_SUPABASE_DATABASE>
```

---

## 🔧 Cấu hình bổ sung

### 1. Cloudinary (Lưu trữ hình ảnh)

Dự án sử dụng Cloudinary để lưu trữ hình ảnh sách. Cập nhật thông tin Cloudinary trong file `application.properties`:

```properties
cloudinary.cloud-name=<YOUR_CLOUDINARY_CLOUD_NAME>
cloudinary.api-key=<YOUR_CLOUDINARY_API_KEY>
cloudinary.api-secret=<YOUR_CLOUDINARY_API_SECRET>
```
- Đăng ký tài khoản [Cloudinary](https://cloudinary.com/) và lấy các giá trị trên từ dashboard.
- Thay các placeholder <YOUR_...> bằng giá trị từ dashboard Cloudinary của bạn.
- Đảm bảo các API liên quan đến upload hình ảnh được gọi đúng.

### 2. Email (Gửi thông báo)

Dự án sử dụng Gmail SMTP để gửi email thông báo. Cập nhật thông tin trong `application.properties`:

```properties
# Gmail SMTP
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=<YOUR_GMAIL_ADDRESS>
spring.mail.password=<YOUR_GMAIL_APP_PASSWORD>
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
```

- <YOUR_GMAIL_ADDRESS>: địa chỉ Gmail dùng gửi email.
- <YOUR_GMAIL_APP_PASSWORD>: App Password tạo từ trang quản lý Google Account (bật Xác thực 2 bước trước).

### 3. OAuth2 (Tùy chọn)

Dự án hỗ trợ đăng nhập bằng Google OAuth2. Cập nhật thông tin trong `application.properties`:

```properties
spring.security.oauth2.client.registration.google.client-id=<YOUR_GOOGLE_CLIENT_ID>
spring.security.oauth2.client.registration.google.client-secret=<YOUR_GOOGLE_CLIENT_SECRET>
spring.security.oauth2.client.registration.google.scope=email,profile
```

- Lấy `client-id` và `client-secret` từ [Google Cloud Console](https://console.cloud.google.com/).
- Cấu hình redirect URI: `{baseUrl}/login/oauth2/code/google`.

---

## 📌 Lưu ý khi chạy project

- **Chạy đồng thời**: Đảm bảo backend và cả hai frontend (user, admin) đều được chạy để project hoạt động đầy đủ.
- **CORS**: Nếu gặp lỗi CORS, kiểm tra và cập nhật `allowed-origins` trong `application.properties`:
  ```properties
  spring.web.cors.allowed-origins=http://localhost:3000,http://localhost:3001
  spring.web.cors.allowed-methods=GET,POST,PUT,DELETE
  spring.web.cors.allowed-headers=Authorization,Content-Type
  spring.web.cors.allow-credentials=true
  ```
- **Kiểm tra kết nối**: Đảm bảo URL, username, password của database và Cloudinary đúng trước khi chạy.
- **Môi trường**: Đặt biến môi trường cho `${MAIL_USERNAME}` và `${MAIL_PASSWORD}` nếu cần.

---




