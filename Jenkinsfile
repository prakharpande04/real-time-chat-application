pipeline {
  agent any
  stages {
    stage('Build Frontend') {
      steps {
        dir('frontend') {
          sh 'npm install && npm run build'
        }
      }
    }
    stage('Build Backend') {
      steps {
        dir('backend') {
          sh 'npm install'
        }
      }
    }
    stage('Docker Compose Up') {
      steps {
        sh 'docker-compose up -d --build'
      }
    }
  }
}
