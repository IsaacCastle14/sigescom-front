import { useEffect, useState } from "react";
import { api } from "../services/api";
import type { Dashboard as DashboardType } from "../types";
import MisSolicitudes from "./MisSolicitudes";
import CrearSolicitud from "./CrearSolicitud";
import GestionarSolicitudes from "./GestionarSolicitudes";
import HistorialSolicitud from "./HistorialSolicitud";
import FiltrarSolicitudes from "./FiltrarSolicitudes";
import ActivarUsuarios from "./ActivarUsuarios";

interface Props {
  id_usuario: number;
  nombre: string;
  rol: string;
  onLogout: () => void;
}

type Vista =
  | "dashboard"
  | "mis-solicitudes"
  | "crear-solicitud"
  | "gestionar"
  | "historial"
  | "filtrar"
  | "activar-usuarios";

export default function Dashboard({
  id_usuario,
  nombre,
  rol,
  onLogout,
}: Props) {
  const [data, setData] = useState<DashboardType | null>(null);
  const [loading, setLoading] = useState(true);
  const [vista, setVista] = useState<Vista>("dashboard");
  const esAdmin = rol === "ADMIN";

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/dashboard/resumen");
      if (res.success) setData(res);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Permisos según rol
  const puedeCrear = rol === "SOLICITANTE" || rol === "ADMIN";
  const puedeGestionar = rol === "APROBADOR" || rol === "ADMIN";
  const puedeConsultar =
    rol === "ADMIN" || rol === "AUDITOR" || rol === "APROBADOR";

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center flex-wrap gap-2">
        <h1 className="text-xl font-bold">SIGESCOM</h1>
        <div className="flex items-center gap-4 flex-wrap">
          <button
            onClick={() => setVista("dashboard")}
            className="hover:underline"
          >
            Dashboard
          </button>

          {/* Solo SOLICITANTE y ADMIN ven Mis Solicitudes y Crear */}
          {puedeCrear && (
            <>
              <button
                onClick={() => setVista("mis-solicitudes")}
                className="hover:underline"
              >
                Mis Solicitudes
              </button>
              <button
                onClick={() => setVista("crear-solicitud")}
                className="hover:underline"
              >
                Crear Solicitud
              </button>
            </>
          )}

          {/* Solo APROBADOR y ADMIN ven Gestionar */}
          {puedeGestionar && (
            <button
              onClick={() => setVista("gestionar")}
              className="hover:underline"
            >
              Gestionar
            </button>
          )}

          {/* Todos pueden ver historial de una solicitud puntual */}
          <button
            onClick={() => setVista("historial")}
            className="hover:underline"
          >
            Historial
          </button>

          {/* Solo ADMIN y AUDITOR ven el listado con filtros */}
          {puedeConsultar && (
            <button
              onClick={() => setVista("filtrar")}
              className="hover:underline"
            >
              Consultar
            </button>
          )}

          {esAdmin && (
            <button
              onClick={() => setVista("activar-usuarios")}
              className="hover:underline"
            >
              Activar Usuarios
            </button>
          )}

          <span>|</span>
          <span className="text-sm">
            {nombre} ({rol})
          </span>
          <button
            onClick={onLogout}
            className="bg-white text-blue-700 px-3 py-1 rounded-lg hover:bg-gray-100 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      {vista === "dashboard" && (
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">Dashboard</h2>
          {loading ? (
            <p className="text-gray-500">Cargando métricas...</p>
          ) : data ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl shadow p-4 text-center">
                <p className="text-gray-500 text-sm">Total Solicitudes</p>
                <p className="text-3xl font-bold text-blue-600">
                  {data.total_solicitudes}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow p-4 text-center">
                <p className="text-gray-500 text-sm">Aprobadas</p>
                <p className="text-3xl font-bold text-green-600">
                  {data.aprobadas}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow p-4 text-center">
                <p className="text-gray-500 text-sm">Rechazadas</p>
                <p className="text-3xl font-bold text-red-600">
                  {data.rechazadas}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow p-4 text-center">
                <p className="text-gray-500 text-sm">Pendientes</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {data.pendientes}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow p-4 text-center col-span-2">
                <p className="text-gray-500 text-sm">Monto Total Solicitado</p>
                <p className="text-3xl font-bold text-blue-600">
                  ₡{data.monto_total_solicitado.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-xl shadow p-4 text-center col-span-2">
                <p className="text-gray-500 text-sm">Monto Total Aprobado</p>
                <p className="text-3xl font-bold text-green-600">
                  ₡{data.monto_total_aprobado.toLocaleString()}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-red-500">Error al cargar métricas</p>
          )}
        </div>
      )}

      {vista === "mis-solicitudes" && puedeCrear && (
        <MisSolicitudes
          id_usuario={id_usuario}
          onBack={() => setVista("dashboard")}
        />
      )}

      {vista === "crear-solicitud" && puedeCrear && (
        <CrearSolicitud
          id_usuario={id_usuario}
          onBack={() => setVista("dashboard")}
        />
      )}

      {vista === "gestionar" && puedeGestionar && (
        <GestionarSolicitudes
          id_usuario={id_usuario}
          onBack={() => setVista("dashboard")}
        />
      )}

      {vista === "historial" && (
        <HistorialSolicitud onBack={() => setVista("dashboard")} />
      )}

      {vista === "filtrar" && puedeConsultar && (
        <FiltrarSolicitudes onBack={() => setVista("dashboard")} />
      )}

      {vista === "activar-usuarios" && esAdmin && (
        <ActivarUsuarios
          id_usuario_admin={id_usuario}
          onBack={() => setVista("dashboard")}
        />
      )}
    </div>
  );
}
