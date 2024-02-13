import * as uuid from "uuid";
import { Table } from "sst/node/table";
import handler from "@music-works/core/handler";
import dynamoDb from "@music-works/core/dynamodb";

export const main = handler(async (event) => {
    let data = {
        songName: "",
        songFilename: "",
    };

    // Request body is passed in as a JSON encoded string in 'event.body'
    if (event.body != null) {
        data = JSON.parse(event.body);
    }
    const params = {
        TableName: Table.Songs.tableName,
        Item: {
            // The attributes of the item to be created
            userId: event.requestContext.authorizer?.iam.cognitoIdentity.identityId,
            songId: uuid.v1(), // A unique uuid
            songName: data.songName, // Parsed from request body
            songFilename: data.songFilename, // Parsed from request body
            createdAt: Date.now(), // Current Unix timestamp
        },
    };

    await dynamoDb.put(params);
    return JSON.stringify(params.Item)
});