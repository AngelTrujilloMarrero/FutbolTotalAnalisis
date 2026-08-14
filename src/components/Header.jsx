import React from 'react';

export default function Header({
  currentMatch,
  activeTab,
  setActiveTab,
  onOpenMatchManager,
  onOpenStats,
  onOpenVideo,
  isOnline,
  onUndoLastEvent
}) {
  return (
    <header className="app-header">
      <div className="brand-section">
        <div className="brand-logo">FT</div>
        <div>
          <div className="brand-title">
            FútbolTotal <span style={{ color: '#38bdf8' }}>Análisis</span>
          </div>
          <div className="brand-subtitle">
            {currentMatch ? `${currentMatch.homeTeam || 'Equipo Propio'} vs ${currentMatch.awayTeam || 'Rival FC'}` : 'Sin partido activo'}
          </div>
        </div>
      </div>

      <div className="header-actions">
        {/* Sync Status */}
        <div className={`sync-badge ${isOnline ? 'online' : 'offline'}`} title={isOnline ? 'Firebase Conectado' : 'Sin conexión'}>
          <span className="sync-dot" />
          <span>{isOnline ? 'Firebase En Vivo' : 'Desconectado'}</span>
        </div>

        {/* View Switcher */}
        <button 
          className={`btn-sm ${activeTab === 'pro' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('pro')}
          title="Panel táctico completo (Foto 2)"
        >
          Matriz Táctica Pro
        </button>

        <button 
          className={`btn-sm ${activeTab === 'quick' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('quick')}
          title="Panel de conteo rápido (Foto 1)"
        >
          Modo Rápido
        </button>

        <button 
          className="btn-sm btn-secondary"
          onClick={onOpenStats}
          title="Ver estadísticas y mapa de calor"
        >
          📊 Estadísticas
        </button>

        <button 
          className="btn-sm btn-secondary"
          onClick={onOpenVideo}
          title="Sincronizar con reproductor de video"
        >
          🎬 Videoanálisis
        </button>

        <button 
          className="btn-sm btn-secondary"
          onClick={onUndoLastEvent}
          title="Deshacer último evento tagueado"
        >
          ↩ Deshacer
        </button>

        <button 
          className="btn-sm btn-emerald"
          onClick={onOpenMatchManager}
          title="Gestionar partidos y alineación"
        >
          ⚙ Partidos
        </button>
      </div>
    </header>
  );
}
