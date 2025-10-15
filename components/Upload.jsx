import React from 'react'

const Upload = () => {
    const [fileName, setFileName] = React.useState('');
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFileName(file.name);
        }
    };
    return (
        <div className='justify-center items-center text-center '>
            <h1 className='justify-center text-center text-7xl font-bold mt-50 font-mono'>8D Audio Converter</h1>
            <br></br>
            <label
            htmlFor="fileInput"
            className="cursor-pointer flex flex-col items-center justify-center"
            >
            <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-400 rounded-2xl w-60 max-w-md mx-auto">
                <svg
                    className="w-12 h-12 text-blue-500 mb-3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M7 16a4 4 0 01-.88-7.9A5 5 0 0115.9 6h1.1a5 5 0 01.9 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
                </svg>
                <p className="text-gray-700 font-medium">Click to upload or drag & drop</p>
                <p className="text-sm text-gray-500">mp3 (max 5MB)</p>
                <p className="mt-3 text-blue-300">{fileName}</p>
            </div>
            <input
            id="fileInput"
            type="file"
            accept="audio/mp3"
            size={5242880}
            className="hidden"
            onChange={handleFileChange}
            />
        </label>
        </div>
    )
}

export default Upload