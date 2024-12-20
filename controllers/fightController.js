const { putItem, getItem, scanItems, deleteItem } = require("../services/dynamoService");
const { uploadFile } = require("../services/s3Service");
const { createResponse } = require("../utils/responseHelper");
const { v4: uuidv4 } = require("uuid");

const FIGHTS_TABLE = process.env.FIGHTS_TABLE;

exports.createFight = async (event) => {
  const { title, date, result, description } = JSON.parse(event.body);
  const fightId = uuidv4();

  const params = {
    TableName: FIGHTS_TABLE,
    Item: { fightId, title, date, result, description },
  };

  await putItem(params);

  return createResponse(201, { message: "Fight created", fightId });
};

exports.getFight = async (event) => {
  const { fightId } = event.pathParameters;

  const params = {
    TableName: FIGHTS_TABLE,
    Key: { fightId },
  };

  const result = await getItem(params);
  if (!result.Item) return createResponse(404, { error: "Fight not found" });

  return createResponse(200, result.Item);
};

exports.listFights = async () => {
  const params = { TableName: FIGHTS_TABLE };
  const result = await scanItems(params);
  return createResponse(200, result.Items);
};

exports.deleteFight = async (event) => {
  const { fightId } = event.pathParameters;

  const params = {
    TableName: FIGHTS_TABLE,
    Key: { fightId },
  };

  await deleteItem(params);
  return createResponse(200, { message: "Fight deleted" });
};

exports.uploadMedia = async (event) => {
    const { fightId } = event.pathParameters;
    const { fileName, fileContent, contentType } = JSON.parse(event.body);
  
    const bucketName = process.env.S3_BUCKET;
    const key = `${fightId}/${fileName}`;
  
    await uploadFile(bucketName, key, Buffer.from(fileContent, "base64"), contentType);
  
    return createResponse(200, { message: "File uploaded successfully", fileUrl: `https://${bucketName}.s3.amazonaws.com/${key}` });
  };
