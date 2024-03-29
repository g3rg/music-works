import {Bucket, StackContext, Table} from "sst/constructs";

export function StorageStack({ stack }: StackContext) {

    // Create an S3 bucket
    const bucket = new Bucket(stack, "Uploads", {
        cors: [
            {
                maxAge: "1 day",
                allowedOrigins: ["*"],
                allowedHeaders: ["*"],
                allowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
                exposedHeaders: ["ETag"],
            },
        ],
    });

    // Create the DynamoDB table
    const table = new Table(stack, "Songs", {
        fields: {
            userId: "string",
            songId: "string",
            songName: "string",
        },
        primaryIndex: { partitionKey: "userId", sortKey: "songId" },
        globalIndexes: {
            songIndex: { partitionKey: "userId", sortKey: "songName"}
        }
    });

    return {
        bucket,
        table,
    };
}