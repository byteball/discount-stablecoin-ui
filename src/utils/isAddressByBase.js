import obyte from "obyte";
import client from "../socket";
import config from "../config";

export const isAddressByBase = async address => {
  if (obyte.utils.isValidAddress(address)) {
    const definition = await client.api.getDefinition(address);
    if (definition) {
      return (
        definition[0] === "autonomous agent" &&
        definition[1].base_aa === config.BASE_AA
      );
    } else {
      return false;
    }
  } else {
    return false;
  }
};
