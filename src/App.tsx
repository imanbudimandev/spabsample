import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode,
} from "react"
import { useDb, usePersistedState } from "./db/client"

type IconName = "alert" | "arrow" | "box" | "building" | "calendar" | "check" | "chevron" | "close" | "dashboard" | "document" | "download" | "eye" | "file" | "handshake" | "lock" | "logout" | "map" | "menu" | "money" | "more" | "package" | "receipt" | "search" | "settings" | "upload" | "user"

const iconPaths: Record<IconName, ReactNode> = {
  alert: (
    <>
      <path d="M12 9v4m0 4h.01" />
      <path d="M10.3 3.9 2.7 17a2 2 0 0 0 1.7 3h15.2a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    </>
  ),
  arrow: <path d="m9 18 6-6-6-6" />,
  box: (
    <>
      <path d="m21 8-9 5-9-5 9-5 9 5Z" />
      <path d="m3 8 9 5 9-5v8l-9 5-9-5V8Z" />
      <path d="M12 13v8" />
    </>
  ),
  building: (
    <>
      <path d="M3 21h18M6 21V5l6-3v19M18 21V9l-6-2" />
      <path d="M9 9h.01M9 13h.01M9 17h.01M15 13h.01M15 17h.01" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 11h18" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  chevron: <path d="m9 18 6-6-6-6" />,
  close: <path d="M18 6 6 18M6 6l12 12" />,
  dashboard: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </>
  ),
  document: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M8 13h8M8 17h6" />
    </>
  ),
  download: <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />,
  eye: (
    <>
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <circle cx="12" cy="12" r="2.5" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
    </>
  ),
  handshake: (
    <>
      <path d="m11 17 2 2a2.8 2.8 0 0 0 4-4l-3.1-3.1" />
      <path d="m13.6 6.4.9-.9a4.9 4.9 0 0 1 6.9 0l.1.1-5.7 5.7" />
      <path d="m8 17-1.5 1.5a2.1 2.1 0 0 1-3-3L9.2 9.8a4 4 0 0 1 5.6 0l1 1" />
      <path d="m2.5 5.5 4 4M17.5 5.5l4 4" />
    </>
  ),
  lock: (
    <>
      <rect x="4" y="10" width="16" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </>
  ),
  logout: (
    <>
      <path d="M10 17l5-5-5-5M15 12H3" />
      <path d="M14 3h5a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5" />
    </>
  ),
  map: (
    <>
      <path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z" />
      <path d="M9 3v15M15 6v15" />
    </>
  ),
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  money: (
    <>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M16 9h.01M8 15h.01" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  more: <path d="M5 12h.01M12 12h.01M19 12h.01" />,
  package: (
    <>
      <path d="m12 2 9 5-9 5-9-5 9-5Z" />
      <path d="m3 7 9 5 9-5v10l-9 5-9-5V7Z" />
    </>
  ),
  receipt: (
    <>
      <path d="M4 2v20l3-2 3 2 2-2 2 2 3-2 3 2V2l-3 2-3-2-2 2-2-2-3 2-3-2Z" />
      <path d="M16 9h-6M16 13h-6" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3A1.7 1.7 0 0 0 10 3v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V4m0 0-4 4m4-4 4 4" />
      <path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </>
  ),
}

function Icon({
  name,
  className = "size-5",
}: {
  name: IconName
  className?: string
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {iconPaths[name]}
    </svg>
  )
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

function Button({ children, className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30 ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

const menuItems: { label: string; icon: IconName }[] = [
  { label: "Dashboard", icon: "dashboard" },
  { label: "Sekolah Terdampak", icon: "building" },
  { label: "Penetapan Bantuan", icon: "package" },
  { label: "RAB", icon: "money" },
  { label: "Pakta Integritas", icon: "document" },
  { label: "Kwitansi", icon: "receipt" },
  { label: "SPTJM", icon: "file" },
  { label: "PKS", icon: "handshake" },
]

const masterItems = [
  "Master Sekolah",
  "Master Wilayah",
  "Master Jenis Bencana",
  "Master Barang",
  "Master Menu Bantuan",
]

const settingItems = [
  "Penandatanganan",
  "Template Pakta",
  "Template SPTJM",
]

const pelaporanItems = [
  "RKAS",
  "Invoice",
  "BAST",
  "PMK",
  "Dokumentasi Hasil",
] as const
type PelaporanKind = (typeof pelaporanItems)[number]

const documentKinds = ["RAB", "Pakta Integritas", "Kwitansi", "PKS"] as const
type DocumentKind = (typeof documentKinds)[number]
type DocumentStatusMap = Record<DocumentKind, boolean>

const aidMenuNames = [
  "Schoolkit",
  "Alat IPA",
  "RKD",
  "Lab Komputer",
  "Meubeler",
] as const
type AidMenuName = (typeof aidMenuNames)[number]

const emptyDocuments: DocumentStatusMap = {
  RAB: false,
  "Pakta Integritas": false,
  Kwitansi: false,
  PKS: false,
}

const schools = [
  {
    name: "SMP Negeri 1 Sukamaju",
    province: "Jawa Barat",
    regency: "Kab. Cianjur",
    location: "Kab. Cianjur, Jawa Barat",
    disaster: "Gempa Bumi",
    date: "18 Mei 2025",
    level: "Rusak Berat",
    students: 412,
    menuCount: 3,
    packages: ["Schoolkit", "Alat IPA", "Meubeler"] as AidMenuName[],
    documents: {
      RAB: true,
      "Pakta Integritas": true,
      Kwitansi: true,
      PKS: true,
    } satisfies DocumentStatusMap,
  },
  {
    name: "SMP Negeri 4 Demak",
    province: "Jawa Tengah",
    regency: "Kab. Demak",
    location: "Kab. Demak, Jawa Tengah",
    disaster: "Banjir",
    date: "16 Mei 2025",
    level: "Rusak Sedang",
    students: 482,
    menuCount: 2,
    packages: ["Schoolkit", "RKD"] as AidMenuName[],
    documents: {
      RAB: true,
      "Pakta Integritas": true,
      Kwitansi: false,
      PKS: true,
    } satisfies DocumentStatusMap,
  },
  {
    name: "SMP Negeri 2 Sumberwuluh",
    province: "Jawa Timur",
    regency: "Kab. Lumajang",
    location: "Kab. Lumajang, Jawa Timur",
    disaster: "Erupsi",
    date: "14 Mei 2025",
    level: "Rusak Berat",
    students: 318,
    menuCount: 2,
    packages: ["Lab Komputer", "Meubeler"] as AidMenuName[],
    documents: {
      RAB: true,
      "Pakta Integritas": false,
      Kwitansi: false,
      PKS: false,
    } satisfies DocumentStatusMap,
  },
  {
    name: "SMP Negeri 1 Tanjung",
    province: "Nusa Tenggara Barat",
    regency: "Kab. Lombok Utara",
    location: "Kab. Lombok Utara, NTB",
    disaster: "Tanah Longsor",
    date: "12 Mei 2025",
    level: "Rusak Ringan",
    students: 365,
    menuCount: 1,
    packages: ["Schoolkit"] as AidMenuName[],
    documents: {
      RAB: false,
      "Pakta Integritas": false,
      Kwitansi: false,
      PKS: false,
    } satisfies DocumentStatusMap,
  },
  {
    name: "SMP Negeri 3 Garut",
    province: "Jawa Barat",
    regency: "Kab. Garut",
    location: "Kab. Garut, Jawa Barat",
    disaster: "Gempa Bumi",
    date: "11 Mei 2025",
    level: "Rusak Sedang",
    students: 528,
    menuCount: 3,
    packages: ["Alat IPA", "RKD", "Lab Komputer"] as AidMenuName[],
    documents: {
      RAB: true,
      "Pakta Integritas": true,
      Kwitansi: false,
      PKS: true,
    } satisfies DocumentStatusMap,
  },
  {
    name: "SMP Negeri 2 Palu",
    province: "Sulawesi Tengah",
    regency: "Kota Palu",
    location: "Kota Palu, Sulawesi Tengah",
    disaster: "Gempa Bumi",
    date: "9 Mei 2025",
    level: "Rusak Berat",
    students: 441,
    menuCount: 3,
    packages: ["Schoolkit", "RKD", "Meubeler"] as AidMenuName[],
    documents: {
      RAB: true,
      "Pakta Integritas": true,
      Kwitansi: true,
      PKS: true,
    } satisfies DocumentStatusMap,
  },
  {
    name: "SMP Negeri 5 Padang",
    province: "Sumatera Barat",
    regency: "Kota Padang",
    location: "Kota Padang, Sumatera Barat",
    disaster: "Banjir",
    date: "8 Mei 2025",
    level: "Rusak Sedang",
    students: 396,
    menuCount: 2,
    packages: ["Alat IPA", "Lab Komputer"] as AidMenuName[],
    documents: {
      RAB: true,
      "Pakta Integritas": false,
      Kwitansi: true,
      PKS: false,
    } satisfies DocumentStatusMap,
  },
  {
    name: "SMP Negeri 1 Cianjur",
    province: "Jawa Barat",
    regency: "Kab. Cianjur",
    location: "Kab. Cianjur, Jawa Barat",
    disaster: "Gempa Bumi",
    date: "7 Mei 2025",
    level: "Rusak Ringan",
    students: 454,
    menuCount: 2,
    packages: ["Schoolkit", "Meubeler"] as AidMenuName[],
    documents: {
      RAB: true,
      "Pakta Integritas": true,
      Kwitansi: false,
      PKS: false,
    } satisfies DocumentStatusMap,
  },
]

type SchoolkitKategori = "uang" | "barang"
type SchoolRecord = (typeof schools)[number] & {
  schoolkitKategori?: SchoolkitKategori
}

function isSchoolkitBarang(school?: {
  packages?: readonly string[]
  schoolkitKategori?: string
}) {
  return (
    Boolean(school?.packages?.includes("Schoolkit")) &&
    school?.schoolkitKategori === "barang"
  )
}

function isSchoolkitBarangOnly(school?: {
  packages?: readonly string[]
  schoolkitKategori?: string
}) {
  const packages = school?.packages ?? []
  return (
    packages.length === 1 &&
    packages[0] === "Schoolkit" &&
    school?.schoolkitKategori === "barang"
  )
}

function uangMenus(school?: {
  packages?: readonly string[]
  schoolkitKategori?: string
}) {
  const packages = [...(school?.packages ?? [])]
  if (!isSchoolkitBarang(school)) return packages
  return packages.filter((menu) => menu !== "Schoolkit")
}

function financeDocRequired(school: SchoolRecord, kind: DocumentKind) {
  if (kind === "PKS") return true
  if (kind === "Pakta Integritas") return !isSchoolkitBarangOnly(school)
  return uangMenus(school).length > 0
}

function useAffectedSchoolList() {
  const { data } = useDb()
  const stored = data.affectedSchools as SchoolRecord[] | undefined
  return stored?.length ? stored : schools
}

function syncAffectedSchools(next: SchoolRecord[]) {
  schools.splice(0, schools.length, ...next)
}

function schoolRelationMessage(
  name: string,
  data: {
    signers?: { schoolName?: string }[]
    docUploads?: Record<string, unknown>
    rabDrafts?: Record<string, unknown>
    kwitansiDrafts?: Record<string, unknown>
    paktaDrafts?: Record<string, unknown>
    sptjmDrafts?: Record<string, unknown>
    pksDrafts?: Record<string, unknown>
    pmkDrafts?: Record<string, unknown>
  },
) {
  if (data.signers?.some((item) => item.schoolName === name)) {
    return "Sekolah masih punya data penandatangan. Hapus relasi itu dulu."
  }
  if (data.docUploads?.[name]) {
    return "Sekolah masih punya unggahan dokumen. Hapus unggahan itu dulu."
  }
  const drafts = [
    data.rabDrafts,
    data.kwitansiDrafts,
    data.paktaDrafts,
    data.sptjmDrafts,
    data.pksDrafts,
    data.pmkDrafts,
  ]
  if (
    drafts.some((collection) =>
      Object.keys(collection ?? {}).some(
        (key) => key === name || key.startsWith(`${name}::`),
      ),
    )
  ) {
    return "Sekolah masih punya draf dokumen. Hapus draf itu dulu."
  }
  return null
}

const pksSchools = [
  {
    name: "SMP Negeri 1 Sukamaju",
    npsn: "20204182",
    address: "Jl. Raya Sukamaju No. 12, Cianjur, Jawa Barat",
    principal: "Hendra Gunawan, S.Pd.",
    number: "SPAB/PKS/0182/V/2025",
    amount: "Rp185.000.000",
  },
  {
    name: "SMP Negeri 4 Demak",
    npsn: "20319374",
    address: "Jl. Sultan Fatah No. 58, Demak, Jawa Tengah",
    principal: "Sri Wahyuni, M.Pd.",
    number: "SPAB/PKS/0181/V/2025",
    amount: "Rp120.000.000",
  },
  {
    name: "SMP Negeri 2 Sumberwuluh",
    npsn: "20520914",
    address: "Desa Sumberwuluh, Candipuro, Lumajang, Jawa Timur",
    principal: "Ahmad Fauzi, S.Pd.",
    number: "SPAB/PKS/0180/V/2025",
    amount: "Rp210.000.000",
  },
  {
    name: "SMP Negeri 1 Tanjung",
    npsn: "50200317",
    address: "Jl. Pendidikan No. 4, Tanjung, Lombok Utara, NTB",
    principal: "Muhammad Ridwan, M.Pd.",
    number: "SPAB/PKS/0179/V/2025",
    amount: "Rp95.000.000",
  },
  {
    name: "SMP Negeri 3 Garut",
    npsn: "20211845",
    address: "Jl. Ahmad Yani No. 21, Garut, Jawa Barat",
    principal: "Rina Marlina, M.Pd.",
    number: "SPAB/PKS/0178/V/2025",
    amount: "Rp165.000.000",
  },
  {
    name: "SMP Negeri 2 Palu",
    npsn: "40201288",
    address: "Jl. Gatot Subroto No. 9, Palu, Sulawesi Tengah",
    principal: "Andi Rahman, S.Pd.",
    number: "SPAB/PKS/0177/V/2025",
    amount: "Rp198.000.000",
  },
  {
    name: "SMP Negeri 5 Padang",
    npsn: "10307821",
    address: "Jl. Sudirman No. 45, Padang, Sumatera Barat",
    principal: "Fitriani, M.Pd.",
    number: "SPAB/PKS/0176/V/2025",
    amount: "Rp142.000.000",
  },
  {
    name: "SMP Negeri 1 Cianjur",
    npsn: "20203119",
    address: "Jl. Dr. Muwardi No. 7, Cianjur, Jawa Barat",
    principal: "Dedi Kurniawan, S.Pd.",
    number: "SPAB/PKS/0175/V/2025",
    amount: "Rp110.000.000",
  },
]

type PksSchool = typeof pksSchools[number]
const initialPksSchools: PksSchool[] = pksSchools.map((item) => ({ ...item }))

const signerRoleOptions = [
  { key: "kepala-sekolah", label: "Kepala Sekolah" },
  { key: "ketua-pelaksana", label: "Ketua Pelaksana" },
  { key: "ketua-komite", label: "Ketua Komite Satuan Pendidikan" },
  { key: "kpa", label: "Kuasa Pengguna Anggaran" },
  { key: "bendahara", label: "Bendahara" },
  { key: "ppk", label: "Pejabat Pembuat Komitmen" },
] as const

type SignerRole = (typeof signerRoleOptions)[number]["key"]

type SignerRecord = {
  id: number
  role: SignerRole
  name: string
  identity: string
  identityLabel: "NIP" | "NIK"
  position: string
  schoolName: string
  line1: string
  line2: string
  line3: string
  place: string
  date: string
}

const initialSigners: SignerRecord[] = [
  {
    id: 1,
    role: "kpa",
    name: "Hendro Sucipto, S.Kom.",
    identity: "19751229 200612 1 001",
    identityLabel: "NIP",
    position: "Pejabat Pembuat Komitmen",
    schoolName: "",
    line1: "an. Kuasa Pengguna Anggaran",
    line2: "Satker Direktorat SMP",
    line3: "Sarana Prasarana dan Tata Kelola",
    place: "Jakarta",
    date: "2026-05-20",
  },
  {
    id: 2,
    role: "bendahara",
    name: "Purwandani Ratih Ruswati, S.E.",
    identity: "19791003 200112 2 001",
    identityLabel: "NIP",
    position: "Bendahara Pengeluaran Pembantu",
    schoolName: "",
    line1: "Bendahara",
    line2: "Pengeluaran Pembantu",
    line3: "Satker Direktorat SMP",
    place: "Jakarta",
    date: "2026-05-20",
  },
  {
    id: 3,
    role: "ppk",
    name: "Budi Santoso, S.E., M.M.",
    identity: "196808171993031001",
    identityLabel: "NIP",
    position: "Pejabat Pembuat Komitmen",
    schoolName: "",
    line1: "PIHAK PERTAMA",
    line2: "Pejabat Pembuat Komitmen",
    line3: "",
    place: "Jakarta",
    date: "2025-05-20",
  },
  ...pksSchools.flatMap((school, index) => {
    const place = schools.find((item) => item.name === school.name)?.regency ?? ""
    const pelaksanaNames = [
      ["Rizal Agusnika, S.Pd", "199708152024211003"],
      ["Slamet Riyadi, S.Pd", "198803122010011003"],
      ["Nurul Hidayah, S.Pd", "198512052009012002"],
      ["I Made Wirawan, S.Pd", "198201152008011004"],
      ["Asep Maulana, S.Pd", "197911202006041005"],
      ["Yusuf Rahman, S.Pd", "198407112011011006"],
      ["Dewi Lestari, S.Pd", "198909172014012007"],
      ["Taufik Hidayat, S.Pd", "198606082012011008"],
    ]
    const komiteNames = [
      ["Usman HS", "1105110209690001"],
      ["Hadi Santoso", "1105110209700002"],
      ["Siti Aminah", "1105110209710003"],
      ["Abdul Karim", "1105110209720004"],
      ["Wawan Setiawan", "1105110209730005"],
      ["Maria Magdalena", "1105110209740006"],
      ["Hasan Basri", "1105110209750007"],
      ["Rukmini", "1105110209760008"],
    ]
    const pelaksana = pelaksanaNames[index] ?? pelaksanaNames[0]
    const komite = komiteNames[index] ?? komiteNames[0]
    return [
      {
        id: 10 + index * 3,
        role: "kepala-sekolah" as const,
        name: school.principal,
        identity:
          index === 0
            ? "19780512 200501 1 008"
            : `19780${index}12200501100${index}`,
        identityLabel: "NIP" as const,
        position: "Kepala Sekolah",
        schoolName: school.name,
        line1: "Kepala Sekolah",
        line2: "",
        line3: "",
        place,
        date: "2025-05-22",
      },
      {
        id: 11 + index * 3,
        role: "ketua-pelaksana" as const,
        name: pelaksana[0],
        identity: pelaksana[1],
        identityLabel: "NIP" as const,
        position: "Ketua Pelaksana",
        schoolName: school.name,
        line1: "Ketua Pelaksana",
        line2: "",
        line3: "",
        place,
        date: "2025-05-22",
      },
      {
        id: 12 + index * 3,
        role: "ketua-komite" as const,
        name: komite[0],
        identity: komite[1],
        identityLabel: "NIK" as const,
        position: "Ketua Komite Satuan Pendidikan",
        schoolName: school.name,
        line1: "Ketua Komite Satuan Pendidikan",
        line2: "",
        line3: "",
        place,
        date: "2025-05-22",
      },
    ]
  }),
]

function signerRoleLabel(role: SignerRole) {
  return signerRoleOptions.find((item) => item.key === role)?.label ?? role
}

function isSchoolSignerRole(role: SignerRole) {
  return (
    role === "kepala-sekolah" ||
    role === "ketua-pelaksana" ||
    role === "ketua-komite"
  )
}

function findSigner(
  signers: SignerRecord[],
  role: SignerRole,
  schoolName?: string,
) {
  if (isSchoolSignerRole(role) && schoolName) {
    return signers.find(
      (item) => item.role === role && item.schoolName === schoolName,
    )
  }
  return signers.find((item) => item.role === role && !item.schoolName)
}

function schoolCommitteeSigners(signers: SignerRecord[], schoolName: string) {
  return {
    pelaksana: findSigner(signers, "ketua-pelaksana", schoolName) ?? null,
    komite: findSigner(signers, "ketua-komite", schoolName) ?? null,
  }
}

function SchoolCommitteeSignatures({
  pelaksana,
  komite,
}: {
  pelaksana?: SignerRecord | null
  komite?: SignerRecord | null
}) {
  if (!pelaksana && !komite) return null
  return (
    <div className="mt-10 grid grid-cols-1 gap-8 text-center text-xs sm:grid-cols-2">
      {pelaksana && (
        <div>
          <div>Ketua Pelaksana</div>
          <div className="h-16" />
          <div className="font-bold underline">{pelaksana.name}</div>
          <div>
            {pelaksana.identityLabel}. {pelaksana.identity}
          </div>
        </div>
      )}
      {komite && (
        <div>
          <div>Ketua Komite Satuan Pendidikan</div>
          <div className="h-16" />
          <div className="font-bold underline">{komite.name}</div>
          <div>
            {komite.identityLabel}. {komite.identity}
          </div>
        </div>
      )}
    </div>
  )
}

function formatSignerDateLabel(date: string, fallback: string) {
  if (!date) return fallback
  const parsed = new Date(`${date}T00:00:00`)
  if (Number.isNaN(parsed.getTime())) return date
  return parsed.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function schoolSignerView(
  signers: SignerRecord[],
  schoolName: string,
  fallback?: { name?: string; nip?: string; role?: string; place?: string; date?: string },
) {
  const item = findSigner(signers, "kepala-sekolah", schoolName)
  const date = item?.date || fallback?.date || ""
  return {
    name: item?.name || fallback?.name || "",
    nip: item?.identity || fallback?.nip || "",
    role: item?.position || fallback?.role || "Kepala Sekolah",
    place: item?.place || fallback?.place || "",
    date,
    dateLabel: formatSignerDateLabel(date, "22 Mei 2025"),
  }
}

const masterSchools = [
  {
    npsn: "20204182",
    name: "SMP Negeri 1 Sukamaju",
    jenjang: "SMP",
    province: "Jawa Barat",
    regency: "Kab. Cianjur",
    principal: "Hendra Gunawan, S.Pd.",
    status: "Aktif",
  },
  {
    npsn: "20203119",
    name: "SMP Negeri 1 Cianjur",
    jenjang: "SMP",
    province: "Jawa Barat",
    regency: "Kab. Cianjur",
    principal: "Dedi Kurniawan, S.Pd.",
    status: "Aktif",
  },
  {
    npsn: "20211845",
    name: "SMP Negeri 3 Garut",
    jenjang: "SMP",
    province: "Jawa Barat",
    regency: "Kab. Garut",
    principal: "Rina Marlina, M.Pd.",
    status: "Aktif",
  },
  {
    npsn: "20319374",
    name: "SMP Negeri 4 Demak",
    jenjang: "SMP",
    province: "Jawa Tengah",
    regency: "Kab. Demak",
    principal: "Sri Wahyuni, M.Pd.",
    status: "Aktif",
  },
  {
    npsn: "20520914",
    name: "SMP Negeri 2 Sumberwuluh",
    jenjang: "SMP",
    province: "Jawa Timur",
    regency: "Kab. Lumajang",
    principal: "Ahmad Fauzi, S.Pd.",
    status: "Aktif",
  },
  {
    npsn: "50200317",
    name: "SMP Negeri 1 Tanjung",
    jenjang: "SMP",
    province: "Nusa Tenggara Barat",
    regency: "Kab. Lombok Utara",
    principal: "Muhammad Ridwan, M.Pd.",
    status: "Aktif",
  },
  {
    npsn: "40201288",
    name: "SMP Negeri 2 Palu",
    jenjang: "SMP",
    province: "Sulawesi Tengah",
    regency: "Kota Palu",
    principal: "Andi Rahman, S.Pd.",
    status: "Aktif",
  },
  {
    npsn: "10307821",
    name: "SMP Negeri 5 Padang",
    jenjang: "SMP",
    province: "Sumatera Barat",
    regency: "Kota Padang",
    principal: "Fitriani, M.Pd.",
    status: "Aktif",
  },
  {
    npsn: "20205501",
    name: "SMP Negeri 2 Cianjur",
    jenjang: "SMP",
    province: "Jawa Barat",
    regency: "Kab. Cianjur",
    principal: "Siti Nurhaliza, M.Pd.",
    status: "Aktif",
  },
  {
    npsn: "20320112",
    name: "SMP Negeri 1 Demak",
    jenjang: "SMP",
    province: "Jawa Tengah",
    regency: "Kab. Demak",
    principal: "Bambang Sutrisno, S.Pd.",
    status: "Nonaktif",
  },
]

const masterRegions = [
  { code: "32", name: "Jawa Barat", type: "Provinsi", parent: "-" },
  { code: "3203", name: "Kab. Cianjur", type: "Kabupaten", parent: "Jawa Barat" },
  { code: "3205", name: "Kab. Garut", type: "Kabupaten", parent: "Jawa Barat" },
  {
    code: "3203.05",
    name: "Kec. Sukamaju",
    type: "Kecamatan",
    parent: "Kab. Cianjur",
  },
  {
    code: "3203.01",
    name: "Kec. Cianjur",
    type: "Kecamatan",
    parent: "Kab. Cianjur",
  },
  { code: "33", name: "Jawa Tengah", type: "Provinsi", parent: "-" },
  { code: "3321", name: "Kab. Demak", type: "Kabupaten", parent: "Jawa Tengah" },
  {
    code: "3321.03",
    name: "Kec. Demak",
    type: "Kecamatan",
    parent: "Kab. Demak",
  },
  { code: "35", name: "Jawa Timur", type: "Provinsi", parent: "-" },
  {
    code: "3508",
    name: "Kab. Lumajang",
    type: "Kabupaten",
    parent: "Jawa Timur",
  },
  {
    code: "3508.04",
    name: "Kec. Candipuro",
    type: "Kecamatan",
    parent: "Kab. Lumajang",
  },
  { code: "52", name: "Nusa Tenggara Barat", type: "Provinsi", parent: "-" },
  {
    code: "5208",
    name: "Kab. Lombok Utara",
    type: "Kabupaten",
    parent: "Nusa Tenggara Barat",
  },
  { code: "72", name: "Sulawesi Tengah", type: "Provinsi", parent: "-" },
  { code: "7271", name: "Kota Palu", type: "Kota", parent: "Sulawesi Tengah" },
  { code: "13", name: "Sumatera Barat", type: "Provinsi", parent: "-" },
  { code: "1371", name: "Kota Padang", type: "Kota", parent: "Sumatera Barat" },
]

const masterDisasters = [
  {
    code: "GPN",
    name: "Gempa Bumi",
    category: "Geologi",
    status: "Aktif",
  },
  {
    code: "BJR",
    name: "Banjir",
    category: "Hidrometeorologi",
    status: "Aktif",
  },
  {
    code: "ERU",
    name: "Erupsi",
    category: "Geologi",
    status: "Aktif",
  },
  {
    code: "LGS",
    name: "Tanah Longsor",
    category: "Geologi",
    status: "Aktif",
  },
  {
    code: "TSN",
    name: "Tsunami",
    category: "Geologi",
    status: "Aktif",
  },
  {
    code: "KBR",
    name: "Kebakaran",
    category: "Non alam",
    status: "Aktif",
  },
  {
    code: "PTN",
    name: "Puting Beliung",
    category: "Hidrometeorologi",
    status: "Aktif",
  },
  {
    code: "KRG",
    name: "Kekeringan",
    category: "Hidrometeorologi",
    status: "Nonaktif",
  },
]

const masterGoods = [
  {
    code: "BRG-001",
    name: "Tas sekolah",
    unit: "Buah",
    category: "Schoolkit",
    price: 185000,
  },
  {
    code: "BRG-002",
    name: "Paket alat tulis",
    unit: "Paket",
    category: "Schoolkit",
    price: 125000,
  },
  {
    code: "BRG-003",
    name: "Seragam sekolah",
    unit: "Set",
    category: "Schoolkit",
    price: 275000,
  },
  {
    code: "BRG-004",
    name: "Kit praktikum IPA",
    unit: "Set",
    category: "Alat IPA",
    price: 4500000,
  },
  {
    code: "BRG-005",
    name: "Mikroskop siswa",
    unit: "Unit",
    category: "Alat IPA",
    price: 1850000,
  },
  {
    code: "BRG-006",
    name: "Rehab ruang kelas rusak",
    unit: "Ruang",
    category: "RKD",
    price: 45000000,
  },
  {
    code: "BRG-007",
    name: "Pengecatan dan finishing",
    unit: "Ruang",
    category: "RKD",
    price: 8500000,
  },
  {
    code: "BRG-008",
    name: "Komputer siswa",
    unit: "Unit",
    category: "Lab Komputer",
    price: 7800000,
  },
  {
    code: "BRG-009",
    name: "Meja dan kursi lab",
    unit: "Set",
    category: "Lab Komputer",
    price: 1250000,
  },
  {
    code: "BRG-010",
    name: "Meja siswa",
    unit: "Unit",
    category: "Meubeler",
    price: 650000,
  },
  {
    code: "BRG-011",
    name: "Kursi siswa",
    unit: "Unit",
    category: "Meubeler",
    price: 425000,
  },
  {
    code: "BRG-012",
    name: "Lemari kelas",
    unit: "Unit",
    category: "Meubeler",
    price: 2750000,
  },
]

type MasterGood = (typeof masterGoods)[number]

function parseRupiahNumber(value: string) {
  return Number(value.replace(/[^\d]/g, "")) || 0
}

function pksJenisBantuan(schoolName: string) {
  const menus = schools.find((item) => item.name === schoolName)?.packages ?? []
  if (menus.length === 0) return "Bantuan Sosial SPAB"
  return joinMenuNames(menus)
}

function pksOpeningDate(date: string) {
  const parsed = date ? new Date(`${date}T00:00:00`) : new Date()
  const valid = Number.isNaN(parsed.getTime()) ? new Date() : parsed
  const days = [
    "Minggu",
    "Senin",
    "Selasa",
    "Rabu",
    "Kamis",
    "Jumat",
    "Sabtu",
  ]
  const months = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ]
  return {
    hari: days[valid.getDay()],
    tanggal: String(valid.getDate()),
    bulan: months[valid.getMonth()],
    tahun: String(valid.getFullYear()),
    label: `${valid.getDate()} ${months[valid.getMonth()]} ${valid.getFullYear()}`,
  }
}

function createPksPdf(
  school: PksSchool,
  options: {
    principal: string
    principalNip: string
    ppkName: string
    ppkNip: string
    date: string
  },
) {
  const escapePdf = (text: string) =>
    text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")
  const opened = pksOpeningDate(options.date)
  const jenis = pksJenisBantuan(school.name)
  const amountNumber = parseRupiahNumber(school.amount)
  const lines = [
    "PERJANJIAN KERJASAMA",
    `NOMOR : ${school.number}`,
    "ANTARA PEJABAT PEMBUAT KOMITMEN DIREKTORAT SMP",
    "DENGAN KEPALA SATUAN PENDIDIKAN",
    "TENTANG PEMBERIAN BANTUAN SOSIAL SPAB SATUAN PENDIDIKAN",
    "SEKOLAH MENENGAH PERTAMA TAHUN ANGGARAN 2026",
    "",
    `Pada hari ini, ${opened.hari} tanggal ${opened.tanggal} bulan ${opened.bulan} tahun dua ribu dua puluh enam.`,
    `PIHAK KESATU: ${options.ppkName} NIP. ${options.ppkNip}`,
    `PIHAK KEDUA: ${options.principal} NIP. ${options.principalNip}`,
    `${school.name} NPSN ${school.npsn}`,
    school.address,
    "",
    `Pasal 3 Nilai bantuan ${school.amount} (${terbilangRupiah(amountNumber)}) untuk jenis bantuan ${jenis}.`,
    "",
    `Jakarta, ${opened.label}`,
    `PIHAK KESATU ${options.ppkName}`,
    `PIHAK KEDUA ${options.principal}`,
  ]
  const content = [
    "BT",
    "/F1 14 Tf",
    "55 790 Td",
    `(${escapePdf(lines[0])}) Tj`,
    "/F1 9 Tf",
    ...lines
      .slice(1)
      .flatMap((line) => ["0 -20 Td", `(${escapePdf(line)}) Tj`]),
    "ET",
  ].join("\n")
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ]
  let pdf = "%PDF-1.4\n"
  const offsets = [0]
  objects.forEach((object, index) => {
    offsets.push(pdf.length)
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  })
  const xrefOffset = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`
  })
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`
  return new Blob([pdf], { type: "application/pdf" })
}

function StatusPill({
  children,
  tone = "blue",
}: {
  children: ReactNode
  tone?: "blue" | "green" | "orange" | "red"
}) {
  const tones = {
    blue: "bg-blue-soft text-primary",
    green: "bg-green-soft text-success",
    orange: "bg-orange-soft text-warning-dark",
    red: "bg-red-soft text-danger",
  }
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  )
}

type DocApprovalStatus =
  | "draft"
  | "menunggu persetujuan"
  | "disetujui"
  | "perlu perubahan"

type PortalRole = "admin" | "dinas" | "direktorat" | "school"

type SignedUploadFile = {
  name: string
  size: number
  uploadedAt: string
  approvalStatus?: Exclude<DocApprovalStatus, "draft">
  reviewNote?: string
  reviewedBy?: string
  reviewedAt?: string
}

function canReviewDocuments(role: PortalRole) {
  return role === "admin" || role === "dinas" || role === "direktorat"
}

function uploadApprovalStatus(
  file: SignedUploadFile | null | undefined,
): Exclude<DocApprovalStatus, "draft"> | null {
  if (!file) return null
  if (
    file.approvalStatus === "disetujui" ||
    file.approvalStatus === "perlu perubahan"
  ) {
    return file.approvalStatus
  }
  return "menunggu persetujuan"
}

function documentFlowStatus(
  hasDraft: boolean,
  file: SignedUploadFile | null | undefined,
): DocApprovalStatus | "belum" {
  const uploaded = uploadApprovalStatus(file)
  if (uploaded) return uploaded
  if (hasDraft) return "draft"
  return "belum"
}

function documentFlowMeta(status: DocApprovalStatus | "belum"): {
  label: string
  tone: "blue" | "green" | "orange" | "red"
} {
  if (status === "disetujui") return { label: "Disetujui", tone: "green" }
  if (status === "perlu perubahan") {
    return { label: "Perlu perubahan", tone: "red" }
  }
  if (status === "menunggu persetujuan") {
    return { label: "Menunggu persetujuan", tone: "orange" }
  }
  if (status === "draft") return { label: "Draft", tone: "blue" }
  return { label: "Belum ada draf", tone: "orange" }
}

function DocFlowStatusPill({
  hasDraft,
  file,
}: {
  hasDraft: boolean
  file: SignedUploadFile | null
}) {
  const meta = documentFlowMeta(documentFlowStatus(hasDraft, file))
  return <StatusPill tone={meta.tone}>{meta.label}</StatusPill>
}

type PelaporanUploads = {
  rkas: SignedUploadFile | null
  invoice: SignedUploadFile | null
  bast: SignedUploadFile | null
  pmk: SignedUploadFile | null
  dokumentasi: SignedUploadFile[]
}

type SchoolDocUploads = {
  rab: Record<string, SignedUploadFile | null>
  pakta: SignedUploadFile | null
  kwitansi: Record<string, SignedUploadFile | null>
  sptjm: SignedUploadFile | null
  pks: SignedUploadFile | null
  pelaporan: PelaporanUploads
}

type DocUploadsMap = Record<string, SchoolDocUploads>

function emptyPelaporanUploads(): PelaporanUploads {
  return { rkas: null, invoice: null, bast: null, pmk: null, dokumentasi: [] }
}

function emptySchoolUploads(): SchoolDocUploads {
  return {
    rab: {},
    pakta: null,
    kwitansi: {},
    sptjm: null,
    pks: null,
    pelaporan: emptyPelaporanUploads(),
  }
}

function schoolDocUploads(all: DocUploadsMap, schoolName: string): SchoolDocUploads {
  const current = all[schoolName]
  if (!current) return emptySchoolUploads()
  return {
    ...emptySchoolUploads(),
    ...current,
    pelaporan: {
      ...emptyPelaporanUploads(),
      ...current.pelaporan,
      dokumentasi: current.pelaporan?.dokumentasi ?? [],
      pmk: current.pelaporan?.pmk ?? null,
    },
  }
}

const DOKUMENTASI_MAX = 5

function requiredPelaporanItems(school?: {
  packages?: readonly string[]
  schoolkitKategori?: string
}): PelaporanKind[] {
  if (isSchoolkitBarangOnly(school)) {
    return pelaporanItems.filter(
      (item) => item === "BAST" || item === "PMK" || item === "Dokumentasi Hasil",
    )
  }
  return [...pelaporanItems]
}

function pelaporanKindDone(uploads: PelaporanUploads, kind: PelaporanKind) {
  if (kind === "Dokumentasi Hasil") return uploads.dokumentasi.length > 0
  if (kind === "RKAS") return Boolean(uploads.rkas)
  if (kind === "Invoice") return Boolean(uploads.invoice)
  if (kind === "PMK") return Boolean(uploads.pmk)
  return Boolean(uploads.bast)
}

function pelaporanProgress(
  uploads: PelaporanUploads,
  school?: { packages?: readonly string[]; schoolkitKategori?: string },
) {
  const required = requiredPelaporanItems(school)
  const done = required.filter((kind) => pelaporanKindDone(uploads, kind)).length
  return { done, total: required.length }
}

function patchSchoolUploads(
  all: DocUploadsMap,
  schoolName: string,
  patch: (current: SchoolDocUploads) => SchoolDocUploads,
): DocUploadsMap {
  return {
    ...all,
    [schoolName]: patch(schoolDocUploads(all, schoolName)),
  }
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function readSignedUpload(file: File) {
  const allowed =
    file.type === "application/pdf" ||
    file.type === "image/jpeg" ||
    file.type === "image/png" ||
    /\.(pdf|jpe?g|png)$/i.test(file.name)
  if (!allowed) return { error: "Unggah PDF, JPG, atau PNG (maks. 10 MB)." }
  if (file.size > 10 * 1024 * 1024) return { error: "Ukuran berkas maksimal 10 MB." }
  return {
    file: {
      name: file.name,
      size: file.size,
      uploadedAt: new Date().toLocaleString("id-ID"),
    } satisfies SignedUploadFile,
  }
}

function SignedDocumentUpload({
  documentLabel,
  file,
  onChange,
  enabled = true,
  disabledHint,
  waitingLabel,
  title,
  hint,
  trackApproval = false,
  hasDraft = false,
  canReview = false,
  reviewerName = "",
}: {
  documentLabel: string
  file: SignedUploadFile | null
  onChange: (file: SignedUploadFile | null) => void
  enabled?: boolean
  disabledHint?: string
  waitingLabel?: string
  title?: string
  hint?: string
  trackApproval?: boolean
  hasDraft?: boolean
  canReview?: boolean
  reviewerName?: string
}) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState("")
  const [changeOpen, setChangeOpen] = useState(false)
  const [reviewNote, setReviewNote] = useState("")
  const [reviewError, setReviewError] = useState("")
  const approvalStatus = trackApproval ? uploadApprovalStatus(file) : null
  const locked = approvalStatus === "disetujui"
  const uploadEnabled = enabled && !locked
  const flow = trackApproval
    ? documentFlowMeta(documentFlowStatus(hasDraft, file))
    : null

  const pickFile = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0]
    event.target.value = ""
    if (!next) return
    const parsed = readSignedUpload(next)
    if ("error" in parsed) {
      setError(parsed.error ?? "Berkas tidak dapat diunggah.")
      return
    }
    setError("")
    setChangeOpen(false)
    setReviewNote("")
    onChange(
      trackApproval
        ? {
            ...parsed.file,
            approvalStatus: "menunggu persetujuan",
            reviewNote: "",
            reviewedBy: "",
            reviewedAt: "",
          }
        : parsed.file,
    )
  }

  const applyReview = (status: "disetujui" | "perlu perubahan") => {
    if (!file) return
    if (status === "perlu perubahan" && !reviewNote.trim()) {
      setReviewError("Isi catatan perubahan terlebih dahulu.")
      return
    }
    setReviewError("")
    setChangeOpen(false)
    onChange({
      ...file,
      approvalStatus: status,
      reviewNote: status === "perlu perubahan" ? reviewNote.trim() : "",
      reviewedBy: reviewerName,
      reviewedAt: new Date().toLocaleString("id-ID"),
    })
    setReviewNote("")
  }

  const statusHint = !enabled
    ? disabledHint ||
      "Simpan draf terlebih dahulu. Tombol unggah aktif setelah draf tersimpan."
    : locked
      ? "Dokumen sudah disetujui."
      : approvalStatus === "perlu perubahan"
        ? "Perbaiki dokumen sesuai catatan, lalu unggah ulang. Status kembali menjadi menunggu persetujuan."
        : approvalStatus === "menunggu persetujuan"
          ? "Dokumen menunggu persetujuan user dinas, direktorat, atau admin."
          : hint ||
            `Cetak ${documentLabel}, tanda tangani dan cap basah, lalu unggah hasil scan (PDF/JPG/PNG, maks. 10 MB).`

  return (
    <div className="mt-4 rounded-2xl border border-dashed border-border bg-surface/80 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-ink">
            {title || "Unggah dokumen TTD cap basah"}
          </div>
          <div className="mt-1 text-[0.65rem] leading-5 text-muted">
            {trackApproval
              ? statusHint
              : enabled
                ? hint ||
                  `Cetak ${documentLabel}, tanda tangani dan cap basah, lalu unggah hasil scan (PDF/JPG/PNG, maks. 10 MB).`
                : disabledHint ||
                  "Simpan draf terlebih dahulu. Tombol unggah aktif setelah draf tersimpan."}
          </div>
        </div>
        {flow ? (
          <StatusPill tone={flow.tone}>{flow.label}</StatusPill>
        ) : (
          <StatusPill tone={file ? "green" : enabled ? "orange" : "blue"}>
            {file
              ? "Sudah unggah"
              : enabled
                ? "Belum unggah"
                : waitingLabel || "Menunggu draf"}
          </StatusPill>
        )}
      </div>
      {file ? (
        <div className="mt-3 space-y-3">
          <div className="flex items-start gap-3 rounded-xl bg-white px-3 py-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-green-soft text-success">
              <Icon name="check" className="size-4" />
            </div>
            <div className="min-w-0">
              <div className="truncate text-xs font-bold text-ink">
                {file.name}
              </div>
              <div className="mt-1 text-[0.65rem] text-muted">
                {formatFileSize(file.size)} · {file.uploadedAt}
              </div>
            </div>
          </div>
          {file.approvalStatus === "perlu perubahan" && file.reviewNote && (
            <div className="rounded-xl bg-red-soft px-3 py-2 text-[0.65rem] leading-5 text-danger">
              Perlu perubahan
              {file.reviewedBy ? ` oleh ${file.reviewedBy}` : ""}:{" "}
              {file.reviewNote}
            </div>
          )}
          {file.approvalStatus === "disetujui" && (
            <div className="text-[0.65rem] font-semibold text-success">
              Disetujui
              {file.reviewedBy ? ` oleh ${file.reviewedBy}` : ""}
              {file.reviewedAt ? ` · ${file.reviewedAt}` : ""}
            </div>
          )}
          {canReview && approvalStatus === "menunggu persetujuan" && (
            <div className="space-y-2 rounded-xl border border-border bg-white p-3">
              <div className="text-[0.65rem] leading-5 text-muted">
                Periksa dokumen. Setujui jika valid, atau minta perubahan jika
                ada yang salah.
              </div>
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-success px-3 py-2 text-xs font-bold text-white hover:bg-[#157a4c]"
                  onClick={() => applyReview("disetujui")}
                  type="button"
                >
                  Setujui
                </Button>
                <Button
                  className="flex-1 border border-border px-3 py-2 text-xs font-bold text-ink hover:bg-surface"
                  onClick={() => {
                    setChangeOpen(true)
                    setReviewError("")
                  }}
                  type="button"
                >
                  Perlu perubahan
                </Button>
              </div>
              {changeOpen && (
                <div className="space-y-2">
                  <textarea
                    className="h-20 w-full rounded-xl border border-border px-3 py-2 text-xs outline-none focus:border-primary"
                    onChange={(event) => setReviewNote(event.target.value)}
                    placeholder="Jelaskan bagian yang salah atau perlu diubah"
                    value={reviewNote}
                  />
                  <Button
                    className="w-full bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-primary-dark"
                    onClick={() => applyReview("perlu perubahan")}
                    type="button"
                  >
                    Simpan status perlu perubahan
                  </Button>
                </div>
              )}
              {reviewError && (
                <div className="text-[0.65rem] font-semibold text-danger">
                  {reviewError}
                </div>
              )}
            </div>
          )}
          <div className="flex gap-2">
            <Button
              className="flex-1 gap-2 border border-border px-3 py-2 text-xs font-bold text-ink hover:bg-white disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!uploadEnabled}
              onClick={() => inputRef.current?.click()}
              type="button"
            >
              Ganti berkas
            </Button>
            <Button
              className="px-3 py-2 text-xs font-bold text-danger hover:bg-red-soft disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!uploadEnabled}
              onClick={() => onChange(null)}
              type="button"
            >
              Hapus
            </Button>
          </div>
        </div>
      ) : (
        <Button
          className="mt-3 w-full gap-2 bg-success px-4 py-2.5 text-xs font-bold text-white hover:bg-[#157a4c] disabled:cursor-not-allowed disabled:bg-success/40 disabled:hover:bg-success/40"
          disabled={!uploadEnabled}
          onClick={() => inputRef.current?.click()}
          type="button"
        >
          <Icon name="upload" className="size-4" /> Unggah {documentLabel}
        </Button>
      )}
      {error && (
        <div className="mt-2 text-[0.65rem] font-semibold text-danger">
          {error}
        </div>
      )}
      <input
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
        className="hidden"
        disabled={!uploadEnabled}
        id={inputId}
        onChange={pickFile}
        ref={inputRef}
        type="file"
      />
    </div>
  )
}

