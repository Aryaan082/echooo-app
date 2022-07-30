// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Echo {
    event MessageEvent(address indexed _receiver, string _message);
    event IdentityEvent(string _communicationAddress);

    function logMessage(address _receiver, string calldata _message) external {
        emit MessageEvent(_receiver, _message);
    }

    function logIdentity(string calldata _communicationAddress) external {
        require(
            bytes(_communicationAddress).length == 64,
            "Echo: communication address invalid"
        );
        emit IdentityEvent(_communicationAddress);
    }
}
