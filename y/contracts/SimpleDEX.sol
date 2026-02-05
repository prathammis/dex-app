// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SimpleDEX {
    IERC20 public tokenA;
    IERC20 public tokenB;

    uint256 public reserveA;
    uint256 public reserveB;

    event LiquidityAdded(
        address indexed provider,
        uint256 amountA,
        uint256 amountB
    );

    event LiquidityRemoved(
        address indexed provider,
        uint256 amountA,
        uint256 amountB
    );

    event Swap(
        address indexed trader,
        address tokenIn,
        uint256 amountIn,
        address tokenOut,
        uint256 amountOut
    );

    constructor(address _tokenA, address _tokenB) {
        tokenA = IERC20(_tokenA);
        tokenB = IERC20(_tokenB);
    }

    function addLiquidity(uint256 amountA, uint256 amountB) external {
        require(amountA > 0 && amountB > 0, "Invalid amounts");

        tokenA.transferFrom(msg.sender, address(this), amountA);
        tokenB.transferFrom(msg.sender, address(this), amountB);

        reserveA += amountA;
        reserveB += amountB;

        emit LiquidityAdded(msg.sender, amountA, amountB);
    }

    function removeLiquidity(uint256 amountA, uint256 amountB) external {
        require(amountA <= reserveA && amountB <= reserveB, "Insufficient reserves");

        reserveA -= amountA;
        reserveB -= amountB;

        tokenA.transfer(msg.sender, amountA);
        tokenB.transfer(msg.sender, amountB);

        emit LiquidityRemoved(msg.sender, amountA, amountB);
    }

    function swapTokenAForTokenB(uint256 amountIn) external {
        require(amountIn > 0, "Invalid amount");

        uint256 amountOut = getAmountOut(amountIn, reserveA, reserveB);
        require(amountOut <= reserveB, "Insufficient liquidity");

        tokenA.transferFrom(msg.sender, address(this), amountIn);
        tokenB.transfer(msg.sender, amountOut);

        reserveA += amountIn;
        reserveB -= amountOut;

        emit Swap(msg.sender, address(tokenA), amountIn, address(tokenB), amountOut);
    }

    function swapTokenBForTokenA(uint256 amountIn) external {
        require(amountIn > 0, "Invalid amount");

        uint256 amountOut = getAmountOut(amountIn, reserveB, reserveA);
        require(amountOut <= reserveA, "Insufficient liquidity");

        tokenB.transferFrom(msg.sender, address(this), amountIn);
        tokenA.transfer(msg.sender, amountOut);

        reserveB += amountIn;
        reserveA -= amountOut;

        emit Swap(msg.sender, address(tokenB), amountIn, address(tokenA), amountOut);
    }

    function getAmountOut(
        uint256 amountIn,
        uint256 reserveIn,
        uint256 reserveOut
    ) public pure returns (uint256) {
        require(reserveIn > 0 && reserveOut > 0, "Empty pool");

        return (amountIn * reserveOut) / (reserveIn + amountIn);
    }
}
