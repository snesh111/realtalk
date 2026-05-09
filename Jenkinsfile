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

        stage('checkout') {
            steps {
                echo 'checking out code from github'
                checkout scm
            }
        }

        stage('build backend image') {
            steps {
                echo 'building backend docker image'
                dir('backend') {
                    sh 'docker build -t ${BACKEND_IMAGE}:latest .'
                    sh 'docker tag ${BACKEND_IMAGE}:latest ${BACKEND_IMAGE}:${BUILD_NUMBER}'
                }
            }
        }

        stage('build frontend image') {
            steps {
                echo 'building frontend docker image'
                dir('frontend') {
                    sh 'docker build -t ${FRONTEND_IMAGE}:latest .'
                    sh 'docker tag ${FRONTEND_IMAGE}:latest ${FRONTEND_IMAGE}:${BUILD_NUMBER}'
                }
            }
        }

        stage('push to docker hub') {
            steps {
                echo 'pushing images to docker hub'
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

        stage('deploy to EKS') {
    steps {
        echo 'deploying to AWS EKS'

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

                kubectl get namespace ingress-nginx || \
                kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/aws/deploy.yaml        
                kubectl wait \
                --namespace ingress-nginx \
                --for=condition=ready pod \
                --selector=app.kubernetes.io/component=controller \
                --timeout=300s


                SECRET_JSON=$(aws secretsmanager get-secret-value \
                  --secret-id realtalk-prod \
                  --region ${AWS_REGION} \
                  --query SecretString \
                  --output text)


                MONGO_URI=$(echo $SECRET_JSON | jq -r .MONGO_URI)
                JWT_SECRET=$(echo $SECRET_JSON | jq -r .JWT_SECRET)
                CLOUDINARY_CLOUD_NAME=$(echo $SECRET_JSON | jq -r .CLOUDINARY_CLOUD_NAME)
                CLOUDINARY_API_KEY=$(echo $SECRET_JSON | jq -r .CLOUDINARY_API_KEY)
                CLOUDINARY_API_SECRET=$(echo $SECRET_JSON | jq -r .CLOUDINARY_API_SECRET)


                kubectl create secret generic realtalk-secrets \
                  --from-literal=MONGO_URI="$MONGO_URI" \
                  --from-literal=JWT_SECRET="$JWT_SECRET" \
                  --from-literal=CLOUDINARY_CLOUD_NAME="$CLOUDINARY_CLOUD_NAME" \
                  --from-literal=CLOUDINARY_API_KEY="$CLOUDINARY_API_KEY" \
                  --from-literal=CLOUDINARY_API_SECRET="$CLOUDINARY_API_SECRET" \
                  --dry-run=client -o yaml | kubectl apply -f -


                kubectl apply -f ${WORKSPACE}/kubernetes/backend-deployment.yaml
                kubectl apply -f ${WORKSPACE}/kubernetes/frontend-deployment.yaml
                kubectl apply -f ${WORKSPACE}/kubernetes/ingress.yaml


                kubectl rollout restart deployment realtalk-backend
                kubectl rollout restart deployment realtalk-frontend
            '''
        }
    }
}
        stage('verify deployment') {
            steps {
                echo 'Verifying deployment'
                sh '''
                    kubectl rollout status deployment realtalk-backend --timeout=300s
                    kubectl rollout status deployment realtalk-frontend --timeout=300s
                    echo "-----"
                    kubectl get pods
                    echo "-----"
                    kubectl get services
                    echo "-----"
                    kubectl get ingress
                '''
            }
        }
    }

    post {
        success {
            echo 'pipeline SUCCESS! deploed on EKS'
        }
        failure {
            echo 'pipeline FAILED!'
        }
        always {
            echo 'Cleaning up unused Docker images...'
            sh 'docker image prune -f || true'
        }
    }
}
