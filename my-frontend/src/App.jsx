// src/App.jsx
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Public / Visitor
import Root                  from "./pages/visitor/Root";

// Authentication
import Login                 from "./pages/Login";
import Register              from "./pages/Register";

// Admin Dashboard
import Home                  from "./pages/Home";

import Profile from "./pages/Profile";

// Admin CRUD
import EntitesList           from "./pages/EntitesList";
import EntiteForm            from "./pages/EntiteForm";
import ProduitsList          from "./pages/ProduitsList";
import ProduitsForm          from "./pages/ProduitsForm";
import FonctionnairesList    from "./pages/FonctionnairesList";
import FonctionnairesForm    from "./pages/FonctionnairesForm";
import MediaList             from "./pages/MediaList";
import MediaForm             from "./pages/MediaForm";
import SecteursList          from "./pages/SecteursList";
import SecteursForm          from "./pages/SecteursForm";
import SousSecteursList      from "./pages/SousSecteursList";
import SousSecteursForm      from "./pages/SousSecteursForm";
import TypeEntreprisesList   from "./pages/TypeEntreprisesList";
import TypeEntreprisesForm   from "./pages/TypeEntreprisesForm";

import ProtectedRoute        from "./components/ProtectedRoute";
import NavBar                from "./components/NavBar";

export default function App() {
  return (
    <Routes>
      {/* 1) Public landing & auto‑redirect */}
      <Route path="/" element={<Root />} />

      {/* 2) Auth */}
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 3) Admin area (requires login) */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <NavBar />
            <Outlet />
          </ProtectedRoute>
        }
      >
        {/* Dashboard (old Home) */}
        <Route path="dashboard" element={<Home />} />
        <Route path="profile" element={<Profile />} />

        {/* Entités */}
        <Route path="entites"          element={<EntitesList />} />
        <Route path="entites/create"   element={<EntiteForm />} />
        <Route path="entites/:id/edit" element={<EntiteForm />} />

        {/* Produits */}
        <Route path="produits"          element={<ProduitsList />} />
        <Route path="produits/create"   element={<ProduitsForm />} />
        <Route path="produits/:id/edit" element={<ProduitsForm />} />

        {/* Fonctionnaires */}
        <Route path="fonctionnaires"          element={<FonctionnairesList />} />
        <Route path="fonctionnaires/create"   element={<FonctionnairesForm />} />
        <Route path="fonctionnaires/:id/edit" element={<FonctionnairesForm />} />

        {/* Médias */}
        <Route path="media"        element={<MediaList />} />
        <Route path="media/create" element={<MediaForm />} />

        {/* Secteurs */}
        <Route path="secteurs"          element={<SecteursList />} />
        <Route path="secteurs/create"   element={<SecteursForm />} />
        <Route path="secteurs/:id/edit" element={<SecteursForm />} />

        {/* Sous‑secteurs */}
        <Route path="sous-secteurs"          element={<SousSecteursList />} />
        <Route path="sous-secteurs/create"   element={<SousSecteursForm />} />
        <Route path="sous-secteurs/:id/edit" element={<SousSecteursForm />} />

        {/* Types d’entreprise */}
        <Route path="type-entreprises"          element={<TypeEntreprisesList />} />
        <Route path="type-entreprises/create"   element={<TypeEntreprisesForm />} />
        <Route path="type-entreprises/:id/edit" element={<TypeEntreprisesForm />} />

        {/* Default inside admin → dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        {/* Fallback for unknown admin routes */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}
