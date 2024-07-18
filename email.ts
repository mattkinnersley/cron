import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";

export const sendEmail = async ({
  to,
  from,
  subject,
  body,
}: {
  to: string;
  from: {
    name: string;
    address: string;
  };
  subject: string;
  body: {
    html: string;
    text: string;
  };
}) => {
  const ses = new SESv2Client({});
  const cmd = new SendEmailCommand({
    Destination: {
      ToAddresses: [to],
    },
    FromEmailAddress: `${from.name} <${from.address}>`,
    Content: {
      Simple: {
        Body: {
          Html: {
            Data: body.html,
          },
          Text: {
            Data: body.text,
          },
        },
        Subject: {
          Data: subject,
        },
      },
    },
  });

  await ses.send(cmd);
};
