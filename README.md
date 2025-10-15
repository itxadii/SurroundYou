# SurroundYou - 8D Audio Converter 🎧

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**SurroundYou is a serverless web application that converts standard stereo audio into immersive 8D surround sound, built with a modern frontend stack (Vite, React, Tailwind CSS) and a powerful AWS backend.**

This project provides a clean interface for anyone to upload an audio file and receive a processed version with automated 8D panning and reverb effects applied.



---

## Key Features

* **Stereo to 8D Conversion:** Utilizes a serverless Node.js function with FFmpeg to apply automated circular panning and reverb.
* **Modern Frontend:** A fast, responsive UI built with Vite, React, and styled with Tailwind CSS.
* **Direct Browser Uploads:** Securely uploads files directly from the browser to Amazon S3.
* **Serverless & Scalable:** The simple, event-driven architecture is built on AWS Lambda and S3, making it cost-effective and highly scalable.

---

## Tech Stack

### Frontend
* **Vite:** A next-generation frontend build tool for extremely fast development.
* **React:** A JavaScript library for building user interfaces.
* **Tailwind CSS:** A utility-first CSS framework for rapid UI development.
* **AWS Amplify JS Library:** For connecting the frontend to AWS S3.

### Backend
* **AWS Lambda:** Runs the Node.js audio processing script in a serverless environment.
* **Amazon S3:** For file storage and as a trigger for the Lambda function.
* **AWS Amplify CLI:** For orchestrating and deploying the backend infrastructure.
* **Node.js:** The runtime environment for the Lambda function.
* **FFmpeg:** The core audio processing engine, packaged in a Lambda Layer.

---

## Architecture Overview

The application uses a minimalist and powerful serverless architecture.

1.  **Upload:** The user selects a file in the React frontend, which uploads it directly to an **Amazon S3** bucket using the Amplify JS library.
2.  **Trigger:** The file upload to S3 automatically triggers the **AWS Lambda** function.
3.  **Processing:** The Lambda function (running Node.js) downloads the file, uses **FFmpeg** to process it and create the 8D effect, and uploads the resulting file to a different folder in the S3 bucket.
4.  **Download:** The frontend provides the user with a direct download link to the processed file in S3.

---

## Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites

* Node.js (v18.x or later)
* NPM or Yarn
* An AWS Account
* AWS Amplify CLI installed and configured:
    ```sh
    npm install -g @aws-amplify/cli
    amplify configure
    ```

### Installation & Setup

1.  **Clone the repository:**
    ```sh
    git clone [https://github.com/itxadii/surroundyou.git](https://github.com/itxadii/surroundyou.git)
    cd surroundyou
    ```

2.  **Install frontend dependencies:**
    ```sh
    npm install
    ```

3.  **Initialize the Amplify backend:**
    This command will connect your local project to the Amplify backend services.
    ```sh
    amplify init
    ```

4.  **Add the Storage and Lambda Function:**
    This single command will set up the S3 bucket and the Lambda function that it triggers.
    ```sh
    amplify add storage
    ```
    * When prompted, choose **Content (Images, audio, video, etc.)**.
    * Give it a friendly name (e.g., `s3surroundyoustorage`).
    * For access, choose **Auth and guest users** and give guests **upload/read** access.
    * **Crucially**, when asked "**Do you want to add a Lambda trigger?**", say **YES**.
    * Choose "**Create a new Lambda function**", give it a name (e.g., `8daudioprocessor`), and select the **Node.js** runtime. Amplify will create all the necessary files and permissions.

5.  **Deploy the backend to your AWS account:**
    This will provision the S3 bucket and the Lambda function.
    ```sh
    amplify push
    ```

6.  **❗️ Important Manual Step: Configure the Lambda Function**
    The audio processing function requires a special binary (FFmpeg) and more resources.
    * Navigate to the **AWS Lambda Console**.
    * Find the function created by Amplify.
    * In the **Configuration** > **General configuration** tab, click **Edit** and increase the **Memory** to **1024 MB** and the **Timeout** to **5 minutes**.
    * In the **Layers** section, click **Add a layer**. Choose "Specify an ARN" and paste the ARN for a public **FFmpeg Lambda Layer** for your AWS region. You can find these by searching online for "ffmpeg lambda layer arn".

7.  **Run the React application locally:**
    ```sh
    npm run dev
    ```
    Your application should now be running on `http://localhost:5173` (or another port specified by Vite) and fully connected to your AWS backend.

