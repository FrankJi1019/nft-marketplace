// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Nft is ERC721 {

    uint256 private tokenCounter;
    string private constant URI = "ipfs://QmYKkKcLyP7M45Xcd6G9UsawHmqXi9hstWVzhQfLnrw18b";

    constructor() ERC721("Dogie", "DOG") {
        tokenCounter = 0;
    }

    function mintNft() public {
        _safeMint(msg.sender, tokenCounter);
        tokenCounter = tokenCounter + 1;
    }

    function tokenURI(uint256) public pure override returns(string memory) {
        return URI;
    }

    function getTokenCount() public view returns(uint256) {
        return tokenCounter;
    }

}