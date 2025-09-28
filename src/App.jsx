import { Routes, Route } from "react-router-dom";
import Navbar from "./CompoNavbar/Navbar";
import Sidebar from "./CompoSidebar/Sidebar";
import Home from "./pages/Home";
import Watchlist from "./Pages/Watchlist";
import Portfolio from "./pages/Portfolio";
import History from "./pages/History";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Signup from "./components/Signup";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import Footer from "./components/Footer";

function App() {
  return ( 
    
    <Routes>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      
      <Route
        path="/*"
        element={
         <ProtectedRoute>
  <div className="flex flex-col h-screen overflow-hidden">
    <Navbar />
    <div className="flex flex-1 overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto px-4 pb-10 pr-0 pl-0 ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/history" element={<History />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
    <Footer />
  </div>
</ProtectedRoute>

        }
      />
    </Routes>
  );
}

export default App;
