import { NextResponse, NextRequest } from "next/server";
import { ethers } from "ethers";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import ClaimSystemABI from "@/lib/ClaimSystemABI.json";

const CONTRACT_ADDRESS = process.env.CLAIM_SYSTEM_CONTRACT_ADDRESS;
const PROVIDER_URL = process.env.ETHEREUM_PROVIDER_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { policyNumber, claimType, description, amount } = await req.json();

    const provider = new ethers.JsonRpcProvider(PROVIDER_URL);
    const wallet = new ethers.Wallet(PRIVATE_KEY!, provider);
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS!,
      ClaimSystemABI,
      wallet
    );

    const tx = await contract.submitClaim(
      policyNumber,
      claimType,
      description,
      ethers.parseEther(amount)
    );
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
    console.error("Error submitting claim:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit claim" },
      { status: 500 }
    );
  }
}
