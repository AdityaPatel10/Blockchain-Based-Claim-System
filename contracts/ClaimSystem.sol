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