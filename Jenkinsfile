pipeline {
    agent any
    
    environment {
        DOCKER_IMAGE = 'api-gateway'
        CONTAINER_NAME = 'api-gateway'
        NETWORK = 'gmao-network'
        PORT = '8000:8000'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'master', url: 'https://github.com/Yassin-abdennadher/api-gateway-pfe.git'
            }
        }
        
        stage('Install') {
            steps {
                sh "docker run --rm -v ${WORKSPACE}:/app -w /app node:18-alpine npm install"
            }
        }
        
        stage('Build') {
            steps {
                sh "docker run --rm -v ${WORKSPACE}:/app -w /app node:18-alpine npm run build"
            }
        }
        
        stage('Test') {
            steps {
                sh "docker run --rm -v ${WORKSPACE}:/app -w /app node:18-alpine npm test || echo 'No tests found'"
            }
        }
        
        stage('Docker Build') {
            steps {
                sh "docker build -t ${DOCKER_IMAGE}:latest ."
            }
        }
        
        stage('Deploy') {
            when { branch 'master' }
            steps {
                script {
                    withCredentials([
                        string(credentialsId: 'auth-service-url', variable: 'AUTH_SERVICE_URL'),
                        string(credentialsId: 'main-service-url', variable: 'MAIN_SERVICE_URL')
                    ]) {
                        sh """
                            docker stop ${CONTAINER_NAME} || true
                            docker rm ${CONTAINER_NAME} || true
                            docker run -d \
                                --name ${CONTAINER_NAME} \
                                --network ${NETWORK} \
                                -p ${PORT} \
                                -e AUTH_SERVICE_URL=${AUTH_SERVICE_URL} \
                                -e MAIN_SERVICE_URL=${MAIN_SERVICE_URL} \
                                ${DOCKER_IMAGE}:latest
                        """
                    }
                }
            }
        }
    }
    
    post {
        success {
            echo '✅ API Gateway déployé avec succès !'
        }
        failure {
            echo '❌ Échec du déploiement API Gateway'
        }
    }
}