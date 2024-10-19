# variables.tf

variable "aws_region" {
  description = "The AWS region to deploy resources."
  default     = "eu-west-3"
}

variable "availability_zone" {
  description = "The availability zone for subnet."
  default     = "eu-west-3a"
}

variable "ecr_repository_name" {
  description = "Name of the ECR repository."
  default     = "arkaans/copilot"
}

variable "ecs_cluster_name" {
  description = "Name of the ECS cluster."
  default     = "arkaanscopilot"
}

variable "ecs_service_name" {
  description = "Name of the ECS service."
  default     = "arkaanscopilot"
}

variable "ecs_task_family" {
  description = "Family name of the ECS task."
  default     = "arkaanscopilot"
}

variable "docker_image_name" {
  description = "Local Docker image name."
  default     = "arkaans-copilot"
}

variable "container_port" {
  description = "Port on which the container listens."
  default     = 80
}

variable "vpc_cidr_block" {
  description = "CIDR block for the VPC."
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr_block" {
  description = "CIDR block for the public subnet."
  default     = "10.0.1.0/24"
}
