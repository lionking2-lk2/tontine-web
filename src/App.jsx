import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Inscription from "./pages/Inscription";
import Connexion from "./pages/Connexion";
import MotDePasseOublie from "./pages/MotDePasseOublie";
import ReinitialiserMotDePasse from "./pages/ReinitialiserMotDePasse";
import VerificationOtp from "./pages/VerificationOtp";

import Dashboard from "./pages/Dashboard/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import Epargne from "./pages/Epargne/Epargne";
import Profile from "./pages/Profile/Profile";
import MesTontines from "./pages/MesTontines/MesTontines";
import CreerTontine from "./pages/CreerTontine/CreerTontine";
import DetailTontine from "./pages/DetailTontine/DetailTontine";
import Notifications from "./pages/Notifications/Notifications";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/inscription" element={<Inscription />} />
                <Route path="/connexion" element={<Connexion />} />
                <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
                <Route path="/reinitialiser-mot-de-passe" element={<ReinitialiserMotDePasse />} />
                <Route path="/verification-otp" element={<VerificationOtp />} />

                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/epargne" element={<Epargne />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/tontines" element={<MesTontines />} />
                    <Route path="/tontines/creer" element={<CreerTontine />} />
                    <Route path="/tontines/:id" element={<DetailTontine />} />
                    <Route path="/notifications" element={<Notifications />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;