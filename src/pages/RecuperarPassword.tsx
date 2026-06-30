import { useState } from 'react';
import { api } from '../services/api';

interface Props {
  onBack: () => void;
}

export default function RecuperarPassword({ onBack }: Props) {
  const [paso, setPaso] = useState<'solicitar' | 'cambiar'>('solicitar');
  const [correo, setCorreo] = useState('');
  const [codigo, setCodigo] = useState('');
  const [nuevaPass, setNuevaPass] = useState('');
  const [confirmarPass, setConfirmarPass] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSolicitarReset = async () => {
    setError('');
    if (!correo) {
      setError('El correo es obligatorio');
      return;
    }
    setLoading(true);
    const res = await api.post('/auth/solicitar-reset', { correo });
    if (res.success) {
      setSuccess('Código generado: ' + res.codigo);
      setPaso('cambiar');
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  const handleCambiarPassword = async () => {
    setError('');
    if (!codigo || !nuevaPass || !confirmarPass) {
      setError('Todos los campos son obligatorios');
      return;
    }
    if (nuevaPass !== confirmarPass) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    const res = await api.post('/auth/cambiar-password', {
      correo,
      codigo,
      nueva_pass: nuevaPass,
    });
    if (res.success) {
      setSuccess('Contraseña actualizada correctamente');
      setTimeout(() => onBack(), 2000);
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">SIGESCOM</h1>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Recuperar Contraseña</h2>

        {paso === 'solicitar' && (
          <>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={e => setCorreo(e.target.value)}
              className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <button
              onClick={handleSolicitarReset}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mb-3"
            >
              {loading ? 'Enviando...' : 'Solicitar Código'}
            </button>
          </>
        )}

        {paso === 'cambiar' && (
          <>
            {success && <p className="text-green-500 text-sm mb-3">{success}</p>}
            <input
              placeholder="Código de recuperación"
              value={codigo}
              onChange={e => setCodigo(e.target.value)}
              className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={nuevaPass}
              onChange={e => setNuevaPass(e.target.value)}
              className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmarPass}
              onChange={e => setConfirmarPass(e.target.value)}
              className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
            <button
              onClick={handleCambiarPassword}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mb-3"
            >
              {loading ? 'Actualizando...' : 'Cambiar Contraseña'}
            </button>
          </>
        )}

        <button
          onClick={onBack}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Volver al Login
        </button>
      </div>
    </div>
  );
}