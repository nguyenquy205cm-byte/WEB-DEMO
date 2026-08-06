# Website bán giày thể thao

## Mục tiêu
Tạo project bài tập lớn môn Điện toán đám mây cho website bán giày thể thao với kiến trúc frontend React + TypeScript và backend Node.js + Express.

## Cấu trúc chính
- `frontend/`: ứng dụng web React với Vite, TypeScript và Tailwind CSS.
- `backend/`: API Node.js + Express với TypeScript và Prisma ORM.
- `infra/`: scaffold hạ tầng Azure bằng Bicep.
- `docker-compose.yml`: định nghĩa toàn bộ dịch vụ chạy bằng Docker (chạy local).
- `render.yaml`: Blueprint triển khai Production lên Render.

## Thực hiện (chạy local)
1. Mở terminal tại thư mục gốc `d:\Điện toán\WEB-DEMO`
2. Chạy lệnh cài đặt cho từng phần:
   - `cd frontend && npm install`
   - `cd ../backend && npm install`
3. Khởi động từng phần:
   - `cd frontend && npm run dev`
   - `cd ../backend && npm run dev`

> Lưu ý: hiện tại `frontend` dùng dữ liệu mẫu tĩnh (`src/services/products.ts`) và ảnh đóng gói sẵn trong repo (`public/images/`), nên không cần backend để chạy giao diện. Mock auth dùng `localStorage`.

## Kiến trúc triển khai (Production)

Hệ thống được triển khai tự động lên **Render** (CI/CD từ GitHub). Frontend là **Static Site**, backend là **Web Service Docker**, database là **PostgreSQL managed**:

```
                        Internet
                           |
                 HTTP/HTTPS (https://sneaker-store-*.onrender.com)
                           |
        ┌──────────────────┴──────────────────┐
        │                Render                │
        │                                      │
        │  ┌────────────────┐   ┌───────────┐  │
        │  │ Static Site    │   │ Web Service│ │
        │  │ sneaker-store- │──►│ sneaker-   │ │
        │  │ frontend (SPA) │   │ store-     │ │
        │  │ React + Vite   │   │ backend    │ │
        │  │ build: dist/   │   │ Docker     │ │
        │  └────────────────┘   │ Node/Express││
        │                       └─────┬──────┘ │
        │             ┌───────────────┴───────┐ │
        │             │ PostgreSQL (Render,   │ │
        │             │ plan free, Prisma)    │ │
        │             └───────────────────────┘ │
        └───────────────────────────────────────┘
                           │
                           ├── (tùy chọn) Redis cache (REDIS_URL)
                           └── (tùy chọn) Azure Blob Storage (ảnh sản phẩm)
```

### Luồng CI/CD
1. Push source lên GitHub.
2. Render phát hiện thay đổi trên `main`, tự động build & deploy:
   - **Frontend**: `npm install && npm run build` → publish thư mục `dist/` (Static Site).
   - **Backend**: build Docker image → chạy `prisma migrate deploy && prisma seed && node dist/index.js` rồi start server.
3. Khi deploy lại, Render tạo **bản sao PostgreSQL mới** → backend tự migrate + seed dữ liệu (seed idempotent: xóa sạch rồi ghi lại).
4. Truy cập website qua URL do Render cấp (có suffix riêng, xem dashboard Render).

> **Ghi chú về plan free:** Render ngủ sau ~15 phút không có truy cập, lần mở đầu phải chờ ~30–60s để wake; database free hết hạn sau 30 ngày kể từ ngày tạo.

### Các service trong `render.yaml`
| Service (Render) | Loại | Root dir | Vai trò |
|---|---|---|---|
| `sneaker-store-frontend` | Static Site | `frontend` | Phục vụ bundle React đã build, SPA fallback về `index.html` |
| `sneaker-store-backend` | Web Service (Docker) | `backend` | REST API (auth, products, cart, orders, users), health check `/health` |
| `sneaker-store-db` | PostgreSQL (free, v16) | – | Cơ sở dữ liệu chính, kết nối qua `DATABASE_URL` từ Render |

### Các container trong `docker-compose.yml` (dùng khi chạy local)
| Service | Image | Cổng | Vai trò |
|---|---|---|---|
| `frontend` | `web-demo-frontend` (Nginx 1.27) | 80 → 80 | Phục vụ bundle React đã build, proxy `/api` sang backend, SPA fallback |
| `backend` | `web-demo-backend` (Node 20) | 4000 → 4000 | REST API (auth, products, cart, orders, users) |
| `db` | `postgres:16-alpine` | 5432 → 5432 | Cơ sở dữ liệu `sneakerstore`, có volume bền vững |
| `redis` | `redis:7-alpine` | 6379 → 6379 | Cache, có volume bền vững |
| `migrate` | `web-demo-migrate` | – | Job chạy `prisma migrate deploy` khi khởi tạo |

## Dịch vụ Cloud được sử dụng

Tổng cộng có **6 dịch vụ** được sử dụng: **4 dịch vụ bắt buộc** (vận hành chính) và **2 dịch vụ tùy chọn** (tính năng mở rộng).

### Dịch vụ bắt buộc (4)
| Dịch vụ | Nhà cung cấp | Công dụng |
|---|---|---|
| GitHub | GitHub | Lưu trữ mã nguồn, kích hoạt tự động deploy lên Render mỗi lần push |
| Render — Static Site | Render | Host frontend React (SPA), phục vụ trực tiếp bản build tĩnh |
| Render — Web Service | Render | Host backend Node.js/Express trong Docker container |
| Render — PostgreSQL | Render | Database managed (free, v16), backend kết nối qua `DATABASE_URL`, tự migrate + seed khi deploy |

### Dịch vụ tùy chọn (2)
| Dịch vụ | Nhà cung cấp | Công dụng |
|---|---|---|
| Redis | Tự quản | Cache dữ liệu (categories, products, dashboard) — backend tự bỏ qua nếu chưa đặt `REDIS_URL` |
| Azure Blob Storage | Azure | Lưu ảnh sản phẩm khi admin upload qua backend (cần `AZURE_STORAGE_CONNECTION_STRING`, `AZURE_STORAGE_CONTAINER`) |

> Frontend hiện đang dùng ảnh đóng gói sẵn trong repo nên Blob Storage chưa thực sự cần cho demo. Redis và Blob chỉ kích hoạt khi điền biến môi trường trên Render dashboard.
