import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Ghost } from 'lucide-react';
import { Button } from '../components/Button';

export const PageNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-primary">
          <Ghost size={38} className="animate-bounce" />
        </div>
        <div className="space-y-2">
          <h1 className="font-serif text-5xl font-bold text-primary tracking-tight">404</h1>
          <h2 className="text-lg font-semibold text-gray-800">Page Not Found</h2>
          <p className="text-sm text-gray-500 font-light max-w-xs mx-auto">The page you're looking for doesn't exist or has been moved.</p>
        </div>
        <div className="flex items-center justify-center gap-3 pt-2">
          <Button variant="outline" size="md" onClick={() => navigate(-1)} leftIcon={<ArrowLeft size={16} />} className="bg-white border-gray-200 text-gray-700">Go Back</Button>
          <Button variant="primary" size="md" onClick={() => navigate('/')} leftIcon={<Home size={16} />}>Home Page</Button>
        </div>
      </div>
    </div>
  );
};