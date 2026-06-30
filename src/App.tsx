import { useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import RecuperarPassword from './pages/RecuperarPassword';
import Dashboard from './pages/Dashboard';

export default function App() {
  const [vista, setVista] = useState<'login' | 'register' | 'recuperar' | 'dashboard'>('login');
  const [usuario, setUsuario] = useState<{ id: number; nombre: string; rol: string } | null>(null);

  const handleLogin = (id_usuario: number, nombre: string, rol: string) => {
    setUsuario({ id: id_usuario, nombre, rol });
    setVista('dashboard');
  };

  const handleLogout = () => {
    setUsuario(null);
    setVista('login');
  };

  return (
    <>
      {vista === 'login' && (
        <Login
          onLogin={handleLogin}
          onRegister={() => setVista('register')}
          onRecuperar={() => setVista('recuperar')}
        />
      )}
      {vista === 'register' && (
        <Register onBack={() => setVista('login')} />
      )}
      {vista === 'recuperar' && (
        <RecuperarPassword onBack={() => setVista('login')} />
      )}
      {vista === 'dashboard' && usuario && (
        <Dashboard
          id_usuario={usuario.id}
          nombre={usuario.nombre}
          rol={usuario.rol}
          onLogout={handleLogout}
        />
      )}
    </>
  );
}