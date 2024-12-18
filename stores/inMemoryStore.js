const inMemoryStore = [
  {
    id: "2643ba24-583c-4547-ae1d-e16fe3246613",
    type: "bitcoin-lightning",
    invoice:
      "lnbc1u1pnkqk8tdqvw3jhxapqd9jqnp4qddd9j25ufjqqjvxmgkefx0pwvh9za0pmnhjg57fy8rvmnp4xm5aspp55fyuttw0rnx0v0dnae89qng7yvd2y37j4up0we5epfplsssk9nuqsp5m4h7yuc03l0u0u5jh7rsxxla997sdv4753dhwxfheq5mzdu0r97q9qyysgqcqpcxqyz5vqk3fe6c3gm0k5qr3ytwan5dk5zzy2m73t7tzmw606xkzsutjzs3xjtv54ukl4wgvjg4rdra09ld4d8vatl6n67ukwezxaps8qk0nxqcgp66e7kl",
    metadata: {
      podcast: "Boostagram Ball",
      feed_guid: "6dfbd8e4-f9f3-5ea1-98a1-574134999b3b",
      item_guid: "bball-27",
      episode: "Boostagram Ball - Episode 23",
      action: "boost",
      ts: 107,
      app_name: "CurioCaster",
      app_version: 531800807734,
      url: "https://mp3s.nashownotes.com/bballrss.xml",
      value_msat_total: 100000,
      message: "This is a boostagram",
      sender_name: "Steven B",
      speed: 1.25,
      reply_address:
        "035ad2c954e264004986da2d9499e1732e5175e1dcef2453c921c6cdcc3536e9d8",
      reply_custom_key: null,
      reply_custom_value: null,
      remote_feed_guid: "f8e5b649-6696-5d08-9e1c-b4fad9a775f5",
      remote_item_guid: "0a83c76f-5577-559b-a68f-563c28453f32",
      value_msat: 100000,
      name: "Boostagram Ball",
    },
  },
];

const storeMetadata = {
  add: (metadata) => {
    inMemoryStore.push(metadata);
  },
  getAll: async () => {
    return inMemoryStore;
  },
  getById: async (id) => {
    return inMemoryStore.find((item) => item.id === id);
  },
  getByInvoice: async (invoice) => {
    return inMemoryStore.find((item) => item.invoice === invoice);
  },
  updateById: async (id, updatedData) => {
    const index = inMemoryStore.findIndex((item) => item.id === id);
    if (index === -1) return null;
    inMemoryStore[index] = { ...inMemoryStore[index], ...updatedData };
    return inMemoryStore[index];
  },
  updateByInvoice: async (invoice, updatedData) => {
    const index = inMemoryStore.findIndex((item) => item.invoice === invoice);
    if (index === -1) return null;
    inMemoryStore[index] = { ...inMemoryStore[index], ...updatedData };
    return inMemoryStore[index];
  },
  deleteById: async (id) => {
    const index = inMemoryStore.findIndex((item) => item.id === id);
    if (index === -1) return false;
    inMemoryStore.splice(index, 1);
    return true;
  },
};

export default storeMetadata;
