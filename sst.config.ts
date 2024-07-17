/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "cron",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    new sst.aws.Cron("Cron", {
      job: "cron.handler",
      schedule: "rate(2 minutes)",
    });
  },
});
