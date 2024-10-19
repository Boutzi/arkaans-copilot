# auth.tf

data "aws_ecr_authorization_token" "auth" {}

resource "null_resource" "docker_login" {
  provisioner "local-exec" {
    command = "aws ecr get-login-password --region ${var.aws_region} | docker login --username AWS --password-stdin ${aws_ecr_repository.my_repository.repository_url}"
  }
}
