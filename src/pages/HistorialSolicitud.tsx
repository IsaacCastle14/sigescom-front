import {  useState } from 'react';
import { api } from '../services/api';

interface Props {
  onBack: () => void;
}

interface Historial {
  id_historial: number;
  usuario: string;
  estado_anterior: string;
  estado_nuevo: string;
  observacion: string;
  fecha: string;
}

export default function HistorialSolicitud({ onBack }: Props) {
  const [id_solicitud, setIdSolicitud] = useState('');
  const [historial, setHistorial] = useState<Historial[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [buscado, setBuscado] = useState(false);

  const handleBuscar = async () => {
    setError('');
    if (!id_solicitud) {
      setError('Ingresá el ID de la solicitud');
      return;
    }
    setLoading(true);
    const res = await api.get(`/solicitudes/historial/${id_solicitud}`);
    if (res.success) {
      setHistorial(res.historial);
      setBuscado(true);
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case 'APROBADA':  return 'text-green-600';
      case 'RECHAZADA': return 'text-red-600';
      case 'PENDIENTE': return 'text-yellow-600';
      case 'DEVUELTA':  return 'text-orange-600';
      case 'BORRADOR':  return 'text-gray-600';
      default:          return 'text-blue-600';
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Historial de Solicitud</h2>
        <button
          onClick={onBack}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Volver
        </button>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex gap-3">
          <input
            type="number"
            placeholder="ID de la solicitud"
            value={id_solicitud}
            onChange={e => setIdSolicitud(e.target.value)}
            className="flex-1 border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={handleBuscar}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {buscado && historial.length === 0 && (
        <p className="text-gray-500">No hay historial para esta solicitud.</p>
      )}

      {historial.length > 0 && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Historial de Solicitud #{id_solicitud}
          </h3>
          <div className="relative">
            {historial.map((h, i) => (
              <div key={h.id_historial} className="flex gap-4 mb-6">
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full bg-blue-600 mt-1"></div>
                  {i < historial.length - 1 && (
                    <div className="w-0.5 bg-blue-200 flex-1 mt-1"></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-semibold text-gray-700">{h.usuario}</span>
                      <span className="text-gray-400 text-sm ml-2">{h.fecha}</span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    <span className={getColorEstado(h.estado_anterior)}>{h.estado_anterior}</span>
                    {h.estado_anterior !== '--' && <span className="mx-2">→</span>}
                    <span className={`font-semibold ${getColorEstado(h.estado_nuevo)}`}>{h.estado_nuevo}</span>
                  </div>
                  {h.observacion && (
                    <p className="text-sm text-gray-500 mt-1 italic">"{h.observacion}"</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}