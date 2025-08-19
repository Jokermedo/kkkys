import { promises as fs } from "fs"
import { dirname } from "path"

export async function ensureDir(path: string) {
  try {
    await fs.mkdir(path, { recursive: true })
  } catch {}
}

export async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const data = await fs.readFile(filePath, "utf-8")
    return JSON.parse(data) as T
  } catch (e: any) {
    if (e?.code === "ENOENT") {
      // initialize with fallback
      await writeJson(filePath, fallback)
      return fallback
    }
    throw e
  }
}

export async function writeJson<T>(filePath: string, data: T): Promise<void> {
  const dir = dirname(filePath)
  await ensureDir(dir)
  const json = JSON.stringify(data, null, 2)
  await fs.writeFile(filePath, json, "utf-8")
}
