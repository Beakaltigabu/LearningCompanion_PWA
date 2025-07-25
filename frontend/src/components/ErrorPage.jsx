import React from 'react';
import { useNavigate } from 'react-router-dom';
import mascotImg from '../assets/react.svg'; // Replace with mascot image

const ErrorPage = () => {
    const navigate = useNavigate();
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
            <img src={mascotImg} alt="Mascot" className="w-32 h-32 mb-6 animate-bounce" />
            <h1 className="text-3xl font-bold mb-2">Oops! Something went wrong.</h1>
            <p className="mb-4 text-lg text-gray-700">We're sorry, but an error occurred. Please try again or go back home.</p>
            <button
                className="px-6 py-2 rounded-full bg-blue-500 text-white shadow-lg hover:bg-blue-600 transition-all"
                onClick={() => navigate('/')}
            >
                Go Home
            </button>
        </div>
    );
};

export default ErrorPage;
