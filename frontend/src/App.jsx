import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import Store from "./components/Store";
import Vendors from "./components/Vendors";
import Experts from "./components/Experts";
import WeatherApp from "./components/WheatherUpdate";
import Assistant from "./components/assistant/Assistant";
import Prediction from "./components/Prediction";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/predict" element={<Prediction/>} />
        <Route path="/store" element={<Store/>} />
        <Route path="/vendors" element={<Vendors/>} />
        <Route path="/experts" element={<Experts />} />
        <Route path="/weather-update" element={<WeatherApp />} />
        <Route path="/assistant" element={<Assistant />} />
      </Routes>
    </Router>
  );
}

export default App;
