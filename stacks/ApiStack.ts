import { Api, StackContext, use } from "sst/constructs";
import { StorageStack } from "./StorageStack";

export function ApiStack({ stack }: StackContext) {
    const { table } = use(StorageStack);

    // Create the API
    const api = new Api(stack, "Api", {
        defaults: {
            authorizer: "iam",
            function: {
                bind: [table],
            },
        },
        routes: {
            "GET /songs": "packages/functions/src/songs/list.main",
            "PUT /songs/{id}": "packages/functions/src/songs/update.main",
            "POST /songs": "packages/functions/src/songs/create.main",
            "GET /songs/{id}": "packages/functions/src/songs/get.main",
            "DELETE /songs/{id}": "packages/functions/src/songs/delete.main",

        },
    });

    // Show the API endpoint in the output
    stack.addOutputs({
        ApiEndpoint: api.url,
    });

    // Return the API resource
    return {
        api,
    };
}