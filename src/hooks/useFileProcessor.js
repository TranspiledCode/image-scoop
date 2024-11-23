// src/hooks/useFileProcessor.js
import { useState } from 'react';
import { useToast } from 'context/ToastContext'; // Import useToast hook

const useFileProcessor = ({
  files,
  processingMode,
  bucketLocation,
  bucketName,
  exportType, // Receive exportType as a parameter
  setFileStatuses,
  setLoading,
  clearForm,
}) => {
  const [controllers, setControllers] = useState([]);
  const { addToast } = useToast(); // Get the addToast function from ToastContext

  const processFiles = () => {
    setLoading(true);

    const updatedStatuses = files.map((file) => ({
      name: file.name,
      status: 'pending',
      progress: 0,
      file: file,
    }));
    setFileStatuses(updatedStatuses);

    processAllFiles(files);
  };

  const processAllFiles = (fileInput) => {
    const controller = new AbortController();
    setControllers([controller]);

    const updatedStatuses = fileInput.map((file) => ({
      name: file.name,
      status: 'processing',
      progress: 0,
      file: file,
    }));
    setFileStatuses(updatedStatuses);

    const formData = new FormData();
    fileInput.forEach((file) => {
      formData.append('images', file);
    });
    formData.append('Processing-Mode', processingMode);
    formData.append('Export-Type', exportType); // Append export type

    if (processingMode === 'aws') {
      formData.append('S3_Prefix', bucketLocation);
      formData.append('S3_Bucket_Name', bucketName);
    }

    fetch('http://localhost:5000/pushup', {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    })
      .then((response) => {
        if (response.ok) {
          return processingMode === 'local' ? response.blob() : response.json();
        } else {
          return response.json().then((err) => {
            throw err;
          });
        }
      })
      .then((data) => {
        updatedStatuses.forEach((status) => {
          status.status = 'success';
          status.progress = 100;
        });
        setFileStatuses([...updatedStatuses]);

        if (processingMode === 'local') {
          const url = window.URL.createObjectURL(new Blob([data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `pixel-pushup-images.zip`);
          document.body.appendChild(link);
          link.click();
          link.parentNode.removeChild(link);
        }
        setLoading(false);
        clearForm();
        addToast('Processing complete.', 'success');
      })
      .catch((error) => {
        // eslint-disable-next-line
        console.error('Error:', error);
        addToast('An error occurred during processing.', 'danger');
        updatedStatuses.forEach((status) => {
          status.status = 'error';
        });
        setFileStatuses([...updatedStatuses]);
        setLoading(false);
        addToast('Processing failed.', 'danger');
      });
  };

  const cancelProcessing = () => {
    controllers.forEach((controller) => controller.abort());
    setLoading(false);
    addToast('Processing canceled.', 'info');
  };

  return { processFiles, cancelProcessing, controllers };
};

export default useFileProcessor;
