pipeline {
    agent any
    
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
                    wget -q https://download.docker.com/linux/static/stable/x86_64/docker-26.1.4.tgz
                    tar xzf docker-26.1.4.tgz
                    cp docker/docker /usr/local/bin/
                    chmod +x /usr/local/bin/docker
                    
                    # Installer docker-compose
                    wget -q "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -O /usr/local/bin/docker-compose
                    chmod +x /usr/local/bin/docker-compose
                    
                    # Installer Node.js
                    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
                    apt-get install -y nodejs
                '''
            }
        }
        
        stage('Build API Gateway') {
            steps {
                sh '''
                    cd /workspace/api-gateway
                    npm install
                    npm run build
                '''
            }
        }
        
        stage('Deploy with Compose') {
            steps {
                sh '''
                    cd /workspace
                    /usr/local/bin/docker-compose up -d api-gateway
                '''
            }
        }
    }
    
    post {
        success {
            echo '✅ API Gateway déployé avec succès !'
        }
        failure {
            echo '❌ Échec du déploiement'
        }
    }
}