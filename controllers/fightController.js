const dynamoService = require('../services/dynamoService');
const { v4: uuidv4 } = require('uuid');

const createFight = async (event) => {
  const body = JSON.parse(event.body);

  const fight = {
    fightId: uuidv4(),
    title: body.title,
    description: body.description,
    videoUrl: body.videoUrl, // Pass the S3 URL from the front-end or pre-configured upload
  };

  await dynamoService.putItem(process.env.FIGHTS_TABLE, fight);

  return {
    statusCode: 201,
    body: JSON.stringify(fight),
  };
};

const getFights = async () => {
  try {
    const fights = await dynamoService.scanItems(process.env.FIGHTS_TABLE);

    return {
      statusCode: 200,
      body: JSON.stringify(fights),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not fetch fights' }),
    };
  }
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

module.exports = {
  createFight,
  getFights,
  getFight,
};
