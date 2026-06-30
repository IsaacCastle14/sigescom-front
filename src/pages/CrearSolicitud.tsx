import { useState } from 'react';
import { api } from '../services/api';

interface Props {
  id_usuario: number;
  onBack: () => void;
}

interface Item {
  tipo_item: string;
  descripcion: string;
  cantidad: number;
  precio_estimado: number;
  proveedor_sug: string;
}

export default function CrearSolicitud({ id_usuario, onBack }: Props) {
  const [paso, setPaso] = useState<'encabezado' | 'items' | 'resumen'>('encabezado');
  const [id_solicitud, setIdSolicitud] = useState<number | null>(null);
  const [form, setForm] = useState({
    prioridad: '',
    justificacion: '',
    observaciones: '',
  });
  const [item, setItem] = useState<Item>({
    tipo_item: 'PRODUCTO',
    descripcion: '',
    cantidad: 1,
    precio_estimado: 0,
    proveedor_sug: '',
  });
  const [items, setItems] = useState<Item[]>([]);
  const [totales, setTotales] = useState<any>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCrearSolicitud = async () => {
    setError('');
    if (!form.prioridad || !form.justificacion) {
      setError('Prioridad y justificación son obligatorias');
      return;
    }
    setLoading(true);
    const res = await api.post('/solicitudes', {
      id_usuario,
      prioridad: form.prioridad,
      justificacion: form.justificacion,
      observaciones: form.observaciones,
    });
    if (res.success) {
      setIdSolicitud(res.id_solicitud);
      setPaso('items');
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  const handleAgregarItem = async () => {
    setError('');
    if (!item.descripcion || item.cantidad <= 0 || item.precio_estimado <= 0) {
      setError('Descripción, cantidad y precio son obligatorios');
      return;
    }
    setLoading(true);
    const res = await api.post('/solicitudes/items', {
      id_solicitud,
      ...item,
    });
    if (res.success) {
      setItems([...items, item]);
      setItem({ tipo_item: 'PRODUCTO', descripcion: '', cantidad: 1, precio_estimado: 0, proveedor_sug: '' });
      setSuccess('Ítem agregado correctamente');
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  const handleVerResumen = async () => {
    setLoading(true);
    const res = await api.post('/solicitudes/calcular', { id_solicitud });
    if (res.success) {
      setTotales(res);
      setPaso('resumen');
    }
    setLoading(false);
  };

  const handleEnviar = async () => {
    setLoading(true);
    const res = await api.post('/solicitudes/enviar', { id_solicitud, id_usuario });
    if (res.success) {
      setSuccess('Solicitud enviada correctamente');
      setTimeout(() => onBack(), 2000);
    } else {
      setError(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Crear Solicitud</h2>
        <button onClick={onBack} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
          Volver
        </button>
      </div>

      {/* PASO 1: ENCABEZADO */}
      {paso === 'encabezado' && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Paso 1: Datos de la solicitud</h3>

          <label className="block text-xs font-medium text-gray-500 mb-1">Prioridad</label>
          <select
            value={form.prioridad}
            onChange={e => setForm({ ...form, prioridad: e.target.value })}
            className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Seleccione prioridad</option>
            <option value="BAJA">BAJA</option>
            <option value="MEDIA">MEDIA</option>
            <option value="ALTA">ALTA</option>
            <option value="URGENTE">URGENTE</option>
          </select>

          <label className="block text-xs font-medium text-gray-500 mb-1">Justificación</label>
          <textarea
            placeholder="Explicá por qué necesitás esta compra"
            value={form.justificacion}
            onChange={e => setForm({ ...form, justificacion: e.target.value })}
            className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={3}
          />

          <label className="block text-xs font-medium text-gray-500 mb-1">Observaciones (opcional)</label>
          <textarea
            placeholder="Información adicional, opcional"
            value={form.observaciones}
            onChange={e => setForm({ ...form, observaciones: e.target.value })}
            className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
            rows={2}
          />

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            onClick={handleCrearSolicitud}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? 'Creando...' : 'Siguiente'}
          </button>
        </div>
      )}

      {/* PASO 2: ITEMS */}
      {paso === 'items' && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Paso 2: Agregar ítems</h3>

          <label className="block text-xs font-medium text-gray-500 mb-1">Tipo de ítem</label>
          <select
            value={item.tipo_item}
            onChange={e => setItem({ ...item, tipo_item: e.target.value })}
            className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="PRODUCTO">PRODUCTO</option>
            <option value="SERVICIO">SERVICIO</option>
          </select>

          <label className="block text-xs font-medium text-gray-500 mb-1">Descripción</label>
          <input
            placeholder="Ej: Laptop Dell 16GB"
            value={item.descripcion}
            onChange={e => setItem({ ...item, descripcion: e.target.value })}
            className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label className="block text-xs font-medium text-gray-500 mb-1">Cantidad</label>
          <input
            type="number"
            placeholder="Ej: 1"
            value={item.cantidad}
            onChange={e => setItem({ ...item, cantidad: Number(e.target.value) })}
            className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label className="block text-xs font-medium text-gray-500 mb-1">Precio estimado (₡)</label>
          <input
            type="number"
            placeholder="Ej: 450000"
            value={item.precio_estimado}
            onChange={e => setItem({ ...item, precio_estimado: Number(e.target.value) })}
            className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label className="block text-xs font-medium text-gray-500 mb-1">Proveedor sugerido (opcional)</label>
          <input
            placeholder="Ej: Conico"
            value={item.proveedor_sug}
            onChange={e => setItem({ ...item, proveedor_sug: e.target.value })}
            className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-3">{success}</p>}

          <button
            onClick={handleAgregarItem}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition mb-3"
          >
            {loading ? 'Agregando...' : 'Agregar Ítem'}
          </button>

          {items.length > 0 && (
            <div className="mb-3">
              <p className="text-sm font-semibold text-gray-600 mb-2">Ítems agregados: {items.length}</p>
              {items.map((it, i) => (
                <div key={i} className="text-sm text-gray-600 border-b py-1">
                  {it.tipo_item} - {it.descripcion} x{it.cantidad} @ ₡{it.precio_estimado.toLocaleString()}
                </div>
              ))}
            </div>
          )}

          {items.length > 0 && (
            <button
              onClick={handleVerResumen}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Ver Resumen
            </button>
          )}
        </div>
      )}

      {/* PASO 3: RESUMEN */}
      {paso === 'resumen' && totales && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Paso 3: Resumen</h3>

          <div className="text-sm text-gray-600 mb-4">
            <div className="flex justify-between py-1 border-b">
              <span>Subtotal</span>
              <span>₡{totales.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span>IVA ({totales.iva_pct}%)</span>
              <span>₡{totales.impuesto.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 font-bold text-gray-800">
              <span>Total</span>
              <span>₡{totales.total.toLocaleString()}</span>
            </div>
            {totales.requiere_aprobacion_especial === 'S' && (
              <p className="text-orange-500 mt-2">⚠️ Esta solicitud requiere aprobación especial</p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-3">{success}</p>}

          <button
            onClick={handleEnviar}
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? 'Enviando...' : 'Enviar Solicitud'}
          </button>
        </div>
      )}
    </div>
  );
}