import fetchChannelFromIndex from "./fetchChannelFromIndex.js";
import fetchItemFromIndex from "./fetchItemFromIndex.js";
import fetchRSSFeed from "./fetchRSSFeed.js";
import normalizeSplits from "./normalizeSplits.js";
import findVTS from "./findVTS.js";
import getItemFromRSS from "./getItemFromRSS.js";
import combineSplits from "./combineSplits.js";

export default async function getSplits(metadata) {
  let debug = false;
  let splits = [];

  let destinations = { mainSplits: [], remoteSplits: [] };
  let channel;
  let remoteChannel;
  let RSS;
  let remoteRSS;
  let itemFromRSS;
  let itemFromRemoteRSS;
  let item;
  let VTS;
  let remoteItemFromRSS;
  let remoteItemFromIndex;

  if (metadata.feed_guid || metadata.feedID) {
    const channelResponse = await fetchChannelFromIndex({
      guid: metadata.feed_guid,
      id: metadata.feedID,
    });
    channel = channelResponse.feed;
    metadata.feed_guid = channel.podcastGuid;
    RSS = await fetchRSSFeed(channel.url);

    if (metadata.item_guid || metadata.itemID) {
      const item = await fetchItemFromIndex({
        feedGuid: metadata.feed_guid,
        itemGuid: metadata.item_guid,
        itemID: metadata.itemID,
      });

      metadata.item_guid = item.guid;

      itemFromRSS = getItemFromRSS(RSS, metadata);

      VTS = findVTS(
        itemFromRSS?.["podcast:value"]?.["podcast:valueTimeSplit"],
        metadata.ts
      );

      const remoteChannelResponse = await fetchChannelFromIndex({
        guid:
          VTS["podcast:remoteItem"]["@_feedGuid"] || metadata.remote_feed_guid,
      });
      remoteChannel = remoteChannelResponse.feed;
      remoteRSS = await fetchRSSFeed(remoteChannel.url);
      itemFromRemoteRSS = getItemFromRSS(remoteRSS, {
        item_guid: VTS["podcast:remoteItem"]["@_itemGuid"],
      });

      remoteItemFromIndex = await fetchItemFromIndex({
        feedGuid:
          VTS["podcast:remoteItem"]["@_feedGuid"] || metadata.remote_feed_guid,
        itemGuid:
          VTS["podcast:remoteItem"]["@_itemGuid"] || metadata.remote_item_guid,
      });

      let remotePercentage = Number(VTS["@_remotePercentage"]) || null;
      let mainPercentage = remotePercentage ? 100 - remotePercentage : 100;

      destinations.mainSplits = normalizeSplits(
        itemFromRSS?.["podcast:value"]?.["podcast:valueRecipient"] ||
          RSS?.["podcast:value"]?.["podcast:valueRecipient"],
        mainPercentage
      );

      destinations.remoteSplits = normalizeSplits(
        itemFromRemoteRSS?.["podcast:value"]?.["podcast:valueRecipient"] ||
          remoteRSS?.["podcast:value"]?.["podcast:valueRecipient"],
        remotePercentage
      );

      splits = combineSplits(destinations);
    } else {
      splits = [];
    }
  }

  if (debug) {
    return {
      RSS,
      remoteRSS,
      channel,
      remoteChannel,
      item,
      itemFromRSS,
      itemFromRemoteRSS,
      splits,
      destinations,
      metadata,
      VTS,
      remoteItemFromIndex,
      remoteItemFromRSS,
    };
  } else {
    return splits;
  }
}
