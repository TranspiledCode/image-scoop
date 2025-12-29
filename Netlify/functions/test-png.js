// test-png.js - Simple PNG test endpoint
export const handler = async (event) => {
  console.warn('PNG test endpoint called');
  
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ 
      message: 'PNG test endpoint working',
      format: event.headers['x-output-format'] || 'none'
    }),
  };
};
