# PublicFund - Web3 Quadratic Funding Platform

PublicFund is a decentralized platform that leverages **quadratic funding** to amplify the impact of donations. Built on the **Solana blockchain**, it allows users to stake their SOL tokens to generate $FUND SPL tokens, which can then be used to donate to various projects. The platform ensures transparency and fairness by distributing funds using the quadratic funding formula.

---

## Features

### 1. **Stake SOL to Earn $FUND**
- Users can connect their Solana wallet (e.g., Phantom) to the platform.
- Stake SOL tokens to earn $FUND SPL tokens as rewards.
- $FUND tokens are used as the primary currency for donations on the platform.

### 2. **Donate to Projects**
- Users can browse and explore various projects (e.g., environmental initiatives, education programs, renewable energy projects).
- Donate $FUND tokens to projects of their choice.
- Donations are amplified using the **quadratic funding formula**, ensuring smaller contributions from many donors have a greater impact.

### 3. **Quadratic Funding**
- Quadratic funding ensures that projects with broader community support receive more matching funds.
- Donations are matched from a funding pool based on the number of unique contributors and the amount donated.

### 4. **KYC Verification**
- Users must complete **KYC (Know Your Customer)** verification to participate in staking and donations.
- This ensures compliance with regulations and prevents misuse of the platform.

### 5. **Transparency**
- All transactions are recorded on the **Solana blockchain** for complete transparency.
- Users can view donation history, project updates, and analytics.

---

## How It Works

### 1. **Connect Wallet**
- Users connect their Solana wallet (e.g., Phantom) to the platform.
- Wallet connection is required to stake SOL, earn $FUND, and donate to projects.

### 2. **Stake SOL**
- Stake SOL tokens through the staking interface.
- Earn $FUND SPL tokens as staking rewards.

### 3. **Complete KYC Verification**
- Complete the KYC process to unlock all platform features.
- Upload required documents and verify your identity.

### 4. **Explore Projects**
- Browse projects listed on the platform.
- View project details, including descriptions, funding goals, and updates.

### 5. **Donate $FUND**
- Use earned $FUND tokens to donate to projects.
- Donations are matched using the quadratic funding formula.

### 6. **Track Impact**
- View donation history and project analytics.
- Track how your contributions are making a difference.

---

## Project Structure

### **Frontend**
- Built with **Next.js** for a modern, server-rendered React experience.
- **Tailwind CSS** is used for styling, ensuring a responsive and visually appealing UI.

### **Backend**
- **MongoDB** is used as the database to store project and user data.
- **Solana Web3.js** and **SPL Token** libraries are used to interact with the Solana blockchain.

### **Smart Contracts**
- The staking and donation logic is implemented using **Anchor**, a framework for Solana smart contracts.
- SPL tokens ($FUND) are managed using the **SPL Token Program**.

---

## Key Components

### 1. **Staking**
- Users stake SOL tokens to earn $FUND SPL tokens.
- The staking logic is implemented in the `stake` Anchor program.

### 2. **Donations**
- Users donate $FUND tokens to projects.
- The donation logic ensures funds are distributed using the quadratic funding formula.

### 3. **KYC Verification**
- Users must complete KYC verification to participate.
- The KYC process includes uploading documents and verifying identity.

### 4. **Projects**
- Projects are listed with details such as title, description, funding goal, and updates.
- Users can view project analytics and community comments.

---

## Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Solana CLI** (for deploying smart contracts)

### Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-repo/publicfund.git
   cd publicfund