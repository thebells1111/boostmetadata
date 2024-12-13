module.exports = (storeMetadata) => {
  return async (req, res) => {
    const { paymentMetadataId } = req.params;

    try {
      const metadata = await storeMetadata.get(paymentMetadataId);

      if (!metadata) {
        return res.status(404).send({ error: "Payment metadata not found" });
      }

      res.status(200).json(metadata);
    } catch (error) {
      console.error("Error fetching metadata by ID:", error);
      res.status(500).send({ error: "Failed to fetch payment metadata" });
    }
  };
};
