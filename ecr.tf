# ecr.tf

resource "aws_ecr_repository" "my_repository" {
  name                 = var.ecr_repository_name
  image_tag_mutability = "MUTABLE"
}
