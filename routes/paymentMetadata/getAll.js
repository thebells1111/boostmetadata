module.exports = (storeMetadata) => {
  return async (req, res) => {
    try {
      const allMetadata = await storeMetadata.getAll();
      res.status(200).json(allMetadata);
    } catch (error) {
      console.error("Error fetching metadata:", error);
      res.status(500).send({ error: "Failed to fetch payment metadata" });
    }
  };
};
