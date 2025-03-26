import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Donation {
  id: string
  projectId: string
  projectTitle: string
  amount: number
  date: string
  txHash: string
}

interface DonationHistoryProps {
  donations: Donation[]
}

export function DonationHistory({ donations }: DonationHistoryProps) {
  if (!donations || donations.length === 0) {
    return <div className="text-center py-8 text-muted-foreground">No donations yet</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Project</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Transaction</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {donations.map((donation) => (
          <TableRow key={donation.id}>
            <TableCell>
              <Link href={`/projects/${donation.projectId}`} className="font-medium hover:underline">
                {donation.projectTitle}
              </Link>
            </TableCell>
            <TableCell className="text-right">${donation.amount}</TableCell>
            <TableCell>{new Date(donation.date).toLocaleDateString()}</TableCell>
            <TableCell className="font-mono text-xs">
              <a
                href={`https://solscan.io/tx/${donation.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {donation.txHash.substring(0, 8)}...{donation.txHash.substring(donation.txHash.length - 6)}
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

