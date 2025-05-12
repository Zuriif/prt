// src/App.jsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

// Public / Visitor
import VisitorHome from "./pages/visitor/VisitorHome";

// Authentication
import Login    from "./pages/Login";
import Register from "./pages/Register";

// Admin Dashboard & CRUD
import Home               from "./pages/Home";
import Profile            from "./pages/Profile";
import EntitesList        from "./pages/EntitesList";
import EntiteForm         from "./pages/EntiteForm";
import ProduitsList       from "./pages/ProduitsList";
import ProduitsForm       from "./pages/ProduitsForm";
import FonctionnairesList from "./pages/FonctionnairesList";
import FonctionnairesForm from "./pages/FonctionnairesForm";
import MediaList          from "./pages/MediaList";
import MediaForm          from "./pages/MediaForm";
import SecteursList       from "./pages/SecteursList";
import SecteursForm       from "./pages/SecteursForm";
import SousSecteursList   from "./pages/SousSecteursList";
import SousSecteursForm   from "./pages/SousSecteursForm";
import TypeEntreprisesList from "./pages/TypeEntreprisesList";
import TypeEntreprisesForm from "./pages/TypeEntreprisesForm";
import UserManagement     from "./pages/UserManagement";

// User Dashboard & Views
import UserHome from "./pages/user/UserHome";
import UserDashboard from "./pages/user/UserDashboard";
import UserProductsList from "./pages/user/UserProductsList";
import UserEntitesList from "./pages/user/UserEntitiesList";
import UserSecteursList from "./pages/user/UserSecteursList";
import UserProfile from "./pages/user/UserProfile";
import UserLayout from "./pages/user/UserLayout";

import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/NavBar";

export default function App() {
  return (
    <Routes>
      {/* 1️⃣ Public routes */}
      <Route path="/"      element={<VisitorHome />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* 2️⃣ Protected wrapper for all admin routes */}
      <Route
        element={
          <ProtectedRoute role="ADMIN">
            <>
              <NavBar />
              <Outlet />
            </>
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/entites" element={<EntitesList />} />
        <Route path="/entites/new" element={<EntiteForm />} />
        <Route path="/entites/:id" element={<EntiteForm />} />
        <Route path="/produits" element={<ProduitsList />} />
        <Route path="/produits/new" element={<ProduitsForm />} />
        <Route path="/produits/:id" element={<ProduitsForm />} />
        <Route path="/fonctionnaires" element={<FonctionnairesList />} />
        <Route path="/fonctionnaires/new" element={<FonctionnairesForm />} />
        <Route path="/fonctionnaires/:id" element={<FonctionnairesForm />} />
        <Route path="/media" element={<MediaList />} />
        <Route path="/media/new" element={<MediaForm />} />
        <Route path="/media/:id" element={<MediaForm />} />
        <Route path="/secteurs" element={<SecteursList />} />
        <Route path="/secteurs/new" element={<SecteursForm />} />
        <Route path="/secteurs/:id" element={<SecteursForm />} />
        <Route path="/sous-secteurs" element={<SousSecteursList />} />
        <Route path="/sous-secteurs/new" element={<SousSecteursForm />} />
        <Route path="/sous-secteurs/:id" element={<SousSecteursForm />} />
        <Route path="/type-entreprises" element={<TypeEntreprisesList />} />
        <Route path="/type-entreprises/new" element={<TypeEntreprisesForm />} />
        <Route path="/type-entreprises/:id" element={<TypeEntreprisesForm />} />
        <Route path="/users" element={<UserManagement />} />
      </Route>

      {/* 3️⃣ Protected wrapper for all user routes with new UserLayout */}
      <Route
        element={
          <ProtectedRoute role="USER">
            <UserLayout>
              <Outlet />
            </UserLayout>
          </ProtectedRoute>
        }
      >
        <Route path="/user/dashboard" element={<UserHome />} />
        <Route path="/user/produits" element={<UserProductsList />} />
        <Route path="/user/entites" element={<UserEntitesList />} />
        <Route path="/user/secteurs" element={<UserSecteursList />} />
        <Route path="/user/compte" element={<UserProfile />} />
        <Route path="/user/profile" element={<UserProfile />} />
        <Route path="/user/userdashboard" element={<UserDashboard />} />
      </Route>

      {/* 4️⃣ Fallback */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
