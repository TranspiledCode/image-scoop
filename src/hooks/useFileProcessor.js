// useFileProcessor.js
import { useState } from 'react';
import { useToast } from 'context/ToastContext';

const useFileProcessor = ({
  files,
  exportType,
  setFileStatuses,
  setLoading,
  clearForm,
}) => {
  const [controllers, setControllers] = useState([]);
  const { addToast } = useToast();

  const normalizeFilename = (filename) => {
    const parts = filename.split('.');
    const extension = parts.pop();
    const baseName = parts.join('-').replace(/\s+/g, '_');
    const newName = `${baseName}.${extension}`.toLowerCase();
    // eslint-disable-next-line no-console
    console.log(`Normalized filename: ${filename} -> ${newName}`);
    return newName;
  };

  const processFiles = () => {
    // eslint-disable-next-line no-console
    console.log('Starting file processing...');
    setLoading(true);

    const updatedStatuses = files.map((file) => {
      const normalizedFilename = normalizeFilename(file.name);
      return {
        name: normalizedFilename,
        status: 'pending',
        progress: 0,
        file: new File([file], normalizedFilename, {
          type: file.type,
        }),
      };
    });

    setFileStatuses(updatedStatuses);
    processAllFiles(updatedStatuses.map((status) => status.file));
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
    formData.append('Export-Type', exportType);
    // eslint-disable-next-line no-console
    console.log('FormData prepared, starting fetch.');

    const API_URL =
      process.env.REACT_APP_API_URL || '/.netlify/functions/image-processor';

    fetch(API_URL, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        // eslint-disable-next-line no-console
        console.log('Received response from API.');
        if (response.ok) {
          return response.blob();
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

        // eslint-disable-next-line no-console
        console.log('File processing succeeded, triggering download.');
        const url = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `processed_images.zip`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        setLoading(false);
        clearForm();
        addToast('Processing complete.', 'success');
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Error during processing:', error);
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
    // eslint-disable-next-line no-console
    console.log('Processing canceled by the user.');
    addToast('Processing canceled.', 'info');
  };

  return { processFiles, cancelProcessing, controllers };
};

export default useFileProcessor;
