import { WalletAuthProvider } from '@/components/wallet-auth-provider';
import { SafeContextProvider } from '@/context/safe-context-provider';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletAuthProvider>{children}</WalletAuthProvider>
      </body>
    </html>
  );
}