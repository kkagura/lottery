export const getDB = (
  dbName: string,
  version: number = 1
): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, version);
    request.onsuccess = function (event: any) {
      resolve(event.target.result);
    };
    request.onerror = function (error) {
      reject(error);
    };
    request.onupgradeneeded = function (event: any) {
      const db: IDBDatabase = event.target.result;
      const lotteryTable = db.createObjectStore("lottery", {
        keyPath: "id",
        autoIncrement: true,
      });
      lotteryTable.createIndex("name", "name", { unique: true });
      lotteryTable.createIndex("id", "id", { unique: true });
      const optionTable = db.createObjectStore("lottery_option", {
        keyPath: "id",
        autoIncrement: true,
      });
      optionTable.createIndex("id", "id", { unique: true });
      optionTable.createIndex("lotteryId", "lotteryId", { unique: false });
    };
  });
};
