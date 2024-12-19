import fetchChannel from "./fetchChannel.js";
import fetchItem from "./fetchItem.js";
import fetchFeed from "./fetchFeed.js";

export default async function getSplits(metadata) {
  let splits = [];

  let destinations;
  let channel;
  let feed;
  let itemFromFeed;
  let item;
  let remoteItemFromMetadata;
  let remoteItem;
  let remoteItemFromFeed;
  let remoteItemFromFeedFromIndex;

  if (metadata.feed_guid || metadata.feedID) {
    const channelResponse = await fetchChannel({
      guid: metadata.feed_guid,
      id: metadata.feedID,
    });
    channel = channelResponse.feed;
    metadata.feed_guid = channel.podcastGuid;
    console.log(metadata);
    feed = await fetchFeed(channel.url);

    if (metadata.item_guid || metadata.itemID) {
      const item = await fetchItem({
        feedGuid: metadata.feed_guid,
        itemGuid: metadata.item_guid,
        itemID: metadata.itemID,
      });

      metadata.item_guid = item.guid;
      itemFromFeed = feed?.item.find(
        (v) =>
          metadata?.item_guid === v?.guid ||
          metadata?.item_guid === v?.guid?.["#text"]
      );
      remoteItemFromFeed = findRemoteItem(
        itemFromFeed?.["podcast:value"]?.["podcast:valueTimeSplit"],
        metadata.ts
      );

      remoteItemFromMetadata = await fetchItem({
        feedGuid: metadata.remote_feed_guid,
        itemGuid: metadata.remote_item_guid,
      });
      remoteItemFromFeedFromIndex = await fetchItem({
        feedGuid: remoteItemFromFeed["podcast:remoteItem"]["@_feedGuid"],
        itemGuid: remoteItemFromFeed["podcast:remoteItem"]["@_itemGuid"],
      });

      destinations = item?.value?.destinations || channel?.value?.destinations;

      if (destinations) {
        splits = splits.concat(destinations);
      }
    } else {
      splits = [];
    }
  }

  return {
    feed,
    channel,
    item,
    itemFromFeed,
    splits,
    metadata,
    remoteItemFromMetadata,
    remoteItemFromFeedFromIndex,
    remoteItem,
    remoteItemFromFeed,
  };
}

function findRemoteItem(data, timestamp) {
  for (let i = 0; i < data.length; i++) {
    const current = data[i];
    const next = data[i + 1];

    const startTime = parseFloat(current["@_startTime"]);
    const endTime = current["@_endTime"]
      ? parseFloat(current["@_endTime"])
      : next
      ? parseFloat(next["@_startTime"])
      : startTime + parseFloat(current["@_duration"]);

    if (timestamp >= startTime && timestamp < endTime) {
      return current;
    }
  }
  return null; // Return null if no match is found
}
