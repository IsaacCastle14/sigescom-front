export interface Usuario {
  id_usuario: number;
  nombre_completo: string;
  correo: string;
  rol: string;
  departamento: string;
}

export interface Solicitud {
  id_solicitud: number;
  solicitante: string;
  departamento: string;
  estado: string;
  prioridad: string;
  total: number;
  req_aprobacion_esp: string;
  fecha_solicitud: string;
}

export interface DetalleSolicitud {
  tipo_item: string;
  descripcion: string;
  cantidad: number;
  precio_estimado: number;
  subtotal_linea: number;
  proveedor: string;
}

export interface Dashboard {
  total_solicitudes: number;
  aprobadas: number;
  rechazadas: number;
  pendientes: number;
  borradores: number;
  monto_total_solicitado: number;
  monto_total_aprobado: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  id_usuario?: number;
  nombre?: string;
  rol?: string;
}