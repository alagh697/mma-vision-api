const { putItem, queryItems } = require("../services/dynamoService");
const { createResponse } = require("../utils/responseHelper");
const { v4: uuidv4 } = require("uuid");

const COMMENTS_TABLE = process.env.COMMENTS_TABLE;

exports.createComment = async (event) => {
  const { fightId } = event.pathParameters;
  const { author, content } = JSON.parse(event.body);
  const commentId = uuidv4();

  const params = {
    TableName: COMMENTS_TABLE,
    Item: { commentId, fightId, author, content, createdAt: new Date().toISOString() },
  };

  await putItem(params);

  return createResponse(201, { message: "Comment added", commentId });
};

exports.listComments = async (event) => {
  const { fightId } = event.pathParameters;

  const params = {
    TableName: COMMENTS_TABLE,
    IndexName: "fightId-index",
    KeyConditionExpression: "fightId = :fightId",
    ExpressionAttributeValues: { ":fightId": fightId },
  };

  const result = await queryItems(params);
  return createResponse(200, result.Items);
};
