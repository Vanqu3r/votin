import '../style/Navbar.css';
import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const LogoutButton = () => {
  const { user, logout } = useAuth();
  const [showModal, setShowModal] = useState(false);

  // Cerrar con tecla ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowModal(false);
      }
    };

    if (showModal) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showModal]);

  // Cerrar haciendo click fuera del contenido
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setShowModal(false);
    }
  };

  const handleLogout = () => {
    logout();
    setShowModal(false);
  };

  if (!user) return null;

  return (
    <>
      <button 
        onClick={() => setShowModal(true)}
        className="logout-button"
      >
        Cerrar sesión
      </button>

      {showModal && (
        <div 
          className="modal-overlay" 
          onClick={handleOverlayClick}
        >
          <div className="modal-content">
            <h3>Confirmar cierre de sesión</h3>
            <p>¿Estás seguro que deseas cerrar tu sesión?</p>
            
            <div className="modal-actions">
              <button 
                onClick={() => setShowModal(false)}
                className="modal-button modal-cancel"
              >
                Cancelar
              </button>
              <button 
                onClick={handleLogout}
                className="modal-button modal-confirm"
              >
                Sí, cerrar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutButton;