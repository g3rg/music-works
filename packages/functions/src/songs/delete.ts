import { Table } from "sst/node/table";
import handler from "@music-works/core/handler";
import dynamoDb from "@music-works/core/dynamodb";

export const main = handler(async (event) => {
    const params = {
        TableName: Table.Songs.tableName,
        Key: {
            userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
            songId: event?.pathParameters?.id, // The id of the note from the path
        },
    };

    await dynamoDb.delete(params);

    return JSON.stringify({ status: true });
});