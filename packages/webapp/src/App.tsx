import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegisterForm from "./components/RegisterForm";
import Navbar from "./components/Navbar";
import { useState } from "react";

function App() {
  interface AlertProps {
    Messages: string;
    Types: "success" | "danger" | "warning" | "info";
  }

  const [alert, setAlert] = useState<AlertProps | null>(null);

  const showAlert = (Message: string, Type: AlertProps["Types"]) => {
    setAlert({
      Messages: Message,
      Types: Type,
    });
    setTimeout(() => {
      setAlert(null);
    }, 2000);
  };

  return (
    <>
      <Router>
        <Navbar />
        <div className="container">
          <Routes>
            <Route path="/" element= {<span>Home Page</span>} />
            {/* <Route path="/about" element={<About />} /> */}
            <Route path="/login" element={<LoginForm showAlert = {showAlert}/>} />

          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
