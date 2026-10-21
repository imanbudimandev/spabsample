import fs from "node:fs"
import path from "node:path"
import type { IncomingMessage, ServerResponse } from "node:http"
import type { Plugin } from "vite"

const COLLECTIONS = [
  "regions",
  "disasters",
  "goods",
  "menus",
  "schools",
  "affectedSchools",
  "pksSchools",
  "signers",
  "paktaTemplates",
  "sptjmTemplates",
  "rabDrafts",
  "kwitansiDrafts",
  "paktaDrafts",
  "sptjmDrafts",
  "pksDrafts",
  "pmkDrafts",
  "docUploads",
] as const

const OBJECT_COLLECTIONS = new Set([
  "menus",
  "rabDrafts",
  "kwitansiDrafts",
  "paktaDrafts",
  "sptjmDrafts",
  "pksDrafts",
  "pmkDrafts",
  "docUploads",
])

export type JsonDbCollection = (typeof COLLECTIONS)[number]

function emptyValue(name: string) {
  return OBJECT_COLLECTIONS.has(name) ? {} : []
}

function readBody(req: IncomingMessage) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = []
    req.on("data", (chunk) => chunks.push(chunk as Buffer))
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
    req.on("error", reject)
  })
}

function sendJson(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status
  res.setHeader("Content-Type", "application/json; charset=utf-8")
  res.end(JSON.stringify(payload))
}

export function jsonDbPlugin(rootDir: string): Plugin {
  const dir = path.resolve(rootDir, "database")

  const filePath = (name: string) => path.join(dir, `${name}.json`)

  const ensureDir = () => {
    fs.mkdirSync(dir, { recursive: true })
  }

  const readCollection = (name: string) => {
    ensureDir()
    const file = filePath(name)
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, `${JSON.stringify(emptyValue(name), null, 2)}\n`)
      return emptyValue(name)
    }
    try {
      return JSON.parse(fs.readFileSync(file, "utf8"))
    } catch {
      return emptyValue(name)
    }
  }

  const writeCollection = (name: string, data: unknown) => {
    ensureDir()
    fs.writeFileSync(filePath(name), `${JSON.stringify(data, null, 2)}\n`)
  }

  return {
    name: "json-db",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0] ?? ""
        if (!url.startsWith("/api/db")) {
          next()
          return
        }

        const parts = url.split("/").filter(Boolean)
        const collection = parts[2] as JsonDbCollection | undefined

        try {
          if (req.method === "GET" && !collection) {
            const all = Object.fromEntries(
              COLLECTIONS.map((name) => [name, readCollection(name)]),
            )
            sendJson(res, 200, all)
            return
          }

          if (!collection || !COLLECTIONS.includes(collection)) {
            sendJson(res, 404, { error: "Koleksi tidak ditemukan." })
            return
          }

          if (req.method === "GET") {
            sendJson(res, 200, readCollection(collection))
            return
          }

          if (req.method === "PUT") {
            const body = await readBody(req)
            const data = body ? JSON.parse(body) : emptyValue(collection)
            writeCollection(collection, data)
            sendJson(res, 200, data)
            return
          }

          sendJson(res, 405, { error: "Metode tidak diizinkan." })
        } catch (error) {
          sendJson(res, 500, {
            error: error instanceof Error ? error.message : "Gagal mengakses database JSON.",
          })
        }
      })
    },
  }
}
