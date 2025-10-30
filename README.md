# 🎧 SurroundYou - Cloud-Native 8D Audio Converter

> A serverless, event-driven audio processing pipeline that transforms stereo audio into immersive 8D experiences—built entirely on AWS.

[![AWS](https://img.shields.io/badge/AWS-Fargate%20%7C%20Lambda%20%7C%20S3-orange)](https://aws.amazon.com/)
[![Docker](https://img.shields.io/badge/Docker-Containerized-blue)](https://www.docker.com/)
[![React](https://img.shields.io/badge/React-Vite-61DAFB)](https://reactjs.org/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB)](https://www.python.org/)

**[🚀 Live Demo](https://main.d3pqqc4w1tm533.amplifyapp.com/)** | **[📝 Read the Build Story](https://www.linkedin.com/posts/xadi_aws-cloudcomputing-serverless-activity-7388656205344391168-vEMi?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEYGzLYBBfd1jEVjlsJ8g02hw5MxiYzVAZE)**

---

## 🎯 What is SurroundYou?

SurroundYou converts standard stereo audio files into an immersive 8D audio experience—where sound appears to move in a 360-degree sphere around your head. 

But more importantly, **this project is a demonstration of building robust, scalable, event-driven data processing pipelines on AWS.**

---

## 🚀 The "Why": A Journey from Simple to Scalable

This project started with a simple goal: use a Python script and an AWS Lambda function to process audio.

**The Problem:** Lambda has a 250MB deployment package limit. My scientific computing libraries (`numpy`, `scipy`, `ffmpeg`) were too large.

**The Pivot:** Complete re-architecture from a simple Lambda function to a container-based workflow using AWS Fargate.

What followed was a real-world education in distributed systems:
- Debugging IAM permission chains
- Configuring cross-service network policies
- A multi-day battle with Amplify build environments
- Learning when to pivot vs. when to push through

**This project showcases not just the final product, but the critical engineering process of identifying bottlenecks and choosing the right tool for the job.**

---

## ⚙️ Architecture & System Design

The application uses a **decoupled, event-driven architecture** to process audio files asynchronously.

[Architecture Diagram](https://lucid.app/lucidchart/5b01e82b-cbf1-42ae-a722-8bcdffeeb5cb/edit?viewport_loc=-718%2C-178%2C2860%2C1175%2C0_0&invitationId=inv_9a3b2110-38a5-4215-806b-d29cf94e9360)

### The Workflow

**1. Frontend (React/Amplify)**  
User selects an MP3 file. Frontend calls a secure "gatekeeper" API to get a pre-signed S3 URL.

**2. API Gateway + Lambda**  
A simple API, managed by Amplify, generates the secure, temporary upload URL.

**3. Amazon S3**  
User's browser uploads the file directly to S3 (no server middleman).

**4. Amazon EventBridge**  
S3 `Object Created` event triggers an EventBridge rule.

**5. AWS Fargate (on ECS)**  
EventBridge launches a serverless Fargate task. Task definition pulls Docker container from Amazon ECR.

**6. Containerized Python App**  
Docker container runs Python script that:
- Downloads the audio from S3
- Performs 8D conversion using `numpy` and `scipy`
- Uploads processed file back to S3 `processed/` folder

**7. Frontend Polling**  
React app periodically checks if processed file exists. Once ready, API provides secure download link.

---

## 🛠️ Technology Stack

### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **AWS Amplify (V6)** - Frontend configuration and API calls

### Backend - API Gateway ("Gatekeeper")
- **AWS Amplify** - Hosting and deployment
- **Amazon API Gateway** - REST API
- **AWS Lambda (Python 3.12)** - Pre-signed URL generation

### Backend - Processing Pipeline
- **Docker** - Containerized Python application
- **Amazon ECR** - Private container registry
- **Amazon ECS on AWS Fargate** - Serverless container compute
- **Amazon EventBridge** - Event bus for triggering tasks
- **Amazon S3** - File storage (uploads + processed results)
- **Python 3.12** - Audio processing with NumPy, SciPy, pydub

### Infrastructure & Permissions
- **AWS IAM** - Service-to-service permissions (Task Roles, Execution Roles)
- **Amazon CloudWatch** - Logging and debugging

---

## 🔥 Key Technical Challenges Solved

### Challenge #1: Lambda's 250MB Limit
**Problem:** Scientific computing libraries exceeded Lambda's deployment size.  
**Solution:** Migrated to containerized processing on AWS Fargate—no size limits, still serverless.

### Challenge #2: IAM Permission Chains
**Problem:** EventBridge couldn't launch Fargate tasks, tasks couldn't pull from ECR, Lambda couldn't access S3.  
**Solution:** Correctly configured Task Roles vs. Execution Roles, and the critical `iam:PassRole` permission.

### Challenge #3: Cross-Platform Docker Builds
**Problem:** Built Docker image on Windows → deployed to Linux Fargate → runtime failures.  
**Solution:** Used `docker build --platform linux/amd64` for Linux compatibility.

### Challenge #4: Silent Failures
**Problem:** Fargate tasks weren't launching with no error logs.  
**Solution:** Configured Dead-Letter Queues (DLQs) on EventBridge to catch and surface failed events.

### Challenge #5: Amplify Build Environment
**Problem:** API deployment failed due to Amazon Linux version mismatches and Python runtime conflicts.  
**Solution:** Explicit build image specification in `amplify.yml` configuration.

---

## 📊 System Metrics

- **Processing Time:** 30-60 seconds per audio file
- **Scalability:** Auto-scales with demand via Fargate
- **AWS Services:** 8 (Lambda, Fargate, ECS, ECR, S3, EventBridge, CloudWatch, Amplify)
- **Cost:** ~$0.05 per conversion (varies by region)

---

## 🧠 What I Learned

### Technical Skills
- **Event-driven architecture:** Decoupling services for scalability
- **Container orchestration:** ECS task definitions, Fargate networking
- **IAM security models:** Task vs. Execution roles, service-linked roles
- **Serverless patterns:** When to use Lambda vs. Fargate
- **Cross-platform development:** Docker platform compatibility

### Engineering Lessons
- **When to pivot:** Recognizing architectural limitations early
- **Debugging distributed systems:** Using DLQs when logs aren't available
- **Infrastructure matters:** Manual console work doesn't scale
- **Real-world complexity:** Production systems have layers tutorials don't show

---

## 🚧 Future Enhancements

- [ ] **Infrastructure as Code** - Migrate to AWS CDK or Terraform
- [ ] **Real-time status updates** - WebSocket notifications instead of polling
- [ ] **Batch processing** - Process multiple files in parallel
- [ ] **Monitoring dashboard** - CloudWatch metrics and alarms
- [ ] **User authentication** - AWS Cognito integration
- [ ] **Additional formats** - Support WAV, FLAC, AAC
- [ ] **Cost optimization** - Spot instances for Fargate tasks

---

## 🎓 Why This Project Matters

This isn't just an audio converter—it's a **case study in solving real engineering constraints**.

**The journey taught me:**
- How to architect for scale, not just functionality
- The importance of proper error handling in distributed systems
- When to use managed services vs. custom solutions
- How to debug issues across multiple AWS services

**Read the full story:** [LinkedIn Post](https://www.linkedin.com/posts/xadi_aws-cloudcomputing-serverless-activity-7388656205344391168-vEMi?utm_source=share&utm_medium=member_desktop&rcm=ACoAAEYGzLYBBfd1jEVjlsJ8g02hw5MxiYzVAZE)

---

## 📧 Connect With Me

**[Aditya Waghmare]**  
[LinkedIn](https://www.linkedin.com/posts/xadi) | [Email](mailto:adityawaghmarex@gmail.com)

Questions about the architecture? Want to discuss AWS best practices? Feel free to reach out!

---

## ⭐ Show Your Support!

If this project helped you understand event-driven architectures or gave you ideas for your own cloud projects, consider giving it a star! ⭐

---

**Built with ☕, countless CloudWatch logs, and way too much IAM debugging**





