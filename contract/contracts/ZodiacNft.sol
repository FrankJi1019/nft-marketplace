// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "base64-sol/base64.sol";

error ZodiacNft__YearOutOfRange();
error ZodiacNft__NftAlreadyExist();
error ZodiacNft__NftNotExist();

contract ZodiacNft is ERC721 {

    string[12] private imageUrls = [
        "ipfs://QmVzieMExrghbaHmcybx5hDhbKhk6P58F1kkUKtXF4aAMR",  // RAT
        "ipfs://QmScEBNeZLW56LARHuuStwBbTQW7Xz6oo1XBTwR9aL7PST",  // OX
        "ipfs://Qmd5UrEshNkbem9BkEYrTQM816jPLbrP6szqtszXU7QMP1",  // TIGER
        "ipfs://QmcWeU95n6PPLMnS3pPrhYLhqQ4tUHwSDpWnVq8gYk8NYG",  // RABBIT
        "ipfs://QmVmT9QjLQFHgGWqJEv4hM9PtJwb3fZwpjvdGeJQvcySNQ",  // DRAGON
        "ipfs://QmVZNHfGXU2eJRULoaW2kVxXjqhLJZJMMiXxpuxTNtYSdZ",  // SNAKE
        "ipfs://Qmd3mHAr2nhj46m25uyUkf7eBzzcqvTNTjnvM3zYrKyMD9",  // HORSE
        "ipfs://QmQFuFNqhceLCNYn5jGHehmJaFAqSYNHZPo1uhUMUFKpDC",  // GOAT
        "ipfs://QmYbv3P8bVkGwuHdynsQNYFmry9MKToGtuseWLvUDEKWHG",  // MONKEY
        "ipfs://QmPFngj6CG4uUe9rKsKQ5GMS6fFcHBAGYAtWfh1NBJnL6H",  // ROOSTER
        "ipfs://QmTZDFNi2aRRQs46PJY9tLDgca4oVaiGgZoQ4LpqsRrsso",  // DOG
        "ipfs://QmXEPGTLhLhmGiqfEwA8KscdvkkMCNeNeSJBEU5Rmy8gpY"   // PIG
    ];
    string[12] private zodiacNames = [
        "rat", "ox", "tiger", "rabbit", "dragon", "snake", "horse", "goat", "monkey", "rooster", "dog", "pig"
    ];

    uint256 private tokenCounter;
    uint256 private startYear = 1890;
    uint256 private endYear = 2090;
    uint256 private firstRatYear = 1888;

    constructor() ERC721("Zodiac", "ZOD") {
        tokenCounter = 0;
    }

    function mintNft(uint256 year) public {
        if (year > endYear || year < startYear) {
            revert ZodiacNft__YearOutOfRange();
        }
        if (_exists(year)) {
            revert ZodiacNft__NftAlreadyExist();
        }
        _safeMint(msg.sender, year);
        tokenCounter = tokenCounter + 1;
    }

    function tokenURI(uint256 year) public view override returns(string memory) {
        if (_exists(year)) {
            revert ZodiacNft__NftNotExist();
        }

        uint256 zodiac = (year - firstRatYear) % 12;
        
        string memory imageUrl = imageUrls[zodiac];
        string memory jsonEncode = Base64.encode(bytes(string(abi.encodePacked(
            '{',
            '"name":"', name(), '",',
            '"description":"Zodiac series token, ', year, ': year of ', zodiacNames[zodiac], '"',
            '"image":"', imageUrl, '"',
            "}"
        ))));
        return jsonEncode;
    }

    function getTokenCount() public view returns(uint256) {
        return tokenCounter;
    }

}