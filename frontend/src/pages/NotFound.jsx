import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
      <motion.div 
        className="text-center p-8 glass glass-light dark:glass-dark rounded-3xl max-w-md mx-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-8xl font-bold text-primary mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
        >
          404
        </motion.div>
        
        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Page Not Found
        </h1>
        
        <p className="text-text-secondary mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <div className="flex gap-3 justify-center">
          <motion.button
            onClick={() => navigate(-1)}
            className="btn btn-secondary flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </motion.button>
          
          <motion.button
            onClick={() => navigate('/')}
            className="btn btn-primary flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Home className="w-4 h-4" />
            Home
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;