import queryindex from "./queryIndex.js";

export default async function fetchChannel({ guid }) {
  if (guid) {
    return await queryindex(`podcasts/byguid?guid=${guid}`);
  }
}
