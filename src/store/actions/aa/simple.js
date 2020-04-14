import { CLOSE_NETWORK, OPEN_NETWORK } from "../../types/aa";

export const openNetwork = () => ({
  type: OPEN_NETWORK
});

export const closeNetwork = () => ({
  type: CLOSE_NETWORK
});
