import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./store/store";
import MainRouter from "./Routes";
import ScrollToTop from "./components/ScrollToTop";
import { ToastProvider } from "./components/ToastProvider";


const App = () => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <BrowserRouter>
          <ScrollToTop />
          <ToastProvider />
          <MainRouter />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
};

export default App;
