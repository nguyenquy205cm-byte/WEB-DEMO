# Website bán giày thể thao

## Mục tiêu
Tạo project bài tập lớn môn Điện toán đám mây cho website bán giày thể thao với kiến trúc frontend React + TypeScript và backend Node.js + Express.

## Cấu trúc chính
- `frontend/`: ứng dụng web React với Vite, TypeScript và Tailwind CSS.
- `backend/`: API Node.js + Express với TypeScript và Prisma ORM.
- `infra/`: scaffold hạ tầng Azure bằng Bicep.
- `docker-compose.yml`: định nghĩa toàn bộ dịch vụ chạy bằng Docker.

## Thực hiện
1. Mở terminal tại thư mục gốc `d:\Điện toán\WEB-DEMO`
2. Chạy lệnh cài đặt cho từng phần:
   - `cd frontend && npm install`
   - `cd ../backend && npm install`
3. Khởi động từng phần:
   - `cd frontend && npm run dev`
   - `cd ../backend && npm run dev`

## Kiến trúc triển khai (Production)

Hệ thống được đóng gói và chạy bằng **Docker Compose** trên một **Azure Virtual Machine (Ubuntu)**:

```
                        Internet
                           |
                           | HTTP :80 / HTTPS
                           v
        ┌──────────────────────────────────────┐
        │   Azure VM Ubuntu (Docker Engine)    │
        │                                      │
        │   ┌──────────┐      ┌─────────────┐  │
        │   │ Frontend │ ───► │ Backend API │  │
        │   │ Nginx    │ /api │ Node/Express│  │
        │   │  :80     │      │    :4000    │  │
        │   └──────────┘      └──────┬──────┘  │
        │                            │         │
        │              ┌─────────────┴──────┐  │
        │              │ PostgreSQL (Prisma)│  │
        │              │ Redis (cache)      │  │
        │              └────────────────────┘  │
        └──────────────────────────────────────┘
                           │
                           ▼
              Azure Blob Storage (ảnh sản phẩm)
```

### Các container trong `docker-compose.yml`
| Service | Image | Cổng | Vai trò |
|---|---|---|---|
| `frontend` | `web-demo-frontend` (Nginx 1.27) | 80 → 80 | Phục vụ bundle React đã build, proxy `/api` sang backend, SPA fallback |
| `backend` | `web-demo-backend` (Node 20) | 4000 → 4000 | REST API (auth, products, cart, orders, users) |
| `db` | `postgres:16-alpine` | 5432 → 5432 | Cơ sở dữ liệu `sneakerstore`, có volume bền vững |
| `redis` | `redis:7-alpine` | 6379 → 6379 | Cache, có volume bền vững |
| `migrate` | `web-demo-migrate` | – | Job chạy `prisma migrate deploy` khi khởi tạo |

### Luồng triển khai
1. Push source lên GitHub.
2. SSH vào Azure VM: `ssh azureuser@<public-ip>`.
3. Kéo code mới: `git pull`.
4. Build và chạy: `docker compose up -d --build`.
5. Truy cập website qua IP công khai của VM.

## Dịch vụ Cloud đã sử dụng

| Dịch vụ | Nhà cung cấp | Công dụng |
|---|---|---|
| Azure Virtual Machine (Ubuntu) | Azure | Máy chủ chạy toàn bộ container Docker |
| Azure Network Security Group (NSG) | Azure | Mở/mở cổng truy cập (22/SSH, 80/HTTP) cho VM |
| Azure Blob Storage | Azure | Lưu trữ ảnh sản phẩm (backend upload qua `AZURE_STORAGE_CONNECTION_STRING`) |
| Azure Public IP | Azure | Địa chỉ truy cập website từ Internet |
| GitHub | GitHub | Lưu trữ mã nguồn và đồng bộ code lên server qua `git pull` |
| PostgreSQL (Docker) | Tự quản | DB chính — chạy trong container trên VM |
| Redis (Docker) | Tự quản | Cache — chạy trong container trên VM |
| Nginx (Docker) | Tự quản | Web server phục vụ frontend và reverse proxy |

> **Ghi chú:** thư mục `infra/` chứa file Bicep scaffold cho phương án dùng dịch vụ PaaS Azure (App Service, Azure SQL, Azure Cache for Redis, Key Vault, Application Insights, Blob Storage). Ngoài ra còn có thể triển khai tự động lên **Render** qua file `render.yaml` (Static Site + Web Service + PostgreSQL free). Hướng triển khai thực tế có thể chọn **Docker Compose trên Azure VM** hoặc **Render Blueprint**.
