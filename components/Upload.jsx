import React, { useState } from 'react';
// --- V6 IMPORTS ---
import { post } from 'aws-amplify/api'; // Correct import for V6
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

const Upload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [processingStatus, setProcessingStatus] = useState('');
    const [downloadUrl, setDownloadUrl] = useState('');
    const [error, setError] = useState('');

    const apiName = 'SurroundYouAPI';
    const path = '/presigned-url';

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            setProcessingStatus('');
            setUploadProgress(0);
            setDownloadUrl('');
            setError('');
        }
    };

    const handleProcessClick = async () => {
        if (!selectedFile) return;
    
        try {
            setProcessingStatus('Preparing secure upload...');
            const uniqueFilename = `${uuidv4()}-${selectedFile.name}`;
    
            // 1. Get the pre-signed URL from our API
            const response = await post({
                apiName: apiName,
                path: path,
                options: {
                    body: {
                        action: 'getUploadUrl',
                        filename: uniqueFilename,
                    },
                },
            }).response;
    
            // --- THIS IS THE CRITICAL FIX ---
            // Let's add debugging and parse the body correctly.
            console.log("Raw API Response:", response);
            const responseData = await response.body.json();
            console.log("Parsed Response Data:", responseData);
    
            const { uploadUrl } = responseData;
    
            // Add a check to ensure we got the URL
            if (!uploadUrl) {
                throw new Error("Failed to get a valid upload URL from the API.");
            }
            
            // 2. Upload the file directly to S3
            setProcessingStatus('Uploading file...');
            await axios.put(uploadUrl, selectedFile, {
                headers: { 'Content-Type': selectedFile.type },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                },
            });
    
            setProcessingStatus('File uploaded. Processing audio...');
            pollForProcessedFile(uniqueFilename);
    
        } catch (err) {
            console.error('Error during upload:', err);
            setError('Upload failed. Please try again.');
            setProcessingStatus('');
        }
    };
    const pollForProcessedFile = (filename) => {
        const interval = setInterval(async () => {
            try {
                // --- V6 API CALL SYNTAX ---
                const response = await post({
                    apiName: apiName,
                    path: path,
                    options: {
                        body: {
                            action: 'getDownloadUrl',
                            filename: filename,
                        },
                    },
                }).response;

                const { downloadUrl } = await response.body.json();
                setDownloadUrl(downloadUrl);
                setProcessingStatus('Processing Complete!');
                clearInterval(interval);

            } catch (err) {
                const errorResponse = err.response;
                if (errorResponse && errorResponse.statusCode === 404) {
                    console.log('File not processed yet, still polling...');
                } else {
                    console.error('Error while polling:', err);
                    setError('An error occurred during processing.');
                    setProcessingStatus('');
                    clearInterval(interval);
                }
            }
        }, 5000);
    };

    // The rest of your JSX remains the same
    return (
        <div className='justify-center items-center text-center '>
            <div className="flex flex-col items-center justify-center text-white">
                <h1 className="text-7xl font-bold text-center mt-20">
                    <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                        8D
                    </span>
                    <span>
                        {' '}Audio
                    </span>
                </h1>
                <h2 className="text-5xl font-thin mt-4">
                    Converter
                </h2>
            </div>
            <br />
            <label htmlFor="fileInput" className="cursor-pointer flex flex-col items-center justify-center">
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-400 rounded-2xl w-80 max-w-md mx-auto">
                    <svg className="w-12 h-12 text-blue-500 mb-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.9A5 5 0 0115.9 6h1.1a5 5 0 01.9 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-gray-400 font-medium">Click to upload or drag & drop</p>
                    <p className="text-sm text-gray-500">mp3 (max 5MB)</p>
                    
                    {selectedFile && <p className="mt-3 text-blue-300">{selectedFile.name}</p>}
                    {uploadProgress > 0 && uploadProgress < 100 && (
                         <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
                            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                    )}
                    {processingStatus && <p className="mt-3 text-green-400">{processingStatus}</p>}
                    {error && <p className="mt-3 text-red-500">{error}</p>}
                    {downloadUrl && (
                        <a href={downloadUrl} download className="mt-4 px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600">
                           Download 8D Audio
                        </a>
                    )}
                </div>
                <input id="fileInput" type="file" accept="audio/mp3" className="hidden" onChange={handleFileChange} />
            </label>
            
            {selectedFile && !processingStatus && (
                 <button onClick={handleProcessClick} className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-transform">
                    Convert to 8D
                </button>
            )}
        </div>
    );
};

export default Upload;