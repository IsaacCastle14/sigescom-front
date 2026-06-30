import { useState } from 'react';
import { api } from '../services/api';

interface Props {
  onLogin: (id_usuario: number, nombre: string, rol: string) => void;
  onRegister: () => void;
  onRecuperar: () => void;
}

export default function Login({ onLogin, onRegister, onRecuperar }: Props) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    const res = await api.post('/auth/login', { correo, password });
    if (res.success) {
      onLogin(res.id_usuario, res.nombre, res.rol);
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">SIGESCOM</h1>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Iniciar Sesión</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={correo}
          onChange={e => setCorreo(e.target.value)}
          className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mb-3"
        >
          {loading ? 'Cargando...' : 'Ingresar'}
        </button>

        <button
          onClick={onRegister}
          className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition mb-2"
        >
          Registrarse
        </button>

        <button
          onClick={onRecuperar}
          className="w-full text-blue-600 text-sm hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>
    </div>
  );
}