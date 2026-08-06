import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* La route /connexion sera ajoutée au moment du merge
            avec la branche de mon binôme (feature/frontend-api-connexion) */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;