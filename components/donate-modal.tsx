"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DonateModalProps {
  open: boolean
  onClose: () => void
  projectId: string
  projectTitle: string
}

export function DonateModal({ open, onClose, projectId, projectTitle }: DonateModalProps) {
  const [amount, setAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleDonate = () => {
    // In a real app, this would interact with a smart contract
    setIsProcessing(true)

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)

      // Reset and close after showing success
      setTimeout(() => {
        setIsSuccess(false)
        setAmount("")
        onClose()
      }, 2000)
    }, 1500)
  }

  const presetAmounts = [5, 10, 25, 50, 100]

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Donate to {projectTitle}</DialogTitle>
          <DialogDescription>
            Your donation will be matched according to the quadratic funding formula.
          </DialogDescription>
        </DialogHeader>
        {!isSuccess ? (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-5 gap-2">
                {presetAmounts.map((preset) => (
                  <Button
                    key={preset}
                    variant={amount === preset.toString() ? "default" : "outline"}
                    onClick={() => setAmount(preset.toString())}
                  >
                    ${preset}
                  </Button>
                ))}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="amount">Custom amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
              <div className="rounded-lg bg-muted p-4">
                <h4 className="mb-2 font-medium">Donation Impact</h4>
                <p className="text-sm text-muted-foreground">
                  Your donation of ${amount || "0"} could result in a match of up to $
                  {amount ? (Number.parseFloat(amount) * 3).toFixed(2) : "0"} based on the number of other contributors.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleDonate} disabled={!amount || isProcessing || Number.parseFloat(amount) <= 0}>
                {isProcessing ? "Processing..." : "Donate"}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6">
            <div className="rounded-full bg-green-100 p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 text-green-600"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3 className="mt-4 text-lg font-medium">Donation Successful!</h3>
            <p className="mt-2 text-center text-sm text-muted-foreground">
              Thank you for your donation of ${amount} to {projectTitle}.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

