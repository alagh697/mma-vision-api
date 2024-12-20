const createResponse = (statusCode, data) => ({
    statusCode,
    body: JSON.stringify(data),
  });
  
  module.exports = { createResponse };
  