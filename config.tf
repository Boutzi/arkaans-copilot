provider "azurerm" {
  features {}
}

# Resource Group
resource "azurerm_resource_group" "rg" {
  name     = "discord-bot-rg"
  location = "East US"
}

# Azure Container Instance
resource "azurerm_container_group" "discord_bot" {
  name                = "discord-bot-container"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"

  container {
    name   = "discord-bot"
    image  = "<your-dockerhub-username>/discord-bot-lambda:latest"
    cpu    = "1"
    memory = "1.5"

    environment_variables = {
      DISCORD_BOT_TOKEN = var.discord_bot_token
      DATABASE_URL      = var.database_url
    }

    ports {
      port     = 80
      protocol = "TCP"
    }

    # Specify your Docker Hub credentials here
    secure_environment_variables = {
      DOCKER_USERNAME = var.docker_hub_username
      DOCKER_PASSWORD = var.docker_hub_password
    }
  }

  image_registry_credential {
    server   = "docker.io"
    username = var.docker_hub_username
    password = var.docker_hub_password
  }

  tags = {
    environment = "production"
  }
}

# Outputs
output "container_group_name" {
  value = azurerm_container_group.discord_bot.name
}

output "resource_group_name" {
  value = azurerm_resource_group.rg.name
}

