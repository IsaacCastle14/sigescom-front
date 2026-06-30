import { useEffect, useState } from 'react';
import { api } from '../services/api';
import EditarSolicitud from './EditarSolicitud';

interface Props {
  id_usuario: number;
  onBack: () => void;
}

interface Solicitud {
  id_solicitud: number;
  estado: string;
  prioridad: string;
  total: number;
  req_aprobacion_esp: string;
  fecha_solicitud: string;
  observacion_devuelta: string;
}

export default function MisSolicitudes({ id_usuario, onBack }: Props) {
  const [solicitudes, setSolicitudes] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState<number | null>(null);

  const fetchSolicitudes = async () => {
    setLoading(true);
    const res = await api.get(`/solicitudes/mis-solicitudes/${id_usuario}`);
    if (res.success) setSolicitudes(res.solicitudes);
    setLoading(false);
  };

  useEffect(() => {
    fetchSolicitudes();
  }, [id_usuario]);

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

  if (editando) {
    return (
      <EditarSolicitud
        id_solicitud={editando}
        id_usuario={id_usuario}
        onBack={() => {
          setEditando(null);
          fetchSolicitudes();
        }}
      />
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Mis Solicitudes</h2>
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
        <p className="text-gray-500">No tenés solicitudes registradas.</p>
      ) : (
        <div className="space-y-3">
          {solicitudes.map(s => (
            <div key={s.id_solicitud} className="bg-white rounded-xl shadow p-4">
              <div className="flex justify-between items-start flex-wrap gap-2">
                <div>
                  <span className="font-semibold text-gray-700">Solicitud #{s.id_solicitud}</span>
                  <span className={`ml-3 px-2 py-1 rounded-full text-xs font-semibold ${getColorEstado(s.estado)}`}>
                    {s.estado}
                  </span>
                </div>
                <span className="text-gray-500 text-sm">{s.fecha_solicitud}</span>
              </div>

              <div className="flex gap-6 text-sm text-gray-600 mt-2">
                <span>Prioridad: <strong>{s.prioridad}</strong></span>
                <span>Total: <strong>₡{s.total.toLocaleString()}</strong></span>
                {s.req_aprobacion_esp === 'S' && <span className="text-orange-500">⚠️ Aprobación especial</span>}
              </div>

              {s.estado === 'DEVUELTA' && (
                <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-3">
                  {s.observacion_devuelta && (
                    <>
                      <p className="text-sm font-semibold text-orange-700 mb-1">
                        Motivo de la devolución:
                      </p>
                      <p className="text-sm text-orange-600 italic">"{s.observacion_devuelta}"</p>
                    </>
                  )}
                  <button
                    onClick={() => setEditando(s.id_solicitud)}
                    className="mt-3 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-blue-700 transition"
                  >
                    Corregir Solicitud
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}