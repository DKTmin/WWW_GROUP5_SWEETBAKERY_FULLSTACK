import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/index";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";

function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen flex-col bg-amber-50/40">
        <Header />
        <div className="flex-1">
          <AppRoutes />
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
