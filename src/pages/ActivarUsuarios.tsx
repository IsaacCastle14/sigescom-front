import { useEffect, useState } from 'react';
import { api } from '../services/api';

interface Props {
  id_usuario_admin: number;
  onBack: () => void;
}

interface UsuarioPendiente {
  id_usuario: number;
  nombre: string;
  correo: string;
  puesto: string;
  departamento: string;
  fecha: string;
}

export default function ActivarUsuarios({ id_usuario_admin, onBack }: Props) {
  const [usuarios, setUsuarios] = useState<UsuarioPendiente[]>([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');

  const fetchPendientes = async () => {
    setLoading(true);
    const res = await api.get('/usuarios/pendientes');
    if (res.success) setUsuarios(res.usuarios);
    setLoading(false);
  };

  useEffect(() => {
    fetchPendientes();
  }, []);

  const handleActivar = async (id_usuario: number) => {
    setMensaje('');
    const res = await api.put(`/usuarios/${id_usuario}/activar`, { id_usuario_admin });
    if (res.success) {
      setMensaje(res.message);
      fetchPendientes();
    } else {
      setMensaje(res.message);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Activar Usuarios</h2>
        <button
          onClick={onBack}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Volver
        </button>
      </div>

      {mensaje && (
        <div className="bg-blue-100 text-blue-700 p-3 rounded-lg mb-4">{mensaje}</div>
      )}

      {loading ? (
        <p className="text-gray-500">Cargando usuarios pendientes...</p>
      ) : usuarios.length === 0 ? (
        <p className="text-gray-500">No hay usuarios pendientes de activación.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-xl shadow text-sm">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Nombre</th>
                <th className="p-3 text-left">Correo</th>
                <th className="p-3 text-left">Puesto</th>
                <th className="p-3 text-left">Departamento</th>
                <th className="p-3 text-left">Fecha</th>
                <th className="p-3 text-left">Acción</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map(u => (
                <tr key={u.id_usuario} className="border-b hover:bg-gray-50">
                  <td className="p-3">{u.id_usuario}</td>
                  <td className="p-3">{u.nombre}</td>
                  <td className="p-3">{u.correo}</td>
                  <td className="p-3">{u.puesto}</td>
                  <td className="p-3">{u.departamento}</td>
                  <td className="p-3">{u.fecha}</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleActivar(u.id_usuario)}
                      className="bg-green-600 text-white px-3 py-1 rounded-lg text-xs hover:bg-green-700 transition"
                    >
                      Activar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}