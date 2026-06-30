import { useEffect, useState } from 'react';
import { api } from '../services/api';

interface Props {
  id_usuario: number;
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

export default function GestionarSolicitudes({ id_usuario, onBack }: Props) {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [observacion, setObservacion] = useState('');
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchSolicitudes = async () => {
    setLoading(true);
    const res = await api.get('/solicitudes/filtros?estado=PENDIENTE');
    if (res.success) setSolicitudes(res.solicitudes);
    setLoading(false);
  };

  useEffect(() => {
    fetchSolicitudes();
  }, []);

  const handleAccion = async (accion: string) => {
    setError('');
    setSuccess('');
    if (!observacion) {
      setError('La observación es obligatoria');
      return;
    }
    const endpoint = accion === 'APROBAR'
      ? `/solicitudes/${selectedId}/aprobar`
      : accion === 'RECHAZAR'
      ? `/solicitudes/${selectedId}/rechazar`
      : `/solicitudes/${selectedId}/devolver`;

    const res = await api.put(endpoint, { id_usuario, observacion });
    if (res.success) {
      setSuccess(res.message);
      setSelectedId(null);
      setObservacion('');
      fetchSolicitudes();
    } else {
      setError(res.message);
    }
  };

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case 'PENDIENTE': return 'bg-yellow-100 text-yellow-700';
      case 'REQUIERE_APROBACION_ESPECIAL': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Gestionar Solicitudes</h2>
        <button
          onClick={onBack}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Volver
        </button>
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando solicitudes...</p>
      ) : solicitudes.length === 0 ? (
        <p className="text-gray-500">No hay solicitudes pendientes.</p>
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
                <th className="p-3 text-left">Acciones</th>
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
                  <td className="p-3">
                    <button
                      onClick={() => { setSelectedId(s.id_solicitud); setError(''); setSuccess(''); }}
                      className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-blue-700 transition"
                    >
                      Gestionar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* PANEL DE GESTIÓN */}
      {selectedId && (
        <div className="mt-6 bg-white rounded-xl shadow p-6 max-w-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Gestionar Solicitud #{selectedId}
          </h3>

          <textarea
            placeholder="Observación (obligatoria)"
            value={observacion}
            onChange={e => setObservacion(e.target.value)}
            className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={3}
          />

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-3">{success}</p>}

          <div className="flex gap-2">
            <button
              onClick={() => handleAccion('APROBAR')}
              className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              Aprobar
            </button>
            <button
              onClick={() => handleAccion('RECHAZAR')}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
            >
              Rechazar
            </button>
            <button
              onClick={() => handleAccion('DEVOLVER')}
              className="flex-1 bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Devolver
            </button>
          </div>
        </div>
      )}
    </div>
  );
}