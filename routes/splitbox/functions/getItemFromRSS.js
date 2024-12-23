export default function getItemFromRSS(feed, metadata) {
  return []
    .concat(feed?.item)
    .find(
      (v) =>
        metadata?.item_guid === v?.guid ||
        metadata?.item_guid === v?.guid?.["#text"]
    );
}
