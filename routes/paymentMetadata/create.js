function createHandler(storeMetadata) {
  return function (req, res) {
    console.log(req.body);
    const { jpt, type, amount, metadata } = req.body;

    if (!jpt || !type) {
      return res.status(400).send({ error: "Invalid input" });
    }

    const newMetadata = {
      id: `${Math.random().toString(36).substr(2, 9)}`,
      jpt,
      type,
      amount,
      metadata,
    };

    storeMetadata.add(newMetadata);
    res.status(200).send(newMetadata);
  };
}

export default createHandler;
