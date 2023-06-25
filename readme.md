
## Run Cost Efficient Workloads on EKS with Karpenter
This package provides supporting material for 'Run Cost Efficient Workloads on EKS with Karpenter' topic presented during below event: 
- Event: Dev Day - Bangalore
- Date: 16-May-2023
- Presented By: Deepesh Dhapola

## Pre-requisites
- Docker and buildx
- EKS Cluster
- Kubectl
- K6
- Metrics Server
- AWS CLI
- eks-node-viewer

Note: Set AWS CLI environment variables including region. If region environment variable is not set then eks-node-viewer won't be able to pull EC2 pricing information.

## Commands Used


### Build multi-arch container images and push to ECR

Dockerfile:
````
ARG ARCH=
FROM ${ARCH}amazoncorretto AS build
RUN yum -y update
VOLUME /tmp
COPY /webapi-ws.jar webapi-ws.jar
COPY /template.html template.html
ENTRYPOINT ["java", "-jar","/webapi-ws.jar"]
````

Build command:
````
docker buildx build \
--platform "linux/arm64/v8,linux/amd64" \
--tag "replace-with-image-tag" . \
--push
````

inspect images
````
docker buildx imagetools inspect <image path with tag>
````

apply provisioner

````
kubectl apply -f ./karpenter/karpenter-provisioner.yaml
````

Deploy app with HPA
````
kubectl apply -f app.yaml
````

run load
````
k6 run k6.js
````

view nodes
````
eks-node-viewer --resources cpu,memory --extra-labels "topology.kubernetes.io/zone,kubernetes.io/arch,eks-node-viewer/node-age"
````



