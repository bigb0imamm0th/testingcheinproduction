"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getCurrentUser, saveFormSubmission, type TransportationCostData } from "@/lib/auth"

export default function FormPage() {
  const [user, setUser] = useState(getCurrentUser())
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState<TransportationCostData>({
    date: "",
    startingMileage: 0,
    endingMileage: 0,
    distance: 0,
    fuelRefilled: 0,
    pricePerLiter: 0,
    totalAmount: 0,
    fuelConsumptionRate: 0,
    activity: "",
    notes: "",
  })

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser) {
      router.push("/")
    } else {
      setUser(currentUser)
    }
  }, [router])

  // Calculate distance from starting and ending mileage
  const calculateDistance = (start: number, end: number) => {
    return Math.max(0, end - start)
  }

  // Calculate total amount
  const calculateTotalAmount = (fuel: number, price: number) => {
    return fuel * price
  }

  // Calculate fuel consumption rate
  const calculateFuelConsumptionRate = (distance: number, fuel: number) => {
    if (fuel === 0) return 0
    return distance / fuel
  }

  // Update form data and auto-calculate derived fields
  const updateFormData = (field: keyof TransportationCostData, value: any) => {
    const updated = { ...formData, [field]: value }

    // Auto-calculate distance if mileage changes
    if (field === "startingMileage" || field === "endingMileage") {
      const start = field === "startingMileage" ? value : updated.startingMileage || 0
      const end = field === "endingMileage" ? value : updated.endingMileage || 0
      updated.distance = calculateDistance(start, end)
    }

    // Auto-calculate total amount if fuel or price changes
    if (field === "fuelRefilled" || field === "pricePerLiter") {
      const fuel = field === "fuelRefilled" ? value : updated.fuelRefilled || 0
      const price = field === "pricePerLiter" ? value : updated.pricePerLiter || 0
      updated.totalAmount = calculateTotalAmount(fuel, price)
    }

    // Auto-calculate fuel consumption rate if distance or fuel changes
    if (field === "distance" || field === "fuelRefilled" || field === "startingMileage" || field === "endingMileage") {
      const dist = updated.distance || 0
      const fuel = updated.fuelRefilled || 0
      updated.fuelConsumptionRate = calculateFuelConsumptionRate(dist, fuel)
    }

    setFormData(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    if (user) {
      try {
        // Save to local storage (existing behavior)
        saveFormSubmission(user.id, user.name, formData)

        // Send to Google Sheets with user information
        const response = await fetch('/api/sheets', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            action: 'append',
            data: formData,
            userId: user.id,
            userName: user.name,
          }),
        })

        const result = await response.json()

        if (result.success) {
          alert(`บันทึกข้อมูลสำเร็จ! ข้อมูลถูกบันทึกลงในแท็บ "${result.sheetName}" แถว ${result.row}`)
          // Reset form after successful submission
          setFormData({
            date: "",
            startingMileage: 0,
            endingMileage: 0,
            distance: 0,
            fuelRefilled: 0,
            pricePerLiter: 0,
            totalAmount: 0,
            fuelConsumptionRate: 0,
            activity: "",
            notes: "",
          })
        } else {
          const errorMsg = result.error?.includes('already filled') 
            ? `แถว A8-A38 ในแท็บ "${result.sheetName}" ถูกใช้หมดแล้ว กรุณาติดต่อผู้ดูแลระบบ`
            : `บันทึกข้อมูลในเครื่องสำเร็จ แต่เกิดข้อผิดพลาดในการบันทึกลง Google Sheets: ${result.error}`
          alert(errorMsg)
        }
      } catch (error: any) {
        console.error('Error submitting form:', error)
        const errorMsg = error.message?.includes('already filled')
          ? `แถว A8-A38 ใน Google Sheets ถูกใช้หมดแล้ว กรุณาติดต่อผู้ดูแลระบบ`
          : 'บันทึกข้อมูลในเครื่องสำเร็จ แต่เกิดข้อผิดพลาดในการบันทึกลง Google Sheets'
        alert(errorMsg)
      } finally {
        setIsSubmitting(false)
      }
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
          <Button variant="outline" onClick={() => router.push("/dashboard")} size="default">
            Back to Dashboard
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-4 py-6 md:py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl md:text-lg">แบบฟอร์มบันทึกค่าใช้จ่ายการขนส่ง</CardTitle>
            <CardDescription className="text-base md:text-sm">กรุณากรอกข้อมูลการบันทึกค่าใช้จ่ายการขนส่ง</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Date - ว/ด/ป */}
                <div className="space-y-2">
                  <Label htmlFor="date">ว/ด/ป</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => updateFormData("date", e.target.value)}
                    required
                  />
                </div>

                {/* Starting Mileage - เลขไมล์เรี่มต้น */}
                <div className="space-y-2">
                  <Label htmlFor="startingMileage">เลขไมล์เรี่มต้น</Label>
                  <Input
                    id="startingMileage"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.startingMileage || ""}
                    onChange={(e) => updateFormData("startingMileage", Number.parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                {/* Ending Mileage - เลขไมล์สิ้นสุด */}
                <div className="space-y-2">
                  <Label htmlFor="endingMileage">เลขไมล์สิ้นสุด</Label>
                  <Input
                    id="endingMileage"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.endingMileage || ""}
                    onChange={(e) => updateFormData("endingMileage", Number.parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                {/* Distance - ระยะทางที่ถึง(กม.) */}
                <div className="space-y-2">
                  <Label htmlFor="distance">ระยะทางที่ถึง(กม.)</Label>
                  <Input
                    id="distance"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.distance || ""}
                    onChange={(e) => updateFormData("distance", Number.parseFloat(e.target.value) || 0)}
                    required
                    readOnly
                    className="bg-muted"
                  />
                </div>

                {/* Fuel Refilled - เติมน้ำมัน(ลิตร) */}
                <div className="space-y-2">
                  <Label htmlFor="fuelRefilled">เติมน้ำมัน(ลิตร)</Label>
                  <Input
                    id="fuelRefilled"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.fuelRefilled || ""}
                    onChange={(e) => updateFormData("fuelRefilled", Number.parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                {/* Price Per Liter - ราคา/ลิตร( บาท) */}
                <div className="space-y-2">
                  <Label htmlFor="pricePerLiter">ราคา/ลิตร( บาท)</Label>
                  <Input
                    id="pricePerLiter"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.pricePerLiter || ""}
                    onChange={(e) => updateFormData("pricePerLiter", Number.parseFloat(e.target.value) || 0)}
                    required
                  />
                </div>

                {/* Total Amount - รวมเป็นเงิน(บาท) */}
                <div className="space-y-2">
                  <Label htmlFor="totalAmount">รวมเป็นเงิน(บาท)</Label>
                  <Input
                    id="totalAmount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.totalAmount?.toFixed(2) || ""}
                    readOnly
                    className="bg-muted"
                  />
                </div>

                {/* Fuel Consumption Rate - อัตราสิ้นเปลือง(กม./ลิตร) */}
                <div className="space-y-2">
                  <Label htmlFor="fuelConsumptionRate">อัตราสิ้นเปลือง(กม./ลิตร)</Label>
                  <Input
                    id="fuelConsumptionRate"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.fuelConsumptionRate?.toFixed(2) || ""}
                    readOnly
                    className="bg-muted"
                  />
                </div>
              </div>

              {/* Activity - กิจกรรมที่ปฏิบัติงาน */}
              <div className="space-y-2 md:space-y-2">
                <Label htmlFor="activity">กิจกรรมที่ปฏิบัติงาน</Label>
                <Input
                  id="activity"
                  placeholder="ระบุกิจกรรมที่ปฏิบัติงาน"
                  value={formData.activity}
                  onChange={(e) => updateFormData("activity", e.target.value)}
                />
              </div>

              {/* Notes - หมายเหตุ */}
              <div className="space-y-2 md:space-y-2">
                <Label htmlFor="notes">หมายเหตุ</Label>
                <Textarea
                  id="notes"
                  placeholder="หมายเหตุเพิ่มเติม (ถ้ามี)"
                  value={formData.notes}
                  onChange={(e) => updateFormData("notes", e.target.value)}
                  rows={4}
                />
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
