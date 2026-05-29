# 🚀 RealTalk - Cloud Native Social Media Platform

A production-style social media platform built using modern DevOps and Cloud Native technologies. RealTalk demonstrates end-to-end application deployment on AWS EKS using Infrastructure as Code, CI/CD automation, containerization, Kubernetes orchestration, secrets management, and monitoring.

---

## 📌 Project Overview

RealTalk is a full-stack social media application consisting of:

* React Frontend
* Node.js Backend
* MongoDB Atlas Database
* Cloudinary Image Storage

The platform is deployed on AWS Elastic Kubernetes Service (EKS) and automated through a Jenkins CI/CD pipeline.

---

# 🏗️ Architecture

## High-Level Flow

Developer
    │
    ▼
GitHub Repository
    │
    ▼ (Webhook Trigger)
Jenkins CI/CD Pipeline
    │
    ├── Build Backend Docker Image
    ├── Build Frontend Docker Image
    ├── Push Images to Docker Hub
    └── Deploy to AWS EKS
                │
                ▼
         AWS Load Balancer
                │
                ▼
      NGINX Ingress Controller
                │
                ▼
         Frontend Service
                │
                ▼
          Frontend Pod
                │
                ▼
          Backend Service
                │
                ▼
           Backend Pod
           │         │
           ▼         ▼
 MongoDB Atlas   Cloudinary

---

# 🛠️ Technology Stack

## Frontend

* React.js
* Axios
* Nginx

## Backend

* Node.js
* Express.js
* JWT Authentication

## Database

* MongoDB Atlas

## Media Storage

* Cloudinary

## DevOps

* Docker
* Kubernetes
* AWS EKS
* Jenkins
* Terraform
* GitHub Webhooks

## Monitoring

* Prometheus
* Grafana

## Cloud Services

* AWS VPC
* AWS EKS
* AWS Secrets Manager
* AWS Load Balancer

---

# ☁️ AWS Infrastructure

Region:

ap-south-1 (Mumbai)

Provisioned using Terraform.

## Networking

### VPC

10.0.0.0/16

### Public Subnets

ap-south-1a
ap-south-1b

### Private Subnets

Private Subnet 1
Private Subnet 2

### Additional Components

* Internet Gateway
* Route Tables
* Security Groups

---

# ☸️ Kubernetes Architecture

## Cluster

realtalk-cluster

## Worker Nodes

2 x t3.medium

## Components

### NGINX Ingress Controller

Handles external traffic routing and exposes the application through AWS Load Balancer.

### Frontend

React + Nginx
Port: 80

### Backend

Node.js + Express
Port: 5000

### Services

* Frontend Service
* Backend Service

### Ingress

* Path-based Routing
* External Access
* SSL Ready

---

# 🔐 Secrets Management

Application secrets are securely stored using AWS Secrets Manager.

## Secret Name

realtalk-prod

## Stored Secrets

MONGO_URI
JWT_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET

Secrets are injected into Kubernetes workloads through Kubernetes Secrets.

---

# 🔄 CI/CD Pipeline

Jenkins automates the entire deployment process.

## Stage 1 – Source Checkout

Pull latest source code from GitHub.

git clone <repository>

---

## Stage 2 – Build Backend Image

docker build -t snesh111/real_talk-backend ./backend

---

## Stage 3 – Build Frontend Image

docker build -t snesh111/real_talk-frontend ./frontend

---

## Stage 4 – Push Images to Docker Hub

docker push snesh111/real_talk-backend
docker push snesh111/real_talk-frontend


---

## Stage 5 – Deploy to Kubernetes

kubectl apply -f kubernetes/backend-deployment.yaml

kubectl apply -f kubernetes/frontend-deployment.yaml

kubectl apply -f kubernetes/backend-service.yaml

kubectl apply -f kubernetes/frontend-service.yaml

kubectl apply -f kubernetes/ingress.yaml

---

## Stage 6 – Verify Deployment

kubectl get pods

kubectl get services

kubectl get ingress

kubectl get service -n ingress-nginx

---

# 📂 Project Structure

RealTalk
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── config/
│   ├── Dockerfile
│   └── package.json
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   └── package.json
│
├── kubernetes/
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   └── ingress.yaml
│
├── terraform/
│   ├── vpc/
│   ├── eks/
│   └── networking/
│
├── Jenkinsfile
│
└── README.md

---

# 🌐 Deployment Flow

Internet Users
        │
        ▼
AWS Load Balancer
        │
        ▼
NGINX Ingress Controller
        │
        ▼
Frontend Service
        │
        ▼
Frontend Pod
        │
        ▼
Backend Service
        │
        ▼
Backend Pod
      /     \
     /       \
MongoDB    Cloudinary
 Atlas

---

# 📊 Monitoring & Observability

## Prometheus

Collects:

* Kubernetes Metrics
* Node Metrics
* Pod Metrics
* Application Metrics

## Grafana

Visualizes:

* CPU Utilization
* Memory Usage
* Pod Health
* Cluster Performance
* Request Metrics

---

# 🚀 Key Features

* Full-Stack Social Media Application
* Containerized Microservices Architecture
* Automated CI/CD Pipeline
* Infrastructure as Code with Terraform
* Kubernetes Deployment on AWS EKS
* NGINX Ingress Controller
* AWS Load Balancer Integration
* Secure Secrets Management
* MongoDB Atlas Integration
* Cloudinary Media Storage
* Monitoring with Prometheus & Grafana

---

# 📈 Future Enhancements

* ArgoCD GitOps Deployment
* Horizontal Pod Autoscaler (HPA)
* Blue-Green Deployments
* Canary Releases
* AWS ECR Integration
* ELK Stack Logging
* AWS CloudWatch Dashboards

---

