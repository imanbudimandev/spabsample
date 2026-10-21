import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"

export type JsonDbCollections = {
  regions: Record<string, unknown>[]
  disasters: Record<string, unknown>[]
  goods: Record<string, unknown>[]
  menus: Record<string, unknown>
  schools: Record<string, unknown>[]
  affectedSchools: Record<string, unknown>[]
  pksSchools: Record<string, unknown>[]
  signers: Record<string, unknown>[]
  paktaTemplates: Record<string, unknown>[]
  sptjmTemplates: Record<string, unknown>[]
  rabDrafts: Record<string, unknown>
  kwitansiDrafts: Record<string, unknown>
  paktaDrafts: Record<string, unknown>
  sptjmDrafts: Record<string, unknown>
  pksDrafts: Record<string, unknown>
  pmkDrafts: Record<string, unknown>
  docUploads: Record<string, unknown>
}

export type CollectionName = keyof JsonDbCollections

type DbContextValue = {
  loaded: boolean
  revision: number
  data: Partial<JsonDbCollections>
  save: <K extends CollectionName>(name: K, value: JsonDbCollections[K]) => Promise<void>
}

const DbContext = createContext<DbContextValue | null>(null)

async function fetchAll() {
  const response = await fetch("/api/db")
  if (!response.ok) throw new Error("Gagal memuat database JSON.")
  return (await response.json()) as Partial<JsonDbCollections>
}

async function putCollection<K extends CollectionName>(
  name: K,
  value: JsonDbCollections[K],
) {
  const response = await fetch(`/api/db/${name}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  })
  if (!response.ok) throw new Error(`Gagal menyimpan ${name}.`)
}

export function DbProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false)
  const [revision, setRevision] = useState(0)
  const [data, setData] = useState<Partial<JsonDbCollections>>({})

  useEffect(() => {
    fetchAll()
      .then((next) => {
        setData(next)
        setLoaded(true)
        setRevision((current) => current + 1)
      })
      .catch(() => {
        setLoaded(true)
      })
  }, [])

  const save = useCallback(
    async <K extends CollectionName>(name: K, value: JsonDbCollections[K]) => {
      setData((current) => ({ ...current, [name]: value }))
      setRevision((current) => current + 1)
      await putCollection(name, value)
    },
    [],
  )

  const value = useMemo(
    () => ({ loaded, revision, data, save }),
    [loaded, revision, data, save],
  )

  return <DbContext.Provider value={value}>{children}</DbContext.Provider>
}

export function useDb() {
  const value = useContext(DbContext)
  if (!value) {
    throw new Error("useDb harus dipakai di dalam DbProvider.")
  }
  return value
}

export function usePersistedState<T>(key: CollectionName, initial: T) {
  const { data, save, loaded } = useDb()
  const [value, setValue] = useState<T>(initial)
  const hydrated = useRef(false)

  useEffect(() => {
    if (!loaded || hydrated.current) return
    hydrated.current = true
    if (Object.prototype.hasOwnProperty.call(data, key) && data[key] != null) {
      const stored = data[key] as T
      const isEmptyArray = Array.isArray(stored) && stored.length === 0
      const isEmptyObject =
        stored &&
        typeof stored === "object" &&
        !Array.isArray(stored) &&
        Object.keys(stored as object).length === 0
      if (!isEmptyArray && !isEmptyObject) {
        setValue(stored)
        return
      }
    }
    void save(key, initial as JsonDbCollections[typeof key])
  }, [loaded, key, data, initial, save])

  const setAndSave = useCallback(
    (next: T | ((previous: T) => T)) => {
      setValue((previous) => {
        const resolved =
          typeof next === "function" ? (next as (previous: T) => T)(previous) : next
        void save(key, resolved as JsonDbCollections[typeof key])
        return resolved
      })
    },
    [key, save],
  )

  return [value, setAndSave] as const
}
