const dynamoService = require('../services/dynamoService');
const { v4: uuidv4 } = require('uuid');

const addComment = async (event) => {
  const { fightId } = event.pathParameters;
  const body = JSON.parse(event.body);

  const comment = {
    commentId: uuidv4(),
    fightId,
    content: body.content,
    author: body.author,
    createdAt: new Date().toISOString(),
  };

  await dynamoService.putItem(process.env.COMMENTS_TABLE, comment);

  return {
    statusCode: 201,
    body: JSON.stringify(comment),
  };
};

const getComments = async (event) => {
  const { fightId } = event.pathParameters;

  const comments = await dynamoService.queryItems(process.env.COMMENTS_TABLE, 'fightId', fightId);

  return {
    statusCode: 200,
    body: JSON.stringify(comments),
  };
};

module.exports = {
  addComment,
  getComments,
};