function MultiDocumentUpload({
  documentLabel,
  files,
  onChange,
  maxFiles,
  wide = false,
}: {
  documentLabel: string
  files: SignedUploadFile[]
  onChange: (files: SignedUploadFile[]) => void
  maxFiles: number
  wide?: boolean
}) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [error, setError] = useState("")
  const canAdd = files.length < maxFiles

  const pickFile = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0]
    event.target.value = ""
    if (!next) return
    if (!canAdd) {
      setError(`Maksimal ${maxFiles} ${documentLabel.toLowerCase()}.`)
      return
    }
    const parsed = readSignedUpload(next)
    if ("error" in parsed) {
      setError(parsed.error)
      return
    }
    setError("")
    onChange([...files, parsed.file])
  }

  return (
    <div className="mt-4 rounded-2xl border border-dashed border-border bg-surface/80 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-bold text-ink">
            Unggah {documentLabel.toLowerCase()}
          </div>
          <div className="mt-1 text-[0.65rem] leading-5 text-muted">
            Unggah foto atau PDF. Maksimal {maxFiles} berkas, masing-masing 10
            MB (PDF/JPG/PNG).
          </div>
        </div>
        <StatusPill tone={files.length > 0 ? "green" : "orange"}>
          {files.length}/{maxFiles} berkas
        </StatusPill>
      </div>
      {files.length > 0 && (
        <div
          className={
            wide
              ? "mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
              : "mt-3 max-h-28 space-y-2 overflow-y-auto"
          }
        >
          {files.map((file, index) => (
            <div
              className="flex items-start gap-3 rounded-xl bg-white px-3 py-3"
              key={`${file.name}-${file.uploadedAt}-${index}`}
            >
              <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-green-soft text-success">
                <Icon name="check" className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-xs font-bold text-ink">
                  {file.name}
                </div>
                <div className="mt-1 text-[0.65rem] text-muted">
                  {formatFileSize(file.size)} · {file.uploadedAt}
                </div>
              </div>
              <Button
                className="px-2 py-1 text-xs font-bold text-danger hover:bg-red-soft"
                onClick={() =>
                  onChange(files.filter((_, itemIndex) => itemIndex !== index))
                }
                type="button"
              >
                Hapus
              </Button>
            </div>
          ))}
        </div>
      )}
      <Button
        className="mt-3 w-full gap-2 bg-success px-4 py-2.5 text-xs font-bold text-white hover:bg-[#157a4c] disabled:cursor-not-allowed disabled:bg-success/40 disabled:hover:bg-success/40"
        disabled={!canAdd}
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        <Icon name="upload" className="size-4" />
        {files.length === 0
          ? `Unggah ${documentLabel}`
          : `Tambah ${documentLabel} (${files.length}/${maxFiles})`}
      </Button>
      {error && (
        <div className="mt-2 text-[0.65rem] font-semibold text-danger">
          {error}
        </div>
      )}
      <input
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
        className="hidden"
        disabled={!canAdd}
        id={inputId}
        onChange={pickFile}
        ref={inputRef}
        type="file"
      />
    </div>
  )
}

