import queryindex from "./queryIndex.js";

export default async function fetchFeed(feedGuid) {
  return await queryindex(`podcasts/byguid?guid=${feedGuid}`);
}
