import { useState } from 'react';
import { api } from '../services/api';

interface Props {
  onBack: () => void;
}

interface Solicitud {
  id_solicitud: number;
  solicitante: string;
  departamento: string;
  estado: string;
  prioridad: string;
  total: number;
  req_aprobacion_esp: string;
  fecha_solicitud: string;
}

export default function FiltrarSolicitudes({ onBack }: Props) {
  const [filtros, setFiltros] = useState({
    estado: '',
    prioridad: '',
    fecha_inicio: '',
    fecha_fin: '',
    monto_min: '',
    monto_max: '',
  });
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [buscado, setBuscado] = useState(false);

  const handleBuscar = async () => {
    setLoading(true);
    setBuscado(false);

    const params = new URLSearchParams();
    if (filtros.estado)      params.append('estado',       filtros.estado);
    if (filtros.prioridad)   params.append('prioridad',    filtros.prioridad);
    if (filtros.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
    if (filtros.fecha_fin)   params.append('fecha_fin',    filtros.fecha_fin);
    if (filtros.monto_min)   params.append('monto_min',    filtros.monto_min);
    if (filtros.monto_max)   params.append('monto_max',    filtros.monto_max);

    const res = await api.get(`/solicitudes/filtros?${params.toString()}`);
    if (res.success) {
      setSolicitudes(res.solicitudes);
      setTotal(res.total_registros);
    }
    setBuscado(true);
    setLoading(false);
  };

  const handleLimpiar = () => {
    setFiltros({ estado: '', prioridad: '', fecha_inicio: '', fecha_fin: '', monto_min: '', monto_max: '' });
    setSolicitudes([]);
    setBuscado(false);
  };

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case 'APROBADA':   return 'bg-green-100 text-green-700';
      case 'RECHAZADA':  return 'bg-red-100 text-red-700';
      case 'PENDIENTE':  return 'bg-yellow-100 text-yellow-700';
      case 'DEVUELTA':   return 'bg-orange-100 text-orange-700';
      case 'BORRADOR':   return 'bg-gray-100 text-gray-700';
      default:           return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Consultar Solicitudes</h2>
        <button
          onClick={onBack}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Volver
        </button>
      </div>

      {/* FILTROS */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Filtros</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <select
            value={filtros.estado}
            onChange={e => setFiltros({ ...filtros, estado: e.target.value })}
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Todos los estados</option>
            <option value="BORRADOR">BORRADOR</option>
            <option value="PENDIENTE">PENDIENTE</option>
            <option value="APROBADA">APROBADA</option>
            <option value="RECHAZADA">RECHAZADA</option>
            <option value="DEVUELTA">DEVUELTA</option>
            <option value="REQUIERE_APROBACION_ESPECIAL">REQUIERE APROBACIÓN ESPECIAL</option>
          </select>

          <select
            value={filtros.prioridad}
            onChange={e => setFiltros({ ...filtros, prioridad: e.target.value })}
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Todas las prioridades</option>
            <option value="BAJA">BAJA</option>
            <option value="MEDIA">MEDIA</option>
            <option value="ALTA">ALTA</option>
            <option value="URGENTE">URGENTE</option>
          </select>

          <input
            type="date"
            value={filtros.fecha_inicio}
            onChange={e => setFiltros({ ...filtros, fecha_inicio: e.target.value })}
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="date"
            value={filtros.fecha_fin}
            onChange={e => setFiltros({ ...filtros, fecha_fin: e.target.value })}
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="number"
            placeholder="Monto mínimo"
            value={filtros.monto_min}
            onChange={e => setFiltros({ ...filtros, monto_min: e.target.value })}
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="number"
            placeholder="Monto máximo"
            value={filtros.monto_max}
            onChange={e => setFiltros({ ...filtros, monto_max: e.target.value })}
            className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={handleBuscar}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
          <button
            onClick={handleLimpiar}
            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* RESULTADOS */}
      {buscado && (
        <>
          <p className="text-gray-600 mb-3 font-semibold">Total de registros: {total}</p>
          {solicitudes.length === 0 ? (
            <p className="text-gray-500">No se encontraron solicitudes con esos filtros.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full bg-white rounded-xl shadow text-sm">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Solicitante</th>
                    <th className="p-3 text-left">Departamento</th>
                    <th className="p-3 text-left">Estado</th>
                    <th className="p-3 text-left">Prioridad</th>
                    <th className="p-3 text-left">Total</th>
                    <th className="p-3 text-left">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitudes.map(s => (
                    <tr key={s.id_solicitud} className="border-b hover:bg-gray-50">
                      <td className="p-3">{s.id_solicitud}</td>
                      <td className="p-3">{s.solicitante}</td>
                      <td className="p-3">{s.departamento}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getColorEstado(s.estado)}`}>
                          {s.estado}
                        </span>
                      </td>
                      <td className="p-3">{s.prioridad}</td>
                      <td className="p-3">₡{s.total.toLocaleString()}</td>
                      <td className="p-3">{s.fecha_solicitud}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}