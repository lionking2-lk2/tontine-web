import { BrowserRouter, Routes, Route } from "react-router-dom";

import Inscription from "./pages/Inscription";
import Connexion from "./pages/Connexion";
import MotDePasseOublie from "./pages/MotDePasseOublie";
import ReinitialiserMotDePasse from "./pages/ReinitialiserMotDePasse";
import VerificationOtp from "./pages/VerificationOtp";

import Dashboard from "./pages/Dashboard/Dashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import Epargne from "./pages/Epargne/Epargne";
import MesTontines from "./pages/MesTontines/MesTontines";
import CreerTontine from "./pages/CreerTontine/CreerTontine";
import DetailTontine from "./pages/DetailTontine/DetailTontine";
import Notifications from "./pages/Notifications/Notifications";
import Parametres from "./pages/Parametres/Parametres";
import DemanderPret from "./pages/DemanderPret/DemanderPret";
import Historique from "./pages/Historique/Historique";
import GestionPrets from "./pages/GestionPrets/GestionPrets";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Connexion />} />
                <Route path="/inscription" element={<Inscription />} />
                <Route path="/connexion" element={<Connexion />} />
                <Route path="/mot-de-passe-oublie" element={<MotDePasseOublie />} />
                <Route path="/reinitialiser-mot-de-passe" element={<ReinitialiserMotDePasse />} />
                <Route path="/verification-otp" element={<VerificationOtp />} />

                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/epargne" element={<Epargne />} />
                    <Route path="/tontines" element={<MesTontines />} />
                    <Route path="/tontines/creer" element={<CreerTontine />} />
                    <Route path="/tontines/:id" element={<DetailTontine />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/parametres" element={<Parametres />} />
                    <Route path="/tontines/:id/demander-pret" element={<DemanderPret />} />
                    <Route path="/historique" element={<Historique />} />
                    <Route path="/gestion-prets" element={<GestionPrets />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
export default App;
