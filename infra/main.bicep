@description('Name prefix for all resources')
param prefix string = 'sportshoe'
param location string = resourceGroup().location

resource storage 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: '${prefix}sa'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    accessTier: 'Hot'
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2022-03-01' = {
  name: '${prefix}-asp'
  location: location
  sku: {
    name: 'P1v3'
    tier: 'PremiumV3'
  }
}

resource webApp 'Microsoft.Web/sites@2022-03-01' = {
  name: '${prefix}-api'
  location: location
  kind: 'app'
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      appSettings: [
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1'
        }
      ]
    }
  }
  dependsOn: [appServicePlan]
}

resource sqlServer 'Microsoft.Sql/servers@2021-02-01-preview' = {
  name: '${prefix}-sql'
  location: location
  properties: {
    administratorLogin: 'sqladmin'
    administratorLoginPassword: 'ChangeThisPassword1234!'
  }
  sku: {
    name: 'GP_Gen5_2'
    tier: 'GeneralPurpose'
  }
}

resource sqlDb 'Microsoft.Sql/servers/databases@2021-02-01-preview' = {
  name: '${sqlServer.name}/sportshoesdb'
  location: location
  sku: {
    name: 'GP_Gen5_2'
  }
  properties: {
    collation: 'SQL_Latin1_General_CP1_CI_AS'
    maxSizeBytes: 2147483648
  }
  dependsOn: [sqlServer]
}

resource redis 'Microsoft.Cache/Redis@2023-07-01' = {
  name: '${prefix}-redis'
  location: location
  sku: {
    name: 'Premium'
    family: 'P'
    capacity: 1
  }
  properties: {
    enableNonSslPort: false
  }
}

resource keyVault 'Microsoft.KeyVault/vaults@2022-07-01' = {
  name: '${prefix}-kv'
  location: location
  properties: {
    tenantId: subscription().tenantId
    sku: {
      family: 'A'
      name: 'standard'
    }
    accessPolicies: []
    enabledForDeployment: true
    enabledForTemplateDeployment: true
    enabledForDiskEncryption: false
  }
}

resource appInsights 'Microsoft.Insights/components@2020-02-02' = {
  name: '${prefix}-appi'
  location: location
  kind: 'web'
  properties: {
    Application_Type: 'web'
  }
}

output storageAccountName string = storage.name
output webAppName string = webApp.name
output sqlServerName string = sqlServer.name
output sqlDatabaseName string = sqlDb.name
output redisName string = redis.name
output keyVaultName string = keyVault.name
output appInsightsName string = appInsights.name
