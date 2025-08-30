export type LocalUser = {
  id: string
  email: string
  password: string // NOTE: stored in plain text locally for demo purposes only
  firstName?: string
  lastName?: string
  createdAt: string
}

export type LocalProfile = {
  userId: string
  displayName: string
  bio: string
  university?: string
  major?: string
  skillsOffered: string[]
  skillsNeeded: string[]
  updatedAt: string
}

const USERS_KEY = "skillecho_users"
const SESSION_KEY = "skillecho_session"
const PROFILES_KEY = "skillecho_profiles"

function isBrowser() {
  return typeof window !== "undefined"
}

function readJSON<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function writeJSON<T>(key: string, value: T) {
  if (!isBrowser()) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // ignore
  }
}

function uuid() {
  if (isBrowser() && "crypto" in window && "randomUUID" in crypto) {
    return (crypto as any).randomUUID()
  }
  return `id_${Date.now()}_${Math.random().toString(16).slice(2)}`
}

// Users
function getUsers(): LocalUser[] {
  return readJSON<LocalUser[]>(USERS_KEY, [])
}

function saveUsers(users: LocalUser[]) {
  writeJSON(USERS_KEY, users)
}

// Session
type Session = { userId: string }
function getSession(): Session | null {
  return readJSON<Session | null>(SESSION_KEY, null)
}
function setSession(s: Session | null) {
  if (s) writeJSON(SESSION_KEY, s)
  else if (isBrowser()) window.localStorage.removeItem(SESSION_KEY)
}

export function getCurrentUser(): LocalUser | null {
  const s = getSession()
  if (!s) return null
  const users = getUsers()
  return users.find((u) => u.id === s.userId) || null
}

export function logout() {
  setSession(null)
}

// Auth API
export function signup(params: { email: string; password: string; firstName?: string; lastName?: string }): LocalUser {
  const { email, password, firstName, lastName } = params
  const users = getUsers()
  const exists = users.some((u) => u.email.toLowerCase() === email.toLowerCase())
  if (exists) {
    throw new Error("An account with this email already exists.")
  }
  const user: LocalUser = {
    id: uuid(),
    email,
    password, // not secure; demo purpose only
    firstName,
    lastName,
    createdAt: new Date().toISOString(),
  }
  users.push(user)
  saveUsers(users)
  setSession({ userId: user.id })
  return user
}

export function login(email: string, password: string): LocalUser {
  const users = getUsers()
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (!user || user.password !== password) {
    throw new Error("Invalid email or password.")
  }
  setSession({ userId: user.id })
  return user
}

// Profiles
function getProfiles(): Record<string, LocalProfile> {
  return readJSON<Record<string, LocalProfile>>(PROFILES_KEY, {})
}
function saveProfiles(map: Record<string, LocalProfile>) {
  writeJSON(PROFILES_KEY, map)
}

export function getProfile(userId: string): LocalProfile | null {
  const map = getProfiles()
  return map[userId] || null
}

export function upsertProfile(userId: string, profile: Omit<LocalProfile, "userId" | "updatedAt">): LocalProfile {
  const map = getProfiles()
  const updated: LocalProfile = {
    ...profile,
    userId,
    updatedAt: new Date().toISOString(),
  }
  map[userId] = updated
  saveProfiles(map)
  return updated
}
