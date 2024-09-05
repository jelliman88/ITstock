import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';

const adapter = new JSONFile('app/db.json');  // Path to your database file
const db = new Low(adapter);

const initializeDB = async () => {
  await db.read();

  // Initial data
  const initialData = [
    { name: "Jabra Evolve2 55", quantity: "10", hasBarcode: true, barcode: "00360649073" },
    { name: "iPhone 13", quantity: "10", hasBarcode: true, barcode: "SJQYQR0JN7Q" },
    { name: "Samsung s22", quantity: "10", hasBarcode: true, barcode: "R5CWC1BEF4M" },
    { name: "no barcode", quantity: "0", hasBarcode: false, barcode: "12345678" }
  ];

  // Initialize with data if not already present
  db.data = db.data || { items: initialData };

  await db.write();
};

export { db, initializeDB };
