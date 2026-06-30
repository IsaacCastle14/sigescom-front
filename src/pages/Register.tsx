import { useState, useEffect } from 'react';
import { api } from '../services/api';

interface Props {
  onBack: () => void;
}

export default function Register({ onBack }: Props) {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    password: '',
    confirmar_password: '',
    id_departamento: '',
    puesto: '',
    telefono: '',
  });
  const [departamentos, setDepartamentos] = useState<{ id_departamento: number; nombre: string }[]>([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDeps = async () => {
      const res = await api.get('/catalogos/departamentos');
      if (res.success) setDepartamentos(res.departamentos);
    };
    fetchDeps();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setError('');
    setSuccess('');

    if (!form.nombre || !form.correo || !form.password || !form.id_departamento || !form.puesto) {
      setError('Todos los campos obligatorios deben estar completos');
      return;
    }

    if (form.password !== form.confirmar_password) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    const res = await api.post('/auth/register', {
      nombre: form.nombre,
      correo: form.correo,
      password: form.password,
      id_departamento: Number(form.id_departamento),
      puesto: form.puesto,
      telefono: form.telefono,
    });

    if (res.success) {
      setSuccess(res.message);
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-blue-700 mb-6">SIGESCOM</h1>
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Registro de Usuario</h2>

        <input
          name="nombre"
          placeholder="Nombre completo"
          value={form.nombre}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          name="correo"
          type="email"
          placeholder="Correo electrónico"
          value={form.correo}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          name="confirmar_password"
          type="password"
          placeholder="Confirmar contraseña"
          value={form.confirmar_password}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <select
          name="id_departamento"
          value={form.id_departamento}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Seleccione un departamento</option>
          {departamentos.map(d => (
            <option key={d.id_departamento} value={d.id_departamento}>
              {d.nombre}
            </option>
          ))}
        </select>
        <input
          name="puesto"
          placeholder="Puesto"
          value={form.puesto}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          name="telefono"
          placeholder="Teléfono (opcional)"
          value={form.telefono}
          onChange={handleChange}
          className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {success && <p className="text-green-500 text-sm mb-3">{success}</p>}

        <button
          onClick={handleRegister}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mb-3"
        >
          {loading ? 'Registrando...' : 'Registrarse'}
        </button>

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