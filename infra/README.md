# Infra as Code

Tệp Bicep này triển khai các tài nguyên Azure cơ bản cho dự án bán giày thể thao.

Tài nguyên:
- Azure Storage Account (Blob Storage)
- Azure App Service
- Azure SQL Server + Database
- Azure Redis Cache
- Azure Key Vault
- Azure Application Insights

Cách dùng:
1. Đăng nhập Azure CLI: `az login`
2. Chọn subscription: `az account set --subscription <id>`
3. Triển khai resource group: `az group create --name <rg-name> --location <location>`
4. Triển khai Bicep: `az deployment group create --resource-group <rg-name> --template-file main.bicep`
