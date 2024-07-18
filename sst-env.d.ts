/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    DB: {
      name: string
      type: "sst.aws.Dynamo"
    }
    Email: {
      sender: string
      type: "sst.aws.Email"
    }
    GoogleAPIKey: {
      type: "sst.sst.Secret"
      value: string
    }
  }
}
export {}