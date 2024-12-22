const dynamoService = require('../services/dynamoService');
const { v4: uuidv4 } = require('uuid');

const createComment = async (event) => {
  const body = JSON.parse(event.body);

  const comment = {
    commentId: uuidv4(),
    fightId: body.fightId, // The associated fight ID
    author: body.author,
    content: body.content,
  };

  await dynamoService.putItem(process.env.COMMENTS_TABLE, comment);

  return {
    statusCode: 201,
    body: JSON.stringify(comment),
  };
};

const getCommentsForFight = async (event) => {
  const { fightId } = event.pathParameters;

  const comments = await dynamoService.queryItems(process.env.COMMENTS_TABLE, 'fightId', fightId);

  return {
    statusCode: 200,
    body: JSON.stringify(comments),
  };
};

module.exports = {
  createComment,
  getCommentsForFight,
};
