import queryindex from "./queryIndex.js";

export default async function fetchChannel({ guid, id }) {
  if (guid) {
    return await queryindex(`podcasts/byguid?guid=${guid}`);
  }
  if (id) {
    return await queryindex(`podcasts/byfeedid?id=${id}`);
  }
}
