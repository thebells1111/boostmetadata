function updateHandler(storeMetadata) {
  return async function (req, res) {
    const { id, jpt, type, updateToken } = req.body;

    if (!id || !updateToken || !jpt || !type) {
      return res.status(400).send({ error: "Invalid input" });
    }

    try {
      const metadata = await storeMetadata.getById(id);

      if (!metadata) {
        return res.status(404).send({ error: "Payment metadata not found" });
      }

      metadata.jpt = jpt;
      metadata.type = type;
      metadata.updateToken = updateToken;

      res.status(200).send(metadata);
    } catch (error) {
      console.error("Error updating metadata:", error);
      res.status(500).send({ error: "Failed to update payment metadata" });
    }
  };
}

export default updateHandler;
