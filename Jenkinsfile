pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = "snesh111"
        BACKEND_IMAGE   = "snesh111/real_talk-backend"
        FRONTEND_IMAGE  = "snesh111/real_talk-frontend"
        CLUSTER_NAME    = "realtalk-cluster"
        AWS_REGION      = "ap-south-1"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out code from GitHub'
                checkout scm
            }
        }

        stage('Build Backend Image') {
            steps {
                echo 'Building backend Docker image'
                dir('backend') {
                    sh 'docker build -t ${BACKEND_IMAGE}:latest .'
                    sh 'docker tag ${BACKEND_IMAGE}:latest ${BACKEND_IMAGE}:${BUILD_NUMBER}'
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                echo 'Building frontend Docker image'
                dir('frontend') {
                    sh 'docker build -t ${FRONTEND_IMAGE}:latest .'
                    sh 'docker tag ${FRONTEND_IMAGE}:latest ${FRONTEND_IMAGE}:${BUILD_NUMBER}'
                }
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing images to Docker Hub'
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                        echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                        docker push ${BACKEND_IMAGE}:latest
                        docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}
                        docker push ${FRONTEND_IMAGE}:latest
                        docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}
                        docker logout
                    '''
                }
            }
        }

        stage('Deploy to EKS') {
            steps {
                echo 'Deploying to AWS EKS'
                sh '''
                    aws eks update-kubeconfig \
                        --region ${AWS_REGION} \
                        --name ${CLUSTER_NAME}

                    kubectl apply -f kubernetes/backend-deployment.yaml
                    kubectl apply -f kubernetes/frontend-deployment.yaml
                    kubectl apply -f kubernetes/ingress.yaml

                    kubectl rollout restart deployment realtalk-backend
                    kubectl rollout restart deployment realtalk-frontend
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Verifying deployment'
                sh '''
                    kubectl rollout status deployment realtalk-backend
                    kubectl rollout status deployment realtalk-frontend
                    echo "━━━━━━━━━━━━━━━━━━━━━━━━"
                    kubectl get pods
                    echo "━━━━━━━━━━━━━━━━━━━━━━━━"
                    kubectl get services
                    echo "━━━━━━━━━━━━━━━━━━━━━━━━"
                    kubectl get ingress
                '''
            }
        }
    }

    post {
        success {
            echo '🎉 Pipeline SUCCESS! RealTalk deployed on EKS!'
        }
        failure {
            echo '❌ Pipeline FAILED! Check logs above.'
        }
        always {
            echo 'Cleaning up unused Docker images...'
            sh 'docker image prune -f || true'
        }
    }
}
