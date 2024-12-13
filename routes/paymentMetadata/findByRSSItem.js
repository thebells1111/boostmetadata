module.exports = (storeMetadata) => {
  return async (req, res) => {
    const { podcastGuid, rssItemGuid } = req.query;

    if (!podcastGuid || !rssItemGuid) {
      return res.status(400).send({ error: "Invalid query parameters" });
    }

    try {
      const allMetadata = await storeMetadata.getAll();
      const filteredMetadata = allMetadata.filter(
        (item) =>
          item.podcastGuid === podcastGuid && item.rssItemGuid === rssItemGuid
      );

      if (filteredMetadata.length === 0) {
        return res.status(404).send({ error: "No matching metadata found" });
      }

      res.status(200).json(filteredMetadata);
    } catch (error) {
      console.error("Error fetching metadata by RSS item:", error);
      res.status(500).send({ error: "Failed to fetch payment metadata" });
    }
  };
};
