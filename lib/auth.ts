// Local authentication utilities
export interface User {
  id: string
  name: string
  password: string
  createdAt: string
}

export interface FormSubmission {
  id: string
  userId: string
  userName: string
  submittedAt: string
  data: TransportationCostData
}

export interface TransportationCostData {
  date?: string // ว/ด/ป
  startingMileage?: number // เลขไมล์เรี่มต้น
  endingMileage?: number // เลขไมล์สิ้นสุด
  distance?: number // ระยะทางที่ถึง(กม.)
  fuelRefilled?: number // เติมน้ำมัน(ลิตร)
  pricePerLiter?: number // ราคา/ลิตร( บาท)
  totalAmount?: number // รวมเป็นเงิน(บาท)
  fuelConsumptionRate?: number // อัตราสิ้นเปลือง(กม./ลิตร)
  activity?: string // กิจกรรมที่ปฏิบัติงาน
  notes?: string // หมายเหตุ
  [key: string]: any
}

// Initialize default admin user if none exists
export function initializeUsers() {
  if (typeof window === "undefined") return

  const usersStr = localStorage.getItem("users")
  if (!usersStr) {
    // No users exist, create default users
    const defaultUsers: User[] = [
      {
        id: "1",
        name: "admin",
        password: "admin123",
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Jaguar",
        password: "jaguar123",
        createdAt: new Date().toISOString(),
      },
    ]
    localStorage.setItem("users", JSON.stringify(defaultUsers))
  } else {
    // Users exist, check if Jaguar needs to be added
    const users: User[] = JSON.parse(usersStr)
    const jaguarExists = users.some(u => u.name === "Jaguar")
    
    if (!jaguarExists) {
      // Add Jaguar to existing users
      users.push({
        id: "2",
        name: "Jaguar",
        password: "jaguar123",
        createdAt: new Date().toISOString(),
      })
      localStorage.setItem("users", JSON.stringify(users))
    }
  }
}

export function authenticateUser(name: string, password: string): User | null {
  if (typeof window === "undefined") return null

  const users = JSON.parse(localStorage.getItem("users") || "[]") as User[]
  const user = users.find((u) => u.name === name && u.password === password)

  if (user) {
    // Store current session
    localStorage.setItem("currentUser", JSON.stringify(user))
    return user
  }

  return null
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const user = localStorage.getItem("currentUser")
  return user ? JSON.parse(user) : null
}

export function logout() {
  if (typeof window === "undefined") return
  localStorage.removeItem("currentUser")
}

export function getAllUsers(): User[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem("users") || "[]")
}

export function addUser(name: string, password: string): User {
  if (typeof window === "undefined") throw new Error("Cannot add user on server")

  const users = getAllUsers()
  const newUser: User = {
    id: Date.now().toString(),
    name,
    password,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  localStorage.setItem("users", JSON.stringify(users))
  return newUser
}

// Form submission functions
export function saveFormSubmission(userId: string, userName: string, data: TransportationCostData) {
  if (typeof window === "undefined") return

  const submissions = getAllSubmissions()
  const newSubmission: FormSubmission = {
    id: Date.now().toString(),
    userId,
    userName,
    submittedAt: new Date().toISOString(),
    data,
  }

  submissions.push(newSubmission)
  localStorage.setItem("formSubmissions", JSON.stringify(submissions))
}

export function getAllSubmissions(): FormSubmission[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem("formSubmissions") || "[]")
}

export function getUserSubmissions(userId: string): FormSubmission[] {
  return getAllSubmissions().filter((s) => s.userId === userId)
}
