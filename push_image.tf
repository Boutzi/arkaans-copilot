# push_image.tf

resource "null_resource" "push_docker_image" {
  depends_on = [null_resource.docker_login]

  provisioner "local-exec" {
    command = <<EOT
      docker build -t ${var.docker_image_name}:latest .
      docker tag ${var.docker_image_name}:latest ${aws_ecr_repository.my_repository.repository_url}:latest
      docker push ${aws_ecr_repository.my_repository.repository_url}:latest
    EOT
  }
}
