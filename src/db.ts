import Dexie from "dexie";

export interface IFile {
  id?: number;
  name: string;
  file: File;
  volume: number;
}

class TestDB extends Dexie {
  files!: Dexie.Table<IFile, number>;

  constructor() {
    super("TestDB");
    this.version(1).stores({
      files: "++id, name, file",
    });
    this.version(2).stores({
      files: "++id, name, file, volume",
    });
  }
}

export const db = new TestDB();
