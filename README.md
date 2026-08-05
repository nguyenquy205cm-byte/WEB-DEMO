# Website bán giày thể thao

## Mục tiêu
Tạo project bài tập lớn môn Điện toán đám mây cho website bán giày thể thao với kiến trúc frontend React + TypeScript và backend Node.js + Express.

## Cấu trúc chính
- `frontend/`: ứng dụng web React với Vite, TypeScript và Tailwind CSS.
- `backend/`: API Node.js + Express với TypeScript và Prisma ORM.
- `infra/`: scaffold hạ tầng Azure bằng Bicep.

## Thực hiện
1. Mở terminal tại thư mục gốc `d:\Điện toán\WEB-DEMO`
2. Chạy lệnh cài đặt cho từng phần:
   - `cd frontend && npm install`
   - `cd ../backend && npm install`
3. Khởi động từng phần:
   - `cd frontend && npm run dev`
   - `cd ../backend && npm run dev`

## Hạ tầng Azure chuẩn bị
- Azure Static Web Apps cho frontend tĩnh
- Azure App Service cho backend
- Azure SQL Database
- Azure Blob Storage cho ảnh sản phẩm
- Azure Redis Cache
- Azure Key Vault
- Azure Monitor / Application Insights
