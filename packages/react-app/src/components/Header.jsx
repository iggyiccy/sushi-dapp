import React from "react";
import { PageHeader } from "antd";

export default function Header() {
  return (
    <a href="https://github.com/austintgriffith/scaffold-eth/tree/uniswapper" target="_blank" rel="noopener noreferrer">
      <PageHeader
        title="🍣 HackAfrica X Sushiswap"
        subTitle="Challenge 1: Sushiswap Interface"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
