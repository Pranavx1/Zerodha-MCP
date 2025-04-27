import { KiteConnect } from "kiteconnect";
import dotenv from "dotenv";
dotenv.config();
const apiKey = process.env.APIKEY || "gedkc6red65aqaym";
if (!apiKey) {
  throw new Error("API key is undefined");
}
const access_token =
  process.env.ACCESSTOKEN || "1qqNWJWAhSJilqCRA2r0oQbQxRinwKFV";
const kc = new KiteConnect({ api_key: apiKey });
//console.log(kc.getLoginURL());
// kc.generateSession(Bun.env.REQTOKEN, Bun.env.APISECRET)
//   .then((response) => {
//     console.log(response.access_token);
//   })
//   .catch((err) => {
//     console.error(err);
//   });
if (access_token) {
  kc.setAccessToken(access_token);
} else {
  console.error("Access token is undefined");
}
export async function getPortfolio() {
  let holdings = "";
  try {
    const portfolio = await kc.getHoldings();
    if (portfolio.length === 0) {
      console.log("Portfolio is empty");
      return "Portfolio is empty";
    }
    portfolio.map((holding) => {
      holdings += `${holding.tradingsymbol}: ${holding.quantity}, ${holding.price}\n`;
    });
  } catch (err) {
    console.error(err);
  }
  console.log(holdings);
  return holdings;
}
export async function placeOrder(
  tradingsymbol: string,
  transaction_type: "BUY" | "SELL",
  quantity: number
) {
  try {
    const response = await kc.placeOrder("regular", {
      exchange: "NSE",
      tradingsymbol: tradingsymbol,
      transaction_type: transaction_type,
      quantity: quantity,
      product: "CNC",
      order_type: "MARKET",
    });
    console.log("Order placed successfully:", response);
    return response.order_id;
  } catch (err) {
    console.error(err);
    return err instanceof Error ? err.message : "An unknown error occurred";
  }
}
