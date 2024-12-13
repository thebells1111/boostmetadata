const inMemoryStore = [
  {
    id: "2sgy87cgd",
    jpt: {
      foo: "2prqx",
    },
    type: "bitcoin-lightning",
  },
];

const storeMetadata = {
  add: (metadata) => {
    console.log(metadata);
    inMemoryStore.push(metadata);
  },
  getAll: async () => {
    return inMemoryStore;
  },
  get: async (id) => {
    return inMemoryStore.find((item) => item.id === id);
  },
  save: async (metadata) => {
    inMemoryStore.push(metadata);
    return metadata;
  },
  update: async (id, updatedData) => {
    const index = inMemoryStore.findIndex((item) => item.id === id);
    if (index === -1) return null;
    inMemoryStore[index] = { ...inMemoryStore[index], ...updatedData };
    return inMemoryStore[index];
  },
  delete: async (id) => {
    const index = inMemoryStore.findIndex((item) => item.id === id);
    if (index === -1) return false;
    inMemoryStore.splice(index, 1);
    return true;
  },
};

module.exports = storeMetadata;
