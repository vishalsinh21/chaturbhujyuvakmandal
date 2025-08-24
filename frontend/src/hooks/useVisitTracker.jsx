import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axiosInstance from '../components/utils/axiosInstance';

const useVisitTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const recordVisit = async () => {
      try {
        await axiosInstance.post(`http://localhost:2025/api/visits/record`, {
          path: location.pathname,
          deviceType: window.innerWidth < 768 ? 'Mobile' : 'Desktop',
        });
      } catch (error) {
        console.error('Failed to record visit:', error);
      }
    };

    recordVisit();
  }, [location]);
};

export default useVisitTracker;
