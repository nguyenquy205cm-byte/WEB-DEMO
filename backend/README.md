Backend for Sport Shoes Store

Quick start (development):

1. Install dependencies

```bash
cd backend
npm install
```

2. Setup environment

Create a `.env` file in `backend/` with `DATABASE_URL` pointing to your MySQL database for development, e.g.:

```
DATABASE_URL=mysql://user:password@localhost:3306/sport_shoes_dev
```

3. Prisma setup

```bash
npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed
npx prisma studio
```

4. Run server

```bash
npm run dev
```

API Endpoints (Postman)

- Health: GET /health
- Auth: POST /api/auth/register, POST /api/auth/login, GET /api/auth/profile, PUT /api/auth/change-password
- Products: GET/POST/PUT/DELETE /api/products
- Categories: GET/POST/PUT/DELETE /api/categories
- Brands: GET/POST/PUT/DELETE /api/brands
- Users: GET/POST/PUT/DELETE /api/users

Controller responsibilities: only handle request/response and delegate to services. Services contain business logic and use Prisma (no raw SQL).
# Backend API

## Authentication module

### Môi trường

Thêm biến môi trường vào `backend/.env`:

```env
DATABASE_URL=mysql://user:password@localhost:3306/sport_shoes_dev
JWT_SECRET=some_super_secret_value
PORT=4000
```

### Register

- Endpoint: `POST /api/auth/register`
- Body JSON:
  ```json
  {
    "email": "user@example.com",
    "password": "StrongPass123",
    "name": "Nguyen Van A"
  }
  ```
