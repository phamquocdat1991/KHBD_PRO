// Keep binary data out of the lesson localStorage record.
function openStore(): Promise<IDBDatabase> {
  return new Promise((resolve,reject) => {
    const request = indexedDB.open('khbd-images-v1',1);
    request.onupgradeneeded = () => request.result.createObjectStore('images');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(new Error('Không mở được bộ nhớ ảnh trên trình duyệt.'));
  });
}
export async function saveImage(dataUrl:string):Promise<string> {
  const db = await openStore();
  const id = crypto.randomUUID();
  try {
    await new Promise<void>((resolve,reject) => {
      const tx = db.transaction('images','readwrite');
      tx.objectStore('images').put(dataUrl,id);
      tx.oncomplete = () => resolve();
      tx.onerror = tx.onabort = () => reject(new Error('Không lưu được ảnh. Bộ nhớ có thể đã đầy hoặc bị chặn.'));
    });
    return id;
  } finally { db.close(); }
}
export async function loadImage(id:string):Promise<string> {
  const db = await openStore();
  try {
    return await new Promise<string>((resolve,reject) => {
      const request = db.transaction('images','readonly').objectStore('images').get(id);
      request.onsuccess = () => typeof request.result === 'string' ? resolve(request.result) : reject(new Error('Không tìm thấy ảnh đã lưu trên trình duyệt này.'));
      request.onerror = () => reject(new Error('Không đọc được ảnh đã lưu.'));
    });
  } finally { db.close(); }
}
