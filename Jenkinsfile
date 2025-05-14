pipeline {
  agent any

  stages {
    stage('Build & Run Docker Compose') {
      steps {
        script {
          bat 'docker-compose down || true'
          bat 'docker-compose build'
          bat 'docker-compose up -d'
        }
      }
    }
  }
  post {
    always {
      bat 'docker-compose down || true'
    }
  }
}