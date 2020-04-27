import obyte from "obyte";
import config from "./config";
let client;
try {
  client = new obyte.Client(`wss://obyte.org/bb${config.TESTNET ? "-test" : ""}`, {
    testnet: config.TESTNET,
    reconnect: true
  });
} catch (e) {
  console.log("socket error: ", e);
}

export default client;
