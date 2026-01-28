import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../config/firebase';

const useStats = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalConversions: 0,
    totalStorageSaved: 0,
    uptime: 99.9,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const statsRef = ref(database, 'stats');

    const unsubscribe = onValue(
      statsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setStats({
            totalUsers: data.totalUsers || 0,
            totalConversions: data.totalConversions || 0,
            totalStorageSaved: data.totalStorageSaved || 0,
            uptime: 99.9,
            loading: false,
            error: null,
          });
        } else {
          setStats({
            totalUsers: 0,
            totalConversions: 0,
            totalStorageSaved: 0,
            uptime: 99.9,
            loading: false,
            error: null,
          });
        }
      },
      (error) => {
        console.error('Error fetching stats:', error);
        setStats((prev) => ({ ...prev, loading: false, error }));
      },
    );

    return () => unsubscribe();
  }, []);

  return stats;
};

export default useStats;
