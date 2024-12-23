import queryindex from "./queryIndex.js";

export default async function fetchItem({ feedGuid, itemGuid, itemID }) {
  if (itemGuid) {
    let itemResponse = await queryindex(
      `episodes/byguid?podcastguid=${feedGuid}&guid=${itemGuid}`
    );
    return itemResponse?.episode;
  }
  if (itemID) {
    let podcast = await queryindex(`episodes/bypodcastguid?guid=${feedGuid}`);
    return podcast?.items.find((v) => v.id === itemID);
  }
}
