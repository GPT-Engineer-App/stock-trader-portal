import React, { useState } from "react";
import { Box, Button, Container, Flex, Heading, Input, Table, Tbody, Td, Th, Thead, Tr, VStack, Text, useToast } from "@chakra-ui/react";
import { FaDollarSign, FaHistory, FaPlus, FaShoppingCart, FaTimes } from "react-icons/fa";

const Index = () => {
  const [cashAccount, setCashAccount] = useState(10000); // Starting with $10,000 in cash account
  const [portfolio, setPortfolio] = useState({});
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const toast = useToast();

  const handleBuyStock = (stockSymbol, stockPrice) => {
    if (cashAccount < stockPrice) {
      toast({
        title: "Insufficient funds.",
        description: "You don't have enough cash to buy this stock.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const order = {
      id: Date.now(),
      type: "buy",
      stockSymbol,
      stockPrice,
    };

    setPendingOrders([...pendingOrders, order]);
  };

  const handleSellStock = (stockSymbol, stockPrice) => {
    if (!portfolio[stockSymbol] || portfolio[stockSymbol] <= 0) {
      toast({
        title: "No stocks to sell.",
        description: "You don't have any of this stock to sell.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const order = {
      id: Date.now(),
      type: "sell",
      stockSymbol,
      stockPrice,
    };

    setPendingOrders([...pendingOrders, order]);
  };

  const executeOrder = (order) => {
    if (order.type === "buy") {
      setCashAccount(cashAccount - order.stockPrice);
      setPortfolio({
        ...portfolio,
        [order.stockSymbol]: (portfolio[order.stockSymbol] || 0) + 1,
      });
    } else if (order.type === "sell") {
      setCashAccount(cashAccount + order.stockPrice);
      setPortfolio({
        ...portfolio,
        [order.stockSymbol]: portfolio[order.stockSymbol] - 1,
      });
    }

    setTransactionHistory([...transactionHistory, { ...order, timestamp: new Date().toLocaleString() }]);

    setPendingOrders(pendingOrders.filter((o) => o.id !== order.id));
  };

  const cancelOrder = (orderId) => {
    setPendingOrders(pendingOrders.filter((order) => order.id !== orderId));
  };

  const handleDepositCash = (amount) => {
    setCashAccount(cashAccount + parseFloat(amount));
  };

  const handleWithdrawCash = (amount) => {
    const withdrawalAmount = parseFloat(amount);
    if (cashAccount < withdrawalAmount) {
      toast({
        title: "Insufficient funds.",
        description: "You don't have enough cash to withdraw.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
    setCashAccount(cashAccount - withdrawalAmount);
  };

  // Simplified stock market listing, in a real scenario this would be fetched from a financial API
  const stockMarketList = [
    { symbol: "AAPL", price: 150 },
    { symbol: "GOOGL", price: 2800 },
    { symbol: "AMZN", price: 3300 },
  ];

  return (
    <Container maxW="container.xl">
      <Heading as="h1" size="xl" my="8">
        Stock Trading Platform
      </Heading>

      <VStack spacing="8">
        <Flex justify="space-between" width="full">
          <VStack>
            <Heading as="h2" size="md">
              Cash Account: <FaDollarSign /> {cashAccount.toFixed(2)}
            </Heading>
            <Button colorScheme="green" onClick={() => handleDepositCash(1000)}>
              Deposit $1000 <FaPlus />
            </Button>
            <Button colorScheme="red" onClick={() => handleWithdrawCash(1000)}>
              Withdraw $1000 <FaDollarSign />
            </Button>
          </VStack>
          <VStack>
            <Heading as="h2" size="md">
              Portfolio
            </Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Stock</Th>
                  <Th isNumeric>Quantity</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Object.entries(portfolio).map(([symbol, quantity]) => (
                  <Tr key={symbol}>
                    <Td>{symbol}</Td>
                    <Td isNumeric>{quantity}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </VStack>
        </Flex>

        <Box width="full">
          <Heading as="h2" size="md">
            Stock Market
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Stock</Th>
                <Th isNumeric>Price</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {stockMarketList.map((stock) => (
                <Tr key={stock.symbol}>
                  <Td>{stock.symbol}</Td>
                  <Td isNumeric>{stock.price.toFixed(2)}</Td>
                  <Td>
                    <Button leftIcon={<FaShoppingCart />} colorScheme="blue" size="sm" onClick={() => handleBuyStock(stock.symbol, stock.price)}>
                      Buy
                    </Button>
                    <Button leftIcon={<FaDollarSign />} colorScheme="orange" size="sm" ml="2" onClick={() => handleSellStock(stock.symbol, stock.price)}>
                      Sell
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Box width="full">
          <Heading as="h2" size="md">
            Pending Orders
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Type</Th>
                <Th>Stock</Th>
                <Th isNumeric>Price</Th>
                <Th>Action</Th>
              </Tr>
            </Thead>
            <Tbody>
              {pendingOrders.map((order) => (
                <Tr key={order.id}>
                  <Td>{order.type}</Td>
                  <Td>{order.stockSymbol}</Td>
                  <Td isNumeric>{order.stockPrice.toFixed(2)}</Td>
                  <Td>
                    <Button leftIcon={<FaTimes />} colorScheme="red" size="sm" onClick={() => cancelOrder(order.id)}>
                      Cancel
                    </Button>
                    <Button leftIcon={<FaHistory />} colorScheme="green" size="sm" ml="2" onClick={() => executeOrder(order)}>
                      Execute
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <Box width="full">
          <Heading as="h2" size="md">
            Transaction History
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Type</Th>
                <Th>Stock</Th>
                <Th isNumeric>Price</Th>
                <Th>Timestamp</Th>
              </Tr>
            </Thead>
            <Tbody>
              {transactionHistory.map((transaction, index) => (
                <Tr key={index}>
                  <Td>{transaction.type}</Td>
                  <Td>{transaction.stockSymbol}</Td>
                  <Td isNumeric>{transaction.stockPrice.toFixed(2)}</Td>
                  <Td>{transaction.timestamp}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>
    </Container>
  );
};

export default Index;
