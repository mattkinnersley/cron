import { UpsertItem, type EntityConfiguration } from "electrodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { Resource } from "sst";

export const Client = new DynamoDBClient({});

export const Configuration: EntityConfiguration = {
  table: Resource.DB.name,
  client: Client,
};

import {
  Entity,
  type CreateEntityItem,
  type EntityIdentifiers,
  type EntityItem,
  type UpdateEntityItem,
} from "electrodb";

export const StatEntity = new Entity(
  {
    model: {
      version: "1",
      entity: "Stats",
      service: "cron",
    },
    attributes: {
      handle: {
        type: "string",
        required: true,
        readOnly: true,
      },
      platform: {
        type: "string",
        required: true,
      },
      statName: {
        type: "string",
        required: true,
      },
      statCount: {
        type: "string",
      },
      createdAt: {
        type: "string",
        default: () => new Date().toISOString(),
        required: true,
        readOnly: true,
      },
      updatedAt: {
        type: "string",
        watch: "*",
        set: () => {
          return new Date().toISOString();
        },
        readOnly: true,
      },
    },
    indexes: {
      byHandle: {
        pk: {
          field: "pk",
          composite: ["handle"],
        },
        sk: {
          field: "sk",
          composite: ["platform", "statName"],
        },
      },
    },
  },
  Configuration
);

export type StatEntityType = EntityItem<typeof StatEntity>;

export const create = async ({
  handle,
  platform,
  statName,
}: CreateEntityItem<typeof StatEntity>) => {
  return await StatEntity.create({
    handle,
    platform,
    statName,
  }).go();
};

export const upsert = async ({
  handle,
  platform,
  statName,
  statCount,
}: CreateEntityItem<typeof StatEntity>) => {
  return await StatEntity.upsert({
    handle,
    platform,
    statName,
    statCount,
  }).go();
};

export const get = async ({
  handle,
  platform,
  statName,
}: EntityIdentifiers<typeof StatEntity>) => {
  return await StatEntity.get({ handle, platform, statName }).go();
};

export const queryByHandle = async ({
  handle,
}: {
  handle: StatEntityType["handle"];
}) => {
  return await StatEntity.query.byHandle({ handle }).go();
};

export const queryByHandleAndPlatform = async ({
  handle,
  platform,
}: {
  handle: StatEntityType["handle"];
  platform: StatEntityType["platform"];
}) => {
  return await StatEntity.query.byHandle({ handle }).begins({ platform }).go();
};

export const updateStat = async ({
  handle,
  platform,
  statName,
  statCount,
}: EntityIdentifiers<typeof StatEntity> &
  UpdateEntityItem<typeof StatEntity>) => {
  return await StatEntity.patch({
    handle,
    platform,
    statName,
  })
    .set({ statCount })
    .go();
};

export * as Stat from "./dynamo";
