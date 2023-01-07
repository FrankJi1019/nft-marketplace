// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "base64-sol/base64.sol";

error ZodiacNft__YearOutOfRange();
error ZodiacNft__NftAlreadyExist();
error ZodiacNft__NftNotExist();

contract ZodiacNft is ERC721 {

    string[12] private imageUrls = [
        "https://cloudflare-ipfs.com/ipfs/QmVzieMExrghbaHmcybx5hDhbKhk6P58F1kkUKtXF4aAMR",  // RAT
        "https://cloudflare-ipfs.com/ipfs/QmScEBNeZLW56LARHuuStwBbTQW7Xz6oo1XBTwR9aL7PST",  // OX
        "https://cloudflare-ipfs.com/ipfs/Qmd5UrEshNkbem9BkEYrTQM816jPLbrP6szqtszXU7QMP1",  // TIGER
        "https://cloudflare-ipfs.com/ipfs/QmcWeU95n6PPLMnS3pPrhYLhqQ4tUHwSDpWnVq8gYk8NYG",  // RABBIT
        "https://cloudflare-ipfs.com/ipfs/QmVmT9QjLQFHgGWqJEv4hM9PtJwb3fZwpjvdGeJQvcySNQ",  // DRAGON
        "https://cloudflare-ipfs.com/ipfs/QmVZNHfGXU2eJRULoaW2kVxXjqhLJZJMMiXxpuxTNtYSdZ",  // SNAKE
        "https://cloudflare-ipfs.com/ipfs/Qmd3mHAr2nhj46m25uyUkf7eBzzcqvTNTjnvM3zYrKyMD9",  // HORSE
        "https://cloudflare-ipfs.com/ipfs/QmQFuFNqhceLCNYn5jGHehmJaFAqSYNHZPo1uhUMUFKpDC",  // GOAT
        "https://cloudflare-ipfs.com/ipfs/QmYbv3P8bVkGwuHdynsQNYFmry9MKToGtuseWLvUDEKWHG",  // MONKEY
        "https://cloudflare-ipfs.com/ipfs/QmPFngj6CG4uUe9rKsKQ5GMS6fFcHBAGYAtWfh1NBJnL6H",  // ROOSTER
        "https://cloudflare-ipfs.com/ipfs/QmTZDFNi2aRRQs46PJY9tLDgca4oVaiGgZoQ4LpqsRrsso",  // DOG
        "https://cloudflare-ipfs.com/ipfs/QmXEPGTLhLhmGiqfEwA8KscdvkkMCNeNeSJBEU5Rmy8gpY"   // PIG
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
        if (!_exists(year)) {
            revert ZodiacNft__NftNotExist();
        }

        uint256 zodiac = (year - firstRatYear) % 12;
        
        string memory imageUrl = imageUrls[zodiac];
        string memory yearString = Strings.toString(year);
        string memory jsonEncode = Base64.encode(bytes(string(abi.encodePacked(
            '{',
            '"name":"', name(), '",',
            '"description":"Zodiac series token, ', yearString, ': year of ', zodiacNames[zodiac], '",',
            '"image":"', imageUrl, '"',
            "}"
        ))));
        return string(abi.encodePacked("data:application/json;base64,", jsonEncode));
    }

    function getStartYear() view external returns(uint256) {
        return startYear;
    }

    function getEndYear() view external returns(uint256) {
        return endYear;
    }

    function getTokenCounter() view external returns(uint256) {
        return tokenCounter;
    }

}