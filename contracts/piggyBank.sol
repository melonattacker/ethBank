pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract PiggyBank {
    using SafeMath for uint256;
    
    struct Deposit {
        uint256 period;
        uint256 amount;
        bool withdrawed;
    }
    
    address[] public users;
    mapping(address => mapping(uint256 => Deposit)) public userToDeposit;
    mapping(address => uint256[]) public userAllDeposit;
    
    function deposit(uint256 _period) public payable {
        if(!isUserExist(msg.sender)) {
            users.push(msg.sender);
        }
        userAllDeposit[msg.sender].push(1);
        uint256 newId = userTotalDeposit(msg.sender);
        userToDeposit[msg.sender][newId] = Deposit(block.timestamp.add(_period), msg.value, false);
    }
    
    function extendPeriod(uint256 _secondsToExtend, uint256 _id) public {
        userToDeposit[msg.sender][_id].period += _secondsToExtend;
    }
    
    function withdraw(uint256 _id) public {
        require(_id > 0);
        require(userToDeposit[msg.sender][_id].amount > 0);
        require(block.timestamp > userToDeposit[msg.sender][_id].period);
        uint256 transferValue = userToDeposit[msg.sender][_id].amount;
        userToDeposit[msg.sender][_id].amount = 0;
        userToDeposit[msg.sender][_id].withdrawed = true;
        msg.sender.transfer(transferValue);
    }
    
    function isUserExist(address _user) public view returns(bool) {
        for(uint i = 0; i < users.length; i++) {
            if(users[i] == _user) {
                return true;
            }
        }
        return false;
    }
    
    function userTotalDeposit(address _user) public view returns(uint256) {
        return userAllDeposit[_user].length;
    }
    
}