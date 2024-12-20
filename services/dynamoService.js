const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

const putItem = async (tableName, item) => {
  const params = {
    TableName: tableName,
    Item: item,
  };
  await dynamoDB.put(params).promise();
};

const getItem = async (tableName, key) => {
  const params = {
    TableName: tableName,
    Key: key,
  };
  const result = await dynamoDB.get(params).promise();
  return result.Item;
};

const queryItems = async (tableName, keyName, keyValue) => {
  const params = {
    TableName: tableName,
    IndexName: `${keyName}-index`,
    KeyConditionExpression: `${keyName} = :value`,
    ExpressionAttributeValues: {
      ':value': keyValue,
    },
  };
  const result = await dynamoDB.query(params).promise();
  return result.Items;
};

module.exports = { putItem, getItem, queryItems };
