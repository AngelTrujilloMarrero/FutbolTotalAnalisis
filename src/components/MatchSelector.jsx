import React, { useState } from 'react';

const emptyForm = {
  homeTeam: 'Equipo Propio',
  awayTeam: 'Rival FC',
  jornada: 'Jornada 1'
};

export default function MatchSelector({
  matches = [],
  currentMatchId,
  onSelectMatch,
  onCreateMatch,
  onUpdateMatch,
  onDeleteMatch
}) {
  // formMode: null (cerrado) | 'create' | id del partido a editar
  const [formMode, setFormMode] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const openCreate = () => {
    setForm(emptyForm);
    setFormMode('create');
  };

  const openEdit = (m) => {
    setForm({
      homeTeam: m.homeTeam || '',
      awayTeam: m.awayTeam || '',
      jornada: m.jornada || m.category || ''
    });
    setFormMode(m.id);
  };

  const setField = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.homeTeam.trim() || !form.awayTeam.trim()) return;

    const payload = {
      homeTeam: form.homeTeam.trim(),
      awayTeam: form.awayTeam.trim(),
      jornada: form.jornada.trim()
    };

    if (formMode === 'create') {
      onCreateMatch({ ...payload, createdAt: Date.now() });
    } else if (formMode) {
      onUpdateMatch(formMode, payload);
    }
    setFormMode(null);
  };

  return (
    <div className="match-selector">
      <div className="match-selector-header">
        <div className="match-selector-title">
          {currentMatchId && (
            <span className="match-selector-active-label">Activo: {matches.find((m) => m.id === currentMatchId)?.homeTeam || '—'} vs {matches.find((m) => m.id === currentMatchId)?.awayTeam || '—'}</span>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
          <button
            className="btn-secondary btn-sm"
            disabled
            title="Próximamente: comparativa entre partidos"
          >
            📊 Comparar
          </button>
          <button className="btn-emerald btn-sm" onClick={openCreate}>
            + Añadir Partido
          </button>
        </div>
      </div>

      <div className="match-selector-list">
        {matches.length === 0 && (
          <div className="match-selector-empty">
            No hay partidos. Añade el primero con el botón "+ Añadir Partido".
          </div>
        )}

        {matches.map((m) => {
          const isActive = m.id === currentMatchId;
          return (
            <div
              key={m.id}
              className={`match-card ${isActive ? 'active' : ''}`}
              onClick={() => onSelectMatch(m.id)}
              title="Haz clic para seleccionar este partido"
            >
              <span className="match-card-teams">
                {m.homeTeam || 'Propio'} <span className="match-card-vs">vs</span> {m.awayTeam || 'Rival'}
              </span>
              <span className="match-card-jornada">
                {(() => {
                  const j = m.jornada || m.category || '';
                  if (!j) return 'Sin jornada';
                  return j.toLowerCase().startsWith('jornada') ? j : `Jornada ${j}`;
                })()}
              </span>
              <span className="match-card-score">
                Marcador: {m.homeScore || 0} - {m.awayScore || 0}
              </span>

              <div className="match-card-actions">
                <button
                  className="btn-secondary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEdit(m);
                  }}
                  title="Editar partido"
                >
                  ✏ Editar
                </button>
                <button
                  className="btn-danger btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm(`¿Eliminar "${m.homeTeam || 'Propio'} vs ${m.awayTeam || 'Rival'}" y todos sus eventos?`)) {
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
        })}

        <button className="match-card-add" onClick={openCreate}>
          <span style={{ fontSize: '1.1rem', fontWeight: 900 }}>+</span> Nuevo partido
        </button>
      </div>

      {/* Formulario crear / editar */}
      {formMode !== null && (
        <div className="modal-overlay" onClick={() => setFormMode(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>
                {formMode === 'create' ? '➕ Nuevo Partido' : '✏️ Editar Partido'}
              </h3>
              <button className="btn-sm btn-secondary" onClick={() => setFormMode(null)}>✕</button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Equipo Propio / Local</label>
                  <input type="text" required value={form.homeTeam} onChange={setField('homeTeam')} className="input-control" placeholder="Ej: CF Unión" />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Equipo Rival / Visitante</label>
                  <input type="text" required value={form.awayTeam} onChange={setField('awayTeam')} className="input-control" placeholder="Ej: Atlético B" />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Jornada</label>
                  <input type="text" value={form.jornada} onChange={setField('jornada')} className="input-control" placeholder="Ej: Jornada 5" />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-secondary btn-sm" onClick={() => setFormMode(null)}>Cancelar</button>
                <button type="submit" className="btn-emerald btn-sm">
                  {formMode === 'create' ? 'Crear e Iniciar' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}