import { Table } from "sst/node/table";
import handler from "@music-works/core/handler";
import dynamoDb from "@music-works/core/dynamodb";

export const main = handler(async (event) => {
    const params = {
        TableName: Table.Songs.tableName,
        // 'Key' defines the partition key and sort key of
        // the item to be retrieved
        Key: {
            userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
            songId: event?.pathParameters?.id, // The id of the note from the path
        },
    };

    const result = await dynamoDb.get(params);
    if (!result.Item) {
        throw new Error("Item not found.");
    }

    // Return the retrieved item
    return JSON.stringify(result.Item);
});