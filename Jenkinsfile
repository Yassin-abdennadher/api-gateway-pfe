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
                checkout scm
            }
        }
        
        stage('Setup') {
            steps {
                sh '''
                    # Installer Docker CLI
                    apt-get update
                    apt-get install -y wget
                    wget https://download.docker.com/linux/static/stable/x86_64/docker-26.1.4.tgz
                    tar xzvf docker-26.1.4.tgz
                    cp docker/docker /usr/local/bin/
                    chmod +x /usr/local/bin/docker
                    
                    # Installer Node.js
                    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
                    apt-get install -y nodejs
                    
                    # Vérifier
                    /usr/local/bin/docker --version
                    node --version
                '''
            }
        }
        
        stage('Install & Build') {
            steps {
                sh '''
                    npm install
                    npm run build
                '''
            }
        }
        
        stage('Docker Build') {
            steps {
                sh '/usr/local/bin/docker build -t api-gateway:latest .'
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
                            /usr/local/bin/docker stop ${CONTAINER_NAME} || true
                            /usr/local/bin/docker rm ${CONTAINER_NAME} || true
                            /usr/local/bin/docker run -d \
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