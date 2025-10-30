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

    const apiName = 'apiforsurroundyouprod';
    const path = '/items';

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
    
            const response = await post({
                apiName: apiName,
                path: path,
                options: { body: { action: 'getUploadUrl', filename: uniqueFilename } },
            }).response;
            
            const responseData = await response.body.json();
            const { uploadUrl, fileKey } = responseData; // <-- Get the fileKey from the API response
    
            if (!uploadUrl || !fileKey) {
                throw new Error("API did not return a valid upload URL or fileKey.");
            }
            
            setProcessingStatus('Uploading file...');
            await axios.put(uploadUrl, selectedFile, {
                headers: { 'Content-Type': selectedFile.type },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percentCompleted);
                },
            });
    
            setProcessingStatus('File uploaded. Processing audio...');
            // --- FIX 3: Pass the fileKey from the API to the polling function ---
            pollForProcessedFile(fileKey);
    
        } catch (err) {
            console.error('Error during upload:', err);
            setError('Upload failed. Please try again.');
            setProcessingStatus('');
        }
    };
    
    const pollForProcessedFile = (keyForFile) => {
        const interval = setInterval(async () => {
            try {
                // This part is the same: try to get the download URL
                const response = await post({
                    apiName: apiName,
                    path: path,
                    options: {
                        body: {
                            action: 'getDownloadUrl',
                            filename: keyForFile,
                        },
                    },
                }).response;
    
                // If the call above succeeds, the file is ready!
                const { downloadUrl } = await response.body.json();
                setDownloadUrl(downloadUrl);
                setProcessingStatus('Processing Complete!');
                clearInterval(interval); // Stop polling
    
            } catch (err) {
                // --- THIS IS THE UPDATED LOGIC ---
    
                // 1. Check if the error object has a response with a status code.
                const errorResponse = err.response;
                
                // 2. If it's a 404 error, just log a calm message instead of a red error.
                if (errorResponse && errorResponse.statusCode === 404) {
                    console.log('File not processed yet, still polling...');
                } else {
                    // 3. For any other error (like a 500 or network issue), treat it as a real problem.
                    console.error('An unexpected error occurred while polling:', err);
                    setError('An error occurred during processing.');
                    setProcessingStatus('');
                    clearInterval(interval); // Stop polling on real errors
                }
            }
        }, 10000); // Check every 5 seconds
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
                    <p className="text-gray-400 font-medium">Click to upload</p>
                    <p className="text-sm text-gray-500">mp3 (max 5MB)</p>
                    
                    {selectedFile && <p className="mt-3 text-gray-300  text-center">{selectedFile.name}</p>}
                    {uploadProgress > 0 && uploadProgress < 100 && (
                         <div className="w-full bg-gray-700 rounded-full h-2.5 mt-4">
                            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                    )}
                    {processingStatus && <p className="mt-3 text-blue-300 font-mono text-3v12 italic text-center">{processingStatus}</p>}
                    {error && <p className="mt-3 text-red-500 font-mono text-sm italic">{error}</p>}
                </div>
                <input id="fileInput" type="file" accept=".mp3" className="hidden" onChange={handleFileChange} />
            </label>
            {downloadUrl && (
                <div className='mt-6'>
                        <a href={downloadUrl} download className="mt-6 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-lg hover:bg-blue-100">
                           <span className="bg-white bg-clip-text text-transparent font-serif">
                           Download
                           </span>
                        </a>
                </div>
                    )}
            {selectedFile && !processingStatus && (
                 <button onClick={handleProcessClick} className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:scale-105 transition-transform">
                    Convert to 8D
                </button>
            )}
        </div>
    );
};

export default Upload;