import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./components/Homepage";
import Store from "./components/Store";
import Vendors from "./components/Vendors";
import Experts from "./components/Experts";
import WeatherApp from "./components/WeatherUpdate";
import Assistant from "./components/assistant/Assistant";
import Prediction from "./components/Prediction";
import WeatherUpdate from "./components/WeatherUpdate";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/predict" element={<Prediction/>} />
        <Route path="/store" element={<Store/>} />
        <Route path="/vendors" element={<Vendors/>} />
        <Route path="/experts" element={<Experts />} />
        <Route path="https://jazzy-sprinkles-727ae3.netlify.app/" element={<WeatherUpdate />} />
        <Route path="/assistant" element={<Assistant />} />
      </Routes>
    </Router>
  );
}

export default App;
