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
                echo 'Checking out code from github'
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
            string(credentialsId: 'aws-access-key-id', variable: 'AWS_ACCESS_KEY_ID'),
            string(credentialsId: 'aws-secret-access-key', variable: 'AWS_SECRET_ACCESS_KEY')
        ]) {

            sh '''
                export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
                export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY
                export AWS_DEFAULT_REGION=${AWS_REGION}

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
}

        stage('verify deployment') {
            steps {
                echo 'Verifying deployment'
                sh '''
                    kubectl rollout status deployment realtalk-backend
                    kubectl rollout status deployment realtalk-frontend
                    echo "---"
                    kubectl get pods
                    echo "---"
                    kubectl get services
                    echo "---"
                    kubectl get ingress
                '''
            }
        }
    }

    post {
        success {
            echo '''
              pipeline SUCCESS!!!
            --------
            RealTalk deployed on EKS!
            --------
            '''
        }
        failure {
            echo 'pipeline FAILED! Check logs above.'
        }
        always {
            echo 'cleaning up unused docker images...'
            sh 'docker image prune -f || true'
        }
    }
}
