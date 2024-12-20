const dynamoService = require('../services/dynamoService');
const s3Service = require('../services/s3Service');
const { v4: uuidv4 } = require('uuid');

const createFight = async (event) => {
  const body = JSON.parse(event.body);
  const fight = {
    fightId: uuidv4(),
    title: body.title,
    date: body.date,
    result: body.result,
    description: body.description,
  };

  await dynamoService.putItem(process.env.FIGHTS_TABLE, fight);

  return {
    statusCode: 201,
    body: JSON.stringify(fight),
  };
};

const getFight = async (event) => {
  const { fightId } = event.pathParameters;

  const fight = await dynamoService.getItem(process.env.FIGHTS_TABLE, { fightId });

  if (!fight) {
    return {
      statusCode: 404,
      body: JSON.stringify({ error: 'Fight not found' }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(fight),
  };
};

const uploadVideo = async (event) => {
  const { fightId } = event.pathParameters;
  const body = JSON.parse(event.body);

  const videoKey = `${fightId}/${body.fileName}`;
  const fileContent = Buffer.from(body.fileContent, 'base64');
  const contentType = body.contentType;

  await s3Service.uploadFile(process.env.S3_BUCKET, videoKey, fileContent, contentType);

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Video uploaded successfully', videoKey }),
  };
};

module.exports = {
  createFight,
  getFight,
  uploadVideo,
};
