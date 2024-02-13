import { SSTConfig } from "sst";
import { StorageStack } from "./stacks/StorageStack";
import { ApiStack } from "./stacks/ApiStack";
import { AuthStack } from "./stacks/AuthStack";
import { FrontendStack } from "./stacks/FrontendStack";

export default {
  config(_input) {
    return {
      name: "music-works",
      region: "ap-southeast-2",
    };
  },
  stacks(app) {
    app
        .stack(StorageStack)
        .stack(ApiStack)
        .stack(AuthStack)
        .stack(FrontendStack);
  },
} satisfies SSTConfig;