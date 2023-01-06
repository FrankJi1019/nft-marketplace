// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

error NftMarket__PriceTooLow();
error NftMarket__UnapprovedNft();
error NftMarket__NftAlreadyListed();
error NftMarket__NotOwner();

contract NftMarket {

    struct Listing {
        address seller;
        uint256 price;
    }

    event NftListed(address nftAddress, uint256 tokenId, address seller, uint256 price);

    mapping(address => mapping(uint256 => Listing)) private listings;

    modifier nftNotListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = listings[nftAddress][tokenId];
        if (listing.price <= 0) {
            _;
        } else {
            revert NftMarket__NftAlreadyListed();
        }
    }

    modifier nftOwnerOnly(address nftAddress, uint256 tokenId) {
        IERC721 nft = IERC721(nftAddress);
        address nftOwner = nft.ownerOf(tokenId);
        if (nftOwner == msg.sender) {
            _;
        } else {
            revert NftMarket__NotOwner();
        }
    }

    function createListing(address nftAddress, uint256 tokenId, uint256 price) external nftNotListed(nftAddress, tokenId) nftOwnerOnly(nftAddress, tokenId) {
        if (price <= 0) {
            revert NftMarket__PriceTooLow();
        }

        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NftMarket__UnapprovedNft();
        }

        listings[nftAddress][tokenId] = Listing(msg.sender, price);

        emit NftListed(nftAddress, tokenId, msg.sender, price);
    }

}
