const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const uploadFile = async (bucketName, key, body, contentType) => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: body,
    ContentType: contentType,
  };

  await s3.upload(params).promise();
};

module.exports = { uploadFile };
