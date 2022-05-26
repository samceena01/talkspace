import { Low, JSONFile } from "lowdb";
import lodash, { omit } from "lodash";
import { verifyPassword } from "../../lib/passwordUtils";
import { dirname, resolve } from "path";
import * as fs from "fs";

export type UserCredential = {
  username: string;
  password: string;
};

export type DrawingData = {
  id: string;
  owner: string;
  imageFileName: string;
  videoFileName: string;
  isPublic: boolean;
  createdAt: number;
  duration: number;
};

type UserSettings = {
  owner: string;
  [key: string]: any;
};

export type DBData = {
  credentials: UserCredential[];
  drawings: DrawingData[];
  settings?: UserSettings;
};

class LowWithLodash<T> extends Low<T> {
  chain: lodash.ExpChain<this["data"]> = lodash.chain(this).get("data");
}
const folderDb = process.env.DB_FOLDER || "data";
const fileNameDb = process.env.DB_FILE_NAME || "db.json";

const currentFile = resolve(process.cwd(), folderDb, fileNameDb);

if (!fs.existsSync(currentFile)) {
  const defaultData = {
    credentials: [],
    drawings: [],
  };

  fs.writeFileSync(currentFile, JSON.stringify(defaultData));
}

const adapter = new JSONFile<DBData>(currentFile);
const db = new LowWithLodash(adapter);

db.data ||= { credentials: [], drawings: [] }; // initialize db with data if it doesn't exist

const transform = (user: UserCredential) => {
  const { username } = user;
  return { name: username };
};

export const findByLogin = async (data: UserCredential) => {
  await db.read();
  const { username, password: plainPassword } = data;
  const user = db.chain.get("credentials").find({ username }).value();

  const isVerified = await verifyPassword(user.password, plainPassword);

  return user && isVerified ? transform(user) : null;
};

export const findByUsername = async (username: string) => {
  await db.read();
  const user = db.chain.get("credentials").find({ username }).value();

  return user ? transform(user) : null;
};

export default db;
