// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { fetchEntites } from "../services/entiteService";
import { fetchProduits } from "../services/produitService";
import { fetchFonctionnaires } from "../services/fonctionnaireService";
import { fetchMedia } from "../services/mediaService";
import { fetchSecteurs } from "../services/secteurService";

import {
  PieChart, Pie, Cell, Legend, Tooltip as ReTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from "recharts";

export default function Home() {
  const [counts, setCounts] = useState({
    entites: 0,
    produits: 0,
    fonctionnaires: 0,
    media: 0,
  });
  const [entites, setEntites] = useState([]);
  const [produits, setProduits] = useState([]);
  const [secteurs, setSecteurs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        const [eRes, pRes, fRes, mRes, sRes] = await Promise.all([
          fetchEntites(),
          fetchProduits(),
          fetchFonctionnaires(),
          fetchMedia(),
          fetchSecteurs(),
        ]);
        setEntites(eRes.data);
        setProduits(pRes.data);
        setSecteurs(sRes.data);
        setCounts({
          entites: eRes.data.length,
          produits: pRes.data.length,
          fonctionnaires: fRes.data.length,
          media: mRes.data.length,
        });
      } catch (err) {
        toast.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    }
    loadAll();
  }, []);

  if (loading) return (
    <div className="container py-4">
      <h1>Tableau de bord</h1>
      <p>Chargement…</p>
    </div>
  );

  // 1) Camembert : Entités par Secteur
  const pieData = secteurs.map(sec => ({
    name: sec.nom,
    value: entites.filter(e => e.secteur?.id === sec.id).length
  })).filter(d => d.value > 0);
  const COLORS = ["#007bff","#28a745","#ffc107","#17a2b8","#6c757d","#dc3545"];

  // 2) BarChart : Top 5 Entités par nombre de Produits
  const prodCountByEntite = entites.map(e => ({
    libelle: e.libelle,
    count: produits.filter(p => p.entiteId === e.id).length
  }));
  const barData = prodCountByEntite
    .sort((a,b) => b.count - a.count)
    .slice(0,5);

  return (
    <div className="container py-4">
      <h1 className="mb-4">Tableau de bord</h1>

      {/* Résumé */}
      <div className="row mb-4">
        {[
          { label: "Entités",       value: counts.entites,       bg: "bg-primary" },
          { label: "Produits",      value: counts.produits,      bg: "bg-success" },
          { label: "Fonctionnaires",value: counts.fonctionnaires, bg: "bg-warning text-dark" },
          { label: "Médias",        value: counts.media,         bg: "bg-info text-dark" },
        ].map(card => (
          <div key={card.label} className="col-sm-6 col-md-3 mb-3">
            <div className={`card text-white ${card.bg}`}>
              <div className="card-body text-center">
                <h2 className="card-title">{card.value}</h2>
                <p className="card-text">{card.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row gy-4">
        {/* Pie: Entités par Secteur */}
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">Entités par Secteur</div>
            <div className="card-body">
              {pieData.length === 0 ? (
                <p>Aucune entité assignée à un secteur.</p>
              ) : (
                <PieChart width={300} height={300}>
                  <Pie
                    data={pieData}
                    cx="50%" cy="50%"
                    outerRadius={100} label
                    dataKey="value"
                  >
                    {pieData.map((entry, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36}/>
                  <ReTooltip/>
                </PieChart>
              )}
            </div>
          </div>
        </div>

        {/* Bar: Top 5 Entités par Produits */}
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header">Top 5 Ent. par nombre de Prod.</div>
            <div className="card-body">
              {barData.every(d => d.count === 0) ? (
                <p>Aucune donnée de produit.</p>
              ) : (
                <BarChart
                  width={500}
                  height={300}
                  data={barData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3"/>
                  <XAxis dataKey="libelle" angle={-45} textAnchor="end" interval={0}/>
                  <YAxis allowDecimals={false}/>
                  <Tooltip/>
                  <Bar dataKey="count" fill="#007bff"/>
                </BarChart>
              )}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-center"/>
    </div>
  );
}
