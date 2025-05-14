pipeline {
  agent any

  stages {
    stage('Checkout') {
      steps {
        git 'https://github.com/prakharpande04/real-time-chat-application.git'
      }
    }
    stage('Build & Run Docker Compose') {
      steps {
        script {
          bat 'docker-compose down || exit 0'
          bat 'docker-compose build'
          bat 'docker-compose up -d'
        }
      }
    }
  }
  post {
    always {
      bat 'docker-compose down'
    }
  }
}