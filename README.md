# 🎧 SurroundYou - Cloud-Native 8D Audio Processing Platform

> Enterprise-grade serverless audio processing pipeline leveraging AWS-managed services for scalable, event-driven 8D audio transformation.

[![AWS](https://img.shields.io/badge/AWS-Fargate%20%7C%20Lambda%20%7C%20S3-FF9900?style=for-the-badge&logo=amazon-aws)](https://aws.amazon.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?style=for-the-badge&logo=docker)](https://www.docker.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python)](https://www.python.org/)

**[🚀 Live Demo](https://main.d3pqqc4w1tm533.amplifyapp.com/)** | **[📝 My LinkedIn Post (The Full Story)](https://www.linkedin.com/posts/xadi_aws-cloudcomputing-serverless-activity-7388656205344391168-vEMi)**

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Visual Walkthrough](#-visual-walkthrough)
- [Architecture & System Design](#-architecture--system-design)
- [Technology Stack](#-technology-stack)
- [Technical Challenges](#-technical-challenges--solutions)
- [Performance & Cost Metrics](#-performance--cost-metrics)
- [Key Learnings](#-key-learnings)
- [Contact](#-connect-with-me)

---

## 🎯 Overview

SurroundYou is a production-ready, cloud-native audio processing platform that transforms stereo audio into immersive 8D spatial audio experiences. This project demonstrates advanced cloud architecture patterns, containerization strategies, and distributed systems design principles.

### Business Value
- **Cost-Efficient:** Under **$1 per 1,000 conversions** with AWS serverless architecture.
- **Scalable:** Auto-scales from zero to hundreds of concurrent processing tasks.
- **Reliable:** Decoupled event-driven design ensures fault tolerance.
- **Secure:** Pre-signed URLs for uploads/downloads, IAM-enforced least-privilege access, and encrypted storage.

### Technical Highlights
- Fully containerized processing pipeline on **AWS Fargate**.
- Event-driven architecture with **Amazon EventBridge**.
- Secure "gatekeeper" API using **API Gateway** and **Lambda**.
- Direct browser-to-S3 uploads (no server bottleneck).

---

## 📸 Visual Walkthrough

Here is the simple, 3-step user flow for the application.

<table>
  <tr>
    <td align="center"><strong>1. Upload File</strong><br/>The user selects an MP3 file. The UI shows the file is ready for processing.</td>
    <td align="center"><strong>2. Processing</strong><br/>The file is uploaded and the backend pipeline is triggered. The UI polls for status.</td>
    <td align="center"><strong>3. Download Result</strong><br/>The Fargate task completes, and the UI displays the final download link.</td>
  </tr>
  <tr>
    <td><img src="https://placehold.co/600x400/2d3748/e2e8f0?text=Your+Upload+UI+Screenshot" alt="Upload UI"></td>
    <td><img src="https://placehold.co/600x400/2d3748/e2e8f0?text=Processing+Screenshot" alt="Processing UI"></td>
    <td><img src="https://placehold.co/600x400/2d3748/e2e8f0?text=Download+Link+Screenshot" alt="Download UI"></td>
  </tr>
</table>

**ACTION:** Replace the `https://placehold.co` links above with screenshots from your own project.

---

## 🏗️ Architecture & System Design

### High-Level Architecture

The platform implements a **loosely-coupled, event-driven architecture** optimized for scalability and cost efficiency. The "gatekeeper" API (API Gateway + Lambda) handles user interaction, while the "processing" pipeline (S3 -> EventBridge -> Fargate) runs asynchronously.

```mermaid
graph TD
    subgraph "User Application (React)"
        A[Users] -- "Interacts with" --> B(AWS Amplify Frontend)
    end

    subgraph "Gatekeeper API (Amplify)"
        B -- "1. POST /presigned-url (action: getUploadUrl)" --> C[Amazon API Gateway]
        C -- "2. Triggers" --> D[AWS Lambda Function]
        D -- "3. Generates URL" --> F[(Amazon S3 Bucket)]
        D -- "4. Returns Secure URL" --> B
        B -- "5. PUT file to Secure URL" --> F
    end

    subgraph "Asynchronous Processing Pipeline (Custom AWS)"
        F -- "6. 'Object Created' Event" --> G[Amazon EventBridge]
        G -- "7. Invokes Task" --> H[Amazon ECS on AWS Fargate]
        I[Amazon ECR] -- "8. Pulls Container Image" --> H
        H -- "9. Processes Audio" --> F
    end

    subgraph "Polling & Download Flow"
        B -- "10. Polls (action: getDownloadUrl)" --> C
        C -- "11. Triggers" --> D
        D -- "12. Checks S3 for file" --> F
        D -- "13. Returns Download URL (if ready)" --> B
    end

    style F fill:#FF9900,stroke:#333
    style H fill:#2A4959,stroke:#fff,color:#fff
    style G fill:#D92228,color:#fff
    style D fill:#FF9900,stroke:#333
    style C fill:#9C4F96,color:#fff
    style B fill:#61DAFB,color:#000
````

### Component Breakdown

#### 1\. **Frontend Layer** (React + Amplify)

  - Single-page application built with React and Vite.
  - Direct-to-S3 uploads via pre-signed URLs to prevent server bottlenecks.
  - Asynchronous polling mechanism using `setInterval` to check for processed file status.

#### 2\. **API Gateway Layer** (Lambda "Gatekeeper")

  - **`getUploadUrl`:** Called by the frontend to get a secure, time-limited S3 pre-signed URL for uploading a file.
  - **`getDownloadUrl`:** Polled by the frontend. This function checks S3 for the processed file.
      - If the file exists, it returns a 200 OK with a pre-signed download URL.
      - If the file doesn't exist, it returns a 404 Not Found, which the frontend interprets as "still processing."

#### 3\. **Event Processing Layer** (EventBridge)

  - Captures S3 `ObjectCreated` events in real-time.
  - Routes events to the Fargate compute target.
  - Uses an **Input Transformer** to pass a clean JSON payload (bucket name, file key) to the Fargate task.
  - A **Dead-Letter Queue (DLQ)** in SQS is configured to capture and debug any failed event invocations.

#### 4\. **Compute Layer** (AWS Fargate on ECS)

  - **Serverless Containers:** No EC2 instance management. Tasks spin up from zero only when triggered.
  - **Dockerized Python App:** The processing logic is containerized with Docker, ensuring a consistent runtime.
  - **Task Definition:** Specifies 1 vCPU and 2GB of memory, which is ideal for this workload.
  - **Scalability:** The system will launch a new, independent Fargate task for *every single file* uploaded, allowing for massive parallel processing.

#### 5\. **Processing Pipeline** (Dockerized Python App)

  - **Core Dependencies:** `boto3`, `numpy`, `pydub`, `pedalboard`.
  - **Processing Steps:**
    1.  Downloads the source MP3 from S3 using the environment variables passed by EventBridge.
    2.  Loads the audio with `pydub` and converts it to a NumPy array.
    3.  Applies advanced spatial panning (panning modulation) and effects using `pedalboard` (Reverb, Gain, Limiter).
    4.  Mixes the dry (panned) and wet (effects) signals.
    5.  Exports the final file to MP3 format.
    6.  Uploads the processed file to the `processed/` prefix in the S3 bucket.

#### 6\. **Observability** (CloudWatch)

  - All Fargate task output (`stdout`, `stderr`) is streamed to CloudWatch Logs.
  - All Lambda function logs are available in CloudWatch.
  - EventBridge invocation metrics are used to monitor the pipeline's health.

-----

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework with hooks and context |
| **Vite** | Lightning-fast build tool and HMR dev server |
| **Tailwind CSS** | Utility-first styling framework |
| **AWS Amplify** | Frontend deployment, API integration, hosting |

### Backend - API Layer

| Technology | Purpose |
|------------|---------|
| **AWS Lambda** | Serverless API handlers (Python 3.12 runtime) |
| **Amazon API Gateway** | RESTful API management and throttling |
| **AWS Amplify** | Infrastructure provisioning and CI/CD |

### Backend - Processing Pipeline

| Technology | Purpose |
|------------|---------|
| **Docker** | Container packaging and portability |
| **Amazon ECR** | Private container registry |
| **Amazon ECS** | Container orchestration |
| **AWS Fargate** | Serverless container compute |
| **Python 3.12** | Core processing logic |

\<details\>
\<summary\>\<strong\>📦 Python Dependencies (requirements.txt)\</strong\>\</summary\>

```
boto3
numpy
pydub
pedalboard
```

\</details\>

### Infrastructure & Security

| Technology | Purpose |
|------------|---------|
| **Amazon S3** | Object storage with encryption and CORS policy |
| **Amazon EventBridge** | Event bus and routing (with DLQ for debugging) |
| **AWS IAM** | Fine-grained access control (Task Roles, Execution Roles, etc.) |
| **Amazon CloudWatch** | Logging, metrics, and alarms |

\<details\>
\<summary\>\<strong\>⚙️ View Amplify Build Configuration (amplify.yml)\</strong\>\</summary\>

This configuration was the solution to a complex build failure, forcing the Amplify build environment to use a specific Python 3.12 version.

```yaml
version: 1
backend:
  runtime-versions:
    nodejs: 18
    python: 3.12
  phases:
    build:
      commands:
        - '# Execute Amplify CLI with the helper script'
        - amplifyPush --simple
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

\</details\>

-----

## 🔥 Technical Challenges & Solutions

### Challenge \#1: Lambda Deployment Size Constraints

**Problem:** Initial Lambda-based design exceeded 250MB uncompressed limit due to scientific libraries (`numpy`, `pydub`, `pedalboard`, and `ffmpeg`).

**Solution:** Pivoted the entire architecture. I kept Lambda as a lightweight "gatekeeper" for handling API requests and migrated the heavy processing logic to a **Docker container run on AWS Fargate**, which has a 10GB image limit.

**Impact:** Enabled use of full-featured audio processing libraries without compromises and created a more robust, scalable solution.

-----

### Challenge \#2: Silent Event Processing Failures

**Problem:** My Fargate task wasn't launching. EventBridge metrics showed `FailedInvocations` but no CloudWatch logs were generated. The system was failing silently.

**Solution:**

1.  **Configured a Dead-Letter Queue (DLQ)** on the EventBridge rule, which sent the failed event payloads to an SQS queue.
2.  Inspecting the DLQ messages revealed the true error: `iam:PassRole` permission was missing.
3.  **Fixed** by adding `iam:PassRole` for both the `TaskRoleArn` and `ExecutionRoleArn` to the EventBridge rule's IAM role.

**Impact:** Gained critical visibility into the distributed system and learned to debug asynchronous flows.

-----

### Challenge \#3: S3 CORS Policy Failure

**Problem:** The browser-based `axios` upload to the pre-signed S3 URL was blocked by a CORS policy, even with `AllowedOrigins: ["*"]`.

**Solution:** The wildcard `*` does not work for credentialed requests (which pre-signed URLs are). The fix was to explicitly specify the origin in the S3 bucket's CORS policy:

```json
"AllowedOrigins": [
    "http://localhost:5173",
    "[https://main.d3pqqc4w1tm533.amplifyapp.com](https://main.d3pqqc4w1tm533.amplifyapp.com)"
]
```

**Impact:** Solved the final, most common bug in direct-to-S3 upload architectures.

-----

### Challenge \#4: Amplify Build Environment Conflicts

**Problem:** The Amplify backend build kept failing, unable to find the correct Python 3.12 runtime (`pipenv` errors).

**Solution:** After trying multiple fixes, the most robust solution was to edit the `amplify.yml` build spec and explicitly set the runtime versions for the build container, forcing it to use the correct environment.

```yaml
backend:
  runtime-versions:
    nodejs: 18
    python: 3.12
```

**Impact:** A stable, reproducible build process and a deep understanding of how Amplify's CI/CD environment works.

-----

## 📊 Performance & Cost Metrics

| Metric | Value |
|--------|-------|
| **Average Processing Time** | 20-40 seconds per 5min MP3 |
| **Task CPU / Memory** | 1 vCPU / 2 GB |
| **Total Cost** | **\~$0.98 per 1,000 conversions** |

**Cost Insight:** The architecture is extremely cost-effective. Even outside the AWS Free Tier, processing 1,000 files costs less than $1.00.

-----

## 🎓 Key Learnings

  - **Choose the Right Tool:** Lambda is for fast, lightweight tasks; Fargate is for heavy, long-running processes. Knowing the difference is key.
  - **Debug Asynchronously:** You can't debug a distributed system by looking at one log. The `FailedInvocations` metric on EventBridge and a DLQ are your most important tools.
  - **IAM is Everything:** 90% of cloud errors are permission errors. Understanding Task Roles, Execution Roles, and `iam:PassRole` is non-negotiable.
  - **Never Trust a Wildcard:** Always be explicit with CORS policies (`AllowedOrigins`) and IAM policies.
  - **The Story is the Project:** The real "project" wasn't the final code; it was the journey of debugging and re-architecting from a failed Lambda to a working Fargate pipeline.

-----

## 📧 Connect With Me

**Aditya Waghmare**  
Cloud & DevOps Engineer | Building Production-Ready Cloud Systems

[](https://www.linkedin.com/in/xadi)
[](mailto:adityawaghmarex@gmail.com)

-----

\<div align="center"\>

**Built with ☕, lots of CloudWatch logs, and a passion for scalable systems.**

*"I'm a crazy music listener and I wasn't satisfied with the 8D tools out there, so I built my own."*

\</div\>

```
```
