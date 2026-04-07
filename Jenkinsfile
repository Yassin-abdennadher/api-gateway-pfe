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
        
        stage('Deploy') {
            steps {
                sh '''
                    # Supprimer l'ancien
                    docker rm -f api-gateway 2>/dev/null || true
                    
                    # Trouver le réseau existant
                    NETWORK=$(docker inspect auth-service | grep -o "gmao-network" | head -1)
                    if [ -z "$NETWORK" ]; then
                        NETWORK="gmao-network"
                    fi
                    
                    # Lancer sur le même réseau
                    docker run -d \
                        --name api-gateway \
                        --network $NETWORK \
                        -p 8000:8000 \
                        -e AUTH_SERVICE_URL=http://auth-service:4001 \
                        -e MAIN_SERVICE_URL=http://main-service:4002 \
                        -e NOTIFICATIONS_SERVICE_URL=http://notifications-service:4003 \
                        api-gateway:latest
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