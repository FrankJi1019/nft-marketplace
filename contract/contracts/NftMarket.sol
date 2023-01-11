// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error NftMarket__PriceTooLow();
error NftMarket__UnapprovedNft();
error NftMarket__NftAlreadyListed();
error NftMarket__NotOwner();
error NftMarket__NftNotListed();
error NftMarket__NotEnoughFund();
error NftMarket__NoProceeds();
error NftMarket__WithdrawProceedFail();

contract NftMarket is ReentrancyGuard {

    struct Listing {
        address seller;
        uint256 price;
    }

    event NftListed(address nftAddress, uint256 tokenId, address seller, uint256 price);
    event NftBought(address nftAddress, uint256 tokenId, address buyer, uint256 price);
    event ListingDeleted(address nftAddress, uint256 tokenId);

    mapping(address => mapping(uint256 => Listing)) public listings;
    mapping(address => uint256) private proceeds;

    modifier nftListed(address nftAddress, uint256 tokenId) {
        Listing memory listing = listings[nftAddress][tokenId];
        if (listing.price <= 0) {
            revert NftMarket__NftNotListed();
        } else {
            _;
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

    function listNft(address nftAddress, uint256 tokenId, uint256 price) external nftOwnerOnly(nftAddress, tokenId) {
        if (price <= 0) {
            revert NftMarket__PriceTooLow();
        }

        IERC721 nft = IERC721(nftAddress);
        if (nft.getApproved(tokenId) != address(this)) {
            revert NftMarket__UnapprovedNft();
        }

        Listing memory listing = listings[nftAddress][tokenId];
        if (listing.price <= 0) {
            listings[nftAddress][tokenId] = Listing(msg.sender, price);
        } else {
            listing.price = price;
        }

        emit NftListed(nftAddress, tokenId, msg.sender, price);
    }

    function buyItem(address nftAddress, uint256 tokenId) external payable nonReentrant nftListed(nftAddress, tokenId) {
        Listing memory listing = listings[nftAddress][tokenId];

        if (msg.value < listing.price) {
            revert NftMarket__NotEnoughFund();
        }

        IERC721 nft = IERC721(nftAddress);
        nft.safeTransferFrom(listing.seller, msg.sender, tokenId);

        proceeds[listing.seller] = proceeds[listing.seller] + msg.value;

        delete listings[nftAddress][tokenId];

        emit NftBought(nftAddress, tokenId, msg.sender, msg.value);
    }

    function cancelListing(address nftAddress, uint256 tokenId) external nftListed(nftAddress, tokenId) nftOwnerOnly(nftAddress, tokenId) {
        delete listings[nftAddress][tokenId];
        emit ListingDeleted(nftAddress, tokenId);
    }

    function withdraw() external payable {
        uint256 fund = proceeds[msg.sender];
        if (fund <= 0) {
            revert NftMarket__NoProceeds();
        }
        bool withdrawSuccess = payable(msg.sender).send(fund);
        if (!withdrawSuccess) {
            revert NftMarket__WithdrawProceedFail();
        }
    }

}