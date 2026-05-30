// IndexedDB wrapper for memory cache (replaces localStorage)
(function(global) {
    'use strict';

    var DB_NAME = 'MemoryFragmentsDB';
    var DB_VERSION = 1;
    var STORE_NAME = 'memories';
    var dbPromise = null;

    function openDB() {
        if (dbPromise) return dbPromise;
        dbPromise = new Promise(function(resolve, reject) {
            var request = indexedDB.open(DB_NAME, DB_VERSION);
            request.onupgradeneeded = function(event) {
                var db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            };
            request.onsuccess = function(event) {
                resolve(event.target.result);
            };
            request.onerror = function(event) {
                console.error('IndexedDB open error:', event.target.error);
                reject(event.target.error);
            };
        });
        return dbPromise;
    }

    function getStore(mode) {
        return openDB().then(function(db) {
            var tx = db.transaction(STORE_NAME, mode);
            return tx.objectStore(STORE_NAME);
        });
    }

    var LocalDB = {
        get: function(key) {
            return getStore('readonly').then(function(store) {
                return new Promise(function(resolve, reject) {
                    var req = store.get(key);
                    req.onsuccess = function() { resolve(req.result); };
                    req.onerror = function() { reject(req.error); };
                });
            }).catch(function(err) {
                console.warn('IndexedDB get error, falling back:', err);
                return null;
            });
        },

        set: function(key, value) {
            return getStore('readwrite').then(function(store) {
                return new Promise(function(resolve, reject) {
                    var req = store.put(value, key);
                    req.onsuccess = function() { resolve(); };
                    req.onerror = function() { reject(req.error); };
                });
            }).catch(function(err) {
                console.warn('IndexedDB set error:', err);
            });
        },

        remove: function(key) {
            return getStore('readwrite').then(function(store) {
                return new Promise(function(resolve, reject) {
                    var req = store.delete(key);
                    req.onsuccess = function() { resolve(); };
                    req.onerror = function() { reject(req.error); };
                });
            }).catch(function(err) {
                console.warn('IndexedDB remove error:', err);
            });
        },

        // localStorage → IndexedDB への一度きりの移行
        migrateFromLocalStorage: function() {
            try {
                var raw = localStorage.getItem('memories');
                if (!raw) return Promise.resolve();
                var data = JSON.parse(raw);
                if (!Array.isArray(data) || data.length === 0) return Promise.resolve();
                return LocalDB.set('memories', data).then(function() {
                    localStorage.removeItem('memories');
                    console.log('Migrated ' + data.length + ' memories from localStorage to IndexedDB');
                });
            } catch (e) {
                console.warn('Migration failed:', e);
                return Promise.resolve();
            }
        }
    };

    global.LocalDB = LocalDB;
})(window);
