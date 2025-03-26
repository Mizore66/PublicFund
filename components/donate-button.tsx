"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DonateModal } from "@/components/donate-modal"

// Client component for the donate button to avoid useState in server component

function DonateButton({ projectId, projectTitle }: { projectId: string; projectTitle: string }) {
    const [showDonateModal, setShowDonateModal] = useState(false)
  
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
        />
      </>
    )
  }

export { DonateButton }