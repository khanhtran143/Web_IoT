# SMART HOME IoT MONITORING & CONTROL SYSTEM

Hệ thống quản lý, giám sát và điều khiển Smart Home IoT Full-Stack theo thời gian thực (Realtime), tối ưu cho báo cáo và demo đồ án môn học IoT.

---

## 1. Cấu trúc thư mục dự án

```
Web_IOT/
├── FE/                        # Frontend (React + TypeScript + Vite + TailwindCSS)
│   ├── src/
│   │   ├── components/        # Layout, Dashboard, Sensors, History, Profile
│   │   ├── services/          # API & WebSocket client + Mock Engine
│   │   ├── context/           # Auth, Socket, Toast Contexts
│   │   ├── utils/             # Smart Datetime Range Parser
│   │   └── types/             # Sensor, Device, Action, User models
│   ├── public/documents/      # 4 tài liệu PDF thực hành (Practice 01-04)
│   └── package.json
│
├── BE/                        # Backend Server (Node.js + TypeScript + Express + Prisma)
│   ├── src/
│   │   ├── controllers/       # Auth, User, Device, Sensor, Action
│   │   ├── services/          # Business logic, Smart queries, IoT Simulator
│   │   ├── websocket/         # Socket.IO Realtime Gateway
│   │   ├── mqtt/              # MQTT Client Adapter (ESP32 Ready)
│   │   └── routes/            # REST API Routes
│   ├── prisma/
│   │   ├── schema.prisma      # 5 bảng: user, Devices, Sensors, Data sensor, Action
│   │   └── seed.ts            # Dữ liệu mẫu demo
│   └── package.json
│
├── BTL IOT/                   # Mã nguồn nhúng ESP32 (PlatformIO C++)
│   ├── src/main.cpp           # Đọc AHT20, BH1750, điều khiển LED & gửi MQTT
│   └── platformio.ini
│
├── docs/                      # Tài liệu hệ thống & hướng dẫn kết nối
│   ├── architecture.md
│   └── esp32_mqtt_guide.md
└── README.md
```

---

## 2. Tài khoản Demo

| Loại | Giá trị |
|---|---|
| **Email / Username** | `khanhtq143@gmail.com` *(hoặc `admin`)* |
| **Password** | `123456` |
| **Vai trò** | Quản trị viên (Admin) |

---

## 3. Các tính năng nổi bật

1. **Dashboard Overview**:
   - 3 Card cảm biến thời gian thực: Nhiệt độ (`AHT20`), Độ ẩm (`AHT20`), Ánh sáng (`BH1750`).
   - Điều khiển Relay thiết bị: **LED Light** (có hiệu ứng glow) và **Fan** (có animation quay cánh quạt).
   - Biểu đồ thời gian thực đa trục (**Recharts**) hiển thị 30 điểm dữ liệu gần nhất, không gây lag.
2. **Data Sensors**:
   - Hiển thị bảng lịch sử 4 cột: `ID | Sensor Name | Value | Time`.
   - **Smart Datetime Search**: Tự động nhận diện độ chính xác thời gian (Năm, Tháng, Ngày, Giờ, Phút, Giây) và lọc theo khoảng thời gian chuẩn xác (`startTime` đến `endTime`).
3. **Action History**:
   - Bảng 6 cột: `ID | Device | Action | Status | Activation Time | Response Time`.
   - **Disconnect Detection**: Thiết bị phản hồi $\le 5s$ hiển thị thời gian phản hồi (VD: `2.4s`), nếu $> 5s$ tự động chuyển trạng thái sang `DISCONNECT` kèm cảnh báo màu đỏ.
4. **Profile & Practice Documents**:
   - Thông tin cá nhân sinh viên thực hiện đồ án.
   - Resource links (GitHub, Figma, Postman) mở trong tab mới.
   - 4 tài liệu thực hành PDF với tính năng **Xem (View Modal)** và **Tải về (Download)** trực tiếp.
5. **Thiết kế Single Viewport**:
   - Toàn bộ giao diện được thiết kế vừa khít màn hình Desktop (1920x1080, 1440x900, 1366x768), không bị scroll chuột dọc.
6. **Dual Mode (Backend & Standalone Mock)**:
   - Frontend kết nối trực tiếp với Backend REST API & Socket.IO.
   - Nếu Backend chưa khởi động, Frontend tự động kích hoạt **Mock Simulator Engine** tạo dữ liệu trôi tự nhiên và mô phỏng phản hồi thiết bị để demo không bị gián đoạn.

---

## 4. Hướng dẫn cài đặt và chạy hệ thống

### 1. Khởi động Backend (BE)
```bash
cd BE
npm install

# Tạo file .env và cấu hình MySQL
cp .env.example .env

# Tạo bảng dữ liệu và nạp dữ liệu mẫu
npx prisma db push
npx prisma db seed

# Chạy server ở chế độ Development
npm run dev
```
> Server sẽ chạy tại `http://localhost:3000` (API: `http://localhost:3000/api`, Swagger Docs: `http://localhost:3000/api-docs`).

### 2. Khởi động Frontend (FE)
```bash
cd FE
npm install
npm run dev
```
> Mở trình duyệt tại: `http://localhost:5173`

---

## 5. Danh sách REST API Chính

| Method | Endpoint | Mô tả |
|---|---|---|
| `POST` | `/api/auth/login` | Đăng nhập hệ thống & nhận JWT Token |
| `GET` | `/api/auth/me` | Lấy thông tin user hiện tại |
| `GET` | `/api/devices` | Danh sách thiết bị (LED, Fan) |
| `PUT` | `/api/devices/:id/status` | Bật / Tắt thiết bị |
| `GET` | `/api/sensors` | Danh sách các cảm biến (AHT20, BH1750) |
| `GET` | `/api/sensors/data` | Truy vấn dữ liệu cảm biến (Hỗ trợ Smart Datetime) |
| `GET` | `/api/actions` | Lịch sử thao tác và thời gian phản hồi |
| `POST` | `/api/actions` | Gửi lệnh kích hoạt thiết bị |

Xem Swagger UI chi tiết tại: `http://localhost:3000/api-docs`

---

## 6. Kết nối Thiết bị Phần cứng (ESP32 / MQTT)

Xem chi tiết sơ đồ chân và code C++ nạp cho ESP32 tại file [`docs/esp32_mqtt_guide.md`](file:///c:/Users/Lenovo/Documents/K%C3%AC_1-N%C4%83m_4/IOT/BTL_IOT%28c%C3%A1%20nh%C3%A2n%29/Web_IOT/docs/esp32_mqtt_guide.md).
