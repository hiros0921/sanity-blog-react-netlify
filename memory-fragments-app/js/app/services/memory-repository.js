(function (global) {
  function safeJsonParse(value, fallback) {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  // IndexedDB版 (LocalDB が読み込まれていれば使用)
  function readLocalMemoriesAsync() {
    if (global.LocalDB) {
      return global.LocalDB.get('memories').then(function(data) {
        return Array.isArray(data) ? data : [];
      });
    }
    // フォールバック: localStorage
    return Promise.resolve(readLocalMemoriesSync());
  }

  function writeLocalMemoriesAsync(memories) {
    if (global.LocalDB) {
      return global.LocalDB.set('memories', memories);
    }
    // フォールバック: localStorage (try-catch付き)
    try {
      localStorage.setItem('memories', JSON.stringify(memories));
    } catch (e) {
      console.warn('localStorage write failed:', e.name);
    }
    return Promise.resolve();
  }

  // 同期版 (フォールバック用)
  function readLocalMemoriesSync() {
    try {
      var raw = localStorage.getItem('memories');
      return Array.isArray(raw) ? raw : safeJsonParse(raw || '[]', []);
    } catch (e) {
      return [];
    }
  }

  class MemoryRepository {
    constructor({ db }) {
      this.db = db;
    }

    // 非同期版
    async listLocalAsync() {
      return readLocalMemoriesAsync();
    }

    // 同期版 (後方互換)
    listLocal() {
      return readLocalMemoriesSync();
    }

    async saveLocal(memory, { prepend = true } = {}) {
      var memories = await readLocalMemoriesAsync();
      var id = memory.id || Date.now().toString();
      var stored = { ...memory, id };
      if (prepend) {
        memories.unshift(stored);
      } else {
        memories.push(stored);
      }
      await writeLocalMemoriesAsync(memories);
      return stored;
    }

    async getLocalById(id) {
      var memories = await readLocalMemoriesAsync();
      return memories.find((m) => String(m.id) === String(id)) || null;
    }

    async writeLocalMemories(memories) {
      return writeLocalMemoriesAsync(memories);
    }

    async addForUser({ uid, memory }) {
      const docRef = await this.db.collection('users').doc(uid).collection('memories').add(memory);
      return { id: docRef.id, ...memory };
    }

    async listForUser({ uid }) {
      const snapshot = await this.db
        .collection('users')
        .doc(uid)
        .collection('memories')
        .orderBy('createdAt', 'desc')
        .get();

      return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    }

    async getForUserById({ uid, id }) {
      const doc = await this.db.collection('users').doc(uid).collection('memories').doc(id).get();
      if (!doc.exists) return null;
      return { id: doc.id, ...doc.data() };
    }
  }

  global.AppServices = global.AppServices || {};
  global.AppServices.MemoryRepository = MemoryRepository;
})(window);
