# locals.tf

locals {
  ecr_repository_url = aws_ecr_repository.my_repository.repository_url
}
