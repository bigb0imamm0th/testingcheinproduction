"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getCurrentUser, logout, type User } from "@/lib/auth"

interface MenuBox {
  id: string
  title: string
  route: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/")
    } else {
      setUser(currentUser)
    }
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const menuBoxes: MenuBox[] = [
    {
      id: "1",
      title: "รายงานบันทึกการใช้รถยนต์",
      route: "/form",
    },
    {
      id: "2",
      title: "เมนู 2",
      route: "#",
    },
    {
      id: "3",
      title: "เมนู 3",
      route: "#",
    },
    {
      id: "4",
      title: "เมนู 4",
      route: "#",
    },
    {
      id: "5",
      title: "เมนู 5",
      route: "#",
    },
    {
      id: "6",
      title: "เมนู 6",
      route: "#",
    },
    {
      id: "7",
      title: "เมนู 7",
      route: "#",
    },
    {
      id: "8",
      title: "เมนู 8",
      route: "#",
    },
    {
      id: "9",
      title: "เมนู 9",
      route: "#",
    },
    {
      id: "10",
      title: "เมนู 10",
      route: "#",
    },
  ]

  const handleBoxClick = (route: string) => {
    if (route !== "#") {
      router.push(route)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 md:px-4 py-4 md:py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-xl font-bold">Chein Production & Products</h1>
          <div className="flex items-center gap-3 md:gap-4">
            <span className="text-base md:text-sm text-muted-foreground hidden sm:inline">Welcome, {user.name}</span>
            <Button variant="outline" onClick={handleLogout} size="default">
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-4 py-6 md:py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 max-w-7xl mx-auto">
          {menuBoxes.map((box) => (
            <Card
              key={box.id}
              className="aspect-square cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary"
              onClick={() => handleBoxClick(box.route)}
            >
              <CardContent className="flex items-center justify-center h-full p-3 md:p-4">
                <h3 className="text-center font-medium text-base md:text-sm">{box.title}</h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  )
}
