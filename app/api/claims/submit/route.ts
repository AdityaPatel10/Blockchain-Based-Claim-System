import { NextResponse, NextRequest } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { ethers } from "ethers";
import prisma from "@/lib/prisma";
import ClaimSystemABI from "@/lib/ClaimSystemABI.json";

const CONTRACT_ADDRESS = process.env.CLAIM_SYSTEM_CONTRACT_ADDRESS!;
const PROVIDER_URL = process.env.ETHEREUM_PROVIDER_URL!;
const PRIVATE_KEY = process.env.PRIVATE_KEY!;

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Validate environment variables
  if (!CONTRACT_ADDRESS || !PROVIDER_URL || !PRIVATE_KEY) {
    return NextResponse.json(
      { error: "Environment variables not set" },
      { status: 500 }
    );
  }

  try {
    const { policyNumber, claimType, description, amount } = await req.json();

    // Validate input
    if (!policyNumber || !claimType || !description || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Blockchain interaction
    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

    // Log wallet address and balance for debugging
    const walletAddress = wallet.address;
    const balance = await provider.getBalance(walletAddress);
    console.log(`Wallet address: ${walletAddress}`);
    console.log(`Wallet balance: ${ethers.formatEther(balance)} ETH`);

    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      ClaimSystemABI,
      wallet
    );

    // Estimate gas before sending transaction
    try {
      const gasEstimate = await contract.submitClaim.estimateGas(
        policyNumber,
        claimType,
        description,
        ethers.parseEther(amount.toString())
      );

      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice || BigInt(0);
      const estimatedCost = gasEstimate * gasPrice;

      if (balance < estimatedCost) {
        console.error(
          `Insufficient funds. Need ${ethers.formatEther(
            estimatedCost
          )} ETH, have ${ethers.formatEther(balance)} ETH`
        );
        return NextResponse.json(
          {
            error: "Insufficient funds in contract owner wallet",
            details: {
              required: ethers.formatEther(estimatedCost),
              available: ethers.formatEther(balance),
              walletAddress,
            },
          },
          { status: 500 }
        );
      }

      // Proceed with transaction
      const tx = await contract.submitClaim(
        policyNumber,
        claimType,
        description,
        ethers.parseEther(amount.toString()),
        {
          gasLimit: Math.ceil(Number(gasEstimate) * 1.2), // Add 20% buffer for safety
          maxFeePerGas: feeData.maxFeePerGas,
          maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
        }
      );

      console.log("Transaction hash:", tx.hash);
      const receipt = await tx.wait();

      // Store claim in database
      const claim = await prisma.claim.create({
        data: {
          transactionHash: receipt.hash,
          policyNumber,
          claimType,
          description,
          amount: parseFloat(amount),
          status: "Submitted",
          userId,
        },
      });

      return NextResponse.json({
        success: true,
        claimId: claim.id,
        transactionHash: receipt.hash,
      });
    } catch (error) {
      console.error("Transaction error:", error);
      return NextResponse.json(
        {
          error: "Failed to process transaction",
          details: (error as Error).message,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error submitting claim:", error);
    return NextResponse.json(
      { error: "Failed to submit claim", details: (error as Error).message },
      { status: 500 }
    );
  }
}
