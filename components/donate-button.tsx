"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DonateModal } from "@/components/donate-modal"

// Client component for the donate button to avoid useState in server component

function DonateButton({ projectId, projectTitle, projectOwnerWallet }: { projectId: string; projectTitle: string, projectOwnerWallet: string }) {
    const [showDonateModal, setShowDonateModal] = useState(false)
    console.log("Project ID:", projectOwnerWallet)
  
    return (
      <>
        <Button className="w-full" size="lg" onClick={() => setShowDonateModal(true)}>
          Donate Now
        </Button>
        <DonateModal
          open={showDonateModal}
          onClose={() => setShowDonateModal(false)}
          projectId={projectId}
          projectTitle={projectTitle}   
          projectOwnerWallet={projectOwnerWallet} // Pass the wallet address to the modal   
          />
      </>
    )
  }

export { DonateButton }