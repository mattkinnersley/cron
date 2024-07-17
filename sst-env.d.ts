/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    GoogleAPIKey: {
      type: "sst.sst.Secret"
      value: string
    }
    KnockAPIKey: {
      type: "sst.sst.Secret"
      value: string
    }
  }
}
export {}