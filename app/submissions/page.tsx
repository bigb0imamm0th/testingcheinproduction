"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getCurrentUser, getUserSubmissions, type FormSubmission } from "@/lib/auth"

export default function SubmissionsPage() {
  const [user, setUser] = useState(getCurrentUser())
  const [submissions, setSubmissions] = useState<FormSubmission[]>([])
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/")
    } else {
      setUser(currentUser)
      setSubmissions(getUserSubmissions(currentUser.id))
    }
  }, [router])

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <header className="border-b bg-background">
        <div className="container mx-auto px-4 md:px-4 py-4 md:py-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-xl font-bold">Chein Production & Products</h1>
          <Button variant="outline" onClick={() => router.push("/dashboard")} size="default">
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-4 py-6 md:py-8">
        <Card className="max-w-6xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl md:text-lg">ข้อมูลที่บันทึก</CardTitle>
            <CardDescription className="text-base md:text-sm">ดูข้อมูลการบันทึกค่าใช้จ่ายการขนส่งทั้งหมด</CardDescription>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">ยังไม่มีข้อมูลที่บันทึก</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>วันที่บันทึก</TableHead>
                      <TableHead>ว/ด/ป</TableHead>
                      <TableHead>เลขไมล์เริ่มต้น</TableHead>
                      <TableHead>เลขไมล์สิ้นสุด</TableHead>
                      <TableHead>ระยะทาง(กม.)</TableHead>
                      <TableHead>เติมน้ำมัน(ลิตร)</TableHead>
                      <TableHead>ราคา/ลิตร(บาท)</TableHead>
                      <TableHead>รวมเป็นเงิน(บาท)</TableHead>
                      <TableHead>อัตราสิ้นเปลือง(กม./ลิตร)</TableHead>
                      <TableHead>กิจกรรม</TableHead>
                      <TableHead>หมายเหตุ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow key={submission.id}>
                        <TableCell>{new Date(submission.submittedAt).toLocaleDateString("th-TH")}</TableCell>
                        <TableCell>{submission.data.date ? new Date(submission.data.date).toLocaleDateString("th-TH") : "-"}</TableCell>
                        <TableCell>{submission.data.startingMileage?.toFixed(2) || "-"}</TableCell>
                        <TableCell>{submission.data.endingMileage?.toFixed(2) || "-"}</TableCell>
                        <TableCell>{submission.data.distance?.toFixed(2) || "-"}</TableCell>
                        <TableCell>{submission.data.fuelRefilled?.toFixed(2) || "-"}</TableCell>
                        <TableCell>{submission.data.pricePerLiter?.toFixed(2) || "-"}</TableCell>
                        <TableCell>{submission.data.totalAmount?.toFixed(2) || "-"}</TableCell>
                        <TableCell>{submission.data.fuelConsumptionRate?.toFixed(2) || "-"}</TableCell>
                        <TableCell className="max-w-xs truncate">{submission.data.activity || "-"}</TableCell>
                        <TableCell className="max-w-xs truncate">{submission.data.notes || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
