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
    new sst.aws.Cron("Cron", {
      job: {
        handler: "cron.handler",
        link: [secrets.GoogleAPIKey],
        environment: {
          CHANNEL_HANDLE: process.env.CHANNEL_HANDLE || "pewdiepie",
        },
      },
      schedule: "rate(1 minute)",
    });
  },
});
