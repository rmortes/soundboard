import Dexie from "dexie";

export interface IFile {
  id?: number;
  name: string;
  file: File;
}

class TestDB extends Dexie {
  files!: Dexie.Table<IFile, number>;

  constructor() {
    super("TestDB");
    this.version(1).stores({
      files: "++id, name, file",
    });
  }
}

export const db = new TestDB();