- Response:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "email": "user@example.com",
      "name": "Nguyen Van A",
      "role": "USER",
      "createdAt": "2026-08-05T00:00:00.000Z"
    }
  }
  ```

### Login

- Endpoint: `POST /api/auth/login`
- Body JSON:
  ```json
  {
    "email": "user@example.com",
    "password": "StrongPass123"
  }
  ```
- Response:
  ```json
  {
    "success": true,
    "data": {
      "token": "<JWT_TOKEN>",
      "user": {
        "id": 1,
        "email": "user@example.com",
        "name": "Nguyen Van A",
        "role": "USER",
        "createdAt": "2026-08-05T00:00:00.000Z"
      }
    }
  }
  ```

### Sử dụng Bearer Token

1. Trong Postman, chọn tab `Authorization`.
2. Chọn `Bearer Token`.
3. Dán giá trị token nhận được từ login.

### Profile

- Endpoint: `GET /api/auth/profile`
- Header:
  - `Authorization: Bearer <JWT_TOKEN>`
- Response:
  ```json
  {
    "success": true,
    "data": {
      "id": 1,
      "email": "user@example.com",
      "name": "Nguyen Van A",
      "role": "USER",
      "createdAt": "2026-08-05T00:00:00.000Z"
    }
  }
  ```

### Change password

- Endpoint: `PUT /api/auth/change-password`
- Header:
  - `Authorization: Bearer <JWT_TOKEN>`
- Body JSON:
  ```json
  {
    "currentPassword": "StrongPass123",
    "newPassword": "NewStrongPass456"
  }
  ```
- Response:
  ```json
  {
    "success": true,
    "data": {
      "message": "Password changed successfully"
    }
  }
  ```

### Role-based access

- Chỉ `ADMIN` mới có quyền tạo, cập nhật, xóa sản phẩm.
- API product bảo vệ với `authMiddleware` và `roleMiddleware([Role.ADMIN])`.

## Product API

### Get products with pagination, filter, search, sort

- Endpoint: `GET /api/products`
- Query params:
  - `page` (number)
  - `limit` (number)
  - `search` (string)
  - `brandId` (number)
  - `categoryId` (number)
  - `minPrice` (number)
  - `maxPrice` (number)
  - `sort` (`priceAsc`, `priceDesc`, `name`, `newest`)
- Example:
  `GET /api/products?page=1&limit=10&search=nike&brandId=2&categoryId=3&minPrice=50&maxPrice=200&sort=priceAsc`
- Response:
  ```json
  {
    "success": true,
    "message": "Products retrieved successfully",
    "data": {
      "items": [
        {
          "id": 1,
          "name": "Air Zoom",
          "slug": "air-zoom",
          "description": "Running shoe",
          "price": 120,
          "stock": 25,
          "sku": "AZ-001",
          "brand": { "id": 2, "name": "Nike" },
          "categories": [
            { "id": 3, "name": "Running" }
          ],
          "images": [
            { "id": 1, "url": "/uploads/products/images-123.jpg", "alt": "Air Zoom", "isMain": true }
          ],
          "createdAt": "2026-08-05T00:00:00.000Z",
          "updatedAt": "2026-08-05T00:00:00.000Z"
        }
      ],
      "total": 1,
      "page": 1,
      "limit": 10
    }
  }
  ```

### Create product (ADMIN only)

- Endpoint: `POST /api/products`
- Headers:
  - `Authorization: Bearer <JWT_TOKEN>`
- Form-data:
  - `name`: string
  - `slug`: string
  - `description`: string
  - `price`: number
  - `stock`: number
  - `sku`: string
  - `brandId`: number
  - `categoryIds`: JSON string array, e.g. `[1,2]`
  - `images`: up to 5 files
- Response:
  ```json
  {
    "success": true,
    "message": "Product created successfully",
    "data": {
      "id": 10,
      "name": "Air Zoom",
      "slug": "air-zoom",
      "description": "Running shoe",
      "price": 120,
      "stock": 25,
      "sku": "AZ-001",
      "brand": { "id": 2, "name": "Nike" },
      "categories": [
        { "id": 3, "name": "Running" }
      ],
      "images": [
        { "id": 1, "url": "/uploads/products/images-123.jpg", "alt": "Air Zoom", "isMain": true }
      ],
      "createdAt": "2026-08-05T00:00:00.000Z",
      "updatedAt": "2026-08-05T00:00:00.000Z"
    }
  }
  ```

### Update product (ADMIN only)

- Endpoint: `PUT /api/products/:id`
- Headers:
  - `Authorization: Bearer <JWT_TOKEN>`
- Form-data: any fields to update plus optional `images` (new files)
- Response:
  ```json
  {
    "success": true,
    "message": "Product updated successfully",
    "data": { ... }
  }
  ```

### Delete product (ADMIN only)

- Endpoint: `DELETE /api/products/:id`
- Headers:
  - `Authorization: Bearer <JWT_TOKEN>`
- Response:
  ```json
  {
    "success": true,
    "message": "Product deleted successfully",
    "data": { "message": "Product deleted successfully" }
  }
  ```

## Mục đích
Backend được thiết kế để chạy trên Azure App Service, kết nối Azure SQL qua Prisma ORM và sử dụng Azure Blob Storage / Redis / Key Vault / Application Insights.

## Cấu trúc
- `src/`: mã nguồn TypeScript
- `prisma/`: schema Prisma
- `.env.example`: biến môi trường mẫu

## Chạy cục bộ
1. `npm install`
2. `cp .env.example .env` và cập nhật giá trị
3. `npm run dev`

## Azure
- Sử dụng `DATABASE_URL` để kết nối Azure SQL
- Sử dụng `AZURE_STORAGE_CONNECTION_STRING` để kết nối Azure Blob Storage
- Sử dụng `AZURE_STORAGE_CONTAINER` để chỉ định container Blob Storage
- Sử dụng `REDIS_URL` cho Azure Redis
- Sử dụng Key Vault để lưu bí mật
- Kết nối Application Insights nếu cần

## Shopping Cart API

Endpoints:

- `POST /api/cart/add` - add item to cart (auth required)
- `GET /api/cart` - get current user's cart (auth required)
- `PUT /api/cart/item/:id` - update quantity for cart item (auth required)
- `DELETE /api/cart/item/:id` - remove cart item (auth required)
- `DELETE /api/cart` - clear cart (auth required)

Example: Add item

`POST /api/cart/add` (form JSON body):

```json
{
  "productId": 1,
  "quantity": 2
}
```

Response:

```json
{
  "success": true,
  "message": "Item added to cart",
  "data": {
    "id": 1,
    "userId": 1,
    "items": [
      {
        "id": 1,
        "productId": 1,
        "quantity": 2,
        "unitPrice": 120,
        "product": { "id":1, "name":"Air Zoom", "slug":"air-zoom", "price":120, "stock":50 }
      }
    ],
    "subtotal": 240,
    "total": 240
  }
}
```

Notes:

- All endpoints require Bearer JWT token.
- The service checks product stock before adding/updating.
- `subtotal` is sum(unitPrice * quantity); `total` currently equals subtotal.

## Orders / Checkout

Endpoints:

- `POST /api/orders/checkout` - create an order from current user's cart (auth required)
- `GET /api/orders` - list current user's orders (auth required)
- `GET /api/orders/:id` - get order detail (auth required)
- `PUT /api/orders/:id/cancel` - cancel pending order (auth required)

Checkout flow:

1. Fetch user's cart and validate stock
2. Create `Order` and `OrderItem`s
3. Decrement product stock
4. Clear user's cart

Example: Checkout

`POST /api/orders/checkout` (JSON body):

```json
{
  "paymentMethod": "CARD",
  "shippingAddress": "123 Nguyen Trai, HCMC"
}
```

Response (201):

```json
{
  "success": true,
  "message": "Order created",
  "data": {
    "id": 1,
    "userId": 1,
    "total": 240,
    "status": "PENDING",
    "placedAt": "2026-08-05T00:00:00.000Z",
    "shippingAddress": "123 Nguyen Trai, HCMC",
    "items": [
      { "id": 1, "productId": 1, "quantity": 2, "unitPrice": 120 }
    ]
  }
}
```

Cancel rules:

- Only orders with status `PENDING` can be cancelled; cancelling restocks products and sets status to `CANCELLED`.



## Azure Blob Storage Setup

1. Tạo Azure Storage Account trong Azure Portal.
2. Trong Storage Account, chọn `Containers` và tạo container mới, ví dụ `product-images`.
3. Lấy `Connection string` từ `Access keys`.
4. Cập nhật `backend/.env` với:

```env
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=<accountName>;AccountKey=<accountKey>;EndpointSuffix=core.windows.net"
AZURE_STORAGE_CONTAINER="product-images"
```

## Kiểm thử upload ảnh sản phẩm

1. Đăng nhập và lấy JWT từ `POST /api/auth/login`.
2. Trong Postman, chọn `Authorization` -> `Bearer Token` và dán token.
3. Chuyển sang `Body` -> `form-data`.
4. Thêm các trường:
   - `name`: `Air Zoom`
   - `slug`: `air-zoom`
   - `description`: `Running shoe`
   - `price`: `120`
   - `stock`: `20`
   - `sku`: `AZ-001`
   - `brandId`: `1`
   - `categoryIds`: `[1,2]`
   - `images`: chọn tối đa 5 file ảnh
5. Gửi `POST /api/products`.
6. Kết quả trả về sẽ chứa các URL Azure Blob trong `data.images[*].url`.

## Kiểm thử xóa ảnh và sản phẩm

- `PUT /api/products/:id` với file ảnh mới sẽ xóa ảnh cũ trên Azure và upload ảnh mới.
- `DELETE /api/products/:id` sẽ xóa tất cả Blob liên quan rồi xóa Product.

> Lưu ý: container Azure phải tồn tại trước khi upload. Nếu container không tồn tại, app sẽ báo lỗi khi upload.
