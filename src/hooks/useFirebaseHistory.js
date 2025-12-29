import { useState, useEffect } from 'react';
import {
  ref,
  push,
  get,
  query,
  orderByChild,
  limitToLast,
} from 'firebase/database';
import { database } from '../config/firebase';
import { useAuth } from '../context/AuthContext';

export const useFirebaseHistory = () => {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const saveProcessingHistory = async (processData) => {
    if (!currentUser) return;

    const historyRef = ref(database, `users/${currentUser.uid}/history`);
    const newHistoryRef = push(historyRef);

    await push(newHistoryRef, {
      originalFiles: processData.originalFiles || [],
      exportFormat: processData.exportFormat,
      processedAt: Date.now(),
      originalSize: processData.originalSize,
      compressedSize: processData.compressedSize,
      compressionRatio: processData.compressionRatio,
      filesProcessed: processData.filesProcessed,
    });
  };

  const loadHistory = async (limit = 50) => {
    if (!currentUser) {
      setHistory([]);
      return;
    }

    setLoading(true);
    try {
      const historyRef = ref(database, `users/${currentUser.uid}/history`);
      const historyQuery = query(
        historyRef,
        orderByChild('processedAt'),
        limitToLast(limit),
      );

      const snapshot = await get(historyQuery);
      if (snapshot.exists()) {
        const historyData = [];
        snapshot.forEach((child) => {
          historyData.push({
            id: child.key,
            ...child.val(),
          });
        });
        setHistory(historyData.reverse());
      } else {
        setHistory([]);
      }
    } catch (error) {
      console.error('Error loading history:', error);
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      loadHistory();
    } else {
      setHistory([]);
    }
  }, [currentUser]);

  return {
    history,
    loading,
    saveProcessingHistory,
    loadHistory,
  };
};

export default useFirebaseHistory;
