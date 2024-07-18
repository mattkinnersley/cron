/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "cron",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  console: {
    autodeploy: {
      target(event) {
        if (
          event.type === "branch" &&
          event.action === "pushed" &&
          event.branch === "main"
        ) {
          return {
            stage: "production",
          };
        }
      },
    },
  },
  async run() {
    const secrets = {
      GoogleAPIKey: new sst.Secret("GoogleAPIKey"),
    };
    const email = new sst.aws.Email("Email", {
      sender: "noreply@mattkinnersley.com",
    });
    const db = new sst.aws.Dynamo("DB", {
      fields: {
        pk: "string",
        sk: "string",
      },
      primaryIndex: {
        hashKey: "pk",
        rangeKey: "sk",
      },
    });
    new sst.aws.Cron("Cron", {
      job: {
        handler: "cron.handler",
        link: [secrets.GoogleAPIKey, email, db],
        environment: {
          CHANNEL_HANDLE: process.env.CHANNEL_HANDLE || "mrbeast",
          TO_ADDRESS: process.env.TO_ADDRESS || "",
        },
      },
      schedule: "rate(30 minutes)",
    });
  },
});