function Sidebar({
  active,
  onNavigate,
  open,
  onClose,
  variant = "admin",
}: {
  active: string
  onNavigate: (label: string) => void
  open: boolean
  onClose: () => void
  variant?: "admin" | "school"
}) {
  const [masterOpen, setMasterOpen] = useState(true)
  const select = (label: string) => {
    onNavigate(label)
    onClose()
  }
  const visibleSettingItems =
    variant === "school"
      ? settingItems.filter((item) => item === "Penandatanganan")
      : settingItems
  const visibleMenus =
    variant === "school"
      ? menuItems.filter((item) => item.label !== "Sekolah Terdampak")
      : menuItems
  const mainMenus =
    variant === "school"
      ? visibleMenus.filter(
          (item) =>
            item.label === "Dashboard" || item.label === "Penetapan Bantuan",
        )
      : visibleMenus.slice(0, 3)
  const manageMenus =
    variant === "school"
      ? visibleMenus.filter(
          (item) =>
            item.label !== "Dashboard" && item.label !== "Penetapan Bantuan",
        )
      : visibleMenus.slice(3)

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-ink/30 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-sidebar text-white transition-transform duration-300 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <div className="grid size-11 place-items-center rounded-2xl bg-white text-primary shadow-lg shadow-black/10">
            <Icon name="building" className="size-6" />
          </div>
          <div>
            <div className="text-xl font-extrabold tracking-tight">SPAB</div>
            <div className="text-xs text-white/55">
              Satuan Pendidikan Aman Bencana
            </div>
          </div>
          <Button
            aria-label="Tutup menu"
            className="ml-auto p-2 text-white/70 hover:bg-white/10 lg:hidden"
            onClick={onClose}
          >
            <Icon name="close" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <div className="mb-3 px-3 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/35">
            Menu Utama
          </div>
          <div className="space-y-1.5">
            {mainMenus.map((item) => (
              <Button
                key={item.label}
                className={`w-full justify-start gap-3 px-3.5 py-3 text-sm font-semibold ${
                  active === item.label
                    ? "bg-white text-primary shadow-md"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => select(item.label)}
              >
                <Icon name={item.icon} />
                {item.label}
              </Button>
            ))}
          </div>

          <div className="mb-3 mt-7 px-3 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/35">
            Pengelolaan
          </div>
          {variant === "admin" && (
            <>
              <Button
                className={`w-full justify-start gap-3 px-3.5 py-3 text-sm font-semibold ${
                  masterItems.includes(active)
                    ? "text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => setMasterOpen(!masterOpen)}
              >
                <Icon name="settings" />
                Master Data
                <Icon
                  name="chevron"
                  className={`ml-auto size-4 transition-transform ${
                    masterOpen ? "rotate-90" : ""
                  }`}
                />
              </Button>
              {masterOpen && (
                <div className="ml-6 mt-1 space-y-1 border-l border-white/15 pl-4">
                  {masterItems.map((item) => (
                    <Button
                      key={item}
                      className={`w-full justify-start px-3 py-2.5 text-left text-xs font-medium ${
                        active === item
                          ? "bg-white/12 text-white"
                          : "text-white/50 hover:text-white"
                      }`}
                      onClick={() => select(item)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              )}
            </>
          )}
          <div className={`space-y-1.5 ${variant === "admin" ? "mt-3" : ""}`}>
            {manageMenus.map((item) => (
              <Button
                key={item.label}
                className={`w-full justify-start gap-3 px-3.5 py-3 text-sm font-semibold ${
                  active === item.label
                    ? "bg-white text-primary shadow-md"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => select(item.label)}
              >
                <Icon name={item.icon} />
                {item.label}
              </Button>
            ))}
          </div>

          <div className="mt-3">
            <Button
              className={`w-full justify-start gap-3 px-3.5 py-3 text-sm font-semibold ${
                active === "Pelaporan/LPJ"
                  ? "bg-white text-primary shadow-md"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
              onClick={() => select("Pelaporan/LPJ")}
            >
              <Icon name="file" />
              Pelaporan/LPJ
            </Button>
          </div>

          <div className="mb-3 mt-7 px-3 text-[0.65rem] font-bold uppercase tracking-[0.18em] text-white/35">
            Setting
          </div>
          <div className="space-y-1.5">
            {visibleSettingItems.map((item) => (
              <Button
                key={item}
                className={`w-full justify-start gap-3 px-3.5 py-3 text-sm font-semibold ${
                  active === item
                    ? "bg-white text-primary shadow-md"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
                onClick={() => select(item)}
              >
                <Icon
                  name={
                    item === "Penandatanganan"
                      ? "user"
                      : item === "Template SPTJM"
                        ? "file"
                        : "document"
                  }
                />
                {item}
              </Button>
            ))}
          </div>
        </nav>

        <div className="m-4 rounded-2xl bg-white/[0.07] p-4">
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-white/80">
            <span className="size-2 rounded-full bg-success-bright" />
            Sistem aktif
          </div>
          <div className="text-[0.68rem] leading-relaxed text-white/40">
            Terakhir diperbarui 20 Mei 2025, 09:42 WIB
          </div>
        </div>
      </aside>
    </>
  )
}

function Header({
  title,
  onMenu,
  onLogout,
  userName = "Admin",
  userRole = "Administrator",
  logoutLabel = "Keluar dari portal admin",
}: {
  title: string
  onMenu: () => void
  onLogout: () => void
  userName?: string
  userRole?: string
  logoutLabel?: string
}) {
  const initials = userName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase()
  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-border bg-white/90 px-5 backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-3">
        <Button
          aria-label="Buka menu"
          className="p-2.5 text-muted hover:bg-surface lg:hidden"
          onClick={onMenu}
        >
          <Icon name="menu" />
        </Button>
        <div>
          <div className="text-lg font-bold text-ink md:text-xl">{title}</div>
          <div className="hidden text-xs text-muted sm:block">
            Sistem Penanggulangan Bencana Satuan Pendidikan
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Button
          aria-label={logoutLabel}
          className="gap-2 border border-border px-3 py-2.5 text-xs font-bold text-primary hover:bg-blue-soft sm:px-4"
          onClick={onLogout}
        >
          <Icon name="logout" className="size-4" />
          <span className="hidden sm:inline">Keluar</span>
        </Button>
        <Button
          className="relative hidden size-10 text-muted hover:bg-surface sm:inline-flex"
          aria-label="Notifikasi"
        >
          <Icon name="alert" />
          <span className="absolute right-2 top-2 size-2 rounded-full border-2 border-white bg-danger" />
        </Button>
        <div className="hidden h-8 w-px bg-border sm:block" />
        <Button className="gap-3 p-1.5 pr-2 hover:bg-surface">
          <div className="grid size-9 place-items-center rounded-xl bg-primary text-sm font-bold text-white">
            {initials || "AR"}
          </div>
          <div className="hidden text-left md:block">
            <div className="text-xs font-bold text-ink">{userName}</div>
            <div className="text-[0.65rem] text-muted">{userRole}</div>
          </div>
          <Icon
            name="chevron"
            className="hidden size-4 rotate-90 text-muted md:block"
          />
        </Button>
      </div>
    </header>
  )
}

function StatCard({
  label,
  value,
  note,
  icon,
  tone,
}: {
  label: string
  value: string
  note: string
  icon: IconName
  tone: "blue" | "orange" | "green" | "purple"
}) {
  const colors = {
    blue: "bg-blue-soft text-primary",
    orange: "bg-orange-soft text-warning",
    green: "bg-green-soft text-success",
    purple: "bg-purple-soft text-purple",
  }
  return (
    <div className="card group relative overflow-hidden p-5">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold text-muted">{label}</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight text-ink">
            {value}
          </div>
        </div>
        <div
          className={`grid size-11 place-items-center rounded-2xl ${colors[tone]}`}
        >
          <Icon name={icon} />
        </div>
      </div>
      <div className="mt-5 text-xs text-muted">{note}</div>
      <div
        className={`absolute -bottom-8 -right-8 size-24 rounded-full opacity-40 ${colors[tone]}`}
      />
    </div>
  )
}

function Dashboard({
  onNavigate,
  schoolName,
}: {
  onNavigate: (label: string) => void
  schoolName?: string
}) {
  const [province, setProvince] = useState("")
  const [regency, setRegency] = useState("")
  const { data, revision } = useDb()
  const isSchoolPortal = Boolean(schoolName)
  const sourceSchools =
    (data.affectedSchools as SchoolRecord[] | undefined)?.length
      ? (data.affectedSchools as SchoolRecord[])
      : schools
  const visibleSchools = useMemo(
    () =>
      schoolName
        ? sourceSchools.filter((school) => school.name === schoolName)
        : sourceSchools,
    [schoolName, sourceSchools, revision],
  )
  const provinces = useMemo(
    () => [...new Set(visibleSchools.map((school) => school.province))].sort(),
    [visibleSchools],
  )
  const regencies = useMemo(() => {
    const source = province
      ? visibleSchools.filter((school) => school.province === province)
      : visibleSchools
    return [...new Set(source.map((school) => school.regency))].sort()
  }, [province, visibleSchools])
  const filteredSchools = useMemo(
    () =>
      visibleSchools.filter((school) => {
        if (province && school.province !== province) return false
        if (regency && school.regency !== regency) return false
        return true
      }),
    [province, regency, visibleSchools],
  )
  const totalSchools = filteredSchools.length
  const documentStats = documentKinds.map((kind) => {
    const applicable = filteredSchools.filter((school) =>
      financeDocRequired(school, kind),
    )
    const uploaded = applicable.filter((school) => school.documents[kind]).length
    const total = applicable.length
    return {
      kind,
      uploaded,
      total,
      pending: total - uploaded,
      percent: total === 0 ? 0 : Math.round((uploaded / total) * 100),
    }
  })
  const menuIcons: Record<AidMenuName, IconName> = {
    Schoolkit: "package",
    "Alat IPA": "box",
    RKD: "document",
    "Lab Komputer": "settings",
    Meubeler: "building",
  }
  const menuStats = aidMenuNames.map((name) => ({
    name,
    icon: menuIcons[name],
    total: filteredSchools.filter((school) => school.packages.includes(name))
      .length,
  }))
  const documentRoutes: Record<DocumentKind, string> = {
    RAB: "RAB",
    "Pakta Integritas": "Pakta Integritas",
    Kwitansi: "Kwitansi",
    PKS: "PKS",
  }
  const requiredUploadDocs: DocumentKind[] = [
    "RAB",
    "Pakta Integritas",
    "Kwitansi",
  ]
  const hasRequiredUploads = (school: SchoolRecord) => {
    const required = requiredUploadDocs.filter((kind) =>
      financeDocRequired(school, kind),
    )
    if (required.length === 0) return true
    return required.every((kind) => school.documents[kind])
  }
  const menuBarStats = aidMenuNames.map((name) => {
    const recipients = filteredSchools.filter((school) =>
      school.packages.includes(name),
    )
    return {
      name,
      recipients: recipients.length,
      uploaded: recipients.filter(hasRequiredUploads).length,
    }
  })
  const maxMenuRecipients = Math.max(
    ...menuBarStats.map((item) => item.recipients),
    1,
  )
  const totalDocumentSlots = documentStats.reduce(
    (sum, item) => sum + item.total,
    0,
  )
  const uploadedDocuments = documentStats.reduce(
    (sum, item) => sum + item.uploaded,
    0,
  )
  const pendingDocuments = totalDocumentSlots - uploadedDocuments
  const uploadedShare =
    totalDocumentSlots === 0
      ? 0
      : (uploadedDocuments / totalDocumentSlots) * 100
  const uploadedPercent = Math.round(uploadedShare)
  const regionLabel =
    [regency, province].filter(Boolean).join(", ") || "seluruh wilayah"

  return (
    <div className="space-y-6">
      {!isSchoolPortal && (
        <div className="card p-5 md:p-6">
          <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <div className="text-base font-bold text-ink">Filter wilayah</div>
              <div className="mt-1 text-xs text-muted">
                Filter ini berlaku untuk seluruh data di dashboard
              </div>
            </div>
            {(province || regency) && (
              <Button
                className="px-3 py-2 text-xs font-bold text-primary hover:bg-blue-soft"
                onClick={() => {
                  setProvince("")
                  setRegency("")
                }}
                type="button"
              >
                Reset filter
              </Button>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-ink">
                Provinsi
              </span>
              <select
                aria-label="Filter provinsi"
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-ink outline-none focus:border-primary"
                onChange={(event) => {
                  setProvince(event.target.value)
                  setRegency("")
                }}
                value={province}
              >
                <option value="">Semua provinsi</option>
                {provinces.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-ink">
                Kabupaten / Kota
              </span>
              <select
                aria-label="Filter kabupaten atau kota"
                className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold text-ink outline-none focus:border-primary"
                onChange={(event) => setRegency(event.target.value)}
                value={regency}
              >
                <option value="">Semua kabupaten/kota</option>
                {regencies.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      )}

      <section className="overflow-hidden rounded-3xl bg-hero px-6 py-7 text-white shadow-xl shadow-primary/10 md:px-8">
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="mb-2 text-sm font-medium text-white/70">
              {isSchoolPortal
                ? `Selamat datang, ${schoolName}`
                : "Selamat datang kembali, Ahmad"}
            </div>
            <div className="max-w-2xl text-2xl font-extrabold leading-tight md:text-3xl">
              {isSchoolPortal
                ? "Pantau kelengkapan dokumen bantuan sekolah Anda."
                : "Pantau sekolah terdampak dan kelengkapan dokumen bantuan."}
            </div>
            <div className="mt-3 max-w-xl text-sm leading-relaxed text-white/65">
              Ringkasan unggahan RAB, pakta integritas, kwitansi, PKS, serta
              sebaran menu bantuan SMP.
            </div>
          </div>
          <Button
            className="shrink-0 gap-2 bg-white px-5 py-3 text-sm font-bold text-primary shadow-lg hover:bg-blue-soft"
            onClick={() =>
              onNavigate(
                isSchoolPortal ? "Penetapan Bantuan" : "Sekolah Terdampak",
              )
            }
          >
            {isSchoolPortal ? "Lihat penetapan bantuan" : "Lihat sekolah terdampak"}
            <Icon name="arrow" className="size-4" />
          </Button>
        </div>
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
      </section>

      <div className="card overflow-hidden p-6 md:p-7">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              Ringkasan
            </div>
            <div className="mt-2 text-lg font-bold text-ink">
              Total sekolah terdampak
            </div>
            <div className="mt-1 text-sm text-muted">
              Jenjang SMP di {regionLabel}.
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="grid size-14 place-items-center rounded-2xl bg-blue-soft text-primary">
              <Icon name="building" className="size-7" />
            </div>
            <div>
              <div className="text-4xl font-extrabold tracking-tight text-ink">
                {totalSchools}
              </div>
              <div className="text-xs font-semibold text-muted">
                SMP terdampak
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-4">
          <div className="text-base font-bold text-ink">
            Status unggah dokumen
          </div>
          <div className="mt-1 text-xs text-muted">
            Jumlah sekolah yang sudah mengunggah RAB, pakta integritas,
            kwitansi, dan PKS
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {documentStats.map((item) => (
            <button
              className="card p-5 text-left transition-shadow hover:shadow-lg"
              key={item.kind}
              onClick={() => onNavigate(documentRoutes[item.kind])}
              type="button"
            >
              <div className="flex items-start justify-between">
                <div className="text-sm font-bold text-ink">{item.kind}</div>
                <StatusPill
                  tone={
                    item.total === 0
                      ? "blue"
                      : item.pending === 0
                        ? "green"
                        : "orange"
                  }
                >
                  {item.total === 0
                    ? "Tidak diwajibkan"
                    : item.pending === 0
                      ? "Lengkap"
                      : `${item.pending} belum`}
                </StatusPill>
              </div>
              <div className="mt-4 text-3xl font-extrabold text-ink">
                {item.uploaded}
                <span className="text-lg font-bold text-muted">
                  /{item.total}
                </span>
              </div>
              <div className="mt-1 text-xs text-muted">sudah unggah</div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${item.percent}%` }}
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      {!isSchoolPortal && (
      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.8fr]">
        <div className="card p-6">
          <div className="mb-7">
            <div className="text-base font-bold text-ink">
              Unggah dokumen per menu
            </div>
            <div className="mt-1 text-xs text-muted">
              Sekolah penerima menu yang sudah unggah RAB, pakta integritas,
              dan kwitansi
            </div>
          </div>
          <div className="flex h-64 items-end gap-3 border-b border-border px-1 pb-1 sm:gap-5">
            {menuBarStats.map((item) => (
              <div
                className="group flex h-full min-w-0 flex-1 flex-col justify-end"
                key={item.name}
              >
                <div className="mb-2 text-center text-sm font-extrabold text-ink">
                  {item.uploaded}
                  <span className="text-[0.7rem] font-bold text-muted">
                    /{item.recipients}
                  </span>
                </div>
                <div
                  className="relative w-full"
                  style={{
                    height: `${Math.max(
                      (item.recipients / maxMenuRecipients) * 100,
                      16,
                    )}%`,
                  }}
                >
                  <div className="absolute inset-0 rounded-t-2xl bg-primary/15" />
                  <div
                    className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-primary transition-all group-hover:bg-primary-dark"
                    style={{
                      height:
                        item.recipients === 0
                          ? "0%"
                          : `${(item.uploaded / item.recipients) * 100}%`,
                    }}
                  />
                </div>
                <div className="mt-3 text-center text-[0.65rem] font-semibold leading-tight text-muted">
                  {item.name}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-5 text-xs text-muted">
            <span className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-primary" />
              Sudah unggah RAB, pakta, dan kwitansi
            </span>
            <span className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-primary/20" />
              Total sekolah penerima menu
            </span>
          </div>
        </div>

        <div className="card p-6">
          <div className="text-base font-bold text-ink">
            Persentase unggah dokumen
          </div>
          <div className="mt-1 text-xs text-muted">
            RAB, pakta integritas, kwitansi, dan PKS yang sudah diunggah
          </div>
          <div
            className="mx-auto my-8 grid size-40 place-items-center rounded-full"
            style={{
              background: `conic-gradient(var(--color-success) 0 ${uploadedShare}%, var(--color-border) ${uploadedShare}% 100%)`,
            }}
          >
            <div className="grid size-24 place-items-center rounded-full bg-white text-center">
              <div>
                <div className="text-2xl font-extrabold text-ink">
                  {uploadedPercent}%
                </div>
                <div className="text-[0.6rem] text-muted">sudah unggah</div>
              </div>
            </div>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-success" />
              <span className="text-muted">Sudah unggah</span>
              <span className="ml-auto font-bold text-ink">
                {uploadedDocuments}/{totalDocumentSlots} · {uploadedPercent}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="size-2.5 rounded-full bg-border" />
              <span className="text-muted">Belum unggah</span>
              <span className="ml-auto font-bold text-ink">
                {pendingDocuments}/{totalDocumentSlots} ·{" "}
                {totalDocumentSlots === 0 ? 0 : 100 - uploadedPercent}%
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-border pt-3">
              {documentStats.map((item) => (
                <div className="flex items-center gap-2" key={item.kind}>
                  <span className="text-muted">{item.kind}</span>
                  <span className="ml-auto font-bold text-ink">
                    {item.percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      )}

      <div>
        <div className="mb-4">
          <div className="text-base font-bold text-ink">
            Sekolah penerima menu bantuan
          </div>
          <div className="mt-1 text-xs text-muted">
            Total SMP yang ditetapkan menerima masing-masing menu
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {menuStats.map((item) => (
            <button
              className="card p-5 text-left transition-shadow hover:shadow-lg"
              key={item.name}
              onClick={() => onNavigate("Penetapan Bantuan")}
              type="button"
            >
              <div className="grid size-11 place-items-center rounded-2xl bg-blue-soft text-primary">
                <Icon name={item.icon} />
              </div>
              <div className="mt-4 text-xs font-semibold text-muted">
                {item.name}
              </div>
              <div className="mt-1 text-3xl font-extrabold text-ink">
                {item.total}
              </div>
              <div className="mt-1 text-xs text-muted">sekolah</div>
            </button>
          ))}
        </div>
      </div>

      {!isSchoolPortal && (
        <SchoolTable
          compact
          data={filteredSchools}
          onSeeAll={() => onNavigate("Sekolah Terdampak")}
        />
      )}
    </div>
  )
}

function SchoolTable({
  compact = false,
  data,
  onSeeAll,
  onAssign,
}: {
  compact?: boolean
  data?: SchoolRecord[]
  onSeeAll?: () => void
  onAssign?: (school: SchoolRecord) => void
}) {
  const [query, setQuery] = useState("")
  const { data: dbData } = useDb()
  const [schoolData, setSchoolData] = usePersistedState<SchoolRecord[]>(
    "affectedSchools",
    schools,
  )
  const [pksRows, setPksRows] = usePersistedState<PksSchool[]>(
    "pksSchools",
    initialPksSchools,
  )
  useEffect(() => {
    syncAffectedSchools(schoolData)
  }, [schoolData])
  useEffect(() => {
    if (!pksRows.length) return
    pksSchools.splice(0, pksSchools.length, ...pksRows)
  }, [pksRows])
  const [formOpen, setFormOpen] = useState(false)
  const [editingName, setEditingName] = useState<string | null>(null)
  const emptySchool: SchoolRecord = {
    name: "",
    province: "",
    regency: "",
    location: "",
    disaster: "Banjir",
    date: "",
    level: "Rusak Ringan",
    students: 0,
    menuCount: 0,
    packages: [],
    documents: { ...emptyDocuments },
  }
  const [draft, setDraft] = useState<SchoolRecord>(emptySchool)
  const source = compact ? (data ?? schools) : schoolData
  const filtered = source.filter((school) =>
    `${school.name} ${school.location} ${school.disaster}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )

  const openAdd = () => {
    setEditingName(null)
    setDraft({ ...emptySchool })
    setFormOpen(true)
  }

  const openEdit = (school: SchoolRecord) => {
    setEditingName(school.name)
    setDraft({ ...school })
    setFormOpen(true)
  }

  const saveSchool = () => {
    if (!draft.name.trim() || !draft.location.trim() || !draft.date) return
    const next = editingName
      ? schoolData.map((school) =>
          school.name === editingName ? { ...draft } : school,
        )
      : [{ ...draft }, ...schoolData]
    setSchoolData(next)
    syncAffectedSchools(next)
    const masterList = (dbData.schools as typeof masterSchools | undefined) ?? masterSchools
    const master = masterList.find((item) => item.name === draft.name)
    setPksRows((current) => {
      let rows = current
      if (editingName && editingName !== draft.name) {
        rows = rows.map((item) =>
          item.name === editingName ? { ...item, name: draft.name } : item,
        )
      }
      const existing = rows.find((item) => item.name === draft.name)
      const payload: PksSchool = {
        name: draft.name,
        npsn: master?.npsn ?? existing?.npsn ?? "",
        address:
          existing?.address ||
          [draft.location, draft.regency, draft.province]
            .filter(Boolean)
            .join(", "),
        principal: master?.principal ?? existing?.principal ?? "",
        number:
          existing?.number ??
          `SPAB/PKS/${String(rows.length + 1).padStart(4, "0")}/V/2025`,
        amount: existing?.amount ?? "Rp0",
      }
      if (existing) {
        return rows.map((item) =>
          item.name === draft.name ? { ...existing, ...payload } : item,
        )
      }
      return [payload, ...rows]
    })
    setFormOpen(false)
  }

  const deleteSchool = (school: SchoolRecord) => {
    const related = schoolRelationMessage(school.name, dbData)
    if (related) {
      window.alert(related)
      return
    }
    if (
      window.confirm(
        `Hapus data ${school.name}? Tindakan ini tidak dapat dibatalkan.`,
      )
    ) {
      const next = schoolData.filter((item) => item.name !== school.name)
      setSchoolData(next)
      syncAffectedSchools(next)
      setPksRows((current) => current.filter((item) => item.name !== school.name))
    }
  }

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-base font-bold text-ink">
            {compact ? "Sekolah Terdampak Terbaru" : "Daftar Sekolah Terdampak"}
          </div>
          <div className="mt-1 text-xs text-muted">
            {compact
              ? "Laporan terbaru yang membutuhkan perhatian"
              : "Kelola dan verifikasi data sekolah terdampak bencana"}
          </div>
        </div>
        {compact ? (
          <Button
            className="gap-2 text-xs font-bold text-primary hover:text-primary-dark"
            onClick={onSeeAll}
          >
            Lihat semua <Icon name="arrow" className="size-4" />
          </Button>
        ) : (
          <div className="flex flex-wrap gap-2">
            <label className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5 text-muted focus-within:border-primary">
              <Icon name="search" className="size-4" />
              <input
                className="w-52 bg-transparent text-xs text-ink outline-none placeholder:text-muted-light"
                placeholder="Cari sekolah..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
            <Button
              className="gap-2 bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-dark"
              onClick={openAdd}
            >
              <span className="text-base leading-none">+</span>
              Tambah Data
            </Button>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[60rem]">
          <thead>
            <tr className="bg-surface text-left text-[0.65rem] font-bold uppercase tracking-wider text-muted">
              <th className="px-5 py-3.5">Sekolah</th>
              <th className="px-5 py-3.5">Jenis Bencana</th>
              <th className="px-5 py-3.5">Tanggal Lapor</th>
              <th className="px-5 py-3.5">Tingkat Kerusakan</th>
              <th className="px-5 py-3.5">Siswa</th>
              <th className="px-5 py-3.5">Jml Menu</th>
              <th className="px-5 py-3.5">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((school) => (
              <tr
                key={school.name}
                className="transition-colors hover:bg-surface/70"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-soft text-primary">
                      <Icon name="building" className="size-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-ink">
                        {school.name}
                      </div>
                      <div className="mt-1 text-[0.65rem] text-muted">
                        {school.location}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className="text-xs font-medium text-ink">
                    {school.disaster}
                  </span>
                </td>
                <td className="px-5 py-4 text-xs text-muted">{school.date}</td>
                <td className="px-5 py-4">
                  <StatusPill
                    tone={
                      school.level === "Rusak Berat"
                        ? "red"
                        : school.level === "Rusak Sedang"
                          ? "orange"
                          : "blue"
                    }
                  >
                    {school.level}
                  </StatusPill>
                </td>
                <td className="px-5 py-4 text-xs font-bold text-ink">
                  {school.students}
                </td>
                <td className="px-5 py-4">
                  <StatusPill
                    tone={
                      (school.packages?.length ?? school.menuCount)
                        ? "green"
                        : "orange"
                    }
                  >
                    {school.packages?.length ?? school.menuCount}
                  </StatusPill>
                </td>
                <td className="px-5 py-4">
                  {compact ? (
                    <Button
                      aria-label={`Lihat ${school.name}`}
                      className="p-2 text-muted hover:bg-blue-soft hover:text-primary"
                    >
                      <Icon name="more" className="size-5" />
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Button
                        className="gap-1.5 px-2.5 py-2 text-xs font-bold text-primary hover:bg-blue-soft"
                        onClick={() => onAssign?.(school)}
                      >
                        <Icon name="package" className="size-4" />
                        Tetapkan
                      </Button>
                      <Button
                        className="px-2.5 py-2 text-xs font-bold text-primary hover:bg-blue-soft"
                        onClick={() => openEdit(school)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="px-2.5 py-2 text-xs font-bold text-danger hover:bg-red-soft"
                        onClick={() => deleteSchool(school)}
                      >
                        Hapus
                      </Button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td
                  className="px-5 py-16 text-center text-sm text-muted"
                  colSpan={7}
                >
                  Tidak ada sekolah untuk filter wilayah yang dipilih.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {!compact && (
        <div className="flex items-center justify-between border-t border-border px-5 py-4 text-xs text-muted">
          <span>
            Menampilkan {filtered.length} dari {schoolData.length} data
          </span>
          <div className="flex gap-2">
            <Button className="border border-border px-3 py-2 hover:bg-surface">
              Sebelumnya
            </Button>
            <Button className="bg-primary px-3 py-2 font-bold text-white">
              1
            </Button>
            <Button className="border border-border px-3 py-2 hover:bg-surface">
              2
            </Button>
            <Button className="border border-border px-3 py-2 hover:bg-surface">
              Berikutnya
            </Button>
          </div>
        </div>
      )}
      {formOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <div className="text-base font-bold text-ink">
                  {editingName
                    ? "Edit Sekolah Terdampak"
                    : "Tambah Sekolah Terdampak"}
                </div>
                <div className="mt-1 text-xs text-muted">
                  Lengkapi data sekolah dan informasi dampak bencana.
                </div>
              </div>
              <Button
                aria-label="Tutup formulir"
                className="p-2 text-muted hover:bg-surface"
                onClick={() => setFormOpen(false)}
              >
                <Icon name="close" />
              </Button>
            </div>
            <div className="grid max-h-[70vh] gap-5 overflow-y-auto p-6 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Nama Sekolah
                </span>
                <input
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                  placeholder="Masukkan nama sekolah"
                  value={draft.name}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Wilayah / Lokasi
                </span>
                <input
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                  placeholder="Kabupaten/Kota, Provinsi"
                  value={draft.location}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      location: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Jenis Bencana
                </span>
                <select
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                  value={draft.disaster}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      disaster: event.target.value,
                    }))
                  }
                >
                  {[
                    "Banjir",
                    "Gempa Bumi",
                    "Tanah Longsor",
                    "Erupsi",
                    "Kebakaran",
                    "Tsunami",
                    "Lainnya",
                  ].map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Tingkat Kerusakan
                </span>
                <select
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                  value={draft.level}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      level: event.target.value,
                    }))
                  }
                >
                  <option>Rusak Ringan</option>
                  <option>Rusak Sedang</option>
                  <option>Rusak Berat</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Tanggal Lapor
                </span>
                <input
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                  placeholder="Contoh: 20 Mei 2025"
                  value={draft.date}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      date: event.target.value,
                    }))
                  }
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Jumlah Siswa Terdampak
                </span>
                <input
                  min="0"
                  type="number"
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                  value={draft.students}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      students: Number(event.target.value),
                    }))
                  }
                />
              </label>
            </div>
            <div className="flex justify-end gap-3 border-t border-border bg-surface p-4">
              <Button
                className="border border-border px-5 py-3 text-xs font-bold text-ink hover:bg-white"
                onClick={() => setFormOpen(false)}
              >
                Batal
              </Button>
              <Button
                className="bg-primary px-5 py-3 text-xs font-bold text-white hover:bg-primary-dark disabled:opacity-50"
                disabled={
                  !draft.name.trim() ||
                  !draft.location.trim() ||
                  !draft.date.trim()
                }
                onClick={saveSchool}
              >
                {editingName ? "Simpan Perubahan" : "Tambah Data"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

type PmkDraft = {
  aidName: string
  skNumber: string
  pksNumber: string
  nominal: string
  aidKind: string
  received: string
  used: string
  unused: string
  usage: string
  signPlace: string
  signDate: string
  updatedAt: string
}

const pmkInstructions = [
  "Diisi dengan nama Satuan Pendidikan bantuan sosial.",
  "Diisi dengan nama pimpinan Satuan Pendidikan bantuan sosial.",
  "Diisi dengan alamat lembaga penerima bantuan sosial.",
  "Diisi dengan nama bantuan sosial.",
  "Diisi dengan nomor dan tanggal SK Penetapan Penerima Bantuan Sosial.",
  "Diisi dengan nomor dan tanggal Perjanjian Kerja Sama.",
  "Diisi dengan nama bantuan sosial.",
  "Diisi dengan nilai bantuan sosial yang telah diterima.",
  "Diisi dengan jenis bantuan sosial yang diterima (uang/barang/jasa).",
  "Diisi dengan jumlah bantuan sosial yang telah diterima.",
  "Diisi dengan jumlah bantuan sosial yang telah digunakan.",
  "Diisi dengan jumlah bantuan sosial yang belum dimanfaatkan.",
  "Diisi dengan penjelasan penggunaan bantuan sosial.",
  "Diisi dengan nama bantuan sosial (sama dengan nomor 7).",
  "Diisi dengan nama bantuan sosial (sama dengan nomor 7).",
  "Diisi dengan nama kota, tanggal dan tahun Laporan Pertanggungjawaban Bantuan Sosial ditandatangani.",
  "Diisi dengan nama Satuan Pendidikan bantuan sosial.",
  "Diisi dengan nama pimpinan Satuan Pendidikan bantuan sosial.",
]

function pmkAidKind(school?: {
  packages?: readonly string[]
  schoolkitKategori?: string
}) {
  const packages = school?.packages ?? []
  if (packages.length === 0) return ""
  const barang = isSchoolkitBarang(school)
  const uang = uangMenus(school).length > 0
  if (barang && uang) return "uang dan barang"
  if (barang) return "barang"
  return "uang"
}

function pmkNominalText(
  school: SchoolRecord | undefined,
  packages: Record<string, AidItem[]>,
) {
  const menus = school?.packages ?? []
  const total = menus.reduce(
    (sum, menu) => sum + menuPackageTotal(menu, packages),
    0,
  )
  if (total > 0) {
    return new Intl.NumberFormat("id-ID", { maximumFractionDigits: 0 }).format(
      total,
    )
  }
  const amount = pksSchools.find((item) => item.name === school?.name)?.amount
  if (!amount || amount === "Rp0") return ""
  return amount.replace(/^Rp\s*/i, "")
}

function emptyPmkDraft(
  school: SchoolRecord | undefined,
  packages: Record<string, AidItem[]>,
): PmkDraft {
  const pks = pksSchools.find((item) => item.name === school?.name)
  return {
    aidName: joinMenuNames([...(school?.packages ?? [])]),
    skNumber: "",
    pksNumber: pks?.number ?? "",
    nominal: pmkNominalText(school, packages),
    aidKind: pmkAidKind(school),
    received: "",
    used: "",
    unused: "",
    usage: "",
    signPlace: school?.regency ?? "",
    signDate: "",
    updatedAt: "",
  }
}

function pmkIdentity(school: SchoolRecord | undefined, signers: SignerRecord[]) {
  const pks = pksSchools.find((item) => item.name === school?.name)
  const signer = schoolSignerView(signers, school?.name ?? "", {
    name: pks?.principal,
    place: school?.regency,
  })
  return {
    schoolName: school?.name ?? "",
    principal: signer.name,
    address: pks?.address || school?.location || "",
  }
}

function PmkFill({ value, wide = false }: { value: string; wide?: boolean }) {
  const text = value.trim()
  if (!text) {
    return (
      <span
        className={`inline-block border-b border-black align-baseline ${
          wide ? "w-full min-w-[8rem]" : "min-w-[9rem]"
        }`}
      >
        &nbsp;
      </span>
    )
  }
  return <span className="font-semibold">{text}</span>
}

function PmkDocument({
  identity,
  draft,
}: {
  identity: { schoolName: string; principal: string; address: string }
  draft: PmkDraft
}) {
  return (
    <div className="pmk-print-root space-y-6">
      <article className="pmk-sheet mx-auto text-[11px] leading-5 shadow-xl">
        <h1 className="mb-4 text-center text-[13px] font-bold uppercase tracking-wide">
          Laporan Pertanggungjawaban Bantuan Sosial
        </h1>
        <ol className="list-decimal space-y-1 pl-5">
          <li>
            Nama Satuan Pendidikan : <PmkFill value={identity.schoolName} />
          </li>
          <li>
            Nama Kepala Satuan Pendidikan :{" "}
            <PmkFill value={identity.principal} />
          </li>
          <li>
            Alamat Satuan Pendidikan : <PmkFill value={identity.address} wide />
          </li>
          <li>
            Nama Bantuan : Bantuan Sosial <PmkFill value={draft.aidName} />
          </li>
        </ol>
        <p className="mt-3">
          Berdasarkan Surat Keputusan Nomor <PmkFill value={draft.skNumber} />{" "}
          dan Perjanjian Kerja Sama Nomor <PmkFill value={draft.pksNumber} />,
          telah menerima Bantuan Sosial <PmkFill value={draft.aidName} /> dengan
          nilai nominal sebesar Rp <PmkFill value={draft.nominal} />.
        </p>
        <p className="mt-3">
          Sehubungan dengan hal tersebut, dengan ini Saya menyampaikan Laporan
          Pertanggungjawaban Bantuan sebagai berikut:
        </p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>
            Laporan penerimaan Bantuan Sosial berupa{" "}
            <PmkFill value={draft.aidKind} />:
            <div className="mt-1 space-y-1 pl-4">
              <div>
                a. Jumlah bantuan yang telah diterima :{" "}
                <PmkFill value={draft.received} wide />
              </div>
              <div>
                b. Jumlah bantuan yang digunakan :{" "}
                <PmkFill value={draft.used} wide />
              </div>
              <div>
                c. Jumlah bantuan yang belum dimanfaatkan :{" "}
                <PmkFill value={draft.unused} wide />
              </div>
            </div>
          </li>
          <li className="mt-1">
            Bantuan Sosial sebagaimana disebut di atas telah dipergunakan untuk{" "}
            <PmkFill value={draft.usage} wide /> berdasarkan Perjanjian Kerja
            Sama tersebut di atas.
          </li>
        </ol>
        <p className="mt-3">
          Berdasarkan hal tersebut di atas, Saya dengan ini menyatakan dengan
          sebenar-benarnya bahwa:
        </p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>
            Telah menggunakan/menyalurkan*) Bantuan Sosial{" "}
            <PmkFill value={draft.aidName} /> sesuai dengan Perjanjian Kerja
            Sama tersebut di atas.
          </li>
          <li>
            Apabila di kemudian hari, atas penggunaan Bantuan Sosial{" "}
            <PmkFill value={draft.aidName} /> mengakibatkan kerugian Negara maka
            saya bersedia dituntut penggantian kerugian negara dimaksud sesuai
            dengan ketentuan peraturan perundang-undangan.
          </li>
        </ol>
        <p className="mt-3">
          Demikian Laporan Pertanggungjawaban Bantuan Sosial ini kami buat
          dengan sesungguhnya dan penuh tanggung jawab.
        </p>
        <div className="mt-6 ml-auto w-[16rem] text-center">
          <div>
            <PmkFill value={draft.signPlace} />,{" "}
            <PmkFill value={draft.signDate} />
          </div>
          <div className="mt-1">{identity.schoolName}</div>
          <div className="mt-3">Penerima Bantuan Sosial,</div>
          <div className="mx-auto mt-2 w-24 border border-black px-2 py-3 text-[9px] leading-4">
            Materai
            <br />
            Rp10.000,-
          </div>
          <div className="mt-8 font-semibold">
            <PmkFill value={identity.principal} />
          </div>
        </div>
        <p className="mt-6 text-[10px]">
          *) Coret salah satu apabila tidak sesuai.
        </p>
      </article>
      <article className="pmk-sheet mx-auto text-[11px] leading-5 shadow-xl">
        <h1 className="text-center text-[13px] font-bold uppercase">
          Petunjuk Pengisian
        </h1>
        <h2 className="mt-1 text-center text-[11px] font-bold uppercase">
          Laporan Pertanggungjawaban Bantuan Sosial - Lampiran A
        </h2>
        <ol className="mt-4 list-decimal space-y-1.5 pl-5">
          {pmkInstructions.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ol>
      </article>
    </div>
  )
}

function pmkPdfLines(
  identity: { schoolName: string; principal: string; address: string },
  draft: PmkDraft,
) {
  const fill = (value: string) => value.trim() || "____________________"
  const pageOne = [
    "LAPORAN PERTANGGUNGJAWABAN BANTUAN SOSIAL",
    "",
    `1. Nama Satuan Pendidikan : ${fill(identity.schoolName)}`,
    `2. Nama Kepala Satuan Pendidikan : ${fill(identity.principal)}`,
    `3. Alamat Satuan Pendidikan : ${fill(identity.address)}`,
    `4. Nama Bantuan : Bantuan Sosial ${fill(draft.aidName)}`,
    "",
    `Berdasarkan Surat Keputusan Nomor ${fill(draft.skNumber)} dan Perjanjian Kerja`,
    `Sama Nomor ${fill(draft.pksNumber)}, telah menerima Bantuan Sosial`,
    `${fill(draft.aidName)} dengan nilai nominal sebesar Rp ${fill(draft.nominal)}.`,
    "",
    "Sehubungan dengan hal tersebut, dengan ini Saya menyampaikan Laporan",
    "Pertanggungjawaban Bantuan sebagai berikut:",
    `1. Laporan penerimaan Bantuan Sosial berupa ${fill(draft.aidKind)}:`,
    `a. Jumlah bantuan yang telah diterima : ${fill(draft.received)}`,
    `b. Jumlah bantuan yang digunakan : ${fill(draft.used)}`,
    `c. Jumlah bantuan yang belum dimanfaatkan : ${fill(draft.unused)}`,
    "2. Bantuan Sosial sebagaimana disebut di atas telah dipergunakan untuk",
    `${fill(draft.usage)} berdasarkan Perjanjian Kerja Sama tersebut di atas.`,
    "",
    "Berdasarkan hal tersebut di atas, Saya dengan ini menyatakan dengan sebenar-benarnya bahwa:",
    `1. Telah menggunakan/menyalurkan*) Bantuan Sosial ${fill(draft.aidName)}`,
    "sesuai dengan Perjanjian Kerja Sama tersebut di atas.",
    "2. Apabila di kemudian hari, atas penggunaan Bantuan Sosial",
    `${fill(draft.aidName)} mengakibatkan kerugian Negara maka saya bersedia`,
    "dituntut penggantian kerugian negara dimaksud sesuai dengan ketentuan peraturan",
    "perundang-undangan.",
    "",
    "Demikian Laporan Pertanggungjawaban Bantuan Sosial ini kami buat dengan sesungguhnya",
    "dan penuh tanggung jawab.",
    "",
    `${fill(draft.signPlace)}, ${fill(draft.signDate)}`,
    identity.schoolName || "____________________",
    "Penerima Bantuan Sosial,",
    "Materai Rp10.000,-",
    identity.principal || "____________________",
    "",
    "*) Coret salah satu apabila tidak sesuai.",
  ]
  const pageTwo = [
    "PETUNJUK PENGISIAN",
    "LAPORAN PERTANGGUNGJAWABAN BANTUAN SOSIAL - LAMPIRAN A",
    "",
    ...pmkInstructions.map((item, index) => `(${index + 1}) ${item}`),
  ]
  return [pageOne, pageTwo]
}

function createTwoPagePdf(pages: string[][]) {
  const escapePdf = (text: string) =>
    text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")
  const wrap = (text: string) => {
    const max = 90
    if (text.length <= max) return [text]
    const words = text.split(" ")
    const lines: string[] = []
    let current = ""
    words.forEach((word) => {
      const next = current ? `${current} ${word}` : word
      if (next.length > max && current) {
        lines.push(current)
        current = word
      } else {
        current = next
      }
    })
    if (current) lines.push(current)
    return lines
  }
  const contents = pages.map((page) => {
    const lines = page.flatMap((line) => wrap(line))
    const body = [
      "BT",
      "/F1 11 Tf",
      "48 800 Td",
      `(${escapePdf(lines[0] ?? "")}) Tj`,
      "/F1 9 Tf",
      ...lines.slice(1).flatMap((line) => ["0 -14 Td", `(${escapePdf(line)}) Tj`]),
      "ET",
    ].join("\n")
    return `<< /Length ${body.length} >>\nstream\n${body}\nendstream`
  })
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R 5 0 R] /Count 2 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 7 0 R >> >> /Contents 4 0 R >>",
    contents[0],
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 7 0 R >> >> /Contents 6 0 R >>",
    contents[1],
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ]
  let pdf = "%PDF-1.4\n"
  const offsets = [0]
  objects.forEach((object, index) => {
    offsets.push(pdf.length)
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  })
  const xrefOffset = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`
  })
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`
  return new Blob([pdf], { type: "application/pdf" })
}

const pelaporanCardMeta: Record<
  PelaporanKind,
  { description: string; icon: IconName }
> = {
  RKAS: {
    description:
      "Unggah satu berkas Rencana Kegiatan dan Anggaran Sekolah.",
    icon: "money",
  },
  Invoice: {
    description: "Unggah satu berkas invoice pengadaan bantuan.",
    icon: "receipt",
  },
  BAST: {
    description: "Unggah satu berkas Berita Acara Serah Terima.",
    icon: "handshake",
  },
  PMK: {
    description:
      "Buat draf laporan pertanggungjawaban, cetak 2 lembar, tanda tangani, lalu unggah.",
    icon: "file",
  },
  "Dokumentasi Hasil": {
    description: `Unggah foto atau PDF hasil kegiatan, maksimal ${DOKUMENTASI_MAX} berkas.`,
    icon: "document",
  },
}

function PelaporanLpjPage({
  mode = "admin",
  schoolName,
  docUploads = {},
  onChangeDocUploads,
}: {
  mode?: "admin" | "school"
  schoolName?: string
  docUploads?: DocUploadsMap
  onChangeDocUploads?: (next: DocUploadsMap) => void
}) {
  const schoolList = useAffectedSchoolList()
  const lockedSchool = mode === "school" ? (schoolName ?? schoolList[0]?.name) : null
  const [selectedSchool, setSelectedSchool] = useState<string | null>(
    lockedSchool,
  )
  const [query, setQuery] = useState("")
  const [province, setProvince] = useState("")
  const [completeness, setCompleteness] = useState<
    "all" | "complete" | "incomplete"
  >("all")
  const { data: dbData } = useDb()
  const aidPackages =
    (dbData.menus as Record<string, AidItem[]> | undefined) ?? initialAidPackages
  const signerRows =
    (dbData.signers as SignerRecord[] | undefined) ?? initialSigners
  const [pmkDrafts, setPmkDrafts] = usePersistedState<Record<string, PmkDraft>>(
    "pmkDrafts",
    {},
  )
  const [pmkView, setPmkView] = useState<"cards" | "edit" | "preview">("cards")
  const [pmkEditor, setPmkEditor] = useState<PmkDraft | null>(null)
  const [pmkSaved, setPmkSaved] = useState("")
  useEffect(() => {
    if (pmkView !== "preview") return
    document.body.classList.add("pmk-print")
    return () => document.body.classList.remove("pmk-print")
  }, [pmkView])
  const provinces = [...new Set(schoolList.map((item) => item.province))]
  const activeSchool = lockedSchool ?? selectedSchool
  const uploads = activeSchool
    ? schoolDocUploads(docUploads, activeSchool).pelaporan
    : emptyPelaporanUploads()
  const school = schoolList.find((item) => item.name === activeSchool)
  const requiredItems = requiredPelaporanItems(school)

  const patchPelaporan = (
    schoolTarget: string,
    next: (current: PelaporanUploads) => PelaporanUploads,
  ) => {
    onChangeDocUploads?.(
      patchSchoolUploads(docUploads, schoolTarget, (current) => ({
        ...current,
        pelaporan: next(current.pelaporan),
      })),
    )
  }

  const listRows = schoolList
    .map((item) => {
      const files = schoolDocUploads(docUploads, item.name).pelaporan
      const progress = pelaporanProgress(files, item)
      return { school: item, files, progress }
    })
    .filter((row) => {
      const haystack =
        `${row.school.name} ${row.school.regency} ${row.school.province}`.toLowerCase()
      if (query && !haystack.includes(query.toLowerCase())) return false
      if (province && row.school.province !== province) return false
      const complete = row.progress.done === row.progress.total
      if (completeness === "complete" && !complete) return false
      if (completeness === "incomplete" && complete) return false
      return true
    })
    .sort((left, right) => {
      if (left.progress.done !== right.progress.done) {
        return left.progress.done - right.progress.done
      }
      return left.school.name.localeCompare(right.school.name)
    })

  const completeCount = schoolList.filter((item) => {
    const progress = pelaporanProgress(
      schoolDocUploads(docUploads, item.name).pelaporan,
      item,
    )
    return progress.done === progress.total
  }).length
  const incompleteCount = schoolList.length - completeCount

  const cards = activeSchool ? (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {requiredItems.map((item) => {
        const dokumentasiWide = item === "Dokumentasi Hasil"
        return (
          <div
            className={`card flex flex-col p-5 ${
              dokumentasiWide ? "lg:col-span-3" : "min-h-[17.5rem]"
            }`}
            id={`pelaporan-card-${item}`}
            key={item}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-bold text-ink">{item}</div>
                <div className="mt-1 text-xs leading-5 text-muted">
                  {pelaporanCardMeta[item].description}
                </div>
              </div>
              <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-blue-soft text-primary">
                <Icon name={pelaporanCardMeta[item].icon} className="size-5" />
              </div>
            </div>
            <div className="mt-auto">
            {item === "Dokumentasi Hasil" ? (
              <MultiDocumentUpload
                documentLabel="Dokumentasi"
                files={uploads.dokumentasi}
                maxFiles={DOKUMENTASI_MAX}
                wide={dokumentasiWide}
                onChange={(next) =>
                  patchPelaporan(activeSchool, (current) => ({
                    ...current,
                    dokumentasi: next,
                  }))
                }
              />
            ) : item === "PMK" ? (
              <div className="mt-4 space-y-3">
                <div className="text-[0.65rem] text-muted">
                  {pmkDrafts[activeSchool]
                    ? `Draf disimpan ${pmkDrafts[activeSchool].updatedAt}`
                    : "Belum ada draf. Simpan draf sebelum unggah."}
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    className="w-full bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-dark"
                    onClick={() => {
                      setPmkEditor(
                        pmkDrafts[activeSchool]
                          ? { ...pmkDrafts[activeSchool] }
                          : emptyPmkDraft(school, aidPackages),
                      )
                      setPmkSaved("")
                      setPmkView("edit")
                    }}
                    type="button"
                  >
                    {pmkDrafts[activeSchool] ? "Edit draf PMK" : "Buat draf PMK"}
                  </Button>
                  {pmkDrafts[activeSchool] && (
                    <Button
                      className="w-full border border-border px-4 py-2.5 text-xs font-bold text-ink hover:bg-surface"
                      onClick={() => setPmkView("preview")}
                      type="button"
                    >
                      Preview PMK
                    </Button>
                  )}
                </div>
                <SignedDocumentUpload
                  disabledHint="Simpan draf terlebih dahulu. Unggah aktif setelah draf tersimpan."
                  documentLabel="PMK"
                  enabled={Boolean(pmkDrafts[activeSchool])}
                  file={uploads.pmk}
                  hint="Cetak 2 lembar, tanda tangani dan cap basah, lalu unggah hasil scan."
                  onChange={(next) =>
                    patchPelaporan(activeSchool, (current) => ({
                      ...current,
                      pmk: next,
                    }))
                  }
                  title="Unggah PMK bertanda tangan"
                />
              </div>
            ) : (
              <SignedDocumentUpload
                documentLabel={item}
                file={
                  item === "RKAS"
                    ? uploads.rkas
                    : item === "Invoice"
                      ? uploads.invoice
                      : item === "PMK"
                        ? uploads.pmk
                        : uploads.bast
                }
                hint="Unggah PDF, JPG, atau PNG (maks. 10 MB)."
                onChange={(next) =>
                  patchPelaporan(activeSchool, (current) => ({
                    ...current,
                    rkas: item === "RKAS" ? next : current.rkas,
                    invoice: item === "Invoice" ? next : current.invoice,
                    bast: item === "BAST" ? next : current.bast,
                    pmk: item === "PMK" ? next : current.pmk,
                  }))
                }
                title={`Unggah ${item}`}
              />
            )}
            </div>
          </div>
        )
      })}
    </div>
  ) : null

  if (mode === "school" || activeSchool) {
    const progress = pelaporanProgress(uploads, school)
    const pelaporanHint = isSchoolkitBarangOnly(school)
      ? `Unggah BAST, PMK, dan dokumentasi hasil. Dokumentasi maksimal ${DOKUMENTASI_MAX} berkas.`
      : `Unggah RKAS, invoice, BAST, dan PMK masing-masing 1 berkas. Dokumentasi hasil maksimal ${DOKUMENTASI_MAX} berkas.`
    const identity = pmkIdentity(school, signerRows)
    const savedPmk = activeSchool ? pmkDrafts[activeSchool] : undefined
    const previewDraft = savedPmk ?? emptyPmkDraft(school, aidPackages)
    const pmkFields: { key: keyof PmkDraft; label: string }[] = [
      { key: "aidName", label: "Nama bantuan, nomor 4, 7, 14, dan 15" },
      { key: "skNumber", label: "Nomor dan tanggal SK penetapan, nomor 5" },
      { key: "pksNumber", label: "Nomor dan tanggal perjanjian kerja sama, nomor 6" },
      { key: "nominal", label: "Nilai nominal tanpa tulisan Rp, nomor 8" },
      { key: "aidKind", label: "Jenis bantuan: uang, barang, atau jasa, nomor 9" },
      { key: "received", label: "Jumlah bantuan yang telah diterima, nomor 10" },
      { key: "used", label: "Jumlah bantuan yang digunakan, nomor 11" },
      { key: "unused", label: "Jumlah bantuan yang belum dimanfaatkan, nomor 12" },
      { key: "usage", label: "Penjelasan penggunaan bantuan, nomor 13" },
      { key: "signPlace", label: "Kota penandatanganan, nomor 16" },
      { key: "signDate", label: "Tanggal penandatanganan, nomor 16" },
    ]

    if (pmkView === "edit" && pmkEditor && activeSchool) {
      return (
        <div className="space-y-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="text-2xl font-extrabold text-ink">
                {savedPmk ? "Edit draf PMK" : "Buat draf PMK"}
              </div>
              <div className="mt-1 text-sm text-muted">
                {activeSchool}. Data yang sudah ada terisi otomatis. Kolom yang
                belum ada datanya dibiarkan kosong.
              </div>
            </div>
            <Button
              className="border border-border px-4 py-2.5 text-xs font-bold text-ink hover:bg-surface"
              onClick={() => setPmkView("cards")}
              type="button"
            >
              Kembali
            </Button>
          </div>
          <div className="card grid gap-4 p-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-ink">
                Nama satuan pendidikan
              </span>
              <input
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted outline-none"
                readOnly
                value={identity.schoolName}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-ink">
                Nama kepala satuan pendidikan
              </span>
              <input
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted outline-none"
                readOnly
                value={identity.principal}
              />
            </label>
            <label className="block md:col-span-2">
              <span className="mb-2 block text-xs font-bold text-ink">
                Alamat satuan pendidikan
              </span>
              <input
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted outline-none"
                readOnly
                value={identity.address}
              />
            </label>
            {pmkFields.map((field) => (
              <label
                className={field.key === "usage" ? "block md:col-span-2" : "block"}
                key={field.key}
              >
                <span className="mb-2 block text-xs font-bold text-ink">
                  {field.label}
                </span>
                {field.key === "usage" ? (
                  <textarea
                    className="h-24 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
                    onChange={(event) =>
                      setPmkEditor({ ...pmkEditor, usage: event.target.value })
                    }
                    value={pmkEditor.usage}
                  />
                ) : (
                  <input
                    className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
                    onChange={(event) =>
                      setPmkEditor({
                        ...pmkEditor,
                        [field.key]: event.target.value,
                      })
                    }
                    value={pmkEditor[field.key]}
                  />
                )}
              </label>
            ))}
          </div>
          <div className="flex justify-end gap-3">
            <Button
              className="border border-border px-5 py-2.5 text-xs font-bold text-ink hover:bg-white"
              onClick={() => setPmkView("cards")}
              type="button"
            >
              Batal
            </Button>
            <Button
              className="bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-dark"
              onClick={() => {
                const next = {
                  ...pmkEditor,
                  updatedAt: new Date().toLocaleString("id-ID"),
                }
                setPmkDrafts((current) => ({
                  ...current,
                  [activeSchool]: next,
                }))
                setPmkSaved("Draf PMK berhasil disimpan.")
                setPmkView("preview")
              }}
              type="button"
            >
              Simpan draf
            </Button>
          </div>
        </div>
      )
    }

    if (pmkView === "preview" && activeSchool) {
      return (
        <div className="space-y-4">
          <div className="no-print flex flex-col gap-3 rounded-2xl border border-border bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-base font-bold text-ink">Preview: PMK</div>
              <div className="mt-1 text-xs text-muted">
                Dua lembar tetap. Cetak, tanda tangani dan cap basah, lalu unggah
                scan-nya.
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                className="gap-2 border border-border px-4 py-2.5 text-xs font-bold text-ink hover:bg-surface"
                onClick={() => window.print()}
                type="button"
              >
                Cetak
              </Button>
              <Button
                className="gap-2 border border-border px-4 py-2.5 text-xs font-bold text-ink hover:bg-surface"
                onClick={() => {
                  const url = URL.createObjectURL(
                    createTwoPagePdf(pmkPdfLines(identity, previewDraft)),
                  )
                  const link = document.createElement("a")
                  link.href = url
                  link.download = `PMK ${activeSchool}.pdf`
                  link.click()
                  URL.revokeObjectURL(url)
                }}
                type="button"
              >
                Download PDF
              </Button>
              <Button
                className="gap-2 bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-dark"
                onClick={() => setPmkView("cards")}
                type="button"
              >
                Kembali
              </Button>
            </div>
          </div>
          <div className="no-print">
            <SignedDocumentUpload
              disabledHint="Simpan draf terlebih dahulu. Unggah aktif setelah draf tersimpan."
              documentLabel="PMK"
              enabled={Boolean(savedPmk)}
              file={uploads.pmk}
              hint="Cetak 2 lembar, tanda tangani dan cap basah, lalu unggah hasil scan."
              onChange={(next) =>
                patchPelaporan(activeSchool, (current) => ({
                  ...current,
                  pmk: next,
                }))
              }
              title="Unggah PMK bertanda tangan"
            />
          </div>
          <PmkDocument draft={previewDraft} identity={identity} />
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
              Pelaporan/LPJ
            </div>
            <div className="mt-1 text-2xl font-extrabold text-ink">
              {activeSchool}
            </div>
            <div className="mt-1 text-sm text-muted">{pelaporanHint}</div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone={progress.done === progress.total ? "green" : "orange"}>
              {progress.done}/{progress.total} lengkap
            </StatusPill>
            {mode === "admin" && (
              <Button
                className="border border-border px-4 py-2.5 text-xs font-bold text-ink hover:bg-surface"
                onClick={() => {
                  setPmkView("cards")
                  setSelectedSchool(null)
                }}
              >
                Kembali ke daftar
              </Button>
            )}
          </div>
        </div>
        {school && (
          <div className="text-xs text-muted">{school.location}</div>
        )}
        {pmkSaved && (
          <div className="rounded-2xl bg-green-soft px-4 py-3 text-sm font-semibold text-success">
            {pmkSaved}
          </div>
        )}
        {cards}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.16em] text-muted">
          Pelaporan/LPJ
        </div>
        <div className="mt-1 text-2xl font-extrabold text-ink">
          Pelaporan/LPJ
        </div>
        <div className="mt-1 text-sm text-muted">
          Pantau kelengkapan unggahan per sekolah. PMK wajib untuk setiap sekolah.
          Sekolah yang hanya menerima Schoolkit barang mengunggah BAST,
          dokumentasi, dan PMK.
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Sekolah"
          value={String(schoolList.length)}
          note="penerima bantuan"
          icon="building"
          tone="blue"
        />
        <StatCard
          label="LPJ lengkap"
          value={String(completeCount)}
          note="sesuai kewajiban"
          icon="check"
          tone="green"
        />
        <StatCard
          label="Belum lengkap"
          value={String(incompleteCount)}
          note="perlu diunggah"
          icon="alert"
          tone="orange"
        />
      </div>
      <div className="card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-base font-bold text-ink">Daftar sekolah</div>
          <div className="flex flex-wrap gap-2">
            <label className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-muted">
              <Icon name="search" className="size-4" />
              <input
                className="w-44 bg-transparent text-xs outline-none"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari nama sekolah..."
                value={query}
              />
            </label>
            <select
              className="rounded-xl border border-border bg-white px-3 py-2.5 text-xs font-semibold text-ink outline-none"
              onChange={(event) => setProvince(event.target.value)}
              value={province}
            >
              <option value="">Semua provinsi</option>
              {provinces.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            <select
              className="rounded-xl border border-border bg-white px-3 py-2.5 text-xs font-semibold text-ink outline-none"
              onChange={(event) =>
                setCompleteness(
                  event.target.value as "all" | "complete" | "incomplete",
                )
              }
              value={completeness}
            >
              <option value="all">Semua status</option>
              <option value="incomplete">Belum lengkap</option>
              <option value="complete">Sudah lengkap</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[56rem]">
            <thead>
              <tr className="bg-surface text-left text-[0.65rem] font-bold uppercase tracking-wider text-muted">
                <th className="px-5 py-3.5">Sekolah</th>
                <th className="px-5 py-3.5">Wilayah</th>
                <th className="px-5 py-3.5">Progres</th>
                {pelaporanItems.map((item) => (
                  <th className="px-5 py-3.5" key={item}>
                    {item === "Dokumentasi Hasil" ? "Dokumentasi" : item}
                  </th>
                ))}
                <th className="px-5 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {listRows.length === 0 ? (
                <tr>
                  <td
                    className="px-5 py-10 text-center text-sm text-muted"
                    colSpan={pelaporanItems.length + 4}
                  >
                    Tidak ada sekolah yang sesuai filter.
                  </td>
                </tr>
              ) : (
                listRows.map((row) => (
                  <tr className="hover:bg-surface/70" key={row.school.name}>
                    <td className="px-5 py-4">
                      <div className="text-xs font-bold text-ink">
                        {row.school.name}
                      </div>
                      <div className="mt-1 text-[0.65rem] text-muted">
                        NPSN{" "}
                        {pksSchools.find((item) => item.name === row.school.name)
                          ?.npsn ??
                          masterSchools.find(
                            (item) => item.name === row.school.name,
                          )?.npsn ??
                          "-"}
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-muted">
                      {row.school.location}
                    </td>
                    <td className="px-5 py-4">
                      <StatusPill
                        tone={
                          row.progress.done === row.progress.total
                            ? "green"
                            : "orange"
                        }
                      >
                        {row.progress.done}/{row.progress.total}
                      </StatusPill>
                    </td>
                    {pelaporanItems.map((item) => {
                      const applies = requiredPelaporanItems(row.school).includes(
                        item,
                      )
                      if (!applies) {
                        return (
                          <td className="px-5 py-4" key={item}>
                            <StatusPill tone="blue">Tidak wajib</StatusPill>
                          </td>
                        )
                      }
                      const done = pelaporanKindDone(row.files, item)
                      const extra =
                        item === "Dokumentasi Hasil"
                          ? ` ${row.files.dokumentasi.length}/${DOKUMENTASI_MAX}`
                          : ""
                      return (
                        <td className="px-5 py-4" key={item}>
                          <StatusPill tone={done ? "green" : "orange"}>
                            {done ? `Sudah${extra}` : "Belum"}
                          </StatusPill>
                        </td>
                      )
                    })}
                    <td className="px-5 py-4">
                      <Button
                        className="bg-primary px-3 py-2 text-xs font-bold text-white hover:bg-primary-dark"
                        onClick={() => setSelectedSchool(row.school.name)}
                      >
                        Unggah
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

type AidItem = {
  id: number
  name: string
  specification: string
  volume: number
  price: number
}

const initialAidPackages: Record<string, AidItem[]> = {
  Schoolkit: [
    {
      id: 1,
      name: "Tas sekolah",
      specification: "Bahan tahan air, ukuran siswa SMP",
      volume: 100,
      price: 185000,
    },
    {
      id: 2,
      name: "Paket alat tulis",
      specification: "Buku tulis, pensil, pulpen, penghapus, dan penggaris",
      volume: 100,
      price: 125000,
    },
    {
      id: 3,
      name: "Seragam sekolah",
      specification: "Satu set seragam SMP sesuai ukuran siswa",
      volume: 100,
      price: 275000,
    },
  ],
  "Alat IPA": [
    {
      id: 1,
      name: "Kit praktikum IPA",
      specification: "Set percobaan fisika dan biologi SMP",
      volume: 8,
      price: 4500000,
    },
    {
      id: 2,
      name: "Mikroskop siswa",
      specification: "Pembesaran 40x-400x, lengkap dengan kaca preparat",
      volume: 6,
      price: 1850000,
    },
  ],
  RKD: [
    {
      id: 1,
      name: "Rehab ruang kelas rusak",
      specification: "Perbaikan dinding, lantai, dan atap ruang kelas SMP",
      volume: 2,
      price: 45000000,
    },
    {
      id: 2,
      name: "Pengecatan dan finishing",
      specification: "Cat tembok, plafon, dan kusen",
      volume: 2,
      price: 8500000,
    },
  ],
  "Lab Komputer": [
    {
      id: 1,
      name: "Komputer siswa",
      specification: "PC desktop, RAM 8 GB, SSD 256 GB",
      volume: 20,
      price: 7800000,
    },
    {
      id: 2,
      name: "Meja dan kursi lab",
      specification: "Meja komputer siswa SMP beserta kursi",
      volume: 20,
      price: 1250000,
    },
  ],
  Meubeler: [
    {
      id: 1,
      name: "Meja siswa",
      specification: "Kayu kuat, ukuran standar SMP",
      volume: 40,
      price: 650000,
    },
    {
      id: 2,
      name: "Kursi siswa",
      specification: "Rangka besi, dudukan kayu",
      volume: 40,
      price: 425000,
    },
    {
      id: 3,
      name: "Lemari kelas",
      specification: "Lemari kayu 2 pintu untuk ruang kelas",
      volume: 6,
      price: 2750000,
    },
  ],
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value)
}

function formatRupiahDoc(value: number) {
  return `Rp ${new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`
}

const schoolDistricts: Record<string, string> = {
  "SMP Negeri 1 Sukamaju": "Kec. Sukamaju",
  "SMP Negeri 1 Cianjur": "Kec. Cianjur",
  "SMP Negeri 3 Garut": "Kec. Garut Kota",
  "SMP Negeri 4 Demak": "Kec. Demak",
  "SMP Negeri 2 Sumberwuluh": "Kec. Candipuro",
  "SMP Negeri 1 Tanjung": "Kec. Tanjung",
  "SMP Negeri 2 Palu": "Kec. Palu Barat",
  "SMP Negeri 5 Padang": "Kec. Padang Barat",
}

function getRabItems(
  menu: string,
  packages: Record<string, AidItem[]>,
) {
  return (packages[menu] ?? []).map((item) => {
    const good = masterGoods.find((row) => row.name === item.name)
    return {
      name: item.name,
      specification: item.specification,
      quantity: item.volume,
      unit: good?.unit ?? "Unit",
      price: item.price,
    }
  })
}

function RabDocument({
  schoolName,
  district,
  regency,
  province,
  address,
  npsn,
  menuName,
  items,
  principal,
  principalNip,
  place,
  dateLabel,
  pelaksana,
  komite,
}: {
  schoolName: string
  district: string
  regency: string
  province: string
  address: string
  npsn: string
  menuName: string
  items: ReturnType<typeof getRabItems>
  principal: string
  principalNip: string
  place: string
  dateLabel: string
  pelaksana?: SignerRecord | null
  komite?: SignerRecord | null
}) {
  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0,
  )
  return (
    <div className="rab-print-sheet overflow-x-auto bg-white p-6 text-black md:p-10">
      <div className="mb-6 flex items-start gap-4 border-b border-black pb-4">
        <div className="grid size-16 shrink-0 place-items-center rounded-full border-2 border-black text-[0.65rem] font-bold">
          LOGO
        </div>
        <div className="flex-1 text-center">
          <div className="text-base font-extrabold uppercase tracking-wide">
            {schoolName}
          </div>
          <div className="mt-1 text-[0.7rem] uppercase">
            {district} {regency} {province}
          </div>
          <div className="mt-1 text-[0.7rem]">{address}</div>
          <div className="text-[0.7rem]">NPSN : {npsn}</div>
        </div>
        <div className="w-16 shrink-0" />
      </div>
      <div className="mb-3 text-center text-sm font-extrabold uppercase">
        Rencana Anggaran Biaya (RAB)
      </div>
      <div className="mb-3 text-center text-xs font-semibold uppercase">
        Menu Bantuan: {menuName}
      </div>
      <table className="w-full min-w-[48rem] border-collapse border border-black text-xs">
        <thead>
          <tr className="bg-white">
            <th className="w-12 border border-black px-2 py-2 font-bold">No</th>
            <th className="border border-black px-2 py-2 font-bold">
              Jenis Barang
            </th>
            <th className="w-28 border border-black px-2 py-2 font-bold">
              Satuan
            </th>
            <th className="w-40 border border-black px-2 py-2 font-bold">
              Harga Satuan
            </th>
            <th className="w-40 border border-black px-2 py-2 font-bold">
              Jumlah (Rp)
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={`${item.name}-${index}`}>
              <td className="border border-black px-2 py-3 text-center align-top">
                {index + 1}
              </td>
              <td className="border border-black px-3 py-3 align-top">
                <div className="font-bold">{item.name}</div>
                <div className="mt-1 leading-5">
                  Spesifikasi:
                  <br />
                  {item.specification}
                </div>
              </td>
              <td className="border border-black px-2 py-3 text-center align-top">
                {item.quantity} {item.unit}
              </td>
              <td className="border border-black px-2 py-3 text-right align-top">
                {formatRupiahDoc(item.price)}
              </td>
              <td className="border border-black px-2 py-3 text-right align-top">
                {formatRupiahDoc(item.quantity * item.price)}
              </td>
            </tr>
          ))}
          <tr>
            <td
              className="border border-black px-3 py-3 text-right font-bold"
              colSpan={4}
            >
              Total Bantuan
            </td>
            <td className="border border-black px-2 py-3 text-right font-bold">
              {formatRupiahDoc(total)}
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mt-10 grid grid-cols-2 gap-8 text-xs">
        <div className="text-center">
          <div>Kepala Satuan Pendidikan</div>
          <div className="font-bold uppercase">{schoolName}</div>
          <div className="h-20" />
          <div className="font-bold underline">{principal}</div>
          <div>NIP. {principalNip}</div>
        </div>
        <div className="text-center">
          <div>
            {place}, {dateLabel}
          </div>
          {pelaksana ? (
            <>
              <div>Ketua Pelaksana</div>
              <div className="h-20" />
              <div className="font-bold underline">{pelaksana.name}</div>
              <div>
                {pelaksana.identityLabel}. {pelaksana.identity}
              </div>
            </>
          ) : (
            <div className="h-20" />
          )}
        </div>
      </div>
      {komite && (
        <div className="mt-8 text-center text-xs">
          <div>Ketua Komite Satuan Pendidikan,</div>
          <div className="h-16" />
          <div className="font-bold underline">{komite.name}</div>
          <div>
            {komite.identityLabel}. {komite.identity}
          </div>
        </div>
      )}
      <div className="mt-10 text-center text-[0.65rem] leading-5 text-neutral-600">
        Dokumen ini adalah formulir Rencana Anggaran Biaya (RAB) tahun 2025.
        <br />
        Silakan cetak, tanda tangani cap basah, lalu unggah kembali di menu RAB.
      </div>
    </div>
  )
}

type RabLine = {
  id: number
  name: string
  specification: string
  quantity: number
  unit: string
  price: number
}

type RabDraft = {
  items: RabLine[]
  updatedAt: string
}

function toRabLines(
  items: ReturnType<typeof getRabItems>,
): RabLine[] {
  return items.map((item, index) => ({ id: index + 1, ...item }))
}

function rabDraftKey(school: string, menu: string) {
  return `${school}::${menu}`
}

function RabPage({
  mode,
  schoolName,
  signer,
  packages,
  signers = initialSigners,
  docUploads = {},
  onChangeDocUploads,
  canReview = false,
  reviewerName = "",
}: {
  mode: "admin" | "school"
  schoolName?: string
  signer?: {
    name: string
    nip: string
    date: string
    place: string
  }
  packages: Record<string, AidItem[]>
  signers?: SignerRecord[]
  docUploads?: DocUploadsMap
  onChangeDocUploads?: (next: DocUploadsMap) => void
  canReview?: boolean
  reviewerName?: string
}) {
  const schoolList = useAffectedSchoolList()
  const [selectedSchool, setSelectedSchool] = useState(schoolName ?? "")
  const [drafts, setDrafts] = usePersistedState<Record<string, RabDraft>>(
    "rabDrafts",
    {},
  )
  const [view, setView] = useState<
    { kind: "list" } | { kind: "edit"; menu: string } | { kind: "preview"; menu: string }
  >({ kind: "list" })
  const [editorItems, setEditorItems] = useState<RabLine[]>([])
  const [savedMessage, setSavedMessage] = useState("")
  const schoolUploads = schoolDocUploads(docUploads, selectedSchool)
  const changeRabUpload = (menu: string, next: SignedUploadFile | null) => {
    onChangeDocUploads?.(
      patchSchoolUploads(docUploads, selectedSchool, (current) => ({
        ...current,
        rab: { ...current.rab, [menu]: next },
      })),
    )
  }
  const school = schoolList.find((item) => item.name === selectedSchool)
  const pks = pksSchools.find((item) => item.name === selectedSchool)
  const menus = uangMenus(school)
  const schoolSigner = schoolSignerView(signers, selectedSchool, {
    name: signer?.name ?? pks?.principal ?? "",
    nip: signer?.nip,
    place: signer?.place ?? school?.regency ?? "",
    date: signer?.date,
  })
  const committee = schoolCommitteeSigners(signers, selectedSchool)
  const context = {
    schoolName: selectedSchool,
    district: schoolDistricts[selectedSchool] ?? "",
    regency: school?.regency ?? "",
    province: school?.province ?? "",
    address: pks?.address ?? school?.location ?? "",
    npsn: pks?.npsn ?? "",
    principal: schoolSigner.name,
    principalNip: schoolSigner.nip,
    place: schoolSigner.place,
    dateLabel: schoolSigner.dateLabel,
    pelaksana: committee.pelaksana,
    komite: committee.komite,
  }

  const templateItems = (menu: string) =>
    toRabLines(getRabItems(menu, packages))

  const openCreateDraft = (menu: string) => {
    setEditorItems(templateItems(menu))
    setView({ kind: "edit", menu })
    setSavedMessage("")
  }

  const openEditDraft = (menu: string) => {
    const draft = drafts[rabDraftKey(selectedSchool, menu)]
    setEditorItems(draft ? draft.items.map((item) => ({ ...item })) : templateItems(menu))
    setView({ kind: "edit", menu })
    setSavedMessage("")
  }

  const saveDraft = () => {
    if (view.kind !== "edit") return
    const cleaned = editorItems
      .filter((item) => item.name.trim())
      .map((item) => ({
        ...item,
        name: item.name.trim(),
        specification: item.specification.trim(),
        unit: item.unit.trim() || "Unit",
        quantity: Number(item.quantity) || 0,
        price: Number(item.price) || 0,
      }))
    setDrafts((current) => ({
      ...current,
      [rabDraftKey(selectedSchool, view.menu)]: {
        items: cleaned,
        updatedAt: new Date().toLocaleString("id-ID"),
      },
    }))
    setSavedMessage("Draf RAB berhasil disimpan.")
    window.setTimeout(() => setSavedMessage(""), 2500)
    setView({ kind: "list" })
  }

  const updateEditorItem = (
    id: number,
    field: keyof Omit<RabLine, "id">,
    value: string,
  ) => {
    setEditorItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "quantity" || field === "price"
                  ? Number(value)
                  : value,
            }
          : item,
      ),
    )
  }

  const addEditorItem = () => {
    setEditorItems((current) => [
      ...current,
      {
        id: Math.max(0, ...current.map((item) => item.id)) + 1,
        name: "",
        specification: "",
        quantity: 1,
        unit: "Unit",
        price: 0,
      },
    ])
  }

  const removeEditorItem = (id: number) => {
    setEditorItems((current) => current.filter((item) => item.id !== id))
  }

  if (view.kind === "preview") {
    const draft = drafts[rabDraftKey(selectedSchool, view.menu)]
    const items = draft?.items ?? templateItems(view.menu)
    const total = items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    )
    return (
      <div className="space-y-4">
        <div className="no-print flex flex-col gap-3 rounded-2xl border border-border bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-base font-bold text-ink">
              Preview: Rencana Anggaran Biaya (RAB)
            </div>
            <div className="mt-1 text-xs text-muted">
              Periksa data sebelum mencetak dan menandatangani. Menu:{" "}
              {view.menu}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              className="gap-2 border border-border px-4 py-2.5 text-xs font-bold text-ink hover:bg-surface"
              onClick={() => window.print()}
            >
              Cetak
            </Button>
            <Button
              className="gap-2 border border-border px-4 py-2.5 text-xs font-bold text-ink hover:bg-surface"
              onClick={() =>
                downloadPortalPdf(`RAB ${view.menu} ${selectedSchool}`, [
                  selectedSchool,
                  `NPSN: ${context.npsn}`,
                  `Menu: ${view.menu}`,
                  "",
                  ...items.map(
                    (item, index) =>
                      `${index + 1}. ${item.name} - ${item.quantity} ${item.unit} - ${formatRupiahDoc(item.quantity * item.price)}`,
                  ),
                  `TOTAL: ${formatRupiahDoc(total)}`,
                ])
              }
            >
              Download PDF
            </Button>
            <Button
              className="gap-2 bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-dark"
              onClick={() => setView({ kind: "list" })}
            >
              Kembali
            </Button>
          </div>
        </div>
        <div className="no-print">
            <SignedDocumentUpload
              canReview={canReview}
              documentLabel={`RAB ${view.menu}`}
              file={schoolUploads.rab[view.menu] ?? null}
              hasDraft
              onChange={(next) => changeRabUpload(view.menu, next)}
              reviewerName={reviewerName}
              trackApproval
            />
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <RabDocument
            {...context}
            items={items}
            komite={context.komite}
            menuName={view.menu}
            pelaksana={context.pelaksana}
          />
        </div>
      </div>
    )
  }

  if (view.kind === "edit") {
    const editorTotal = editorItems.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0,
    )
    const isNew = !drafts[rabDraftKey(selectedSchool, view.menu)]
    return (
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="text-2xl font-extrabold text-ink">
              {isNew ? "Buat draf RAB" : "Edit draf RAB"}
            </div>
            <div className="mt-1 text-sm text-muted">
              {selectedSchool} · Menu {view.menu}. Sesuaikan barang, volume, dan
              harga, lalu simpan draf.
            </div>
          </div>
          <Button
            className="border border-border px-4 py-2.5 text-xs font-bold text-ink hover:bg-surface"
            onClick={() => setView({ kind: "list" })}
          >
            Kembali
          </Button>
        </div>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[56rem] text-left">
              <thead className="bg-surface text-xs text-muted">
                <tr>
                  <th className="px-4 py-3 font-bold">Jenis barang</th>
                  <th className="px-4 py-3 font-bold">Spesifikasi</th>
                  <th className="px-4 py-3 font-bold">Satuan</th>
                  <th className="px-4 py-3 font-bold">Volume</th>
                  <th className="px-4 py-3 font-bold">Harga satuan</th>
                  <th className="px-4 py-3 text-right font-bold">Jumlah</th>
                  <th className="px-4 py-3 font-bold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {editorItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-3">
                      <input
                        className="w-40 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                        onChange={(event) =>
                          updateEditorItem(item.id, "name", event.target.value)
                        }
                        value={item.name}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <textarea
                        className="h-20 w-56 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                        onChange={(event) =>
                          updateEditorItem(
                            item.id,
                            "specification",
                            event.target.value,
                          )
                        }
                        value={item.specification}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        className="w-24 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                        onChange={(event) =>
                          updateEditorItem(item.id, "unit", event.target.value)
                        }
                        value={item.unit}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        className="w-20 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                        min="0"
                        onChange={(event) =>
                          updateEditorItem(
                            item.id,
                            "quantity",
                            event.target.value,
                          )
                        }
                        type="number"
                        value={item.quantity}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        className="w-32 rounded-lg border border-border px-3 py-2 text-sm outline-none focus:border-primary"
                        min="0"
                        onChange={(event) =>
                          updateEditorItem(item.id, "price", event.target.value)
                        }
                        type="number"
                        value={item.price}
                      />
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-bold text-ink">
                      {formatRupiah(item.quantity * item.price)}
                    </td>
                    <td className="px-4 py-3">
                      <Button
                        className="px-2.5 py-2 text-xs font-bold text-danger hover:bg-red-soft"
                        onClick={() => removeEditorItem(item.id)}
                      >
                        Hapus
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t border-border bg-blue-soft/40">
                <tr>
                  <td className="px-4 py-4 text-sm font-extrabold text-ink" colSpan={5}>
                    Total Bantuan
                  </td>
                  <td className="px-4 py-4 text-right text-base font-extrabold text-primary">
                    {formatRupiah(editorTotal)}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
          <div className="flex flex-col justify-between gap-3 border-t border-border p-4 sm:flex-row sm:items-center">
            <Button
              className="border border-border px-4 py-2.5 text-xs font-bold text-ink hover:bg-surface"
              onClick={addEditorItem}
            >
              + Tambah barang
            </Button>
            <div className="flex flex-wrap items-center gap-3">
              {savedMessage && (
                <div className="text-xs font-semibold text-success">
                  {savedMessage}
                </div>
              )}
              <Button
                className="border border-border px-5 py-2.5 text-xs font-bold text-ink hover:bg-white"
                onClick={() => setView({ kind: "list" })}
              >
                Batal
              </Button>
              <Button
                className="bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-dark"
                onClick={saveDraft}
              >
                Simpan draf
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="text-2xl font-extrabold text-ink">
            Rencana Anggaran Biaya
          </div>
          <div className="mt-1 text-sm text-muted">
            Buat draf RAB per menu bantuan yang diterima sekolah, isi atau
            edit, lalu simpan sebelum preview dan cetak.
          </div>
        </div>
        {mode === "admin" && (
          <div className="block sm:w-96">
            <span className="mb-2 block text-xs font-bold text-ink">
              Sekolah
            </span>
            <SchoolSearchPicker
              ariaLabel="Cari sekolah untuk RAB"
              onChange={(name) => {
                setSelectedSchool(name)
                setView({ kind: "list" })
                setSavedMessage("")
              }}
              source="affected"
              value={selectedSchool}
            />
          </div>
        )}
      </div>
      {savedMessage && (
        <div className="rounded-2xl bg-green-soft px-4 py-3 text-sm font-semibold text-success">
          {savedMessage}
        </div>
      )}
      {!selectedSchool ? (
        <PickSchoolPrompt label="RAB" />
      ) : menus.length === 0 ? (
        <div className="card px-6 py-16 text-center text-sm text-muted">
          {isSchoolkitBarangOnly(school)
            ? "Schoolkit berbentuk barang, sehingga RAB tidak diperlukan."
            : "Sekolah ini belum memiliki menu bantuan, sehingga RAB belum tersedia."}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {menus.map((menu) => {
            const draft = drafts[rabDraftKey(selectedSchool, menu)]
            const items = draft?.items ?? templateItems(menu)
            const total = items.reduce(
              (sum, item) => sum + item.quantity * item.price,
              0,
            )
            return (
              <div className="card flex flex-col p-5" key={menu}>
                <div className="flex items-start justify-between gap-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted">
                    RAB terpisah
                  </div>
                  <DocFlowStatusPill
                    file={schoolUploads.rab[menu] ?? null}
                    hasDraft={Boolean(draft)}
                  />
                </div>
                <div className="mt-2 text-lg font-extrabold text-ink">{menu}</div>
                <div className="mt-1 text-xs text-muted">
                  {items.length} jenis barang · {selectedSchool}
                </div>
                <div className="mt-4 text-sm font-bold text-ink">
                  {formatRupiah(total)}
                </div>
                {draft && (
                  <div className="mt-1 text-[0.7rem] text-muted">
                    Disimpan {draft.updatedAt}
                  </div>
                )}
                <div className="mt-5 flex flex-col gap-2">
                  {draft ? (
                    <>
                      <Button
                        className="w-full bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-dark"
                        onClick={() => openEditDraft(menu)}
                      >
                        Edit RAB
                      </Button>
                      <Button
                        className="w-full border border-border px-4 py-2.5 text-xs font-bold text-ink hover:bg-surface"
                        onClick={() => setView({ kind: "preview", menu })}
                      >
                        Preview RAB
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="w-full bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-dark"
                      onClick={() => openCreateDraft(menu)}
                    >
                      Buat draf RAB
                    </Button>
                  )}
                </div>
                <SignedDocumentUpload
                  canReview={canReview}
                  documentLabel={`RAB ${menu}`}
                  enabled={Boolean(draft)}
                  file={schoolUploads.rab[menu] ?? null}
                  hasDraft={Boolean(draft)}
                  onChange={(next) => changeRabUpload(menu, next)}
                  reviewerName={reviewerName}
                  trackApproval
                />
            </div>
          )
        })}
        </div>
      )}
    </div>
  )
}

type KwitansiKind = "schoolkit" | "non-schoolkit"

type KwitansiDraft = {
  receivedFrom: string
  amount: number
  paymentFor: string
  year: string
  principal: string
  principalNip: string
  updatedAt: string
}

const defaultKwitansiKpa: SignerRecord = initialSigners[0]
const defaultKwitansiTreasurer: SignerRecord = initialSigners[1]

function terbilangRupiah(value: number) {
  const ones = [
    "",
    "satu",
    "dua",
    "tiga",
    "empat",
    "lima",
    "enam",
    "tujuh",
    "delapan",
    "sembilan",
    "sepuluh",
    "sebelas",
  ]
  const toWords = (amount: number): string => {
    if (amount < 12) return ones[amount]
    if (amount < 20) return `${toWords(amount - 10)} belas`
    if (amount < 100) {
      const rest = amount % 10
      return `${toWords(Math.floor(amount / 10))} puluh${rest ? ` ${toWords(rest)}` : ""}`
    }
    if (amount < 200) {
      return `seratus${amount % 100 ? ` ${toWords(amount % 100)}` : ""}`
    }
    if (amount < 1000) {
      const rest = amount % 100
      return `${toWords(Math.floor(amount / 100))} ratus${rest ? ` ${toWords(rest)}` : ""}`
    }
    if (amount < 2000) {
      return `seribu${amount % 1000 ? ` ${toWords(amount % 1000)}` : ""}`
    }
    if (amount < 1_000_000) {
      const rest = amount % 1000
      return `${toWords(Math.floor(amount / 1000))} ribu${rest ? ` ${toWords(rest)}` : ""}`
    }
    if (amount < 1_000_000_000) {
      const rest = amount % 1_000_000
      return `${toWords(Math.floor(amount / 1_000_000))} juta${rest ? ` ${toWords(rest)}` : ""}`
    }
    if (amount < 1_000_000_000_000) {
      const rest = amount % 1_000_000_000
      return `${toWords(Math.floor(amount / 1_000_000_000))} miliar${rest ? ` ${toWords(rest)}` : ""}`
    }
    const rest = amount % 1_000_000_000_000
    return `${toWords(Math.floor(amount / 1_000_000_000_000))} triliun${rest ? ` ${toWords(rest)}` : ""}`
  }
  const rounded = Math.floor(Math.abs(value))
  if (rounded === 0) return "Nol rupiah"
  const text = toWords(rounded).replace(/\s+/g, " ").trim()
  return `${text.charAt(0).toUpperCase()}${text.slice(1)} rupiah`
}

function formatRupiahKwitansi(value: number) {
  return `Rp. ${new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)}`
}

function menuPackageTotal(
  menu: string,
  packages: Record<string, AidItem[]>,
) {
  return (packages[menu] ?? []).reduce(
    (sum, item) => sum + item.volume * item.price,
    0,
  )
}

function joinMenuNames(menus: string[]) {
  if (menus.length === 0) return ""
  if (menus.length === 1) return menus[0]
  return `${menus.slice(0, -1).join(", ")} dan ${menus[menus.length - 1]}`
}

function getKwitansiGroups(menus: string[], hideSchoolkit = false) {
  const hasSchoolkit = menus.includes("Schoolkit") && !hideSchoolkit
  const otherMenus = menus.filter((menu) => menu !== "Schoolkit")
  const groups: {
    kind: KwitansiKind
    title: string
    menus: string[]
  }[] = []
  if (hasSchoolkit) {
    groups.push({
      kind: "schoolkit",
      title: "Kwitansi Schoolkit",
      menus: ["Schoolkit"],
    })
  }
  if (otherMenus.length > 0) {
    groups.push({
      kind: "non-schoolkit",
      title: "Kwitansi Non-Schoolkit",
      menus: otherMenus,
    })
  }
  return groups
}

function pksPrerequisiteItems(
  schoolName: string,
  all: DocUploadsMap,
  schoolList: SchoolRecord[] = schools,
) {
  const school = schoolList.find((item) => item.name === schoolName)
  const menus = uangMenus(school)
  const files = schoolDocUploads(all, schoolName)
  const rabDone = menus.filter((menu) => files.rab[menu]).length
  const groups = getKwitansiGroups(school?.packages ?? [], isSchoolkitBarang(school))
  const kwitansiDone = groups.filter((group) => files.kwitansi[group.kind]).length
  const items = [
    ...(menus.length > 0
      ? [
          {
            label: "RAB",
            done: rabDone === menus.length,
            detail: `${rabDone}/${menus.length} menu`,
          },
        ]
      : []),
    ...(!isSchoolkitBarangOnly(school)
      ? [
          {
            label: "Pakta Integritas",
            done: Boolean(files.pakta),
            detail: files.pakta ? "Sudah unggah" : "Belum unggah",
          },
        ]
      : []),
    ...(groups.length > 0
      ? [
          {
            label: "Kwitansi",
            done: kwitansiDone === groups.length,
            detail: `${kwitansiDone}/${groups.length} dokumen`,
          },
        ]
      : []),
    ...(!isSchoolkitBarangOnly(school)
      ? [
          {
            label: "SPTJM",
            done: Boolean(files.sptjm),
            detail: files.sptjm ? "Sudah unggah" : "Belum unggah",
          },
        ]
      : []),
  ]
  return {
    items,
    allReady: items.every((item) => item.done),
  }
}

function defaultKwitansiPurpose(menus: string[], year: string) {
  const subject =
    menus.length === 1 && menus[0] === "Schoolkit"
      ? "Schoolkit"
      : joinMenuNames(menus)
  return `Untuk Pembayaran Bantuan Pemerintah ${subject} Satuan Pendidikan Sekolah Menengah Pertama (SMP) Tahun ${year}`
}

function kwitansiDraftKey(school: string, kind: KwitansiKind) {
  return `${school}::${kind}`
}

function KwitansiDocument({
  receivedFrom,
  amount,
  paymentFor,
  year,
  schoolName,
  principal,
  principalNip,
  kpa = defaultKwitansiKpa,
  treasurer = defaultKwitansiTreasurer,
  pelaksana,
  komite,
}: {
  receivedFrom: string
  amount: number
  paymentFor: string
  year: string
  schoolName: string
  principal: string
  principalNip: string
  kpa?: SignerRecord
  treasurer?: SignerRecord
  pelaksana?: SignerRecord | null
  komite?: SignerRecord | null
}) {
  const rows = [
    ["Telah terima dari", receivedFrom],
    ["Uang sebesar", formatRupiahKwitansi(amount)],
    ["Terbilang", terbilangRupiah(amount)],
    ["Untuk Pembayaran", paymentFor],
  ]
  return (
    <div className="rab-print-sheet overflow-x-auto bg-white p-8 text-black md:p-12">
      <div className="mb-10 text-center text-lg font-extrabold tracking-[0.55em] underline">
        KUITANSI
      </div>
      <div className="mx-auto max-w-4xl space-y-3 text-sm leading-7">
        {rows.map(([label, value]) => (
          <div className="grid grid-cols-[11rem_0.75rem_1fr] gap-x-2" key={label}>
            <div className="font-semibold">{label}</div>
            <div>:</div>
            <div className={label === "Uang sebesar" ? "font-extrabold" : ""}>
              {value}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12 text-right text-sm">
        ................, ................. {year}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-8 text-center text-[0.7rem] leading-5 sm:grid-cols-3">
        <div>
          <div>{kpa.line1}</div>
          <div>{kpa.line2}</div>
          <div>{kpa.position}</div>
          <div>{kpa.line3}</div>
          <div className="h-20" />
          <div className="font-bold underline">{kpa.name}</div>
          <div>
            {kpa.identityLabel}. {kpa.identity}
          </div>
        </div>
        <div>
          <div>{treasurer.line1}</div>
          <div>{treasurer.line2}</div>
          <div>{treasurer.line3}</div>
          <div className="h-20" />
          <div className="font-bold underline">{treasurer.name}</div>
          <div>
            {treasurer.identityLabel}. {treasurer.identity}
          </div>
        </div>
        <div>
          <div>Kepala Sekolah</div>
          <div className="font-bold uppercase">{schoolName}</div>
          <div className="h-20" />
          <div className="font-bold underline">{principal}</div>
          <div>NIP. {principalNip}</div>
        </div>
      </div>
      <SchoolCommitteeSignatures komite={komite} pelaksana={pelaksana} />
      <div className="mt-12 text-center text-[0.65rem] leading-5 text-neutral-600">
        Dokumen ini adalah formulir Kwitansi tahun {year}.
        <br />
        Silakan cetak, tanda tangani cap basah, lalu unggah kembali di menu
        Kwitansi.
      </div>
    </div>
  )
}

function KwitansiPage({
  mode,
  schoolName,
  signer,
  packages,
  signers = initialSigners,
  docUploads = {},
  onChangeDocUploads,
  canReview = false,
  reviewerName = "",
}: {
  mode: "admin" | "school"
  schoolName?: string
  signer?: {
    name: string
    nip: string
  }
  packages: Record<string, AidItem[]>
  signers?: SignerRecord[]
  docUploads?: DocUploadsMap
  onChangeDocUploads?: (next: DocUploadsMap) => void
  canReview?: boolean
  reviewerName?: string
}) {
  const schoolList = useAffectedSchoolList()
  const [selectedSchool, setSelectedSchool] = useState(schoolName ?? "")
  const [drafts, setDrafts] = usePersistedState<Record<string, KwitansiDraft>>(
    "kwitansiDrafts",
    {},
  )
  const [view, setView] = useState<
    | { kind: "list" }
    | { kind: "edit"; receipt: KwitansiKind }
    | { kind: "preview"; receipt: KwitansiKind }
  >({ kind: "list" })
  const [editor, setEditor] = useState<KwitansiDraft | null>(null)
  const [savedMessage, setSavedMessage] = useState("")
  const schoolUploads = schoolDocUploads(docUploads, selectedSchool)
  const changeKwitansiUpload = (
    kind: KwitansiKind,
    next: SignedUploadFile | null,
  ) => {
    onChangeDocUploads?.(
      patchSchoolUploads(docUploads, selectedSchool, (current) => ({
        ...current,
        kwitansi: { ...current.kwitansi, [kind]: next },
      })),
    )
  }
  const school = schoolList.find((item) => item.name === selectedSchool)
  const pks = pksSchools.find((item) => item.name === selectedSchool)
  const groups = getKwitansiGroups(
    school?.packages ?? [],
    isSchoolkitBarang(school),
  )
  const yearDefault = "2026"
  const schoolSigner = schoolSignerView(signers, selectedSchool, {
    name: signer?.name ?? pks?.principal ?? "",
    nip: signer?.nip,
  })
  const kpaSigner = findSigner(signers, "kpa") ?? defaultKwitansiKpa
  const treasurerSigner = findSigner(signers, "bendahara") ?? defaultKwitansiTreasurer

  const templateDraft = (receipt: KwitansiKind): KwitansiDraft => {
    const group = groups.find((item) => item.kind === receipt)
    const menus = group?.menus ?? []
    const amount = menus.reduce(
      (sum, menu) => sum + menuPackageTotal(menu, packages),
      0,
    )
    return {
      receivedFrom:
        "Kuasa Pengguna Anggaran Satuan Kerja Direktorat Sekolah Menengah Pertama",
      amount,
      paymentFor: defaultKwitansiPurpose(menus, yearDefault),
      year: yearDefault,
      principal: schoolSigner.name,
      principalNip: schoolSigner.nip,
      updatedAt: "",
    }
  }

  const openCreateDraft = (receipt: KwitansiKind) => {
    setEditor(templateDraft(receipt))
    setView({ kind: "edit", receipt })
    setSavedMessage("")
  }

  const openEditDraft = (receipt: KwitansiKind) => {
    const draft = drafts[kwitansiDraftKey(selectedSchool, receipt)]
    setEditor(draft ? { ...draft } : templateDraft(receipt))
    setView({ kind: "edit", receipt })
    setSavedMessage("")
  }

  const saveDraft = () => {
    if (view.kind !== "edit" || !editor) return
    const next: KwitansiDraft = {
      ...editor,
      receivedFrom: editor.receivedFrom.trim(),
      paymentFor: editor.paymentFor.trim(),
      year: editor.year.trim() || yearDefault,
      principal: editor.principal.trim(),
      principalNip: editor.principalNip.trim(),
      amount: Number(editor.amount) || 0,
      updatedAt: new Date().toLocaleString("id-ID"),
    }
    setDrafts((current) => ({
      ...current,
      [kwitansiDraftKey(selectedSchool, view.receipt)]: next,
    }))
    setSavedMessage("Draf kwitansi berhasil disimpan.")
    window.setTimeout(() => setSavedMessage(""), 2500)
    setView({ kind: "list" })
  }

  if (view.kind === "preview") {
    const group = groups.find((item) => item.kind === view.receipt)
    const draft =
      drafts[kwitansiDraftKey(selectedSchool, view.receipt)] ??
      templateDraft(view.receipt)
    return (
      <div className="space-y-4">
        <div className="no-print flex flex-col gap-3 rounded-2xl border border-border bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-base font-bold text-ink">
              Preview: Kwitansi
            </div>
            <div className="mt-1 text-xs text-muted">
              Periksa data sebelum mencetak dan menandatangani.{" "}
              {group?.title ?? "Kwitansi"}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              className="gap-2 border border-border px-4 py-2.5 text-xs font-bold text-ink hover:bg-surface"
              onClick={() => window.print()}
            >
              Cetak
            </Button>
            <Button
              className="gap-2 border border-border px-4 py-2.5 text-xs font-bold text-ink hover:bg-surface"
              onClick={() =>
                downloadPortalPdf(`Kwitansi ${selectedSchool}`, [
                  selectedSchool,
                  group?.title ?? "Kwitansi",
                  `Telah terima dari: ${draft.receivedFrom}`,
                  `Uang sebesar: ${formatRupiahKwitansi(draft.amount)}`,
                  `Terbilang: ${terbilangRupiah(draft.amount)}`,
                  `Untuk pembayaran: ${draft.paymentFor}`,
                ])
              }
            >
              Download PDF
            </Button>
            <Button
              className="gap-2 bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-dark"
              onClick={() => setView({ kind: "list" })}
            >
              Kembali
            </Button>
          </div>
        </div>
        <div className="no-print">
            <SignedDocumentUpload
              canReview={canReview}
              documentLabel={group?.title ?? "Kwitansi"}
              file={schoolUploads.kwitansi[view.receipt] ?? null}
              hasDraft
              onChange={(next) => changeKwitansiUpload(view.receipt, next)}
              reviewerName={reviewerName}
              trackApproval
            />
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <KwitansiDocument
            amount={draft.amount}
            kpa={kpaSigner}
            komite={findSigner(signers, "ketua-komite", selectedSchool)}
            paymentFor={draft.paymentFor}
            pelaksana={findSigner(signers, "ketua-pelaksana", selectedSchool)}
            principal={schoolSigner.name}
            principalNip={schoolSigner.nip}
            receivedFrom={draft.receivedFrom}
            schoolName={selectedSchool}
            treasurer={treasurerSigner}
            year={draft.year}
          />
        </div>
      </div>
    )
  }

  if (view.kind === "edit" && editor) {
    const isNew = !drafts[kwitansiDraftKey(selectedSchool, view.receipt)]
    const group = groups.find((item) => item.kind === view.receipt)
    return (
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="text-2xl font-extrabold text-ink">
              {isNew ? "Buat draf kwitansi" : "Edit draf kwitansi"}
            </div>
            <div className="mt-1 text-sm text-muted">
              {selectedSchool} · {group?.title}. Isi data kwitansi, lalu simpan
              draf.
            </div>
          </div>
          <Button
            className="border border-border px-4 py-2.5 text-xs font-bold text-ink hover:bg-surface"
            onClick={() => setView({ kind: "list" })}
          >
            Kembali
          </Button>
        </div>
        <div className="card p-5 md:p-6">
          <div className="mb-5 rounded-2xl bg-blue-soft/70 px-4 py-3 text-xs leading-5 text-primary">
            {view.receipt === "schoolkit"
              ? "Kwitansi ini khusus menu Schoolkit."
              : `Menu non-Schoolkit digabung dalam satu kwitansi: ${joinMenuNames(group?.menus ?? [])}.`}
          </div>
          <div className="grid gap-5">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-ink">
                Telah terima dari
              </span>
              <input
                className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
                onChange={(event) =>
                  setEditor({ ...editor, receivedFrom: event.target.value })
                }
                value={editor.receivedFrom}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-ink">
                Uang sebesar
              </span>
              <input
                className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
                min="0"
                onChange={(event) =>
                  setEditor({
                    ...editor,
                    amount: Number(event.target.value),
                  })
                }
                type="number"
                value={editor.amount}
              />
              <div className="mt-2 text-xs text-muted">
                Terbilang: {terbilangRupiah(editor.amount)}
              </div>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-ink">
                Untuk pembayaran
              </span>
              <textarea
                className="h-28 w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
                onChange={(event) =>
                  setEditor({ ...editor, paymentFor: event.target.value })
                }
                value={editor.paymentFor}
              />
            </label>
            <div className="grid gap-5 md:grid-cols-3">
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Tahun
                </span>
                <input
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
                  onChange={(event) =>
                    setEditor({ ...editor, year: event.target.value })
                  }
                  value={editor.year}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Kepala sekolah
                </span>
                <input
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted outline-none"
                  readOnly
                  value={schoolSigner.name}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-ink">
                  NIP kepala sekolah
                </span>
                <input
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted outline-none"
                  readOnly
                  value={schoolSigner.nip}
                />
              </label>
            </div>
          </div>
          <div className="mt-6 flex flex-col justify-end gap-3 border-t border-border pt-4 sm:flex-row sm:items-center">
            <Button
              className="border border-border px-5 py-2.5 text-xs font-bold text-ink hover:bg-white"
              onClick={() => setView({ kind: "list" })}
            >
              Batal
            </Button>
            <Button
              className="bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-dark"
              onClick={saveDraft}
            >
              Simpan draf
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="text-2xl font-extrabold text-ink">Kwitansi</div>
          <div className="mt-1 text-sm text-muted">
            Buat draf kwitansi Schoolkit dan non-Schoolkit. Menu selain
            Schoolkit digabung dalam satu kwitansi.
          </div>
        </div>
        {mode === "admin" && (
          <div className="block sm:w-96">
            <span className="mb-2 block text-xs font-bold text-ink">
              Sekolah
            </span>
            <SchoolSearchPicker
              ariaLabel="Cari sekolah untuk kwitansi"
              onChange={(name) => {
                setSelectedSchool(name)
                setView({ kind: "list" })
                setSavedMessage("")
              }}
              source="affected"
              value={selectedSchool}
            />
          </div>
        )}
      </div>
      {savedMessage && (
        <div className="rounded-2xl bg-green-soft px-4 py-3 text-sm font-semibold text-success">
          {savedMessage}
        </div>
      )}
      {!selectedSchool ? (
        <PickSchoolPrompt label="kwitansi" />
      ) : groups.length === 0 ? (
        <div className="card px-6 py-16 text-center text-sm text-muted">
          {isSchoolkitBarangOnly(school)
            ? "Schoolkit berbentuk barang, sehingga kwitansi tidak diperlukan."
            : "Sekolah ini belum memiliki menu bantuan, sehingga kwitansi belum tersedia."}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {groups.map((group) => {
            const draft = drafts[kwitansiDraftKey(selectedSchool, group.kind)]
            const amount =
              draft?.amount ??
              group.menus.reduce(
                (sum, menu) => sum + menuPackageTotal(menu, packages),
                0,
              )
            return (
              <div className="card flex flex-col p-5" key={group.kind}>
                <div className="flex items-start justify-between gap-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-muted">
                    {group.kind === "schoolkit"
                      ? "Menu Schoolkit"
                      : "Menu non-Schoolkit digabung"}
                  </div>
                  <DocFlowStatusPill
                    file={schoolUploads.kwitansi[group.kind] ?? null}
                    hasDraft={Boolean(draft)}
                  />
                </div>
                <div className="mt-2 text-lg font-extrabold text-ink">
                  {group.title}
                </div>
                <div className="mt-1 text-xs text-muted">
                  {joinMenuNames(group.menus)} · {selectedSchool}
                </div>
                <div className="mt-4 text-sm font-bold text-ink">
                  {formatRupiah(amount)}
                </div>
                {draft && (
                  <div className="mt-1 text-[0.7rem] text-muted">
                    Disimpan {draft.updatedAt}
                  </div>
                )}
                <div className="mt-5 flex flex-col gap-2">
                  {draft ? (
                    <>
                      <Button
                        className="w-full bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-dark"
                        onClick={() => openEditDraft(group.kind)}
                      >
                        Edit kwitansi
                      </Button>
                      <Button
                        className="w-full border border-border px-4 py-2.5 text-xs font-bold text-ink hover:bg-surface"
                        onClick={() =>
                          setView({ kind: "preview", receipt: group.kind })
                        }
                      >
                        Preview kwitansi
                      </Button>
                    </>
                  ) : (
                    <Button
                      className="w-full bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-dark"
                      onClick={() => openCreateDraft(group.kind)}
                    >
                      Buat draf kwitansi
                    </Button>
                  )}
                </div>
                <SignedDocumentUpload
                  canReview={canReview}
                  documentLabel={group.title}
                  enabled={Boolean(draft)}
                  file={schoolUploads.kwitansi[group.kind] ?? null}
                  hasDraft={Boolean(draft)}
                  onChange={(next) => changeKwitansiUpload(group.kind, next)}
                  reviewerName={reviewerName}
                  trackApproval
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

type PaktaTemplate = {
  id: number
  title: string
  statement: string
}

type PaktaDraft = {
  name: string
  role: string
  nip: string
  templateId: number
  place: string
  dateLabel: string
  updatedAt: string
}

const defaultPaktaStatement =
  "Dengan ini menyatakan akan menggunakan bantuan secara tertib, transparan, dan bertanggung jawab sesuai ketentuan yang berlaku, serta tidak melakukan perbuatan korupsi, kolusi, dan nepotisme dalam pengelolaan dana bantuan.\n\nDemikian pakta integritas ini dibuat dengan sebenar-benarnya."

const initialPaktaTemplates: PaktaTemplate[] = [
  {
    id: 1,
    title: "Pakta Integritas Bantuan SPAB",
    statement: defaultPaktaStatement,
  },
]

function defaultPaktaTemplate(templates: PaktaTemplate[]): PaktaTemplate {
  const sorted = [...templates].sort((a, b) => a.id - b.id)
  return (
    sorted[0] ?? {
      id: 1,
      title: "Pakta Integritas Bantuan SPAB",
      statement: defaultPaktaStatement,
    }
  )
}

function resolvePaktaTemplate(
  templates: PaktaTemplate[],
  templateId?: number,
): PaktaTemplate {
  return (
    templates.find((item) => item.id === templateId) ??
    defaultPaktaTemplate(templates)
  )
}

function PaktaDocument({
  schoolName,
  name,
  role,
  nip,
  statement,
  place,
  dateLabel,
  pelaksana,
  komite,
}: {
  schoolName: string
  name: string
  role: string
  nip: string
  statement: string
  place: string
  dateLabel: string
  pelaksana?: SignerRecord | null
  komite?: SignerRecord | null
}) {
  return (
    <div className="rab-print-sheet overflow-x-auto bg-white p-8 text-black md:p-12">
      <div className="mb-2 text-center text-lg font-extrabold uppercase tracking-wide">
        Pakta Integritas
      </div>
      <div className="mb-8 text-center text-xs">
        Bantuan Satuan Pendidikan Terdampak Bencana
      </div>
      <div className="mx-auto max-w-3xl space-y-4 text-sm leading-7">
        <div>Saya yang bertanda tangan di bawah ini:</div>
        <div className="grid grid-cols-[8rem_1fr] gap-y-2">
          <span>Nama</span>
          <b>{name}</b>
          <span>Jabatan</span>
          <b>{role}</b>
          <span>NIP</span>
          <b>{nip}</b>
          <span>Sekolah</span>
          <b>{schoolName}</b>
        </div>
        <div className="whitespace-pre-wrap">{statement}</div>
      </div>
      <div className="ml-auto mt-14 w-56 text-center text-sm">
        <div>
          {place}, {dateLabel}
        </div>
        <div className="h-20" />
        <div className="font-bold underline">{name}</div>
        <div>NIP. {nip}</div>
      </div>
      <SchoolCommitteeSignatures komite={komite} pelaksana={pelaksana} />
      <div className="mt-12 text-center text-[0.65rem] leading-5 text-neutral-600">
        Dokumen ini adalah formulir Pakta Integritas.
        <br />
        Silakan cetak, tanda tangani cap basah, lalu unggah kembali di menu
        Pakta Integritas.
      </div>
    </div>
  )
}

function PaktaPage({
  mode,
  schoolName,
  signer,
  signers = initialSigners,
  templates = initialPaktaTemplates,
  docUploads = {},
  onChangeDocUploads,
  canReview = false,
  reviewerName = "",
}: {
  mode: "admin" | "school"
  schoolName?: string
  signer?: {
    name: string
    role: string
    nip: string
    date: string
    place: string
  }
  signers?: SignerRecord[]
  templates?: PaktaTemplate[]
  docUploads?: DocUploadsMap
  onChangeDocUploads?: (next: DocUploadsMap) => void
  canReview?: boolean
  reviewerName?: string
}) {
  const schoolList = useAffectedSchoolList()
  const [selectedSchool, setSelectedSchool] = useState(schoolName ?? "")
  const [drafts, setDrafts] = usePersistedState<Record<string, PaktaDraft>>(
    "paktaDrafts",
    {},
  )
  const [view, setView] = useState<"list" | "edit" | "preview">("list")
  const [editor, setEditor] = useState<PaktaDraft | null>(null)
  const [savedMessage, setSavedMessage] = useState("")
  const schoolUploads = schoolDocUploads(docUploads, selectedSchool)
  const changePaktaUpload = (next: SignedUploadFile | null) => {
    onChangeDocUploads?.(
      patchSchoolUploads(docUploads, selectedSchool, (current) => ({
        ...current,
        pakta: next,
      })),
    )
  }
  const school = schoolList.find((item) => item.name === selectedSchool)
  const pks = pksSchools.find((item) => item.name === selectedSchool)
  const schoolSigner = schoolSignerView(signers, selectedSchool, {
    name: signer?.name ?? pks?.principal ?? "",
    nip: signer?.nip,
    role: signer?.role,
    place: signer?.place ?? school?.regency ?? "",
    date: signer?.date,
  })
  const fallbackTemplate = defaultPaktaTemplate(templates)

  const templateDraft = (): PaktaDraft => ({
    name: schoolSigner.name,
    role: schoolSigner.role,
    nip: schoolSigner.nip,
    templateId: fallbackTemplate.id,
    place: schoolSigner.place,
    dateLabel: schoolSigner.dateLabel,
    updatedAt: "",
  })

  const openCreateDraft = () => {
    setEditor(templateDraft())
    setView("edit")
    setSavedMessage("")
  }

  const openEditDraft = () => {
    const draft = drafts[selectedSchool]
    setEditor(draft ? { ...draft } : templateDraft())
    setView("edit")
    setSavedMessage("")
  }

  const saveDraft = () => {
    if (!editor) return
    const next: PaktaDraft = {
      ...editor,
      name: editor.name.trim(),
      role: editor.role.trim() || "Kepala Sekolah",
      nip: editor.nip.trim(),
      templateId: resolvePaktaTemplate(templates, editor.templateId).id,
      place: editor.place.trim(),
      dateLabel: editor.dateLabel.trim() || schoolSigner.dateLabel,
      updatedAt: new Date().toLocaleString("id-ID"),
    }
    setDrafts((current) => ({ ...current, [selectedSchool]: next }))
    setSavedMessage("Draf pakta integritas berhasil disimpan.")
    window.setTimeout(() => setSavedMessage(""), 2500)
    setView("list")
  }

  const draft = drafts[selectedSchool]
  const selectedTemplate = resolvePaktaTemplate(
    templates,
    (view === "edit" && editor ? editor.templateId : draft?.templateId) ??
      fallbackTemplate.id,
  )

  if (view === "preview") {
    const data = {
      ...(draft ?? templateDraft()),
      name: schoolSigner.name,
      role: schoolSigner.role,
      nip: schoolSigner.nip,
      place: schoolSigner.place,
      dateLabel: schoolSigner.dateLabel,
      statement: resolvePaktaTemplate(templates, draft?.templateId).statement,
    }
    return (
      <div className="space-y-4">
        <div className="no-print flex flex-col gap-3 rounded-2xl border border-border bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-base font-bold text-ink">
              Preview: Pakta Integritas
            </div>
            <div className="mt-1 text-xs text-muted">
              Periksa data sebelum mencetak dan menandatangani.
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              className="gap-2 border border-border px-4 py-2.5 text-xs font-bold text-ink hover:bg-surface"
              onClick={() => window.print()}
            >
              Cetak
            </Button>
            <Button
              className="gap-2 border border-border px-4 py-2.5 text-xs font-bold text-ink hover:bg-surface"
              onClick={() =>
                downloadPortalPdf(`Pakta Integritas ${selectedSchool}`, [
                  selectedSchool,
                  `Nama: ${data.name}`,
                  `Jabatan: ${data.role}`,
                  `NIP: ${data.nip}`,
                  data.statement,
                ])
              }
            >
              Download PDF
            </Button>
            <Button
              className="gap-2 bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-dark"
              onClick={() => setView("list")}
            >
              Kembali
            </Button>
          </div>
        </div>
        <div className="no-print">
            <SignedDocumentUpload
              canReview={canReview}
              documentLabel="Pakta Integritas"
              file={schoolUploads.pakta}
              hasDraft
              onChange={changePaktaUpload}
              reviewerName={reviewerName}
              trackApproval
            />
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <PaktaDocument
            komite={findSigner(signers, "ketua-komite", selectedSchool)}
            pelaksana={findSigner(signers, "ketua-pelaksana", selectedSchool)}
            schoolName={selectedSchool}
            {...data}
          />
        </div>
      </div>
    )
  }

  if (view === "edit" && editor) {
    const isNew = !draft
    return (
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="text-2xl font-extrabold text-ink">
              {isNew ? "Buat draf pakta integritas" : "Edit draf pakta integritas"}
            </div>
            <div className="mt-1 text-sm text-muted">
              {selectedSchool}. Data penandatangan terisi otomatis. Pernyataan
              mengikuti template pakta.
            </div>
          </div>
          <Button
            className="border border-border px-4 py-2.5 text-xs font-bold text-ink hover:bg-surface"
            onClick={() => setView("list")}
          >
            Kembali
          </Button>
        </div>
        <div className="card p-5 md:p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-ink">Nama</span>
              <input
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted outline-none"
                readOnly
                value={schoolSigner.name}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-ink">
                Jabatan
              </span>
              <input
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted outline-none"
                readOnly
                value={schoolSigner.role}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-ink">NIP</span>
              <input
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted outline-none"
                readOnly
                value={schoolSigner.nip}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-ink">
                Tempat
              </span>
              <input
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted outline-none"
                readOnly
                value={schoolSigner.place}
              />
            </label>
            <label className="block md:col-span-2">
              <span className="mb-2 block text-xs font-bold text-ink">
                Tanggal
              </span>
              <input
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted outline-none"
                readOnly
                value={schoolSigner.dateLabel}
              />
            </label>
            {templates.length > 1 && mode === "admin" && (
              <label className="block md:col-span-2">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Template pernyataan
                </span>
                <select
                  aria-label="Pilih template pernyataan pakta"
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-primary"
                  onChange={(event) =>
                    setEditor({
                      ...editor,
                      templateId: Number(event.target.value),
                    })
                  }
                  value={editor.templateId}
                >
                  {templates.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.id === fallbackTemplate.id
                        ? `${item.title} (default)`
                        : item.title}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <div className="md:col-span-2">
              <span className="mb-2 block text-xs font-bold text-ink">
                Pernyataan
              </span>
              <div className="whitespace-pre-wrap rounded-xl border border-border bg-surface px-4 py-3 text-sm leading-6 text-ink">
                {selectedTemplate.statement}
              </div>
              <div className="mt-2 text-xs text-muted">
                Menginduk ke template #{selectedTemplate.id} ·{" "}
                {selectedTemplate.title}. Perubahan pernyataan cukup di template.
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col justify-end gap-3 border-t border-border pt-4 sm:flex-row">
            <Button
              className="border border-border px-5 py-2.5 text-xs font-bold text-ink hover:bg-white"
              onClick={() => setView("list")}
            >
              Batal
            </Button>
            <Button
              className="bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-dark"
              onClick={saveDraft}
            >
              Simpan draf
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="text-2xl font-extrabold text-ink">
            Pakta Integritas
          </div>
          <div className="mt-1 text-sm text-muted">
            Buat draf pakta integritas sekolah. Isi pernyataan mengikuti
            template, lalu simpan sebelum preview dan cetak.
          </div>
        </div>
        {mode === "admin" && (
          <div className="block sm:w-96">
            <span className="mb-2 block text-xs font-bold text-ink">
              Sekolah
            </span>
            <SchoolSearchPicker
              ariaLabel="Cari sekolah untuk pakta integritas"
              onChange={(name) => {
                setSelectedSchool(name)
                setView("list")
                setSavedMessage("")
              }}
              source="affected"
              value={selectedSchool}
            />
          </div>
        )}
      </div>
      {savedMessage && (
        <div className="rounded-2xl bg-green-soft px-4 py-3 text-sm font-semibold text-success">
          {savedMessage}
        </div>
      )}
      {!selectedSchool ? (
        <PickSchoolPrompt label="pakta integritas" />
      ) : isSchoolkitBarangOnly(school) ? (
        <div className="card px-6 py-16 text-center text-sm text-muted">
          Sekolah ini hanya menerima Schoolkit barang, sehingga pakta integritas
          tidak diperlukan.
        </div>
      ) : (
      <div className="card flex max-w-xl flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted">
            Dokumen sekolah
          </div>
          <DocFlowStatusPill
            file={schoolUploads.pakta}
            hasDraft={Boolean(draft)}
          />
        </div>
        <div className="mt-2 text-lg font-extrabold text-ink">
          Pakta Integritas
        </div>
        <div className="mt-1 text-xs text-muted">{selectedSchool}</div>
        <div className="mt-2 text-[0.7rem] text-muted">
          Pernyataan dari template #
          {resolvePaktaTemplate(templates, draft?.templateId).id}
        </div>
        {draft && (
          <div className="mt-2 text-[0.7rem] text-muted">
            Disimpan {draft.updatedAt}
          </div>
        )}
        <div className="mt-5 flex flex-col gap-2">
          {draft ? (
            <>
              <Button
                className="w-full bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-dark"
                onClick={openEditDraft}
              >
                Edit pakta
              </Button>
              <Button
                className="w-full border border-border px-4 py-2.5 text-xs font-bold text-ink hover:bg-surface"
                onClick={() => setView("preview")}
              >
                Preview pakta
              </Button>
            </>
          ) : (
            <Button
              className="w-full bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-dark"
              onClick={openCreateDraft}
            >
              Buat draf pakta
            </Button>
          )}
        </div>
        <SignedDocumentUpload
          canReview={canReview}
          documentLabel="Pakta Integritas"
          enabled={Boolean(draft)}
          file={schoolUploads.pakta}
          hasDraft={Boolean(draft)}
          onChange={changePaktaUpload}
          reviewerName={reviewerName}
          trackApproval
        />
      </div>
      )}
    </div>
  )
}

function StatementTemplatePage({
  heading,
  description,
  noun,
  defaultStatement,
  templates,
  onChange,
}: {
  heading: string
  description: string
  noun: string
  defaultStatement: string
  templates: PaktaTemplate[]
  onChange: (templates: PaktaTemplate[]) => void
}) {
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState<PaktaTemplate>({
    id: 0,
    title: "",
    statement: defaultStatement,
  })
  const defaultTemplate = defaultPaktaTemplate(templates)

  const openAdd = () => {
    setEditingId(null)
    setDraft({
      id: 0,
      title: "",
      statement: defaultStatement,
    })
    setFormOpen(true)
  }

  const openEdit = (item: PaktaTemplate) => {
    setEditingId(item.id)
    setDraft({ ...item })
    setFormOpen(true)
  }

  const saveItem = () => {
    if (!draft.title.trim() || !draft.statement.trim()) return
    const payload = {
      title: draft.title.trim(),
      statement: draft.statement.trim(),
    }
    if (editingId) {
      onChange(
        templates.map((item) =>
          item.id === editingId ? { ...item, ...payload } : item,
        ),
      )
    } else {
      const id = Math.max(0, ...templates.map((item) => item.id)) + 1
      onChange([...templates, { id, ...payload }])
    }
    setFormOpen(false)
  }

  const deleteItem = (item: PaktaTemplate) => {
    if (templates.length === 1) {
      window.alert(`Minimal satu template ${noun} harus tersedia.`)
      return
    }
    if (
      window.confirm(
        `Hapus ${item.title}? Dokumen ${noun} yang memakai template ini akan kembali ke template default.`,
      )
    ) {
      onChange(templates.filter((row) => row.id !== item.id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-2xl font-extrabold text-ink">{heading}</div>
          <div className="mt-1 text-sm text-muted">{description}</div>
        </div>
        <Button
          className="gap-2 bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-dark"
          onClick={openAdd}
        >
          <span className="text-lg leading-none">+</span> Tambah Template
        </Button>
      </div>
      <div className="space-y-4">
        {templates
          .slice()
          .sort((a, b) => a.id - b.id)
          .map((item) => (
            <div className="card p-5" key={item.id}>
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-sm font-bold text-ink">
                      #{item.id} · {item.title}
                    </div>
                    {item.id === defaultTemplate.id && (
                      <StatusPill tone="green">Default</StatusPill>
                    )}
                  </div>
                  <div className="mt-3 whitespace-pre-wrap text-sm leading-6 text-muted">
                    {item.statement}
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button
                    className="px-3 py-2 text-xs font-bold text-primary hover:bg-blue-soft"
                    onClick={() => openEdit(item)}
                  >
                    Edit
                  </Button>
                  <Button
                    className="px-3 py-2 text-xs font-bold text-danger hover:bg-red-soft"
                    onClick={() => deleteItem(item)}
                  >
                    Hapus
                  </Button>
                </div>
              </div>
            </div>
          ))}
      </div>
      {formOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <div className="text-base font-bold text-ink">
                  {editingId
                    ? `Edit template ${noun}`
                    : `Tambah template ${noun}`}
                </div>
                <div className="mt-1 text-xs text-muted">
                  Tulis seluruh poin di satu kolom. Perubahan langsung dipakai
                  semua dokumen yang menginduk ke template ini.
                </div>
              </div>
              <Button
                aria-label="Tutup formulir template"
                className="p-2 text-muted hover:bg-surface"
                onClick={() => setFormOpen(false)}
              >
                <Icon name="close" />
              </Button>
            </div>
            <div className="space-y-4 p-6">
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Nama template
                </span>
                <input
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
                  onChange={(event) =>
                    setDraft({ ...draft, title: event.target.value })
                  }
                  value={draft.title}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Pernyataan
                </span>
                <textarea
                  className="h-56 w-full rounded-xl border border-border px-4 py-3 text-sm leading-6 outline-none focus:border-primary"
                  onChange={(event) =>
                    setDraft({ ...draft, statement: event.target.value })
                  }
                  placeholder={"1. Poin pertama\n2. Poin kedua"}
                  value={draft.statement}
                />
              </label>
            </div>
            <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
              <Button
                className="border border-border px-5 py-2.5 text-xs font-bold text-ink hover:bg-surface"
                onClick={() => setFormOpen(false)}
              >
                Batal
              </Button>
              <Button
                className="bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-dark"
                onClick={saveItem}
              >
                Simpan template
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

type SptjmDraft = {
  name: string
  nip: string
  role: string
  address: string
  place: string
  dateLabel: string
  year: string
  updatedAt: string
}

const defaultSptjmStatement = `1. Memiliki surat keputusan pengangkatan sebagai kepala satuan pendidikan dan pejabat yang berwenang.
2. Sanggup memulai pekerjaan Program Bantuan Penanganan Satuan Pendidikan Terdampak Bencana Tahun Anggaran {tahun} selambat-lambatnya 14 (empat belas) hari kalender sejak dana masuk ke rekening sekolah.
3. Sanggup untuk melaksanakan dan menyelesaikan pekerjaan Program Bantuan Penanganan Satuan Pendidikan Terdampak Bencana Tahun Anggaran {tahun} sesuai Perjanjian Kerja Sama (PKS).
4. Sanggup memberikan laporan pertanggungjawaban akhir pelaksanaan pekerjaan Program Bantuan Penanganan Satuan Pendidikan Terdampak Bencana Tahun Anggaran {tahun} selambat-lambatnya 14 (empat belas) hari kerja setelah jangka waktu pelaksanaan pekerjaan selesai.
5. Bersedia bertanggung jawab penuh atas semua penggunaan dan pemanfaatan seluruh dana yang digunakan dalam rangka pelaksanaan Bantuan Pemerintah Program Bantuan Penanganan Satuan Pendidikan Terdampak Bencana Tahun Anggaran {tahun} serta Perjanjian Kerja Sama (PKS) mengacu Panduan Pelaksanaan dan Laporan Bantuan Pemerintah.`

const initialSptjmTemplates: PaktaTemplate[] = [
  {
    id: 1,
    title: "SPTJM Bantuan SPAB",
    statement: defaultSptjmStatement,
  },
]

function applySptjmYear(statement: string, year: string) {
  return statement.replaceAll("{tahun}", year)
}

function resolveSptjmStatement(templates: PaktaTemplate[], year: string) {
  return applySptjmYear(defaultPaktaTemplate(templates).statement, year)
}

function SptjmDocument({
  schoolName,
  district,
  regency,
  province,
  address,
  npsn,
  name,
  nip,
  role,
  place,
  dateLabel,
  year,
  statement,
  pelaksana,
  komite,
}: {
  schoolName: string
  district: string
  regency: string
  province: string
  address: string
  npsn: string
  name: string
  nip: string
  role: string
  place: string
  dateLabel: string
  year: string
  statement: string
  pelaksana?: SignerRecord | null
  komite?: SignerRecord | null
}) {
  return (
    <div className="rab-print-sheet overflow-x-auto bg-white p-8 text-black md:p-12">
      <div className="mb-6 flex items-start gap-4 border-b-2 border-black pb-4">
        <div className="grid size-16 shrink-0 place-items-center rounded-full border-2 border-black text-[0.65rem] font-bold">
          LOGO
        </div>
        <div className="flex-1 text-center">
          <div className="text-base font-extrabold uppercase tracking-wide">
            {schoolName}
          </div>
          <div className="mt-1 text-[0.7rem] uppercase">
            {district} {regency} {province}
          </div>
          <div className="mt-1 text-[0.7rem]">{address}</div>
          <div className="text-[0.7rem]">NPSN : {npsn}</div>
        </div>
        <div className="w-16 shrink-0" />
      </div>
      <div className="mb-8 text-center text-sm font-extrabold uppercase underline">
        Surat Pernyataan Tanggung Jawab Mutlak
      </div>
      <div className="mx-auto max-w-4xl space-y-4 text-sm leading-7">
        <div>Yang bertanda tangan di bawah ini, saya :</div>
        <div className="grid grid-cols-[7rem_1rem_1fr] gap-y-1">
          <span>Nama</span>
          <span>:</span>
          <b>{name}</b>
          <span>NIP</span>
          <span>:</span>
          <b>{nip}</b>
          <span>Jabatan</span>
          <span>:</span>
          <b>{role}</b>
          <span>Alamat</span>
          <span>:</span>
          <b>{address}</b>
        </div>
        <div>
          bertindak atas nama jabatan, dengan ini menyatakan bahwa:
        </div>
        <div className="whitespace-pre-wrap">{statement}</div>
        <div>
          Apabila pernyataan ini tidak benar dan atau di kemudian hari saya
          melakukan tidak memenuhi pernyataan tersebut atau lalai, maka saya
          bersedia mempertanggungjawabkannya sesuai dengan ketentuan
          perundang-undangan.
        </div>
        <div className="ml-auto mt-8 w-72">
          <div>Dibuat di : {place}</div>
          <div>Tanggal : {dateLabel}</div>
          <div>
            Kepala Sekolah <span className="font-bold uppercase">{schoolName}</span>
          </div>
          <div className="h-20" />
          <div className="font-bold underline">{name}</div>
          <div>NIP. {nip}</div>
        </div>
      </div>
      <SchoolCommitteeSignatures komite={komite} pelaksana={pelaksana} />
      <div className="mt-12 text-center text-[0.65rem] leading-5 text-neutral-600">
        Dokumen ini adalah formulir Surat Pernyataan Tanggung Jawab Mutlak
        (SPTJM) tahun {year}.
        <br />
        Silakan cetak, tanda tangani cap basah, lalu unggah kembali di menu
        SPTJM.
      </div>
    </div>
  )
}

function SptjmPage({
  mode,
  schoolName,
  signer,
  signers = initialSigners,
  templates = initialSptjmTemplates,
  docUploads = {},
  onChangeDocUploads,
  canReview = false,
  reviewerName = "",
}: {
  mode: "admin" | "school"
  schoolName?: string
  signer?: {
    name: string
    role: string
    nip: string
    date: string
    place: string
  }
  signers?: SignerRecord[]
  templates?: PaktaTemplate[]
  docUploads?: DocUploadsMap
  onChangeDocUploads?: (next: DocUploadsMap) => void
  canReview?: boolean
  reviewerName?: string
}) {
  const schoolList = useAffectedSchoolList()
  const [selectedSchool, setSelectedSchool] = useState(schoolName ?? "")
  const [drafts, setDrafts] = usePersistedState<Record<string, SptjmDraft>>(
    "sptjmDrafts",
    {},
  )
  const [view, setView] = useState<"list" | "edit" | "preview">("list")
  const [editor, setEditor] = useState<SptjmDraft | null>(null)
  const [savedMessage, setSavedMessage] = useState("")
  const schoolUploads = schoolDocUploads(docUploads, selectedSchool)
  const changeSptjmUpload = (next: SignedUploadFile | null) => {
    onChangeDocUploads?.(
      patchSchoolUploads(docUploads, selectedSchool, (current) => ({
        ...current,
        sptjm: next,
      })),
    )
  }
  const school = schoolList.find((item) => item.name === selectedSchool)
  const pks = pksSchools.find((item) => item.name === selectedSchool)
  const yearDefault = "2026"
  const schoolSigner = schoolSignerView(signers, selectedSchool, {
    name: signer?.name ?? pks?.principal ?? "",
    nip: signer?.nip,
    role: signer?.role,
    place: signer?.place ?? school?.regency ?? "",
    date: signer?.date,
  })

  const templateDraft = (): SptjmDraft => ({
    name: schoolSigner.name,
    nip: schoolSigner.nip,
    role: schoolSigner.role,
    address: pks?.address ?? school?.location ?? "",
    place: schoolSigner.place,
    dateLabel: schoolSigner.dateLabel,
    year: yearDefault,
    updatedAt: "",
  })

  const openCreateDraft = () => {
    setEditor(templateDraft())
    setView("edit")
    setSavedMessage("")
  }

  const openEditDraft = () => {
    const draft = drafts[selectedSchool]
    setEditor(draft ? { ...draft } : templateDraft())
    setView("edit")
    setSavedMessage("")
  }

  const saveDraft = () => {
    if (!editor) return
    const next: SptjmDraft = {
      ...editor,
      name: editor.name.trim(),
      nip: editor.nip.trim(),
      role: editor.role.trim() || "Kepala Sekolah",
      address: editor.address.trim(),
      place: editor.place.trim(),
      dateLabel: editor.dateLabel.trim() || schoolSigner.dateLabel,
      year: editor.year.trim() || yearDefault,
      updatedAt: new Date().toLocaleString("id-ID"),
    }
    setDrafts((current) => ({ ...current, [selectedSchool]: next }))
    setSavedMessage("Draf SPTJM berhasil disimpan.")
    window.setTimeout(() => setSavedMessage(""), 2500)
    setView("list")
  }

  const draft = drafts[selectedSchool]
  const header = {
    schoolName: selectedSchool,
    district: schoolDistricts[selectedSchool] ?? "",
    regency: school?.regency ?? "",
    province: school?.province ?? "",
    npsn: pks?.npsn ?? "",
  }

  if (view === "preview") {
    const data = {
      ...(draft ?? templateDraft()),
      name: schoolSigner.name,
      nip: schoolSigner.nip,
      role: schoolSigner.role,
      place: schoolSigner.place,
      dateLabel: schoolSigner.dateLabel,
      statement: resolveSptjmStatement(
        templates,
        (draft ?? templateDraft()).year,
      ),
    }
    return (
      <div className="space-y-4">
        <div className="no-print flex flex-col gap-3 rounded-2xl border border-border bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-base font-bold text-ink">
              Preview: Surat Pernyataan Tanggung Jawab Mutlak (SPTJM)
            </div>
            <div className="mt-1 text-xs text-muted">
              Periksa data sebelum mencetak dan menandatangani.
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              className="gap-2 border border-border px-4 py-2.5 text-xs font-bold text-ink hover:bg-surface"
              onClick={() => window.print()}
            >
              Cetak
            </Button>
            <Button
              className="gap-2 border border-border px-4 py-2.5 text-xs font-bold text-ink hover:bg-surface"
              onClick={() =>
                downloadPortalPdf(`SPTJM ${selectedSchool}`, [
                  selectedSchool,
                  `Nama: ${data.name}`,
                  `NIP: ${data.nip}`,
                  `Jabatan: ${data.role}`,
                  "",
                  data.statement,
                ])
              }
            >
              Download PDF
            </Button>
            <Button
              className="gap-2 bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-dark"
              onClick={() => setView("list")}
            >
              Kembali
            </Button>
          </div>
        </div>
        <div className="no-print">
            <SignedDocumentUpload
              canReview={canReview}
              documentLabel="SPTJM"
              file={schoolUploads.sptjm}
              hasDraft
              onChange={changeSptjmUpload}
              reviewerName={reviewerName}
              trackApproval
            />
        </div>
        <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
          <SptjmDocument
            {...header}
            {...data}
            komite={findSigner(signers, "ketua-komite", selectedSchool)}
            pelaksana={findSigner(signers, "ketua-pelaksana", selectedSchool)}
          />
        </div>
      </div>
    )
  }

  if (view === "edit" && editor) {
    const isNew = !draft
    return (
      <div className="space-y-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="text-2xl font-extrabold text-ink">
              {isNew ? "Buat draf SPTJM" : "Edit draf SPTJM"}
            </div>
            <div className="mt-1 text-sm text-muted">
              {selectedSchool}. Data penandatangan terisi otomatis. Pernyataan
              mengikuti template SPTJM.
            </div>
          </div>
          <Button
            className="border border-border px-4 py-2.5 text-xs font-bold text-ink hover:bg-surface"
            onClick={() => setView("list")}
          >
            Kembali
          </Button>
        </div>
        <div className="card p-5 md:p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-ink">Nama</span>
              <input
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted outline-none"
                readOnly
                value={schoolSigner.name}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-ink">NIP</span>
              <input
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted outline-none"
                readOnly
                value={schoolSigner.nip}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-ink">
                Jabatan
              </span>
              <input
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted outline-none"
                readOnly
                value={schoolSigner.role}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-ink">
                Tahun
              </span>
              <input
                className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
                onChange={(event) =>
                  setEditor({ ...editor, year: event.target.value })
                }
                value={editor.year}
              />
            </label>
            <label className="block md:col-span-2">
              <span className="mb-2 block text-xs font-bold text-ink">
                Alamat
              </span>
              <input
                className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
                onChange={(event) =>
                  setEditor({ ...editor, address: event.target.value })
                }
                value={editor.address}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-ink">
                Dibuat di
              </span>
              <input
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted outline-none"
                readOnly
                value={schoolSigner.place}
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-ink">
                Tanggal
              </span>
              <input
                className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-muted outline-none"
                readOnly
                value={schoolSigner.dateLabel}
              />
            </label>
          </div>
          <div className="mt-5">
            <span className="mb-2 block text-xs font-bold text-ink">
              Pernyataan
            </span>
            <div className="whitespace-pre-wrap rounded-xl border border-border bg-surface px-4 py-3 text-sm leading-6 text-ink">
              {resolveSptjmStatement(templates, editor.year)}
            </div>
            <div className="mt-2 text-xs text-muted">
              Menginduk ke template #{defaultPaktaTemplate(templates).id}. Ubah
              poin pernyataan di Setting Template SPTJM.
            </div>
          </div>
          <div className="mt-6 flex flex-col justify-end gap-3 border-t border-border pt-4 sm:flex-row">
            <Button
              className="border border-border px-5 py-2.5 text-xs font-bold text-ink hover:bg-white"
              onClick={() => setView("list")}
            >
              Batal
            </Button>
            <Button
              className="bg-primary px-5 py-2.5 text-xs font-bold text-white hover:bg-primary-dark"
              onClick={saveDraft}
            >
              Simpan draf
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <div className="text-2xl font-extrabold text-ink">
            Surat Pernyataan Tanggung Jawab Mutlak
          </div>
          <div className="mt-1 text-sm text-muted">
            Buat draf SPTJM sekolah. Isi pernyataan mengikuti template, lalu
            simpan sebelum preview dan cetak.
          </div>
        </div>
        {mode === "admin" && (
          <div className="block sm:w-96">
            <span className="mb-2 block text-xs font-bold text-ink">
              Sekolah
            </span>
            <SchoolSearchPicker
              ariaLabel="Cari sekolah untuk SPTJM"
              onChange={(name) => {
                setSelectedSchool(name)
                setView("list")
                setSavedMessage("")
              }}
              source="affected"
              value={selectedSchool}
            />
          </div>
        )}
      </div>
      {savedMessage && (
        <div className="rounded-2xl bg-green-soft px-4 py-3 text-sm font-semibold text-success">
          {savedMessage}
        </div>
      )}
      {!selectedSchool ? (
        <PickSchoolPrompt label="SPTJM" />
      ) : isSchoolkitBarangOnly(school) ? (
        <div className="card px-6 py-16 text-center text-sm text-muted">
          Sekolah ini hanya menerima Schoolkit barang, sehingga SPTJM tidak
          diperlukan.
        </div>
      ) : (
      <div className="card flex max-w-xl flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted">
            Dokumen sekolah
          </div>
          <DocFlowStatusPill
            file={schoolUploads.sptjm}
            hasDraft={Boolean(draft)}
          />
        </div>
        <div className="mt-2 text-lg font-extrabold text-ink">SPTJM</div>
        <div className="mt-1 text-xs text-muted">{selectedSchool}</div>
        {draft && (
          <div className="mt-4 text-[0.7rem] text-muted">
            Disimpan {draft.updatedAt}
          </div>
        )}
        <div className="mt-5 flex flex-col gap-2">
          {draft ? (
            <>
              <Button
                className="w-full bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-dark"
                onClick={openEditDraft}
              >
                Edit SPTJM
              </Button>
              <Button
                className="w-full border border-border px-4 py-2.5 text-xs font-bold text-ink hover:bg-surface"
                onClick={() => setView("preview")}
              >
                Preview SPTJM
              </Button>
            </>
          ) : (
            <Button
              className="w-full bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-dark"
              onClick={openCreateDraft}
            >
              Buat draf SPTJM
            </Button>
          )}
        </div>
        <SignedDocumentUpload
          canReview={canReview}
          documentLabel="SPTJM"
          enabled={Boolean(draft)}
          file={schoolUploads.sptjm}
          hasDraft={Boolean(draft)}
          onChange={changeSptjmUpload}
          reviewerName={reviewerName}
          trackApproval
        />
      </div>
      )}
    </div>
  )
}

function assignedAidPackages(
  schoolName: string | undefined,
  availablePackages: Record<string, AidItem[]>,
  schoolList: Pick<SchoolRecord, "name" | "packages">[] = schools,
) {
  if (!schoolName) return {}
  const assigned =
    schoolList.find((item) => item.name === schoolName)?.packages ?? []
  return Object.fromEntries(
    assigned.map((name) => [
      name,
      (availablePackages[name] ?? []).map((item) => ({ ...item })),
    ]),
  )
}

function assignmentSchoolFromAffected(
  school: SchoolRecord,
  pksList: PksSchool[] = pksSchools,
  masters: typeof masterSchools = masterSchools,
) {
  const pks = pksList.find((item) => item.name === school.name)
  const master = masters.find((item) => item.name === school.name)
  return {
    name: school.name,
    npsn: pks?.npsn || master?.npsn || "",
    address:
      pks?.address ||
      [school.location, school.regency, school.province]
        .filter(Boolean)
        .join(", "),
  }
}

function AidAssignmentPage({
  packages,
  onManagePackages,
  initialSchoolNpsn = "",
  lockedSchoolNpsn,
}: {
  packages?: Record<string, AidItem[]> | null
  onManagePackages?: () => void
  initialSchoolNpsn?: string
  lockedSchoolNpsn?: string
}) {
  const availablePackages = packages ?? initialAidPackages
  const { data, loaded } = useDb()
  const [schoolData, setSchoolData] = usePersistedState<SchoolRecord[]>(
    "affectedSchools",
    schools,
  )
  const affectedSchools =
    (data.affectedSchools as SchoolRecord[] | undefined)?.length
      ? (data.affectedSchools as SchoolRecord[])
      : schoolData
  const [schoolNpsn, setSchoolNpsn] = useState(
    lockedSchoolNpsn || initialSchoolNpsn,
  )
  const schoolLocked = Boolean(lockedSchoolNpsn)
  const schoolOptions = affectedSchools
    .map((item) => assignmentSchoolFromAffected(item))
    .filter((item) => item.npsn)
  const visibleSchoolOptions = schoolLocked
    ? schoolOptions.filter((item) => item.npsn === lockedSchoolNpsn)
    : schoolOptions
  const school = visibleSchoolOptions.find((item) => item.npsn === schoolNpsn)
  const [selectedPackages, setSelectedPackages] = useState<
    Record<string, AidItem[]>
  >(() => {
    const npsn = lockedSchoolNpsn || initialSchoolNpsn
    if (!npsn) return {}
    const selectedSchool =
      schools
        .map((item) => assignmentSchoolFromAffected(item))
        .find((item) => item.npsn === npsn) ??
      pksSchools.find((item) => item.npsn === npsn)
    return assignedAidPackages(selectedSchool?.name, availablePackages)
  })
  const [detailPackage, setDetailPackage] = useState<string | null>(null)
  const [schoolkitKategori, setSchoolkitKategori] = useState<
    "" | SchoolkitKategori
  >("")
  const [saved, setSaved] = useState(false)
  const [saveMode, setSaveMode] = useState<"add" | "edit" | null>(null)
  const existingPackages =
    affectedSchools.find((item) => item.name === school?.name)?.packages ?? []
  const isEdit = existingPackages.length > 0
  const selectedPackageNames = Object.keys(selectedPackages)

  useEffect(() => {
    if (!loaded) return
    if (!schoolNpsn) {
      setSelectedPackages({})
      setSchoolkitKategori("")
      setDetailPackage(null)
      setSaved(false)
      setSaveMode(null)
      return
    }
    const selectedSchool =
      schoolOptions.find((item) => item.npsn === schoolNpsn) ??
      pksSchools.find((item) => item.npsn === schoolNpsn)
    setSelectedPackages(
      assignedAidPackages(
        selectedSchool?.name,
        availablePackages,
        affectedSchools,
      ),
    )
    const affected = affectedSchools.find(
      (item) => item.name === selectedSchool?.name,
    )
    setSchoolkitKategori(
      affected?.packages?.includes("Schoolkit")
        ? (affected.schoolkitKategori ?? "")
        : "",
    )
    setDetailPackage(null)
    setSaved(false)
    setSaveMode(null)
  }, [loaded, schoolNpsn])

  const saveAssignment = () => {
    if (!school || schoolLocked) return
    const names = Object.keys(selectedPackages) as AidMenuName[]
    if (names.includes("Schoolkit") && !schoolkitKategori) return
    const kategori: SchoolkitKategori | undefined = names.includes("Schoolkit")
      ? schoolkitKategori === "barang"
        ? "barang"
        : "uang"
      : undefined
    setSchoolData((current) => {
      const next = current.map((item) =>
        item.name === school.name
          ? ({
              ...item,
              packages: names,
              menuCount: names.length,
              schoolkitKategori: kategori,
            } as SchoolRecord)
          : item,
      )
      syncAffectedSchools(next)
      return next
    })
    setSaveMode(isEdit ? "edit" : "add")
    setSaved(true)
  }
  const detailItems = detailPackage
    ? (selectedPackages[detailPackage] ?? [])
    : []
  const total = Object.values(selectedPackages).reduce(
    (packageTotal, packageItems) =>
      packageTotal +
      packageItems.reduce((sum, item) => sum + item.volume * item.price, 0),
    0,
  )

  const togglePackage = (name: string) => {
    if (name === "Schoolkit" && selectedPackages.Schoolkit) {
      setSchoolkitKategori("")
    }
    setSelectedPackages((current) => {
      const next = { ...current }
      if (next[name]) {
        delete next[name]
      } else {
        next[name] = (availablePackages[name] ?? []).map((item) => ({
          ...item,
        }))
      }
      return next
    })
    setSaved(false)
  }

  const updateItem = (
    id: number,
    field: keyof Omit<AidItem, "id">,
    value: string,
  ) => {
    if (!detailPackage) return
    setSelectedPackages((current) => ({
      ...current,
      [detailPackage]: (current[detailPackage] ?? []).map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "volume" || field === "price" ? Number(value) : value,
            }
          : item,
      ),
    }))
  }

  const addItem = () => {
    if (!detailPackage) return
    setSelectedPackages((current) => {
      const currentItems = current[detailPackage] ?? []
      return {
        ...current,
        [detailPackage]: [
          ...currentItems,
          {
            id: Math.max(0, ...currentItems.map((item) => item.id)) + 1,
            name: "",
            specification: "",
            volume: 1,
            price: 0,
          },
        ],
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-extrabold text-ink">
          Penetapan Bantuan
        </div>
        <div className="mt-1 text-sm text-muted">
          {schoolLocked
            ? "Menu bantuan yang sudah ditetapkan untuk sekolah Anda."
            : "Tetapkan sekolah penerima, paket bantuan, dan nilai bantuan."}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["1", "Pilih Sekolah", school ? "Selesai" : "Tahap aktif"],
          [
            "2",
            "Pilih Paket",
            selectedPackageNames.length
              ? `${selectedPackageNames.length} paket dipilih`
              : "Belum dipilih",
          ],
          [
            "3",
            "Tetapkan Nilai",
            total ? formatRupiah(total) : "Belum dihitung",
          ],
        ].map(([number, label, status]) => (
          <div
            key={number}
            className={`card flex items-center gap-4 p-4 ${
              (number === "1" && !school) ||
              (number === "2" && school && !selectedPackageNames.length) ||
              (number === "3" && selectedPackageNames.length)
                ? "border-primary/30"
                : ""
            }`}
          >
            <div
              className={`grid size-10 shrink-0 place-items-center rounded-xl text-sm font-extrabold ${
                status === "Selesai" || status?.includes("paket dipilih")
                  ? "bg-green-soft text-success"
                  : "bg-blue-soft text-primary"
              }`}
            >
              {status === "Selesai" ? "✓" : number}
            </div>
            <div>
              <div className="text-xs font-bold text-ink">{label}</div>
              <div className="mt-1 text-[0.65rem] text-muted">{status}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_0.75fr]">
        <div className="card p-6">
          <div className="text-base font-bold text-ink">Data Penetapan</div>
          <div className="mt-1 text-xs text-muted">
            {schoolLocked
              ? "Paket menu diisi otomatis sesuai penetapan bantuan sekolah."
              : "Lengkapi sekolah dan paket bantuan yang akan ditetapkan."}
          </div>

          <label className="mt-6 block">
            <span className="mb-2 block text-xs font-bold text-ink">
              Sekolah Penerima
            </span>
            <select
              aria-label="Sekolah penerima bantuan"
              className="w-full rounded-xl border border-border bg-white px-4 py-3.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-surface disabled:text-muted"
              disabled={schoolLocked}
              value={schoolNpsn}
              onChange={(event) => {
                setSchoolNpsn(event.target.value)
              }}
            >
              <option value="">Pilih sekolah terdampak...</option>
              {visibleSchoolOptions.map((item) => (
                <option key={item.npsn} value={item.npsn}>
                  {item.name} — NPSN {item.npsn}
                </option>
              ))}
            </select>
          </label>

          {school && (
            <div className="mt-3 flex items-start gap-3 rounded-2xl bg-blue-soft p-4">
              <Icon
                name="building"
                className="mt-0.5 size-5 shrink-0 text-primary"
              />
              <div>
                <div className="text-xs font-bold text-ink">{school.name}</div>
                <div className="mt-1 text-xs leading-relaxed text-muted">
                  {school.address}
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="text-xs font-bold text-ink">
                Paket Menu Bantuan
              </div>
              {!schoolLocked && (
                <Button
                  className="gap-1.5 text-xs font-bold text-primary hover:text-primary-dark"
                  onClick={onManagePackages ?? (() => undefined)}
                >
                  <Icon name="settings" className="size-4" />
                  Tambah / Edit Menu
                </Button>
              )}
            </div>
            <div className="space-y-3">
              {Object.keys(availablePackages).map((name) => (
                <div
                  key={name}
                  className={`rounded-2xl border p-4 transition-colors ${
                    selectedPackages[name]
                      ? "border-primary bg-blue-soft/40"
                      : "border-border bg-white"
                  } ${!school || (schoolLocked && !selectedPackages[name]) ? "pointer-events-none opacity-45" : ""}`}
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <Button
                      className="flex-1 justify-start gap-3 text-left"
                      onClick={() => {
                        if (schoolLocked) return
                        togglePackage(name)
                      }}
                      disabled={!school || schoolLocked}
                    >
                      <span
                        className={`grid size-5 shrink-0 place-items-center rounded-md border ${
                          selectedPackages[name]
                            ? "border-primary bg-primary text-white"
                            : "border-muted-light"
                        }`}
                      >
                        {selectedPackages[name] && "✓"}
                      </span>
                      <span>
                        <span className="block text-xs font-bold text-ink">
                          {name}
                        </span>
                        <span className="mt-1 block text-[0.65rem] text-muted">
                          {availablePackages[name]?.length ?? 0} barang standar
                        </span>
                      </span>
                    </Button>
                    {selectedPackages[name] && (
                      <Button
                        className="gap-2 border border-primary px-3 py-2 text-xs font-bold text-primary hover:bg-white"
                        onClick={() => setDetailPackage(name)}
                      >
                        <Icon name="eye" className="size-4" /> Detail Paket
                      </Button>
                    )}
                  </div>
                  {name === "Schoolkit" && selectedPackages.Schoolkit && (
                    <label className="mt-4 block border-t border-primary/15 pt-4">
                      <span className="mb-2 block text-xs font-bold text-ink">
                        Kategori Schoolkit
                      </span>
                      <select
                        aria-label="Kategori Schoolkit"
                        className="w-full rounded-xl border border-border bg-white px-4 py-3.5 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 disabled:bg-surface disabled:text-muted"
                        disabled={schoolLocked}
                        onChange={(event) => {
                          setSchoolkitKategori(
                            event.target.value as "" | SchoolkitKategori,
                          )
                          setSaved(false)
                        }}
                        value={schoolkitKategori}
                      >
                        <option value="">Pilih kategori...</option>
                        <option value="uang">Uang</option>
                        <option value="barang">Barang</option>
                      </select>
                    </label>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card p-6">
            <div className="text-base font-bold text-ink">
              Ringkasan Penetapan
            </div>
            <div className="mt-5 space-y-4">
              <div className="flex justify-between gap-4 border-b border-border pb-4 text-xs">
                <span className="text-muted">Sekolah</span>
                <span className="text-right font-bold text-ink">
                  {school?.name || "Belum dipilih"}
                </span>
              </div>
              <div className="flex justify-between gap-4 border-b border-border pb-4 text-xs">
                <span className="text-muted">Paket dipilih</span>
                <span className="text-right font-bold text-ink">
                  {selectedPackageNames.length
                    ? `${selectedPackageNames.length} paket`
                    : "Belum dipilih"}
                </span>
              </div>
              {selectedPackageNames.length > 0 && (
                <div className="space-y-2 rounded-xl bg-surface p-3">
                  {selectedPackageNames.map((name) => (
                    <div
                      key={name}
                      className="flex items-center gap-2 text-xs text-ink"
                    >
                      <span className="size-1.5 rounded-full bg-primary" />
                      <span className="font-semibold">{name}</span>
                      {name === "Schoolkit" && schoolkitKategori && (
                        <span className="ml-auto font-bold text-primary">
                          {schoolkitKategori === "barang" ? "Barang" : "Uang"}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <div className="flex justify-between gap-4 border-b border-border pb-4 text-xs">
                <span className="text-muted">Jumlah barang</span>
                <span className="font-bold text-ink">
                  {Object.values(selectedPackages).reduce(
                    (packageTotal, packageItems) =>
                      packageTotal +
                      packageItems.reduce((sum, item) => sum + item.volume, 0),
                    0,
                  )}{" "}
                  unit
                </span>
              </div>
              <div className="rounded-2xl bg-sidebar p-5 text-white">
                <div className="text-xs text-white/60">Nilai Bantuan</div>
                <div className="mt-2 text-2xl font-extrabold">
                  {formatRupiah(total)}
                </div>
                <div className="mt-1 text-[0.65rem] text-white/45">
                  Dihitung otomatis dari detail paket
                </div>
              </div>
            </div>
            {!schoolLocked && (
              <Button
                className="mt-5 w-full bg-primary py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
                disabled={
                  !school ||
                  !selectedPackageNames.length ||
                  (Boolean(selectedPackages.Schoolkit) && !schoolkitKategori)
                }
                onClick={saveAssignment}
              >
                {isEdit ? "Simpan Perubahan" : "Simpan Penetapan"}
              </Button>
            )}
            {saved && (
              <div className="mt-3 rounded-xl bg-green-soft px-4 py-3 text-center text-xs font-bold text-success">
                {saveMode === "edit"
                  ? "Penetapan bantuan berhasil diperbarui."
                  : "Penetapan bantuan berhasil ditambahkan."}
              </div>
            )}
          </div>
        </div>
      </div>

      {detailPackage && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <div className="text-base font-bold text-ink">
                  Detail {detailPackage}
                </div>
                <div className="mt-1 text-xs text-muted">
                  Isi nama barang, spesifikasi, volume, dan harga satuan.
                </div>
              </div>
              <Button
                aria-label="Tutup detail paket"
                className="p-2 text-muted hover:bg-surface"
                onClick={() => setDetailPackage(null)}
              >
                <Icon name="close" />
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto p-6">
              <div className="min-w-[52rem] space-y-3">
                <div className="grid grid-cols-[2fr_2.5fr_0.7fr_1.2fr_1.2fr_2.5rem] gap-3 px-3 text-[0.65rem] font-bold uppercase tracking-wider text-muted">
                  <span>Nama Barang</span>
                  <span>Spesifikasi</span>
                  <span>Volume</span>
                  <span>Harga Satuan</span>
                  <span>Jumlah</span>
                  <span />
                </div>
                {detailItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[2fr_2.5fr_0.7fr_1.2fr_1.2fr_2.5rem] items-center gap-3 rounded-2xl border border-border p-3"
                  >
                    <input
                      className="rounded-xl border border-border px-3 py-2.5 text-xs text-ink outline-none focus:border-primary"
                      placeholder="Nama barang"
                      value={item.name}
                      onChange={(event) =>
                        updateItem(item.id, "name", event.target.value)
                      }
                    />
                    <input
                      className="rounded-xl border border-border px-3 py-2.5 text-xs text-ink outline-none focus:border-primary"
                      placeholder="Spesifikasi barang"
                      value={item.specification}
                      onChange={(event) =>
                        updateItem(item.id, "specification", event.target.value)
                      }
                    />
                    <input
                      min="1"
                      type="number"
                      className="rounded-xl border border-border px-3 py-2.5 text-xs text-ink outline-none focus:border-primary"
                      value={item.volume}
                      onChange={(event) =>
                        updateItem(item.id, "volume", event.target.value)
                      }
                    />
                    <input
                      min="0"
                      type="number"
                      className="rounded-xl border border-border px-3 py-2.5 text-xs text-ink outline-none focus:border-primary"
                      value={item.price}
                      onChange={(event) =>
                        updateItem(item.id, "price", event.target.value)
                      }
                    />
                    <div className="text-xs font-bold text-ink">
                      {formatRupiah(item.volume * item.price)}
                    </div>
                    <Button
                      aria-label={`Hapus ${item.name || "barang"}`}
                      className="p-2 text-danger hover:bg-red-soft"
                      onClick={() => {
                        if (!detailPackage) return
                        setSelectedPackages((current) => ({
                          ...current,
                          [detailPackage]: (
                            current[detailPackage] ?? []
                          ).filter((entry) => entry.id !== item.id),
                        }))
                      }}
                    >
                      <Icon name="close" className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                className="mt-4 gap-2 border border-dashed border-primary px-4 py-2.5 text-xs font-bold text-primary hover:bg-blue-soft"
                onClick={addItem}
              >
                <span className="text-base leading-none">+</span> Tambah Barang
              </Button>
            </div>
            <div className="flex flex-col gap-3 border-t border-border bg-surface px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-xs text-muted">Total nilai paket</div>
                <div className="text-lg font-extrabold text-ink">
                  {formatRupiah(
                    detailItems.reduce(
                      (sum, item) => sum + item.volume * item.price,
                      0,
                    ),
                  )}
                </div>
              </div>
              <Button
                className="bg-primary px-5 py-3 text-xs font-bold text-white hover:bg-primary-dark"
                onClick={() => setDetailPackage(null)}
              >
                Simpan Detail Paket
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MasterPackagePage({
  packages,
  onChange,
  onAssign,
}: {
  packages: Record<string, AidItem[]>
  onChange: (packages: Record<string, AidItem[]>) => void
  onAssign: () => void
}) {
  const { data } = useDb()
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingName, setEditingName] = useState<string | null>(null)
  const [draftName, setDraftName] = useState("")
  const [draftItems, setDraftItems] = useState<AidItem[]>([])

  const openNew = () => {
    setEditingName(null)
    setDraftName("")
    setDraftItems([
      {
        id: 1,
        name: "",
        specification: "",
        volume: 1,
        price: 0,
      },
    ])
    setEditorOpen(true)
  }

  const openEdit = (name: string) => {
    setEditingName(name)
    setDraftName(name)
    setDraftItems(packages[name].map((item) => ({ ...item })))
    setEditorOpen(true)
  }

  const updateDraftItem = (
    id: number,
    field: keyof Omit<AidItem, "id">,
    value: string,
  ) => {
    setDraftItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]:
                field === "volume" || field === "price" ? Number(value) : value,
            }
          : item,
      ),
    )
  }

  const addDraftItem = () => {
    setDraftItems((current) => [
      ...current,
      {
        id: Math.max(0, ...current.map((item) => item.id)) + 1,
        name: "",
        specification: "",
        volume: 1,
        price: 0,
      },
    ])
  }

  const savePackage = () => {
    if (!draftName.trim() || !draftItems.length) return
    const next = { ...packages }
    if (editingName && editingName !== draftName.trim()) {
      delete next[editingName]
    }
    next[draftName.trim()] = draftItems
    onChange(next)
    setEditorOpen(false)
  }

  const deletePackage = (name: string) => {
    const affected =
      (data.affectedSchools as SchoolRecord[] | undefined) ?? schools
    if (affected.some((school) => (school.packages as string[]).includes(name))) {
      window.alert(
        "Menu masih ditetapkan ke sekolah terdampak. Ubah penetapan bantuan dulu.",
      )
      return
    }
    if (
      !window.confirm(
        `Hapus menu ${name}? Tindakan ini tidak dapat dibatalkan.`,
      )
    ) {
      return
    }
    const next = { ...packages }
    delete next[name]
    onChange(next)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-2xl font-extrabold text-ink">
            Master Menu Bantuan
          </div>
          <div className="mt-1 text-sm text-muted">
            Buat menu baru dan kelola rincian barang bantuan.
          </div>
        </div>
        <Button
          className="gap-2 bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-dark"
          onClick={openNew}
        >
          <span className="text-lg leading-none">+</span> Tambah Menu
        </Button>
      </div>

      <div className="card grid gap-0 overflow-hidden lg:grid-cols-3">
        {[
          ["1", "Master Menu", "Buat atau edit menu beserta barangnya"],
          ["2", "Penetapan Bantuan", "Pilih sekolah dan paket yang tersedia"],
          ["3", "Dokumen PKS", "Nilai bantuan masuk ke dokumen kerja sama"],
        ].map(([number, title, description], index) => (
          <div
            key={number}
            className={`flex gap-3 p-5 ${
              index < 2
                ? "border-b border-border lg:border-b-0 lg:border-r"
                : ""
            }`}
          >
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-blue-soft text-xs font-extrabold text-primary">
              {number}
            </div>
            <div>
              <div className="text-xs font-bold text-ink">{title}</div>
              <div className="mt-1 text-[0.65rem] leading-relaxed text-muted">
                {description}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Object.entries(packages).map(([name, items]) => {
          const packageValue = items.reduce(
            (sum, item) => sum + item.volume * item.price,
            0,
          )
          return (
            <div key={name} className="card flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="grid size-11 place-items-center rounded-2xl bg-blue-soft text-primary">
                  <Icon name="package" className="size-5" />
                </div>
                <StatusPill tone="green">Aktif</StatusPill>
              </div>
              <div className="mt-5 text-sm font-bold text-ink">{name}</div>
              <div className="mt-1 text-xs text-muted">
                {items.length} jenis barang ·{" "}
                {items.reduce((sum, item) => sum + item.volume, 0)} unit
              </div>
              <div className="mt-4 rounded-xl bg-surface p-3">
                <div className="text-[0.65rem] text-muted">
                  Estimasi nilai paket
                </div>
                <div className="mt-1 text-sm font-extrabold text-ink">
                  {formatRupiah(packageValue)}
                </div>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-2">
                <Button
                  className="gap-2 border border-border py-2.5 text-xs font-bold text-ink hover:bg-surface"
                  onClick={() => openEdit(name)}
                >
                  <Icon name="settings" className="size-4" /> Edit
                </Button>
                <Button
                  className="gap-2 border border-primary py-2.5 text-xs font-bold text-primary hover:bg-blue-soft"
                  onClick={onAssign}
                >
                  Tetapkan <Icon name="arrow" className="size-4" />
                </Button>
                <Button
                  className="col-span-2 gap-2 py-2.5 text-xs font-bold text-danger hover:bg-red-soft"
                  onClick={() => deletePackage(name)}
                >
                  Hapus
                </Button>
              </div>
            </div>
          )
        })}
      </div>

      {editorOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <div className="text-base font-bold text-ink">
                  {editingName ? "Edit Menu Bantuan" : "Tambah Menu Bantuan"}
                </div>
                <div className="mt-1 text-xs text-muted">
                  Contoh: Menu School Kit, Menu Sanitasi, atau menu khusus
                  lainnya.
                </div>
              </div>
              <Button
                aria-label="Tutup editor paket"
                className="p-2 text-muted hover:bg-surface"
                onClick={() => setEditorOpen(false)}
              >
                <Icon name="close" />
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto p-6">
              <label className="block max-w-xl">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Nama Menu
                </span>
                <input
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                  placeholder="Contoh: Menu School Kit"
                  value={draftName}
                  onChange={(event) => setDraftName(event.target.value)}
                />
              </label>
              <div className="mb-3 mt-6 text-xs font-bold text-ink">
                Rincian Barang
              </div>
              <div className="min-w-[52rem] space-y-3">
                <div className="grid grid-cols-[2fr_2.5fr_0.7fr_1.2fr_2.5rem] gap-3 px-3 text-[0.65rem] font-bold uppercase tracking-wider text-muted">
                  <span>Nama Barang</span>
                  <span>Spesifikasi</span>
                  <span>Volume</span>
                  <span>Harga Satuan</span>
                  <span />
                </div>
                {draftItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-[2fr_2.5fr_0.7fr_1.2fr_2.5rem] gap-3 rounded-2xl border border-border p-3"
                  >
                    <input
                      className="rounded-xl border border-border px-3 py-2.5 text-xs outline-none focus:border-primary"
                      placeholder="Nama barang"
                      value={item.name}
                      onChange={(event) =>
                        updateDraftItem(item.id, "name", event.target.value)
                      }
                    />
                    <input
                      className="rounded-xl border border-border px-3 py-2.5 text-xs outline-none focus:border-primary"
                      placeholder="Spesifikasi"
                      value={item.specification}
                      onChange={(event) =>
                        updateDraftItem(
                          item.id,
                          "specification",
                          event.target.value,
                        )
                      }
                    />
                    <input
                      min="1"
                      type="number"
                      className="rounded-xl border border-border px-3 py-2.5 text-xs outline-none focus:border-primary"
                      value={item.volume}
                      onChange={(event) =>
                        updateDraftItem(item.id, "volume", event.target.value)
                      }
                    />
                    <input
                      min="0"
                      type="number"
                      className="rounded-xl border border-border px-3 py-2.5 text-xs outline-none focus:border-primary"
                      value={item.price}
                      onChange={(event) =>
                        updateDraftItem(item.id, "price", event.target.value)
                      }
                    />
                    <Button
                      aria-label="Hapus barang"
                      className="p-2 text-danger hover:bg-red-soft"
                      onClick={() =>
                        setDraftItems((current) =>
                          current.filter((entry) => entry.id !== item.id),
                        )
                      }
                    >
                      <Icon name="close" className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                className="mt-4 gap-2 border border-dashed border-primary px-4 py-2.5 text-xs font-bold text-primary hover:bg-blue-soft"
                onClick={addDraftItem}
              >
                <span className="text-base leading-none">+</span> Tambah Barang
              </Button>
            </div>
            <div className="flex justify-end gap-3 border-t border-border bg-surface p-4">
              <Button
                className="border border-border px-5 py-3 text-xs font-bold text-ink hover:bg-white"
                onClick={() => setEditorOpen(false)}
              >
                Batal
              </Button>
              <Button
                className="bg-primary px-5 py-3 text-xs font-bold text-white hover:bg-primary-dark disabled:opacity-50"
                disabled={!draftName.trim() || !draftItems.length}
                onClick={savePackage}
              >
                Simpan Paket
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PksIdentityRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="grid grid-cols-[7.4rem_0.7rem_1fr] gap-x-1">
      <span>{label}</span>
      <span>:</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}

function PksPasal({
  number,
  title,
  children,
}: {
  number: string
  title: string
  children: ReactNode
}) {
  return (
    <div className="mt-3.5">
      <div className="text-center font-bold">Pasal {number}</div>
      <div className="mb-1 text-center font-bold">{title}</div>
      <p className="text-justify">{children}</p>
    </div>
  )
}

function PksDocument({
  school,
  ppk,
  principal,
  principalNip,
  date,
  showKop = true,
}: {
  school: PksSchool
  ppk: SignerRecord | null
  principal: string
  principalNip: string
  date: string
  showKop?: boolean
}) {
  const opened = pksOpeningDate(date)
  const jenis = pksJenisBantuan(school.name)
  const amountNumber = parseRupiahNumber(school.amount)
  const amountWords = terbilangRupiah(amountNumber)
  const skNumber = `SPAB/SK/${school.npsn}/2026`
  const ppkName = ppk?.name ?? "Budi Santoso, S.E., M.M."
  const ppkNip = ppk?.identity ?? "196808171993031001"
  const ppkAddress = "Jalan Jenderal Sudirman, Senayan, Jakarta 10270"

  return (
    <div className="rab-print-sheet bg-white p-6 text-black md:px-10 md:py-8">
      {showKop ? (
        <img
          alt="Logo Kementerian Pendidikan Dasar dan Menengah"
          className="mx-auto h-14 w-auto max-w-full object-contain sm:h-16"
          src="/logo-kemendikdasmen.png"
        />
      ) : null}
      <div className={`${showKop ? "mt-3" : ""} py-2 text-center`}>
        <div className="text-[0.95rem] font-extrabold tracking-wide">
          PERJANJIAN KERJASAMA
        </div>
        <div className="mt-1 text-[0.72rem] font-bold">
          NOMOR : {school.number}
        </div>
      </div>
      <div className="mt-3 space-y-0.5 text-center text-[0.68rem] font-bold uppercase leading-4">
        <div>Antara</div>
        <div>Pejabat Pembuat Komitmen</div>
        <div>Direktorat Sekolah Menengah Pertama</div>
        <div>
          Direktorat Jenderal Pendidikan Anak Usia Dini, Pendidikan Dasar, dan
          Pendidikan Non Formal dan Informal
        </div>
        <div>Kementerian Pendidikan Dasar dan Menengah</div>
        <div className="py-1 font-semibold normal-case">dengan</div>
        <div>Kepala {school.name}</div>
        <div className="py-1 font-semibold normal-case">tentang</div>
        <div>Pemberian Bantuan Sosial SPAB Satuan Pendidikan</div>
        <div>Sekolah Menengah Pertama Tahun Anggaran 2026</div>
      </div>

      <p className="mt-4 text-justify text-[0.7rem] leading-5">
        Pada hari ini, {opened.hari} tanggal {opened.tanggal} bulan{" "}
        {opened.bulan} tahun dua ribu dua puluh enam, kami yang bertanda tangan
        di bawah ini:
      </p>

      <div className="mt-3 text-[0.7rem] leading-5">
        <div className="font-bold">1.</div>
        <div className="mt-1 space-y-0.5 pl-4">
          <PksIdentityRow label="Nama" value={ppkName} />
          <PksIdentityRow label="NIP" value={ppkNip} />
          <PksIdentityRow
            label="Jabatan"
            value="Pejabat Pembuat Komitmen Direktorat SMP"
          />
          <PksIdentityRow label="Alamat" value={ppkAddress} />
        </div>
        <p className="mt-2 text-justify">
          Bertindak atas nama Direktorat Sekolah Menengah Pertama sebagai
          Pemberi Bantuan Sosial SPAB Tahun Anggaran 2026, selanjutnya disebut{" "}
          <strong>PIHAK KESATU</strong>.
        </p>
      </div>

      <div className="mt-3 text-[0.7rem] leading-5">
        <div className="font-bold">2.</div>
        <div className="mt-1 space-y-0.5 pl-4">
          <PksIdentityRow label="Nama" value={principal} />
          <PksIdentityRow label="NIP/NIK" value={principalNip} />
          <PksIdentityRow label="Jabatan" value="Kepala Satuan Pendidikan" />
          <PksIdentityRow label="NPSN" value={school.npsn} />
          <PksIdentityRow label="Alamat" value={school.address} />
        </div>
        <p className="mt-2 text-justify">
          Bertindak atas nama satuan pendidikan penerima Bantuan Sosial SPAB
          Tahun Anggaran 2026, berdasarkan Surat Keputusan Penetapan Penerima
          Bansos SPAB yang ditetapkan oleh PPK dan disahkan oleh KPA Nomor{" "}
          {skNumber} tanggal {opened.label}, selanjutnya disebut{" "}
          <strong>PIHAK KEDUA</strong>.
        </p>
      </div>

      <p className="mt-3 text-justify text-[0.7rem] leading-5">
        Dengan ini para pihak sepakat mengikatkan diri dalam Perjanjian Kerja
        Sama Penyaluran dan Penggunaan Dana Bantuan Sosial SPAB Tahun Anggaran
        2026 dengan ketentuan sebagai berikut:
      </p>

      <div className="text-[0.7rem] leading-5">
        <PksPasal number="1" title="Ruang Lingkup">
          Ruang lingkup Perjanjian Kerja Sama ini meliputi: (1) Penyaluran Dana
          Bantuan Sosial SPAB; dan (2) Penggunaan Dana Bantuan Sosial SPAB
          sesuai RAB yang telah disetujui.
        </PksPasal>
        <PksPasal number="2" title="Hak dan Kewajiban">
          PIHAK KESATU wajib menyalurkan dana bantuan sesuai RAB yang telah
          diverifikasi dan berhak melakukan monitoring, evaluasi, serta
          menerima laporan pertanggungjawaban dari PIHAK KEDUA. PIHAK KEDUA
          wajib menggunakan dana bantuan sesuai RAB dan Panduan Pelaksanaan,
          melaksanakan belanja, menyusun dan menyampaikan laporan
          pertanggungjawaban, serta berhak menerima dana bantuan sesuai nilai
          yang ditetapkan.
        </PksPasal>
        <PksPasal number="3" title="Nilai dan Jenis Bantuan">
          PIHAK KEDUA menerima dana Bantuan Sosial SPAB dari PIHAK KESATU
          sebesar {school.amount} ({amountWords}) untuk jenis bantuan: {jenis},
          sesuai Surat Keputusan Penetapan Penerima Bantuan Nomor {skNumber}.
          Rincian tercantum dalam RAB yang menjadi bagian tidak terpisahkan
          dari Perjanjian ini.
        </PksPasal>
        <PksPasal number="4" title="Jangka Waktu Penggunaan Dana">
          PIHAK KEDUA menggunakan dana bantuan sesuai RAB dan jangka waktu
          pelaksanaan yang ditetapkan dalam ketentuan pelaksanaan bantuan.
        </PksPasal>
        <PksPasal number="5" title="Penyaluran Dana">
          Dana disalurkan melalui pemindahbukuan ke rekening satuan pendidikan
          penerima, secara sekaligus atau bertahap, sesuai mekanisme
          penyaluran Bansos SPAB sebagaimana diatur dalam Peraturan Direktur
          Jenderal Nomor 4 Tahun 2026 dan ketentuan peraturan
          perundang-undangan.
        </PksPasal>
        <PksPasal number="6" title="Pengelolaan Sisa Dana">
          Dalam hal terdapat sisa dana bantuan, PIHAK KEDUA wajib menyetorkan
          sisa dana tersebut ke rekening Kas Negara dan dilarang membungakan
          atau memindahkan dana bantuan untuk kepentingan di luar peruntukan.
        </PksPasal>
        <PksPasal number="7" title="Sanksi">
          PIHAK KEDUA yang melanggar ketentuan Panduan Pelaksanaan dan
          Perjanjian Kerja Sama ini dikenakan sanksi berupa teguran tertulis,
          kewajiban pengembalian dana, dan/atau sanksi lain sesuai peraturan
          perundang-undangan.
        </PksPasal>
        <PksPasal number="8" title="Laporan Pertanggungjawaban">
          PIHAK KEDUA menyusun dan menyampaikan laporan pertanggungjawaban
          kepada PIHAK KESATU sesuai Panduan Pelaksanaan Bantuan Sosial SPAB
          Tahun Anggaran 2026.
        </PksPasal>
        <PksPasal number="9" title="Penyelesaian Perselisihan">
          Perselisihan antara para pihak diselesaikan secara musyawarah untuk
          mencapai mufakat.
        </PksPasal>
        <PksPasal number="10" title="Lain-Lain">
          Perubahan Perjanjian ini hanya dapat dilakukan atas kesepakatan
          kedua belah pihak dan dituangkan dalam adendum yang menjadi bagian
          tidak terpisahkan dari Perjanjian ini.
        </PksPasal>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-8 text-center text-[0.7rem] leading-5">
        <div>
          <div className="font-bold">PIHAK KESATU</div>
          <div className="h-20" />
          <div className="font-bold underline">{ppkName}</div>
          <div>NIP. {ppkNip}</div>
        </div>
        <div>
          <div>
            {schoolSignerPlace(school.name)}, {opened.label}
          </div>
          <div className="font-bold">PIHAK KEDUA</div>
          <div className="h-16" />
          <div className="font-bold underline">{principal}</div>
          <div>NIP. {principalNip}</div>
        </div>
      </div>
    </div>
  )
}

function PickSchoolPrompt({ label }: { label: string }) {
  return (
    <div className="card px-6 py-16 text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-3xl bg-blue-soft text-primary">
        <Icon name="search" className="size-6" />
      </div>
      <div className="mt-4 text-sm font-bold text-ink">
        Cari sekolah terlebih dahulu
      </div>
      <div className="mt-2 text-sm text-muted">
        Ketik nama sekolah atau NPSN di kolom pencarian untuk membuka {label}.
      </div>
    </div>
  )
}

function schoolSignerPlace(schoolName: string) {
  return (
    schools.find((item) => item.name === schoolName)?.regency ||
    pksSchools.find((item) => item.name === schoolName)?.address.split(",")[0] ||
    "........................"
  )
}

function PksPage({
  signers = initialSigners,
  mode = "admin",
  schoolName,
  docUploads = {},
  onChangeDocUploads,
  canReview = false,
  reviewerName = "",
}: {
  signers?: SignerRecord[]
  mode?: "admin" | "school"
  schoolName?: string
  docUploads?: DocUploadsMap
  onChangeDocUploads?: (next: DocUploadsMap) => void
  canReview?: boolean
  reviewerName?: string
}) {
  const schoolList = useAffectedSchoolList()
  const lockedSchool =
    mode === "school"
      ? (pksSchools.find((item) => item.name === schoolName) ?? pksSchools[0])
      : null
  const [role, setRole] = useState<"admin" | "school">(mode)
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<PksSchool | null>(lockedSchool)
  const [previewOpen, setPreviewOpen] = useState(false)
  const [useKop, setUseKop] = useState(true)
  const [drafts, setDrafts] = usePersistedState<
    Record<string, { useKop: boolean }>
  >("pksDrafts", {})
  const [savedMessage, setSavedMessage] = useState("")
  const school = lockedSchool ?? (role === "school" ? pksSchools[0] : selected)
  const schoolSigner = school
    ? schoolSignerView(signers, school.name, { name: school.principal })
    : null
  const ppkSigner = findSigner(signers, "ppk")
  const signer = schoolSigner?.name ?? school?.principal ?? ""
  const results = pksSchools.filter((item) =>
    `${item.name} ${item.npsn} ${item.address}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )
  const pksPrereq = school
    ? pksPrerequisiteItems(school.name, docUploads, schoolList)
    : { items: [], allReady: false }
  const schoolUploads = school
    ? schoolDocUploads(docUploads, school.name)
    : emptySchoolUploads()
  const hasPksDraft = Boolean(school && drafts[school.name])

  const chooseSchool = (item: PksSchool) => {
    setSelected(item)
    setQuery("")
    setUseKop(drafts[item.name]?.useKop ?? true)
    setSavedMessage("")
  }

  const saveDraft = () => {
    if (!school) return
    setDrafts((current) => ({
      ...current,
      [school.name]: { useKop },
    }))
    setSavedMessage("Draf PKS tersimpan.")
  }

  const pksPdfOptions = {
    principal: signer,
    principalNip: schoolSigner?.nip ?? "",
    ppkName: ppkSigner?.name ?? "Budi Santoso, S.E., M.M.",
    ppkNip: ppkSigner?.identity ?? "196808171993031001",
    date: schoolSigner?.date || "2026-05-20",
  }

  const openPreview = () => {
    if (!school) return
    setPreviewOpen(true)
  }

  const downloadPdf = () => {
    if (!school) return
    const url = URL.createObjectURL(createPksPdf(school, pksPdfOptions))
    const link = document.createElement("a")
    link.href = url
    link.download = `PKS-${school.npsn}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  }

  const changeRole = (nextRole: "admin" | "school") => {
    setRole(nextRole)
    setPreviewOpen(false)
    if (nextRole === "school") setSelected(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <div className="text-2xl font-extrabold text-ink">
            Perjanjian Kerja Sama
          </div>
          <div className="mt-1 text-sm text-muted">
            Buat, periksa, dan unduh dokumen PKS bantuan sekolah.
          </div>
        </div>
        {mode === "admin" && (
          <div className="flex rounded-xl border border-border bg-white p-1">
            <Button
              className={`px-4 py-2 text-xs font-bold ${
                role === "admin"
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-surface"
              }`}
              onClick={() => changeRole("admin")}
            >
              Tampilan Admin
            </Button>
            <Button
              className={`px-4 py-2 text-xs font-bold ${
                role === "school"
                  ? "bg-primary text-white"
                  : "text-muted hover:bg-surface"
              }`}
              onClick={() => changeRole("school")}
            >
              Tampilan Sekolah
            </Button>
          </div>
        )}
      </div>
      {role === "admin" && !selected && (
        <div className="card p-6 md:p-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-blue-soft text-primary">
              <Icon name="building" className="size-7" />
            </div>
            <div className="mt-5 text-lg font-bold text-ink">
              Cari sekolah penerima bantuan
            </div>
            <div className="mt-2 text-sm text-muted">
              Pilih sekolah untuk membuat format PKS secara otomatis.
            </div>
            <label className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5 text-muted focus-within:border-primary focus-within:bg-white">
              <Icon name="search" />
              <input
                className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted-light"
                placeholder="Cari nama sekolah, NPSN, atau wilayah..."
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>
          <div className="mx-auto mt-5 max-w-2xl divide-y divide-border overflow-hidden rounded-2xl border border-border">
            {results.map((item) => (
              <Button
                key={item.npsn}
                className="w-full justify-start gap-4 rounded-none bg-white px-4 py-4 text-left hover:bg-surface"
                onClick={() => chooseSchool(item)}
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-blue-soft text-primary">
                  <Icon name="building" className="size-5" />
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-ink">{item.name}</div>
                  <div className="mt-1 truncate text-xs text-muted">
                    NPSN {item.npsn} · {item.address}
                  </div>
                </div>
                <Icon
                  name="arrow"
                  className="ml-auto size-4 shrink-0 text-muted"
                />
              </Button>
            ))}
          </div>
        </div>
      )}

      {school && (
        <div className="grid gap-6 xl:grid-cols-[0.72fr_1.28fr]">
          <div className="space-y-5">
            <div className="card p-5">
              <div className="flex items-start gap-3">
                <div className="grid size-11 shrink-0 place-items-center rounded-2xl bg-blue-soft text-primary">
                  <Icon name="building" className="size-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-ink">
                    {school.name}
                  </div>
                  <div className="mt-1 text-xs text-muted">
                    NPSN {school.npsn}
                  </div>
                  <div className="mt-2 text-xs leading-relaxed text-muted">
                    {school.address}
                  </div>
                </div>
              </div>
              {role === "admin" && (
                <Button
                  className="mt-4 w-full border border-border py-2.5 text-xs font-bold text-ink hover:bg-surface"
                  onClick={() => setSelected(null)}
                >
                  Ganti Sekolah
                </Button>
              )}
            </div>

            <div className="card p-5">
              <div className="text-sm font-bold text-ink">
                Data Penandatangan
              </div>
              <div className="mt-1 text-xs leading-relaxed text-muted">
                Data terisi otomatis dari menu Penandatanganan.
              </div>
              <label className="mt-5 block">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Nama Penandatangan
                </span>
                <input
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm text-muted outline-none"
                  readOnly
                  value={signer}
                />
              </label>
              <label className="mt-4 block">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Jabatan
                </span>
                <input
                  className="w-full rounded-xl border border-border bg-surface px-3.5 py-3 text-sm text-muted outline-none"
                  readOnly
                  value={schoolSigner?.role ?? "Kepala Sekolah"}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button
                className="gap-2 border border-primary py-3 text-xs font-bold text-primary hover:bg-blue-soft"
                onClick={openPreview}
              >
                <Icon name="eye" className="size-4" /> Preview PDF
              </Button>
              <Button
                className="gap-2 bg-primary py-3 text-xs font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-dark"
                onClick={downloadPdf}
              >
                <Icon name="download" className="size-4" /> Download
              </Button>
            </div>
            <div className="mt-4 rounded-2xl border border-border bg-surface/80 p-4">
              <div className="text-xs font-bold text-ink">
                Status unggah dokumen pendukung
              </div>
              <div className="mt-1 text-[0.65rem] leading-5 text-muted">
                {pksPrereq.items.length === 0
                  ? "Sekolah hanya menerima Schoolkit barang. Unggah PKS dapat dilakukan setelah draf disimpan."
                  : "Unggah PKS aktif setelah dokumen uang yang diwajibkan sudah diunggah. Bagian Schoolkit barang tidak menjadi syarat."}
              </div>
              <div className="mt-3 space-y-2">
                {pksPrereq.items.length === 0 ? (
                  <div className="rounded-xl bg-white px-3 py-2.5 text-xs text-muted">
                    Tidak ada syarat unggah.
                  </div>
                ) : (
                  pksPrereq.items.map((item) => (
                  <div
                    className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2.5"
                    key={item.label}
                  >
                    <div>
                      <div className="text-xs font-bold text-ink">
                        {item.label}
                      </div>
                      <div className="mt-0.5 text-[0.65rem] text-muted">
                        {item.detail}
                      </div>
                    </div>
                    <StatusPill tone={item.done ? "green" : "orange"}>
                      {item.done ? "Sudah unggah" : "Belum unggah"}
                    </StatusPill>
                  </div>
                  ))
                )}
              </div>
            </div>
            <SignedDocumentUpload
              canReview={canReview}
              disabledHint={
                hasPksDraft
                  ? "Unggah dokumen uang yang masih diwajibkan terlebih dahulu."
                  : "Simpan draf terlebih dahulu. Unggah aktif setelah draf tersimpan dan dokumen pendukung lengkap."
              }
              documentLabel="PKS"
              enabled={hasPksDraft && pksPrereq.allReady}
              file={schoolUploads.pks}
              hasDraft={hasPksDraft}
              onChange={(next) =>
                onChangeDocUploads?.(
                  patchSchoolUploads(docUploads, school.name, (current) => ({
                    ...current,
                    pks: next,
                  })),
                )
              }
              reviewerName={reviewerName}
              trackApproval
              waitingLabel="Menunggu dokumen"
            />
          </div>

          <div className="card overflow-hidden">
            <div className="flex flex-col gap-3 border-b border-border bg-surface px-5 py-3.5 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <div className="text-xs font-bold text-ink">Draft PKS</div>
                  <div className="text-[0.65rem] text-muted">{school.number}</div>
                </div>
                <DocFlowStatusPill
                  file={schoolUploads.pks}
                  hasDraft={hasPksDraft}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-1.5">
                  <span
                    className={`text-xs font-bold ${
                      useKop ? "text-muted" : "text-sidebar"
                    }`}
                  >
                    Tanpa kop surat
                  </span>
                  <Button
                    aria-checked={useKop}
                    aria-label="Alihkan kop surat"
                    className={`relative h-7 w-12 shrink-0 rounded-full p-0.5 ${
                      useKop ? "bg-sidebar" : "bg-[#c5cad6]"
                    }`}
                    onClick={() => setUseKop((current) => !current)}
                    role="switch"
                  >
                    <span
                      className={`block size-6 rounded-full bg-white shadow-sm transition-transform ${
                        useKop ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </Button>
                  <span
                    className={`text-xs font-bold ${
                      useKop ? "text-sidebar" : "text-muted"
                    }`}
                  >
                    Pakai kop surat
                  </span>
                </div>
                {savedMessage ? (
                  <div className="text-xs font-semibold text-success">
                    {savedMessage}
                  </div>
                ) : null}
                <Button
                  className="bg-primary px-4 py-2 text-xs font-bold text-white hover:bg-primary-dark"
                  onClick={saveDraft}
                >
                  Simpan draf
                </Button>
              </div>
            </div>
            <article className="mx-auto my-4 max-w-[210mm] overflow-hidden rounded-sm bg-white shadow-xl shadow-ink/10">
              <PksDocument
                date={schoolSigner?.date || "2026-05-20"}
                ppk={ppkSigner ?? null}
                principal={signer}
                principalNip={schoolSigner?.nip ?? ""}
                school={school}
                showKop={useKop}
              />
            </article>
          </div>
        </div>
      )}

      {previewOpen && school && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-sm">
          <div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="no-print flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <div className="text-sm font-bold text-ink">Preview PKS</div>
                <div className="text-xs text-muted">{school.name}</div>
              </div>
              <Button
                aria-label="Tutup preview"
                className="p-2 text-muted hover:bg-surface"
                onClick={() => setPreviewOpen(false)}
              >
                <Icon name="close" />
              </Button>
            </div>
            <div className="min-h-0 flex-1 overflow-auto bg-surface">
              <PksDocument
                date={schoolSigner?.date || "2026-05-20"}
                ppk={ppkSigner ?? null}
                principal={signer}
                principalNip={schoolSigner?.nip ?? ""}
                school={school}
                showKop={useKop}
              />
            </div>
            <div className="no-print flex justify-end gap-3 border-t border-border p-4">
              <Button
                className="border border-border px-4 py-2.5 text-xs font-bold text-ink hover:bg-surface"
                onClick={() => window.print()}
              >
                Cetak
              </Button>
              <Button
                className="gap-2 bg-primary px-4 py-2.5 text-xs font-bold text-white hover:bg-primary-dark"
                onClick={downloadPdf}
              >
                <Icon name="download" className="size-4" /> Download PDF
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function downloadPortalPdf(title: string, details: string[]) {
  const escapePdf = (text: string) =>
    text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)")
  const lines = [title, "", ...details]
  const content = [
    "BT",
    "/F1 14 Tf",
    "55 790 Td",
    `(${escapePdf(lines[0])}) Tj`,
    "/F1 9 Tf",
    ...lines
      .slice(1)
      .flatMap((line) => ["0 -20 Td", `(${escapePdf(line)}) Tj`]),
    "ET",
  ].join("\n")
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ]
  let pdf = "%PDF-1.4\n"
  const offsets = [0]
  objects.forEach((object, index) => {
    offsets.push(pdf.length)
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`
  })
  const xrefOffset = pdf.length
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`
  })
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`
  const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }))
  const link = document.createElement("a")
  link.href = url
  link.download = `${title.toLowerCase().replaceAll(" ", "-")}.pdf`
  link.click()
  URL.revokeObjectURL(url)
}

function PortalLogin({
  onLogin,
}: {
  onLogin: (role: PortalRole) => void
}) {
  const accounts: { role: PortalRole; label: string; identity: string }[] = [
    { role: "admin", label: "Administrator", identity: "admin.spab" },
    { role: "dinas", label: "Dinas", identity: "dinas.spab" },
    { role: "direktorat", label: "Direktorat", identity: "direktorat.spab" },
    { role: "school", label: "Sekolah", identity: "20204182" },
  ]
  const [role, setRole] = useState<PortalRole>("admin")
  const [identity, setIdentity] = useState("admin.spab")
  const [password, setPassword] = useState("spab2025")
  const [showPassword, setShowPassword] = useState(false)
  const account = accounts.find((item) => item.role === role) ?? accounts[0]
  const changeRole = (nextRole: PortalRole) => {
    setRole(nextRole)
    setIdentity(
      accounts.find((item) => item.role === nextRole)?.identity ?? "",
    )
  }

  return (
    <div className="relative grid min-h-screen overflow-hidden bg-canvas lg:grid-cols-[1.1fr_0.9fr]">
      <div className="relative hidden overflow-hidden bg-sidebar p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="relative flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-white text-primary">
            <Icon name="building" className="size-7" />
          </div>
          <div>
            <div className="text-2xl font-extrabold">SPAB</div>
            <div className="text-xs text-white/60">
              Sistem Satuan Pendidikan Aman Bencana
            </div>
          </div>
        </div>
        <div className="relative max-w-xl">
          <StatusPill tone="green">Portal resmi SPAB</StatusPill>
          <div className="mt-6 text-4xl font-extrabold leading-tight">
            Satu akses untuk pengelolaan bantuan bencana.
          </div>
          <div className="mt-5 max-w-lg text-sm leading-7 text-white/65">
            Masuk sesuai peran Anda untuk mengelola bantuan, menyiapkan dokumen,
            memantau verifikasi, dan memastikan penyaluran yang transparan.
          </div>
          <div className="mt-10 grid grid-cols-3 gap-3">
            {["Data terpusat", "Dokumen terpadu", "Akses berbasis peran"].map(
              (item, index) => (
                <div
                  className="rounded-2xl border border-white/10 bg-white/[0.06] p-4"
                  key={item}
                >
                  <div className="mb-3 grid size-8 place-items-center rounded-xl bg-white/10 text-sm font-bold">
                    0{index + 1}
                  </div>
                  <div className="text-xs font-semibold text-white/80">
                    {item}
                  </div>
                </div>
              ),
            )}
          </div>
        </div>
        <div className="relative text-xs text-white/35">
          Kementerian Pendidikan Dasar dan Menengah
        </div>
      </div>
      <div className="flex items-center justify-center p-5 md:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="mb-3 grid size-12 place-items-center rounded-2xl bg-sidebar text-white">
              <Icon name="building" />
            </div>
            <div className="text-xl font-extrabold text-ink">
              Portal SPAB
            </div>
          </div>
          <div className="text-3xl font-extrabold tracking-tight text-ink">
            Selamat datang
          </div>
          <div className="mt-2 text-sm leading-6 text-muted">
            Pilih peran, lalu masuk menggunakan akun yang sesuai.
          </div>
          <div className="mt-7 grid grid-cols-2 gap-1 rounded-xl bg-surface p-1">
            {accounts.map((item) => (
              <Button
                className={`px-4 py-2.5 text-xs font-bold ${
                  role === item.role
                    ? "bg-white text-primary shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
                key={item.role}
                onClick={() => changeRole(item.role)}
                type="button"
              >
                {item.label}
              </Button>
            ))}
          </div>
          <form
            className="mt-6 space-y-5"
            onSubmit={(event) => {
              event.preventDefault()
              onLogin(role)
            }}
          >
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-ink">
                {role === "school" ? "NPSN" : "Nama pengguna"}
              </span>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                <Icon
                  name={role === "school" ? "building" : "user"}
                  className="size-5 text-muted"
                />
                <input
                  className="w-full bg-transparent py-3.5 text-sm text-ink outline-none"
                  onChange={(event) => setIdentity(event.target.value)}
                  placeholder={
                    role === "school"
                      ? "Masukkan 8 digit NPSN"
                      : "Masukkan nama pengguna"
                  }
                  required
                  value={identity}
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-2 block text-xs font-bold text-ink">
                Kata sandi
              </span>
              <div className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
                <Icon name="lock" className="size-5 text-muted" />
                <input
                  className="w-full bg-transparent py-3.5 text-sm text-ink outline-none"
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                />
                <Button
                  aria-label="Tampilkan kata sandi"
                  className="p-1 text-muted hover:text-primary"
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                >
                  <Icon name="eye" className="size-4" />
                </Button>
              </div>
            </label>
            <div className="rounded-xl bg-blue-soft px-4 py-3 text-xs leading-5 text-primary">
              Akun demo {account.label.toLowerCase()} sudah terisi. User dinas,
              direktorat, dan admin dapat menyetujui dokumen yang berstatus
              menunggu persetujuan.
            </div>
            <Button
              className="w-full gap-2 bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-dark"
              type="submit"
            >
              Masuk sebagai {account.label}{" "}
              <Icon name="arrow" className="size-4" />
            </Button>
          </form>
          <div className="mt-8 text-center text-xs text-muted">
            Mengalami kendala akun? Hubungi administrator SPAB.
          </div>
        </div>
      </div>
    </div>
  )
}

function SchoolPortal({
  onLogout,
  signers,
  onChangeSigners,
  paktaTemplates,
  sptjmTemplates,
  packages,
  docUploads,
  onChangeDocUploads,
}: {
  onLogout: () => void
  signers: SignerRecord[]
  onChangeSigners: (signers: SignerRecord[]) => void
  paktaTemplates: PaktaTemplate[]
  sptjmTemplates: PaktaTemplate[]
  packages: Record<string, AidItem[]>
  docUploads: DocUploadsMap
  onChangeDocUploads: (next: DocUploadsMap) => void
}) {
  const [active, setActive] = useState("Dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const schoolName = "SMP Negeri 1 Sukamaju"
  const schoolNpsn = "20204182"
  const schoolSigner = schoolSignerView(signers, schoolName, {
    name: "Hendra Gunawan, S.Pd.",
    nip: "19780512 200501 1 008",
    role: "Kepala Sekolah",
    date: "2025-05-22",
    place: "Cianjur",
  })
  const signer = {
    name: schoolSigner.name,
    role: schoolSigner.role,
    nip: schoolSigner.nip,
    date: schoolSigner.date || "2025-05-22",
    place: schoolSigner.place,
  }
  const content =
    active === "Dashboard" ? (
      <Dashboard onNavigate={setActive} schoolName={schoolName} />
    ) : active === "Penetapan Bantuan" ? (
      <AidAssignmentPage
        lockedSchoolNpsn={schoolNpsn}
        packages={packages}
      />
    ) : active === "RAB" ? (
      <RabPage
        docUploads={docUploads}
        mode="school"
        onChangeDocUploads={onChangeDocUploads}
        packages={packages}
        schoolName={schoolName}
        signer={signer}
        signers={signers}
      />
    ) : active === "Pakta Integritas" ? (
      <PaktaPage
        docUploads={docUploads}
        mode="school"
        onChangeDocUploads={onChangeDocUploads}
        schoolName={schoolName}
        signer={signer}
        signers={signers}
        templates={paktaTemplates}
      />
    ) : active === "Kwitansi" ? (
      <KwitansiPage
        docUploads={docUploads}
        mode="school"
        onChangeDocUploads={onChangeDocUploads}
        packages={packages}
        schoolName={schoolName}
        signer={signer}
        signers={signers}
      />
    ) : active === "SPTJM" ? (
      <SptjmPage
        docUploads={docUploads}
        mode="school"
        onChangeDocUploads={onChangeDocUploads}
        schoolName={schoolName}
        signer={signer}
        signers={signers}
        templates={sptjmTemplates}
      />
    ) : active === "Pelaporan/LPJ" ? (
      <PelaporanLpjPage
        docUploads={docUploads}
        mode="school"
        onChangeDocUploads={onChangeDocUploads}
        schoolName={schoolName}
      />
    ) : active === "PKS" ? (
      <PksPage
        docUploads={docUploads}
        mode="school"
        onChangeDocUploads={onChangeDocUploads}
        schoolName={schoolName}
        signers={signers}
      />
    ) : active === "Penandatanganan" ? (
      <SignerSettingsPage
        onChange={onChangeSigners}
        schoolName={schoolName}
        signers={signers}
      />
    ) : (
      <ModulePage name={active} />
    )

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink">
      <Sidebar
        active={active}
        onClose={() => setSidebarOpen(false)}
        onNavigate={setActive}
        open={sidebarOpen}
        variant="school"
      />
      <div className="min-h-screen lg:pl-72">
        <Header
          logoutLabel="Keluar dari portal sekolah"
          onLogout={onLogout}
          onMenu={() => setSidebarOpen(true)}
          title={active}
          userName={signer.name}
          userRole={signer.role}
        />
        <main className="p-5 md:p-8">{content}</main>
      </div>
    </div>
  )
}

function MasterDataPage({
  title,
  description,
  columns,
  rows,
  idKey,
  onChange,
  relatedMessage,
  categoryFilter,
}: {
  title: string
  description: string
  columns: { key: string; label: string }[]
  rows: Record<string, string | number>[]
  idKey: string
  onChange?: (rows: Record<string, string | number>[]) => void
  relatedMessage?: (row: Record<string, string | number>) => string | null
  categoryFilter?: {
    key: string
    label: string
    options: string[]
  }
}) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const emptyDraft = Object.fromEntries(
    columns.map((column) => [column.key, column.key === "status" ? "Aktif" : ""]),
  ) as Record<string, string | number>
  const [draft, setDraft] = useState(emptyDraft)
  const filtered = rows.filter((row) => {
    if (
      categoryFilter &&
      category &&
      String(row[categoryFilter.key]) !== category
    ) {
      return false
    }
    return Object.values(row)
      .join(" ")
      .toLowerCase()
      .includes(query.toLowerCase())
  })

  const openAdd = () => {
    setEditingId(null)
    setDraft({ ...emptyDraft })
    setFormOpen(true)
  }

  const openEdit = (row: Record<string, string | number>) => {
    setEditingId(String(row[idKey]))
    setDraft({ ...row })
    setFormOpen(true)
  }

  const saveRow = () => {
    if (!String(draft[idKey] ?? "").trim()) return
    const payload = { ...draft, [idKey]: String(draft[idKey]).trim() }
    const duplicate = rows.some(
      (row) => String(row[idKey]) === String(payload[idKey]) && String(row[idKey]) !== editingId,
    )
    if (duplicate) {
      window.alert("Kode/ID sudah digunakan.")
      return
    }
    const next = editingId
      ? rows.map((row) => (String(row[idKey]) === editingId ? payload : row))
      : [payload, ...rows]
    onChange?.(next)
    setFormOpen(false)
  }

  const deleteRow = (row: Record<string, string | number>) => {
    const related = relatedMessage?.(row)
    if (related) {
      window.alert(related)
      return
    }
    if (!window.confirm(`Hapus ${row[idKey]}? Tindakan ini tidak dapat dibatalkan.`)) {
      return
    }
    onChange?.(rows.filter((item) => String(item[idKey]) !== String(row[idKey])))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-2xl font-extrabold text-ink">{title}</div>
          <div className="mt-1 text-sm text-muted">{description}</div>
        </div>
        <Button
          className="gap-2 bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-dark"
          onClick={openAdd}
        >
          <span className="text-lg leading-none">+</span> Tambah Data
        </Button>
      </div>
      <div className="card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-sm font-semibold text-muted">
            {filtered.length} dari {rows.length} data
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {categoryFilter && (
              <label className="block">
                <span className="sr-only">{categoryFilter.label}</span>
                <select
                  aria-label={categoryFilter.label}
                  className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-xs font-semibold text-ink outline-none focus:border-primary sm:w-52"
                  onChange={(event) => setCategory(event.target.value)}
                  value={category}
                >
                  <option value="">Semua {categoryFilter.label.toLowerCase()}</option>
                  {categoryFilter.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <label className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5 text-muted focus-within:border-primary">
              <Icon name="search" className="size-4" />
              <input
                className="w-52 bg-transparent text-xs text-ink outline-none placeholder:text-muted-light"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari data..."
                value={query}
              />
            </label>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[48rem]">
            <thead>
              <tr className="bg-surface text-left text-[0.65rem] font-bold uppercase tracking-wider text-muted">
                {columns.map((column) => (
                  <th className="px-5 py-3.5" key={column.key}>
                    {column.label}
                  </th>
                ))}
                <th className="px-5 py-3.5">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((row, index) => (
                <tr
                  className="transition-colors hover:bg-surface/70"
                  key={`${Object.values(row).join("-")}-${index}`}
                >
                  {columns.map((column) => {
                    const value = row[column.key]
                    return (
                      <td className="px-5 py-4" key={column.key}>
                        {column.key === "status" ? (
                          <StatusPill
                            tone={value === "Aktif" ? "green" : "orange"}
                          >
                            {String(value)}
                          </StatusPill>
                        ) : column.key === "price" ? (
                          <span className="text-xs font-bold text-ink">
                            {formatRupiah(Number(value))}
                          </span>
                        ) : (
                          <span className="text-xs font-medium text-ink">
                            {String(value)}
                          </span>
                        )}
                      </td>
                    )
                  })}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Button
                        className="px-2.5 py-2 text-xs font-bold text-primary hover:bg-blue-soft"
                        onClick={() => openEdit(row)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="px-2.5 py-2 text-xs font-bold text-danger hover:bg-red-soft"
                        onClick={() => deleteRow(row)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    className="px-5 py-16 text-center text-sm text-muted"
                    colSpan={columns.length + 1}
                  >
                    Data tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {formOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div className="text-base font-bold text-ink">
                {editingId ? "Edit Data" : "Tambah Data"}
              </div>
              <Button
                aria-label="Tutup formulir"
                className="p-2 text-muted hover:bg-surface"
                onClick={() => setFormOpen(false)}
              >
                <Icon name="close" />
              </Button>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              {columns.map((column) => (
                <label className="block" key={column.key}>
                  <span className="mb-2 block text-xs font-bold text-ink">
                    {column.label}
                  </span>
                  <input
                    className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        [column.key]: event.target.value,
                      }))
                    }
                    value={String(draft[column.key] ?? "")}
                  />
                </label>
              ))}
            </div>
            <div className="flex justify-end gap-3 border-t border-border bg-surface p-4">
              <Button
                className="border border-border px-5 py-3 text-xs font-bold text-ink hover:bg-white"
                onClick={() => setFormOpen(false)}
              >
                Batal
              </Button>
              <Button
                className="bg-primary px-5 py-3 text-xs font-bold text-white hover:bg-primary-dark"
                onClick={saveRow}
              >
                Simpan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function nextGoodsCode(items: MasterGood[]) {
  const numbers = items.map((item) => Number(item.code.replace(/\D/g, "")) || 0)
  const next = Math.max(0, ...numbers) + 1
  return `BRG-${String(next).padStart(3, "0")}`
}

function MasterGoodsPage() {
  const emptyDraft: MasterGood = {
    code: "",
    name: "",
    unit: "Unit",
    category: "Schoolkit",
    price: 0,
  }
  const { data } = useDb()
  const [items, setItems] = usePersistedState<MasterGood[]>(
    "goods",
    masterGoods,
  )
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingCode, setEditingCode] = useState<string | null>(null)
  const [draft, setDraft] = useState<MasterGood>(emptyDraft)
  const filtered = items.filter((item) => {
    if (category && item.category !== category) return false
    return `${item.code} ${item.name} ${item.unit} ${item.category} ${item.price}`
      .toLowerCase()
      .includes(query.toLowerCase())
  })

  const openAdd = () => {
    setEditingCode(null)
    setDraft({ ...emptyDraft, code: nextGoodsCode(items) })
    setFormOpen(true)
  }

  const openEdit = (item: MasterGood) => {
    setEditingCode(item.code)
    setDraft({ ...item })
    setFormOpen(true)
  }

  const saveItem = () => {
    if (!draft.code.trim() || !draft.name.trim() || !draft.unit.trim()) return
    const payload = {
      ...draft,
      code: draft.code.trim().toUpperCase(),
      name: draft.name.trim(),
      unit: draft.unit.trim(),
      price: Number(draft.price) || 0,
    }
    const duplicate = items.some(
      (item) => item.code === payload.code && item.code !== editingCode,
    )
    if (duplicate) {
      window.alert("Kode barang sudah digunakan.")
      return
    }
    if (editingCode) {
      setItems((current) =>
        current.map((item) => (item.code === editingCode ? payload : item)),
      )
    } else {
      setItems((current) => [...current, payload])
    }
    setFormOpen(false)
  }

  const deleteItem = (item: MasterGood) => {
    const menus = (data.menus ?? {}) as Record<string, { name: string }[]>
    const usedIn = Object.entries(menus).find(([, rows]) =>
      rows.some((row) => row.name === item.name),
    )
    if (usedIn) {
      window.alert(
        `Barang masih dipakai di master menu ${usedIn[0]}. Ubah paket bantuan dulu.`,
      )
      return
    }
    if (
      window.confirm(
        `Hapus ${item.name}? Tindakan ini tidak dapat dibatalkan.`,
      )
    ) {
      setItems((current) => current.filter((row) => row.code !== item.code))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-2xl font-extrabold text-ink">Master Barang</div>
          <div className="mt-1 text-sm text-muted">
            Referensi barang untuk schoolkit, alat IPA, RKD, lab komputer, dan
            meubeler.
          </div>
        </div>
        <Button
          className="gap-2 bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-dark"
          onClick={openAdd}
        >
          <span className="text-lg leading-none">+</span> Tambah Data
        </Button>
      </div>
      <div className="card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-sm font-semibold text-muted">
            {filtered.length} dari {items.length} data
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="block">
              <span className="sr-only">Kategori menu</span>
              <select
                aria-label="Kategori menu"
                className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-xs font-semibold text-ink outline-none focus:border-primary sm:w-52"
                onChange={(event) => setCategory(event.target.value)}
                value={category}
              >
                <option value="">Semua kategori menu</option>
                {aidMenuNames.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5 text-muted focus-within:border-primary">
              <Icon name="search" className="size-4" />
              <input
                className="w-52 bg-transparent text-xs text-ink outline-none placeholder:text-muted-light"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari data..."
                value={query}
              />
            </label>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[56rem]">
            <thead>
              <tr className="bg-surface text-left text-[0.65rem] font-bold uppercase tracking-wider text-muted">
                <th className="px-5 py-3.5">Kode</th>
                <th className="px-5 py-3.5">Nama Barang</th>
                <th className="px-5 py-3.5">Satuan</th>
                <th className="px-5 py-3.5">Menu Bantuan</th>
                <th className="px-5 py-3.5">Harga Satuan</th>
                <th className="px-5 py-3.5">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => (
                <tr
                  className="transition-colors hover:bg-surface/70"
                  key={item.code}
                >
                  <td className="px-5 py-4 text-xs font-medium text-ink">
                    {item.code}
                  </td>
                  <td className="px-5 py-4 text-xs font-medium text-ink">
                    {item.name}
                  </td>
                  <td className="px-5 py-4 text-xs font-medium text-ink">
                    {item.unit}
                  </td>
                  <td className="px-5 py-4 text-xs font-medium text-ink">
                    {item.category}
                  </td>
                  <td className="px-5 py-4 text-xs font-bold text-ink">
                    {formatRupiah(item.price)}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <Button
                        className="px-2.5 py-2 text-xs font-bold text-primary hover:bg-blue-soft"
                        onClick={() => openEdit(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="px-2.5 py-2 text-xs font-bold text-danger hover:bg-red-soft"
                        onClick={() => deleteItem(item)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td
                    className="px-5 py-16 text-center text-sm text-muted"
                    colSpan={6}
                  >
                    Data tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {formOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div>
                <div className="text-base font-bold text-ink">
                  {editingCode ? "Edit Barang" : "Tambah Barang"}
                </div>
                <div className="mt-1 text-xs text-muted">
                  Lengkapi kode, nama, satuan, kategori menu, dan harga satuan.
                </div>
              </div>
              <Button
                aria-label="Tutup formulir"
                className="p-2 text-muted hover:bg-surface"
                onClick={() => setFormOpen(false)}
              >
                <Icon name="close" />
              </Button>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Kode
                </span>
                <input
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      code: event.target.value,
                    }))
                  }
                  value={draft.code}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Nama barang
                </span>
                <input
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="Contoh: Tas sekolah"
                  value={draft.name}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Satuan
                </span>
                <input
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      unit: event.target.value,
                    }))
                  }
                  placeholder="Unit, Set, Paket"
                  value={draft.unit}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Kategori menu
                </span>
                <select
                  className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      category: event.target.value as MasterGood["category"],
                    }))
                  }
                  value={draft.category}
                >
                  {aidMenuNames.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Harga satuan
                </span>
                <input
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm text-ink outline-none focus:border-primary"
                  min="0"
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      price: Number(event.target.value),
                    }))
                  }
                  type="number"
                  value={draft.price}
                />
              </label>
            </div>
            <div className="flex justify-end gap-3 border-t border-border bg-surface p-4">
              <Button
                className="border border-border px-5 py-3 text-xs font-bold text-ink hover:bg-white"
                onClick={() => setFormOpen(false)}
              >
                Batal
              </Button>
              <Button
                className="bg-primary px-5 py-3 text-xs font-bold text-white hover:bg-primary-dark disabled:opacity-50"
                disabled={
                  !draft.code.trim() || !draft.name.trim() || !draft.unit.trim()
                }
                onClick={saveItem}
              >
                {editingCode ? "Simpan Perubahan" : "Tambah Data"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ModulePage({ name }: { name: string }) {
  const config = useMemo(() => {
    const byName: Record<string, { icon: IconName; description: string }> = {
      "Master Sekolah": {
        icon: "building",
        description: "Kelola data referensi seluruh satuan pendidikan.",
      },
      "Master Wilayah": {
        icon: "map",
        description:
          "Kelola data provinsi, kabupaten/kota, kecamatan, dan desa.",
      },
      "Master Jenis Bencana": {
        icon: "alert",
        description:
          "Kelola klasifikasi banjir, gempa, longsor, erupsi, kebakaran, tsunami, dan lainnya.",
      },
      "Master Barang": {
        icon: "box",
        description: "Kelola referensi barang dan kebutuhan bantuan.",
      },
      "Master Menu Bantuan": {
        icon: "package",
        description: "Susun menu bantuan sesuai kebutuhan penanganan.",
      },
      Penandatanganan: {
        icon: "user",
        description:
          "Kelola data pejabat dan kepala sekolah untuk tanda tangan dokumen.",
      },
      "Template Pakta": {
        icon: "document",
        description:
          "Kelola template pernyataan pakta integritas yang dipakai semua sekolah.",
      },
      "Template SPTJM": {
        icon: "file",
        description:
          "Kelola template pernyataan SPTJM yang dipakai semua sekolah.",
      },
      RAB: {
        icon: "money",
        description:
          "Kelola rencana anggaran biaya penanganan sekolah terdampak.",
      },
      "Pakta Integritas": {
        icon: "document",
        description:
          "Pantau unggahan dan verifikasi pakta integritas sekolah terdampak.",
      },
      SPTJM: {
        icon: "file",
        description:
          "Kelola surat pernyataan tanggung jawab mutlak satuan pendidikan.",
      },
      PKS: {
        icon: "handshake",
        description: "Kelola dokumen perjanjian kerja sama penyaluran bantuan.",
      },
      Kwitansi: {
        icon: "receipt",
        description: "Catat dan verifikasi kwitansi penyaluran dana bantuan.",
      },
      RKAS: {
        icon: "money",
        description: "Kelola Rencana Kegiatan dan Anggaran Sekolah.",
      },
      Invoice: {
        icon: "receipt",
        description: "Kelola invoice pengadaan bantuan SPAB.",
      },
      BAST: {
        icon: "handshake",
        description: "Kelola berita acara serah terima bantuan.",
      },
      "Dokumentasi Hasil": {
        icon: "document",
        description: "Kelola foto dan berkas hasil pelaksanaan bantuan.",
      },
    }
    return (
      byName[name] ?? {
        icon: "document" as IconName,
        description: "Kelola data dan dokumen SPAB.",
      }
    )
  }, [name])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-2xl font-extrabold text-ink">{name}</div>
          <div className="mt-1 text-sm text-muted">{config.description}</div>
        </div>
        <Button className="gap-2 bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-dark">
          <span className="text-lg leading-none">+</span> Tambah Data
        </Button>
      </div>
      <div className="card">
        <div className="flex flex-col items-center px-6 py-20 text-center">
          <div className="grid size-20 place-items-center rounded-3xl bg-blue-soft text-primary">
            <Icon name={config.icon} className="size-9" />
          </div>
          <div className="mt-6 text-lg font-bold text-ink">Modul {name}</div>
          <div className="mt-2 max-w-md text-sm leading-relaxed text-muted">
            Area kerja ini siap digunakan untuk mengelola data, pencarian,
            verifikasi, dan pelaporan {name.toLowerCase()}.
          </div>
          <Button className="mt-6 gap-2 border border-border px-5 py-3 text-sm font-bold text-ink hover:bg-surface">
            <Icon name="file" className="size-4" /> Lihat panduan modul
          </Button>
        </div>
      </div>
    </div>
  )
}

function SchoolSearchPicker({
  value,
  onChange,
  source = "master",
  ariaLabel = "Cari sekolah",
}: {
  value: string
  onChange: (schoolName: string) => void
  source?: "master" | "affected"
  ariaLabel?: string
}) {
  const { data } = useDb()
  const catalog =
    source === "affected"
      ? ((data.affectedSchools as SchoolRecord[] | undefined)?.length
          ? (data.affectedSchools as SchoolRecord[])
          : schools
        ).map((item) => {
          const lookup = assignmentSchoolFromAffected(item)
          return {
            name: item.name,
            npsn: lookup.npsn || "-",
            regency: item.regency,
            province: item.province,
          }
        })
      : masterSchools
  const [query, setQuery] = useState("")
  const selected =
    catalog.find((item) => item.name === value) ??
    (value
      ? {
          name: value,
          npsn: "-",
          regency: "",
          province: "",
        }
      : undefined)
  const normalized = query.trim().toLowerCase()
  const results =
    normalized.length < 2
      ? []
      : catalog
          .filter((item) =>
            `${item.name} ${item.npsn} ${item.regency} ${item.province}`
              .toLowerCase()
              .includes(normalized),
          )
          .slice(0, 12)

  if (selected) {
    return (
      <div className="flex items-start justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3">
        <div className="min-w-0">
          <div className="text-sm font-bold text-ink">{selected.name}</div>
          <div className="mt-1 truncate text-xs text-muted">
            NPSN {selected.npsn} · {selected.regency}, {selected.province}
          </div>
        </div>
        <Button
          className="shrink-0 px-2 py-1 text-xs font-bold text-primary hover:bg-blue-soft"
          onClick={() => {
            onChange("")
            setQuery("")
          }}
          type="button"
        >
          Ganti
        </Button>
      </div>
    )
  }

  return (
    <div className="relative">
      <label className="flex items-center gap-3 rounded-xl border border-border bg-white px-4 py-3 text-muted focus-within:border-primary">
        <Icon name="search" className="size-4 shrink-0" />
        <input
          aria-label={ariaLabel}
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted-light"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Ketik minimal 2 huruf: nama sekolah atau NPSN"
          value={query}
        />
      </label>
      {normalized.length > 0 && normalized.length < 2 && (
        <div className="mt-2 text-xs text-muted">
          Ketik minimal 2 karakter untuk mencari sekolah.
        </div>
      )}
      {normalized.length >= 2 && (
        <div className="absolute z-10 mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border border-border bg-white shadow-lg">
          {results.length === 0 ? (
            <div className="px-4 py-3 text-xs text-muted">
              Sekolah tidak ditemukan. Coba nama atau NPSN lain.
            </div>
          ) : (
            results.map((item) => (
              <Button
                className="w-full justify-start rounded-none px-4 py-3 text-left hover:bg-surface"
                key={item.npsn}
                onClick={() => {
                  onChange(item.name)
                  setQuery("")
                }}
                type="button"
              >
                <div className="min-w-0">
                  <div className="text-sm font-bold text-ink">{item.name}</div>
                  <div className="mt-1 truncate text-xs text-muted">
                    NPSN {item.npsn} · {item.regency}, {item.province}
                  </div>
                </div>
              </Button>
            ))
          )}
        </div>
      )}
    </div>
  )
}

const emptySignerDraft = (): SignerRecord => ({
  id: 0,
  role: "kepala-sekolah",
  name: "",
  identity: "",
  identityLabel: "NIP",
  position: "Kepala Sekolah",
  schoolName: "",
  line1: "Kepala Sekolah",
  line2: "",
  line3: "",
  place: "",
  date: "",
})

function SignerSettingsPage({
  signers,
  onChange,
  schoolName,
}: {
  signers: SignerRecord[]
  onChange: (signers: SignerRecord[]) => void
  schoolName?: string
}) {
  const [query, setQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState<SignerRecord>(emptySignerDraft())
  const schoolLocked = Boolean(schoolName)
  const roleOptions = schoolLocked
    ? signerRoleOptions.filter((item) => isSchoolSignerRole(item.key))
    : signerRoleOptions
  const scopedSigners = schoolName
    ? signers.filter((item) => item.schoolName === schoolName)
    : signers
  const filtered = scopedSigners.filter((item) => {
    if (roleFilter && item.role !== roleFilter) return false
    return `${item.name} ${item.identity} ${item.position} ${item.schoolName} ${signerRoleLabel(item.role)}`
      .toLowerCase()
      .includes(query.toLowerCase())
  })

  const applyRoleDefaults = (role: SignerRole, current: SignerRecord) => {
    const defaults: Record<SignerRole, Partial<SignerRecord>> = {
      "kepala-sekolah": {
        position: "Kepala Sekolah",
        identityLabel: "NIP",
        line1: "Kepala Sekolah",
      },
      "ketua-pelaksana": {
        position: "Ketua Pelaksana",
        identityLabel: "NIP",
        line1: "Ketua Pelaksana",
      },
      "ketua-komite": {
        position: "Ketua Komite Satuan Pendidikan",
        identityLabel: "NIK",
        line1: "Ketua Komite Satuan Pendidikan",
      },
      kpa: {
        position: "Pejabat Pembuat Komitmen",
        identityLabel: "NIP",
        line1: "an. Kuasa Pengguna Anggaran",
        line2: "Satker Direktorat SMP",
        line3: "Sarana Prasarana dan Tata Kelola",
        schoolName: "",
      },
      bendahara: {
        position: "Bendahara Pengeluaran Pembantu",
        identityLabel: "NIP",
        line1: "Bendahara",
        line2: "Pengeluaran Pembantu",
        line3: "Satker Direktorat SMP",
        schoolName: "",
      },
      ppk: {
        position: "Pejabat Pembuat Komitmen",
        identityLabel: "NIP",
        line1: "PIHAK PERTAMA",
        line2: "Pejabat Pembuat Komitmen",
        schoolName: "",
      },
    }
    return {
      ...current,
      role,
      ...defaults[role],
      ...(schoolName && isSchoolSignerRole(role) ? { schoolName } : {}),
    }
  }

  const openAdd = () => {
    const next = emptySignerDraft()
    setEditingId(null)
    setDraft(schoolName ? { ...next, schoolName } : next)
    setFormOpen(true)
  }

  const openEdit = (item: SignerRecord) => {
    setEditingId(item.id)
    setDraft({ ...item })
    setFormOpen(true)
  }

  const saveItem = () => {
    if (!draft.name.trim() || !draft.identity.trim()) return
    if (isSchoolSignerRole(draft.role) && !draft.schoolName) {
      window.alert("Pilih sekolah untuk penandatangan ini.")
      return
    }
    const payload: SignerRecord = {
      ...draft,
      name: draft.name.trim(),
      identity: draft.identity.trim(),
      position: draft.position.trim() || signerRoleLabel(draft.role),
      schoolName: isSchoolSignerRole(draft.role)
        ? schoolName || draft.schoolName
        : "",
      line1: draft.line1.trim(),
      line2: draft.line2.trim(),
      line3: draft.line3.trim(),
      place: draft.place.trim(),
    }
    if (editingId) {
      onChange(
        signers.map((item) => (item.id === editingId ? { ...payload, id: editingId } : item)),
      )
    } else {
      const id = Math.max(0, ...signers.map((item) => item.id)) + 1
      onChange([...signers, { ...payload, id }])
    }
    setFormOpen(false)
  }

  const deleteItem = (item: SignerRecord) => {
    if (
      window.confirm(
        `Hapus ${item.name}? Tanda tangan di dokumen akan memakai data tersisa.`,
      )
    ) {
      onChange(signers.filter((row) => row.id !== item.id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="text-2xl font-extrabold text-ink">Penandatanganan</div>
          <div className="mt-1 text-sm text-muted">
            {schoolLocked
              ? `Data penandatangan ${schoolName}. Hanya peran sekolah yang tampil di sini.`
              : "Data ini otomatis mengisi kolom tanda tangan pada RAB, pakta integritas, kwitansi, SPTJM, dan PKS."}
          </div>
        </div>
        <Button
          className="gap-2 bg-primary px-5 py-3 text-sm font-bold text-white shadow-lg shadow-primary/20 hover:bg-primary-dark"
          onClick={openAdd}
        >
          <span className="text-lg leading-none">+</span> Tambah Data
        </Button>
      </div>
      <div className="card overflow-hidden">
        <div className="flex flex-col gap-4 border-b border-border p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="text-sm font-semibold text-muted">
            {filtered.length} dari {scopedSigners.length} data
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <select
              aria-label="Filter jabatan penandatangan"
              className="w-full rounded-xl border border-border bg-white px-3 py-2.5 text-xs font-semibold text-ink outline-none focus:border-primary sm:w-56"
              onChange={(event) => setRoleFilter(event.target.value)}
              value={roleFilter}
            >
              <option value="">Semua jabatan</option>
              {roleOptions.map((option) => (
                <option key={option.key} value={option.key}>
                  {option.label}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 rounded-xl border border-border bg-white px-3 py-2.5 text-muted focus-within:border-primary">
              <Icon name="search" className="size-4" />
              <input
                className="w-52 bg-transparent text-xs text-ink outline-none placeholder:text-muted-light"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari nama atau NIP..."
                value={query}
              />
            </label>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[52rem] text-left">
            <thead className="bg-surface text-xs text-muted">
              <tr>
                <th className="px-5 py-3 font-bold">Nama</th>
                <th className="px-5 py-3 font-bold">Jabatan setting</th>
                <th className="px-5 py-3 font-bold">Identitas</th>
                <th className="px-5 py-3 font-bold">Sekolah / unit</th>
                <th className="px-5 py-3 font-bold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td className="px-5 py-4">
                    <div className="text-sm font-bold text-ink">{item.name}</div>
                    <div className="mt-1 text-xs text-muted">{item.position}</div>
                  </td>
                  <td className="px-5 py-4 text-xs font-semibold text-ink">
                    {signerRoleLabel(item.role)}
                  </td>
                  <td className="px-5 py-4 text-xs text-muted">
                    {item.identityLabel}. {item.identity}
                  </td>
                  <td className="px-5 py-4 text-xs text-muted">
                    {item.schoolName || item.line2 || item.line1 || "-"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-2">
                      <Button
                        className="px-3 py-2 text-xs font-bold text-primary hover:bg-blue-soft"
                        onClick={() => openEdit(item)}
                      >
                        Edit
                      </Button>
                      <Button
                        className="px-3 py-2 text-xs font-bold text-danger hover:bg-red-soft"
                        onClick={() => deleteItem(item)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {formOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-ink/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="border-b border-border px-6 py-4">
              <div className="text-base font-bold text-ink">
                {editingId ? "Edit penandatangan" : "Tambah penandatangan"}
              </div>
              <div className="mt-1 text-xs text-muted">
                Setelah disimpan, dokumen terkait memakai data ini otomatis.
              </div>
            </div>
            <div className="grid max-h-[70vh] gap-5 overflow-y-auto p-6 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Jenis penandatangan
                </span>
                <select
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
                  onChange={(event) =>
                    setDraft(
                      applyRoleDefaults(event.target.value as SignerRole, draft),
                    )
                  }
                  value={draft.role}
                >
                  {roleOptions.map((option) => (
                    <option key={option.key} value={option.key}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              {isSchoolSignerRole(draft.role) && (
                <div className="block md:col-span-2">
                  <span className="mb-2 block text-xs font-bold text-ink">
                    Sekolah
                  </span>
                  {schoolLocked ? (
                    <div className="rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-ink">
                      {schoolName}
                    </div>
                  ) : (
                    <SchoolSearchPicker
                      onChange={(nextSchool) =>
                        setDraft({ ...draft, schoolName: nextSchool })
                      }
                      value={draft.schoolName}
                    />
                  )}
                </div>
              )}
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-ink">Nama</span>
                <input
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
                  onChange={(event) =>
                    setDraft({ ...draft, name: event.target.value })
                  }
                  value={draft.name}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Jabatan pada dokumen
                </span>
                <input
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
                  onChange={(event) =>
                    setDraft({ ...draft, position: event.target.value })
                  }
                  value={draft.position}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Jenis identitas
                </span>
                <select
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      identityLabel: event.target.value as "NIP" | "NIK",
                    })
                  }
                  value={draft.identityLabel}
                >
                  <option value="NIP">NIP</option>
                  <option value="NIK">NIK</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Nomor {draft.identityLabel}
                </span>
                <input
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
                  onChange={(event) =>
                    setDraft({ ...draft, identity: event.target.value })
                  }
                  value={draft.identity}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Baris jabatan 1
                </span>
                <input
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
                  onChange={(event) =>
                    setDraft({ ...draft, line1: event.target.value })
                  }
                  value={draft.line1}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Baris jabatan 2
                </span>
                <input
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
                  onChange={(event) =>
                    setDraft({ ...draft, line2: event.target.value })
                  }
                  value={draft.line2}
                />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Baris jabatan 3
                </span>
                <input
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
                  onChange={(event) =>
                    setDraft({ ...draft, line3: event.target.value })
                  }
                  value={draft.line3}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Tempat tanda tangan
                </span>
                <input
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
                  onChange={(event) =>
                    setDraft({ ...draft, place: event.target.value })
                  }
                  value={draft.place}
                />
              </label>
              <label className="block">
                <span className="mb-2 block text-xs font-bold text-ink">
                  Tanggal tanda tangan
                </span>
                <input
                  className="w-full rounded-xl border border-border px-4 py-3 text-sm outline-none focus:border-primary"
                  onChange={(event) =>
                    setDraft({ ...draft, date: event.target.value })
                  }
                  type="date"
                  value={draft.date}
                />
              </label>
            </div>
            <div className="flex justify-end gap-3 border-t border-border bg-surface p-4">
              <Button
                className="border border-border px-5 py-3 text-xs font-bold text-ink hover:bg-white"
                onClick={() => setFormOpen(false)}
              >
                Batal
              </Button>
              <Button
                className="bg-primary px-5 py-3 text-xs font-bold text-white hover:bg-primary-dark disabled:opacity-50"
                disabled={!draft.name.trim() || !draft.identity.trim()}
                onClick={saveItem}
              >
                {editingId ? "Simpan Perubahan" : "Tambah Data"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [active, setActive] = useState("Dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [appMode, setAppMode] = useState<"login" | PortalRole>("login")
  const [assignmentSchoolNpsn, setAssignmentSchoolNpsn] = useState("")
  const [packages, setPackages] = usePersistedState<Record<string, AidItem[]>>(
    "menus",
    initialAidPackages,
  )
  const [signers, setSigners] = usePersistedState<SignerRecord[]>(
    "signers",
    initialSigners,
  )
  const [paktaTemplates, setPaktaTemplates] = usePersistedState<PaktaTemplate[]>(
    "paktaTemplates",
    initialPaktaTemplates,
  )
  const [sptjmTemplates, setSptjmTemplates] = usePersistedState<PaktaTemplate[]>(
    "sptjmTemplates",
    initialSptjmTemplates,
  )
  const [docUploads, setDocUploads] = usePersistedState<DocUploadsMap>(
    "docUploads",
    {},
  )
  const [masterSchoolRows, setMasterSchoolRows] = usePersistedState(
    "schools",
    masterSchools,
  )
  const [masterRegionRows, setMasterRegionRows] = usePersistedState(
    "regions",
    masterRegions,
  )
  const [masterDisasterRows, setMasterDisasterRows] = usePersistedState(
    "disasters",
    masterDisasters,
  )
  const { data } = useDb()
  useEffect(() => {
    const rows = data.pksSchools as PksSchool[] | undefined
    if (!rows?.length) return
    pksSchools.splice(0, pksSchools.length, ...rows)
  }, [data.pksSchools])

  if (appMode === "login") {
    return (
      <PortalLogin
        onLogin={(role) => setAppMode(role)}
      />
    )
  }

  if (appMode === "school") {
    return (
      <SchoolPortal
        docUploads={docUploads}
        onChangeDocUploads={setDocUploads}
        onChangeSigners={setSigners}
        onLogout={() => setAppMode("login")}
        packages={packages}
        paktaTemplates={paktaTemplates}
        sptjmTemplates={sptjmTemplates}
        signers={signers}
      />
    )
  }

  const reviewerName =
    appMode === "dinas"
      ? "User Dinas"
      : appMode === "direktorat"
        ? "User Direktorat"
        : "User Admin"
  const reviewerRole =
    appMode === "dinas"
      ? "Dinas"
      : appMode === "direktorat"
        ? "Direktorat"
        : "Administrator"

  const content =
    active === "Dashboard" ? (
      <Dashboard onNavigate={setActive} />
    ) : active === "Sekolah Terdampak" ? (
      <SchoolTable
        onAssign={(school) => {
          setAssignmentSchoolNpsn(
            pksSchools.find((item) => item.name === school.name)?.npsn ??
              masterSchoolRows.find((item) => item.name === school.name)
                ?.npsn ??
              "",
          )
          setActive("Penetapan Bantuan")
        }}
      />
    ) : active === "Penetapan Bantuan" ? (
      <AidAssignmentPage
        initialSchoolNpsn={assignmentSchoolNpsn}
        packages={packages}
        onManagePackages={() => setActive("Master Menu Bantuan")}
      />
    ) : active === "Master Sekolah" ? (
      <MasterDataPage
        columns={[
          { key: "npsn", label: "NPSN" },
          { key: "name", label: "Nama Sekolah" },
          { key: "jenjang", label: "Jenjang" },
          { key: "regency", label: "Kabupaten/Kota" },
          { key: "province", label: "Provinsi" },
          { key: "principal", label: "Kepala Sekolah" },
          { key: "status", label: "Status" },
        ]}
        description="Data referensi satuan pendidikan jenjang SMP."
        idKey="npsn"
        onChange={setMasterSchoolRows}
        relatedMessage={(row) =>
          schools.some((item) => item.name === row.name) ||
          pksSchools.some((item) => item.name === row.name || item.npsn === row.npsn)
            ? "Sekolah masih dipakai di data sekolah terdampak atau PKS. Hapus relasi itu dulu."
            : null
        }
        rows={masterSchoolRows}
        title="Master Sekolah"
      />
    ) : active === "Master Wilayah" ? (
      <MasterDataPage
        columns={[
          { key: "code", label: "Kode" },
          { key: "name", label: "Nama Wilayah" },
          { key: "type", label: "Tingkat" },
          { key: "parent", label: "Induk" },
        ]}
        description="Referensi provinsi, kabupaten/kota, dan kecamatan."
        idKey="code"
        onChange={setMasterRegionRows}
        relatedMessage={(row) =>
          schools.some(
            (item) =>
              item.province === row.name || item.regency === row.name,
          )
            ? "Wilayah masih dipakai sekolah terdampak. Ubah data sekolah dulu."
            : null
        }
        rows={masterRegionRows}
        title="Master Wilayah"
      />
    ) : active === "Master Jenis Bencana" ? (
      <MasterDataPage
        columns={[
          { key: "code", label: "Kode" },
          { key: "name", label: "Jenis Bencana" },
          { key: "category", label: "Kategori" },
          { key: "status", label: "Status" },
        ]}
        description="Klasifikasi jenis bencana untuk pelaporan sekolah terdampak."
        idKey="code"
        onChange={setMasterDisasterRows}
        relatedMessage={(row) =>
          schools.some((item) => item.disaster === row.name)
            ? "Jenis bencana masih dipakai sekolah terdampak. Ubah data sekolah dulu."
            : null
        }
        rows={masterDisasterRows}
        title="Master Jenis Bencana"
      />
    ) : active === "Master Barang" ? (
      <MasterGoodsPage />
    ) : active === "Master Menu Bantuan" ? (
      <MasterPackagePage
        packages={packages}
        onChange={setPackages}
        onAssign={() => setActive("Penetapan Bantuan")}
      />
    ) : active === "Penandatanganan" ? (
      <SignerSettingsPage onChange={setSigners} signers={signers} />
    ) : active === "Template Pakta" ? (
      <StatementTemplatePage
        defaultStatement={defaultPaktaStatement}
        description="Semua pakta integritas menginduk ke template. Default memakai template dengan ID terkecil. Ubah pernyataan di sini agar semua dokumen ikut berubah."
        heading="Template Pakta"
        noun="pakta"
        onChange={setPaktaTemplates}
        templates={paktaTemplates}
      />
    ) : active === "Template SPTJM" ? (
      <StatementTemplatePage
        defaultStatement={defaultSptjmStatement}
        description="Semua SPTJM menginduk ke template ID pertama. Tulis seluruh poin dalam satu kolom. Ubah pernyataan di sini agar semua dokumen ikut berubah. Gunakan {tahun} jika tahun anggaran perlu menyesuaikan draf."
        heading="Template SPTJM"
        noun="SPTJM"
        onChange={setSptjmTemplates}
        templates={sptjmTemplates}
      />
    ) : active === "RAB" ? (
      <RabPage
        canReview
        docUploads={docUploads}
        mode="admin"
        onChangeDocUploads={setDocUploads}
        packages={packages}
        reviewerName={reviewerName}
        signers={signers}
      />
    ) : active === "Pakta Integritas" ? (
      <PaktaPage
        canReview
        docUploads={docUploads}
        mode="admin"
        onChangeDocUploads={setDocUploads}
        reviewerName={reviewerName}
        signers={signers}
        templates={paktaTemplates}
      />
    ) : active === "Kwitansi" ? (
      <KwitansiPage
        canReview
        docUploads={docUploads}
        mode="admin"
        onChangeDocUploads={setDocUploads}
        packages={packages}
        reviewerName={reviewerName}
        signers={signers}
      />
    ) : active === "SPTJM" ? (
      <SptjmPage
        canReview
        docUploads={docUploads}
        mode="admin"
        onChangeDocUploads={setDocUploads}
        reviewerName={reviewerName}
        signers={signers}
        templates={sptjmTemplates}
      />
    ) : active === "Pelaporan/LPJ" ? (
      <PelaporanLpjPage
        docUploads={docUploads}
        mode="admin"
        onChangeDocUploads={setDocUploads}
      />
    ) : active === "PKS" ? (
      <PksPage
        canReview
        docUploads={docUploads}
        onChangeDocUploads={setDocUploads}
        reviewerName={reviewerName}
        signers={signers}
      />
    ) : (
      <ModulePage name={active} />
    )

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink">
      <Sidebar
        active={active}
        onNavigate={setActive}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="min-h-screen lg:pl-72">
        <Header
          logoutLabel={`Keluar dari portal ${reviewerRole.toLowerCase()}`}
          onLogout={() => setAppMode("login")}
          onMenu={() => setSidebarOpen(true)}
          title={active}
          userName={reviewerName}
          userRole={reviewerRole}
        />
        <main className="p-5 md:p-8">{content}</main>
      </div>
    </div>
  )
}
