import { Table } from "sst/node/table";
import handler from "@music-works/core/handler";
import dynamoDb from "@music-works/core/dynamodb";

export const main = handler(async (event) => {
    const data = JSON.parse(event.body || "{}");

    const params = {
        TableName: Table.Songs.tableName,
        Key: {
            // The attributes of the item to be created
            userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
            songId: event?.pathParameters?.id, // The id of the note from the path
        },
        // 'UpdateExpression' defines the attributes to be updated
        // 'ExpressionAttributeValues' defines the value in the update expression
        UpdateExpression: "SET songName = :songName, songFile = :songFile",
        ExpressionAttributeValues: {
            ":songFile": data.songFile || null,
            ":songName": data.songName || null,
        },
        // 'ReturnValues' specifies if and how to return the item's attributes,
        // where ALL_NEW returns all attributes of the item after the update; you
        // can inspect 'result' below to see how it works with different settings
        ReturnValues: "ALL_NEW",
    };

    await dynamoDb.update(params);

    return JSON.stringify({ status: true });
});