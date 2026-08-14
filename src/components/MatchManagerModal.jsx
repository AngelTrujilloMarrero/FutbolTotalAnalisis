import React, { useState } from 'react';

export default function MatchManagerModal({
  isOpen,
  onClose,
  matches = [],
  currentMatchId,
  onSelectMatch,
  onCreateMatch,
  onDeleteMatch
}) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [homeTeam, setHomeTeam] = useState('Equipo Propio');
  const [awayTeam, setAwayTeam] = useState('Rival FC');
  const [category, setCategory] = useState('Senior');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!homeTeam.trim() || !awayTeam.trim()) return;
    onCreateMatch({
      homeTeam: homeTeam.trim(),
      awayTeam: awayTeam.trim(),
      category: category.trim(),
      date,
      createdAt: Date.now()
    });
    setShowCreateForm(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
            ⚽ Gestión de Partidos & Sesiones
          </h3>
          <button className="btn-sm btn-secondary" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {!showCreateForm ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                  Partidos en Firebase ({matches.length})
                </span>
                <button
                  className="btn-emerald btn-sm"
                  onClick={() => setShowCreateForm(true)}
                >
                  + Nuevo Partido
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '350px', overflowY: 'auto' }}>
                {matches.length === 0 ? (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>
                    No hay partidos guardados. ¡Crea tu primer partido para empezar a analizar!
                  </div>
                ) : (
                  matches.map((m) => {
                    const isSelected = m.id === currentMatchId;
                    return (
                      <div
                        key={m.id}
                        style={{
                          background: isSelected ? 'rgba(2, 132, 199, 0.15)' : 'var(--bg-secondary)',
                          border: isSelected ? '2px solid #0284c7' : '1px solid var(--border-subtle)',
                          borderRadius: '8px',
                          padding: '0.75rem 1rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.95rem', color: '#f8fafc' }}>
                            {m.homeTeam || 'Propio'} vs {m.awayTeam || 'Rival'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {m.date || 'Sin fecha'} • Categoría: {m.category || 'Senior'} • Marcador: {m.homeScore || 0}-{m.awayScore || 0}
                          </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          {!isSelected && (
                            <button
                              className="btn-primary btn-sm"
                              onClick={() => {
                                onSelectMatch(m.id);
                                onClose();
                              }}
                            >
                              Seleccionar
                            </button>
                          )}
                          <button
                            className="btn-danger btn-sm"
                            onClick={() => {
                              if (window.confirm('¿Seguro que deseas eliminar este partido y todos sus eventos?')) {
                                onDeleteMatch(m.id);
                              }
                            }}
                            title="Eliminar partido"
                          >
                            🗑
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h4 style={{ fontWeight: 800 }}>Crear Nuevo Partido</h4>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Equipo Propio / Local</label>
                <input
                  type="text"
                  required
                  value={homeTeam}
                  onChange={(e) => setHomeTeam(e.target.value)}
                  className="input-control"
                  placeholder="Ej: CF Unión"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Equipo Rival / Visitante</label>
                <input
                  type="text"
                  required
                  value={awayTeam}
                  onChange={(e) => setAwayTeam(e.target.value)}
                  className="input-control"
                  placeholder="Ej: Atlético B"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Categoría</label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="input-control"
                    placeholder="Ej: Juvenil A"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Fecha</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input-control"
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-emerald btn-sm"
                >
                  Crear e Iniciar
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary btn-sm" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
