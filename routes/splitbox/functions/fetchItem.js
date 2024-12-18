import queryindex from "./queryIndex.js";

export default async function fetchItem(feedGuid, itemGuid) {
  return await queryindex(
    `episodes/byguid?podcastguid=${feedGuid}&guid=${itemGuid}`
  );
}
