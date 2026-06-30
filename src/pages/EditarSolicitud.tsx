import { useState, useEffect } from 'react';
import { api } from '../services/api';

interface Props {
  id_solicitud: number;
  id_usuario: number;
  onBack: () => void;
}

interface Item {
  id_detalle?: number;
  tipo_item: string;
  descripcion: string;
  cantidad: number;
  precio_estimado: number;
  proveedor_sug: string;
}

export default function EditarSolicitud({ id_solicitud, id_usuario, onBack }: Props) {
  const [form, setForm] = useState({
    prioridad: '',
    justificacion: '',
    observaciones: '',
  });
  const [items, setItems] = useState<Item[]>([]);
  const [nuevoItem, setNuevoItem] = useState<Item>({
    tipo_item: 'PRODUCTO',
    descripcion: '',
    cantidad: 1,
    precio_estimado: 0,
    proveedor_sug: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [totales, setTotales] = useState<any>(null);

  const fetchDetalle = async () => {
    setLoading(true);
    const res = await api.get(`/solicitudes/${id_solicitud}`);
    if (res.success) {
      setForm({
        prioridad: res.solicitud.prioridad,
        justificacion: res.solicitud.justificacion,
        observaciones: '',
      });
      setItems(res.solicitud.items);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDetalle();
  }, []);

  const handleGuardarEncabezado = async () => {
    setError('');
    setSuccess('');
    if (!form.prioridad || !form.justificacion) {
      setError('Prioridad y justificación son obligatorias');
      return;
    }
    const res = await api.put('/solicitudes/encabezado', {
      id_solicitud,
      id_usuario,
      ...form,
    });
    if (res.success) {
      setSuccess('Encabezado actualizado correctamente');
    } else {
      setError(res.message);
    }
  };

  const handleAgregarItem = async () => {
    setError('');
    if (!nuevoItem.descripcion || nuevoItem.cantidad <= 0 || nuevoItem.precio_estimado <= 0) {
      setError('Descripción, cantidad y precio son obligatorios');
      return;
    }
    const res = await api.post('/solicitudes/items', {
      id_solicitud,
      ...nuevoItem,
    });
    if (res.success) {
      setSuccess('Ítem agregado correctamente');
      setNuevoItem({ tipo_item: 'PRODUCTO', descripcion: '', cantidad: 1, precio_estimado: 0, proveedor_sug: '' });
      fetchDetalle();
    } else {
      setError(res.message);
    }
  };

  const handleEliminarItem = async (id_detalle: number) => {
    setError('');
    const res = await fetch(
      `https://g618625fbf2dd27-sigescom.adb.mx-queretaro-1.oraclecloudapps.com/ords/adminbd/sigescom/solicitudes/items/${id_detalle}`,
      {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario }),
      }
    );
    const data = await res.json();
    if (data.success) {
      setSuccess('Ítem eliminado correctamente');
      fetchDetalle();
    } else {
      setError(data.message);
    }
  };

  const handleCalcular = async () => {
    const res = await api.post('/solicitudes/calcular', { id_solicitud });
    if (res.success) setTotales(res);
  };

  const handleReenviar = async () => {
    setError('');
    if (items.length === 0) {
      setError('Debe tener al menos un ítem antes de reenviar');
      return;
    }
    const res = await api.put(`/solicitudes/${id_solicitud}/reenviar`, { id_usuario });
    if (res.success) {
      setSuccess('Solicitud reenviada correctamente');
      setTimeout(() => onBack(), 2000);
    } else {
      setError(res.message);
    }
  };

  if (loading) return <div className="p-6">Cargando...</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-700">Corregir Solicitud #{id_solicitud}</h2>
        <button onClick={onBack} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition">
          Volver
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      {success && <p className="text-green-500 text-sm mb-3">{success}</p>}

      {/* ENCABEZADO */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Datos de la solicitud</h3>

        <label className="block text-xs font-medium text-gray-500 mb-1">Prioridad</label>
        <select
          value={form.prioridad}
          onChange={e => setForm({ ...form, prioridad: e.target.value })}
          className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
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

        <button
          onClick={handleGuardarEncabezado}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Guardar Encabezado
        </button>
      </div>

      {/* ITEMS ACTUALES */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Ítems actuales</h3>

        {items.length === 0 ? (
          <p className="text-gray-500 text-sm mb-3">No hay ítems. Agregá al menos uno.</p>
        ) : (
          items.map((it, i) => (
            <div key={i} className="flex justify-between items-center border-b py-2 text-sm">
              <div>
                <span className="font-semibold">{it.tipo_item}</span> - {it.descripcion} x{it.cantidad} @ ₡{it.precio_estimado.toLocaleString()}
              </div>
              {it.id_detalle && (
                <button
                  onClick={() => handleEliminarItem(it.id_detalle!)}
                  className="text-red-500 text-xs hover:underline"
                >
                  Eliminar
                </button>
              )}
            </div>
          ))
        )}

        <h4 className="text-sm font-semibold text-gray-600 mt-4 mb-2">Agregar nuevo ítem</h4>

        <label className="block text-xs font-medium text-gray-500 mb-1">Tipo de ítem</label>
        <select
          value={nuevoItem.tipo_item}
          onChange={e => setNuevoItem({ ...nuevoItem, tipo_item: e.target.value })}
          className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="PRODUCTO">PRODUCTO</option>
          <option value="SERVICIO">SERVICIO</option>
        </select>

        <label className="block text-xs font-medium text-gray-500 mb-1">Descripción</label>
        <input
          placeholder="Ej: Laptop Dell 16GB"
          value={nuevoItem.descripcion}
          onChange={e => setNuevoItem({ ...nuevoItem, descripcion: e.target.value })}
          className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block text-xs font-medium text-gray-500 mb-1">Cantidad</label>
        <input
          type="number"
          placeholder="Ej: 1"
          value={nuevoItem.cantidad}
          onChange={e => setNuevoItem({ ...nuevoItem, cantidad: Number(e.target.value) })}
          className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block text-xs font-medium text-gray-500 mb-1">Precio estimado (₡)</label>
        <input
          type="number"
          placeholder="Ej: 450000"
          value={nuevoItem.precio_estimado}
          onChange={e => setNuevoItem({ ...nuevoItem, precio_estimado: Number(e.target.value) })}
          className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <label className="block text-xs font-medium text-gray-500 mb-1">Proveedor sugerido (opcional)</label>
        <input
          placeholder="Ej: Conico"
          value={nuevoItem.proveedor_sug}
          onChange={e => setNuevoItem({ ...nuevoItem, proveedor_sug: e.target.value })}
          className="w-full border rounded-lg p-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleAgregarItem}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Agregar Ítem
        </button>
      </div>

      {/* TOTALES */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <button
          onClick={handleCalcular}
          className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition mb-3"
        >
          Recalcular Totales
        </button>

        {totales && (
          <div className="text-sm text-gray-600">
            <div className="flex justify-between py-1 border-b">
              <span>Subtotal</span>
              <span>₡{totales.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b">
              <span>Impuesto</span>
              <span>₡{totales.impuesto.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 font-bold text-gray-800">
              <span>Total</span>
              <span>₡{totales.total.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>

      {/* REENVIAR */}
      <button
        onClick={handleReenviar}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
      >
        Reenviar a Aprobación
      </button>
    </div>
  );
}