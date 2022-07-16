//SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Whitelist {
    uint256 public maxWhitelistAddresses;
    uint256 public numOfAddressesWhitelisted;

    mapping(address => bool) public whitelistedAddresses;

    constructor(uint256 _maxWhitelistAddresses) {
        maxWhitelistAddresses = _maxWhitelistAddresses;
    }

    function addToWhitelist() public {
        require(
            numOfAddressesWhitelisted < maxWhitelistAddresses,
            "Can't add to whitelist, limit reached"
        );
        require(!whitelistedAddresses[msg.sender], "Already in the whitelist");

        whitelistedAddresses[msg.sender] = true;
        numOfAddressesWhitelisted += 1;
    }
}
