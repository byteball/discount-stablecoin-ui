import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import thunk from "redux-thunk";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer } from "redux-persist";

import { aaReducer } from "./reducers/aa";
import { deployReducer } from "./reducers/deploy";
import { notificationsReducer } from "./reducers/notifications";
import { auctionReducer } from "./reducers/auction";
import { assetsReducer } from "./reducers/assets";
import { symbolsReducer } from "./reducers/symbols";
import { recentReducer } from "./reducers/recent";

const rootReducer = combineReducers({
  aa: aaReducer,
  deploy: deployReducer,
  notifications: notificationsReducer,
  auction: auctionReducer,
  assets: assetsReducer,
  symbols: symbolsReducer,
  recent: recentReducer
});
const persistConfig = {
  key: "SC",
  storage,
  whitelist: ["assets", "symbols", "recent"]
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
export default () => {
  const store = createStore(
    persistedReducer,
    compose(
      applyMiddleware(thunk),
      window.__REDUX_DEVTOOLS_EXTENSION__
        ? window.__REDUX_DEVTOOLS_EXTENSION__()
        : f => f
    )
  );
  return { store, persistor: persistStore(store) };
};
