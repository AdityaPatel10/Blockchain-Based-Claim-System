# Blockchain-Based Claim System

## Domain: Insurance

### Description

A blockchain-based system designed to securely and efficiently verify and process insurance claims.

### Hardware/Software

- **Frontend:** Next.js (TypeScript, TailwindCSS, ShadCN)
- **Backend:** NeonDB (PostgreSQL), Prisma ORM
- **Authentication:** Clerk
- **Blockchain Contract:** Solidity

### Technology

The system leverages blockchain technology to:

- Speed up claims processing
- Enhance data security and authenticity

### Objective

- **Secure Transactions:** Ensure claim authenticity
- **Automation:** Streamline claim verification workflows

### Targeted Outcomes

1. **Faster Processing:** Reduce delays in claim approvals
2. **Transparency:** Enhance trust in the claims process
3. **Cost Efficiency:** Lower administrative expenses
4. **Automation:** Streamline claim workflows

---

## Solidity Smart Contract

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ClaimSystem {
    enum ClaimStatus { Submitted, UnderReview, Approved, Rejected }

    struct Claim {
        string policyNumber;
        string claimType;
        string description;
        uint256 amount;
        ClaimStatus status;
        address claimant;
    }

    mapping(uint256 => Claim) public claims;
    uint256 public claimCounter;

    event ClaimSubmitted(uint256 indexed claimId, address indexed claimant);
    event ClaimStatusUpdated(uint256 indexed claimId, ClaimStatus newStatus);

    function submitClaim(string memory _policyNumber, string memory _claimType, string memory _description, uint256 _amount) public returns (uint256) {
        claimCounter++;
        claims[claimCounter] = Claim({
            policyNumber: _policyNumber,
            claimType: _claimType,
            description: _description,
            amount: _amount,
            status: ClaimStatus.Submitted,
            claimant: msg.sender
        });

        emit ClaimSubmitted(claimCounter, msg.sender);
        return claimCounter;
    }

    function updateClaimStatus(uint256 _claimId, ClaimStatus _newStatus) public {
        require(_claimId <= claimCounter, "Invalid claim ID");
        claims[_claimId].status = _newStatus;
        emit ClaimStatusUpdated(_claimId, _newStatus);
    }

    function getClaimStatus(uint256 _claimId) public view returns (ClaimStatus) {
        require(_claimId <= claimCounter, "Invalid claim ID");
        return claims[_claimId].status;
    }

    function getClaim(uint256 _claimId) public view returns (Claim memory) {
        require(_claimId <= claimCounter, "Invalid claim ID");
        return claims[_claimId];
    }
}
```

---

## Prisma Schema

```prisma
datasource db {
    provider = "postgresql"
    url      = env("DATABASE_URL")
}

generator client {
    provider = "prisma-client-js"
}

model User {
    id        String   @id
    email     String   @unique
    name      String?
    claims    Claim[]
    createdAt DateTime @default(now())
    updatedAt DateTime @updatedAt
}

model Claim {
    id              String   @id @default(cuid())
    transactionHash String   @unique
    policyNumber    String
    claimType       String
    description     String
    amount          Float
    status          String
    userId          String
    user            User     @relation(fields: [userId], references: [id])
    createdAt       DateTime @default(now())
    updatedAt       DateTime @updatedAt
}
```

---

## Installation and Deployment

### Installation Commands

```bash
# Clone the repository
git clone <repository_url>
cd <project_directory>

# Install dependencies
npm install

# Set up Prisma database
npx prisma generate
npx prisma db push

# Start development server
npm run dev
```

### Hardhat Deployment

```bash
# Install Hardhat and dependencies
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox

# Compile the smart contracts
npx hardhat node

# Deploy to the default network
npx hardhat run scripts/deploy.js
```

---

## Default Hardhat Network Configuration

```javascript
/* eslint-disable @typescript-eslint/no-require-imports */
require("@nomicfoundation/hardhat-toolbox");

const infuraProjectId = "46774284d91340bcb320d96207b81db8";
const PRIVATE_KEY =
  "ae01353949a41c233aaa8130ca12477d7a761ba0a180d8601cdc1790ba9a70f1";

module.exports = {
  defaultNetwork: "localhost",
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545",
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${infuraProjectId}`,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
    zksyncSepolia: {
      url: "https://sepolia.era.zksync.dev",
      accounts: [PRIVATE_KEY],
      chainId: 300,
      gasPrice: "auto",
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${infuraProjectId}`,
      accounts: [PRIVATE_KEY],
      chainId: 5,
    },
    mumbai: {
      url: `https://polygon-mumbai.infura.io/v3/${infuraProjectId}`,
      accounts: [PRIVATE_KEY],
      chainId: 80001,
      gasPrice: "auto",
    },
  },
  solidity: "0.8.28",
};
```
