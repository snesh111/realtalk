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
                withCredentials([
                    string(credentialsId: 'aws-access-key-id',
                           variable: 'AWS_ACCESS_KEY_ID'),
                    string(credentialsId: 'aws-secret-access-key',
                           variable: 'AWS_SECRET_ACCESS_KEY')
                ]) {
                    sh '''
                        export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
                        export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
                        export AWS_DEFAULT_REGION=${AWS_REGION}

                        aws eks update-kubeconfig \
                            --region ${AWS_REGION} \
                            --name ${CLUSTER_NAME}

                        # Install Ingress Controller if not exists
                        kubectl get namespace ingress-nginx || \
                        kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/aws/deploy.yaml

                        # Create secrets if not exists
                        kubectl get secret realtalk-secrets || \
                        kubectl create secret generic realtalk-secrets \
                            --from-literal=MONGO_URI="${MONGO_URI}" \
                            --from-literal=JWT_SECRET="${JWT_SECRET}" \
                            --from-literal=CLOUDINARY_CLOUD_NAME="${CLOUDINARY_CLOUD_NAME}" \
                            --from-literal=CLOUDINARY_API_KEY="${CLOUDINARY_API_KEY}" \
                            --from-literal=CLOUDINARY_API_SECRET="${CLOUDINARY_API_SECRET}"

                        kubectl apply -f ${WORKSPACE}/kubernetes/backend-deployment.yaml
                        kubectl apply -f ${WORKSPACE}/kubernetes/frontend-deployment.yaml
                        kubectl apply -f ${WORKSPACE}/kubernetes/ingress.yaml

                        kubectl rollout restart deployment realtalk-backend
                        kubectl rollout restart deployment realtalk-frontend
                    '''
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                echo 'Verifying deployment'
                sh '''
                    kubectl rollout status deployment realtalk-backend --timeout=300s
                    kubectl rollout status deployment realtalk-frontend --timeout=300s
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
