// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Echo {
    event MessageEvent(address indexed _receiver, string _senderMessage, string _receiverMessage);
    event IdentityEvent(string _communicationKey);

    function logMessage(address _receiver, string calldata _senderMessage, string calldata _receiverMessage) external {
        emit MessageEvent(_receiver, _senderMessage, _receiverMessage);
    }

    function logIdentity(string calldata _communicationKey) external {
        // require(
        //     bytes(_communicationKey).length == 64,
        //     "Echo: communication address invalid"
        // );
        emit IdentityEvent(_communicationKey);
    }
}
