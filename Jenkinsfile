pipeline {
  agent any

  stages {
    stage('Build & Run Docker Compose') {
      steps {
        script {
          sh 'docker-compose down || true'
          sh 'docker-compose build'
          sh 'docker-compose up -d'
        }
      }
    }
  }
  post {
    always {
      sh 'docker-compose down || true'
    }
  }
}