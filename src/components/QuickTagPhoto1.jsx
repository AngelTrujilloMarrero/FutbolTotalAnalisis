import React from 'react';

export default function QuickTagPhoto1({
  counts = {},
  onTagEvent
}) {
  const handleTag = (category, type, team) => {
    onTagEvent({
      category,
      type,
      team
    });
  };

  return (
    <div style={{ padding: '1rem', background: '#0e1424', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
      <div style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
          Panel de Tagueo Rápido (Modo Simplificado / Foto 1)
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          Registro directo y conteo por bloques de equipo propio vs rival
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '850px', margin: '0 auto' }}>
        {/* COLUMNA EQUIPO PROPIO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#38bdf8', textTransform: 'uppercase' }}>
            Acciones Propias
          </h4>

          {/* Inicio propio */}
          <button
            className="tag-btn"
            style={{ background: '#ffffff', color: '#0f172a', padding: '0.8rem 1rem', fontSize: '0.95rem' }}
            onClick={() => handleTag('inicio', 'Inicio Propio', 'propio')}
          >
            <div className="tag-btn-content">
              <span>inicio propio</span>
            </div>
            <span className="tag-counter-badge" style={{ background: '#0f172a', color: '#fff', fontSize: '0.9rem' }}>
              {counts['inicio_propio'] || 0}
            </span>
          </button>

          {/* Corner propio */}
          <button
            className="tag-btn cat-yellow"
            style={{ padding: '0.8rem 1rem', fontSize: '0.95rem' }}
            onClick={() => handleTag('corner', 'Córner Propio', 'propio')}
          >
            <div className="tag-btn-content">
              <span>CORNER PROPIO</span>
            </div>
            <span className="tag-counter-badge" style={{ background: '#0f172a', color: '#fff', fontSize: '0.9rem' }}>
              {counts['corner_propio'] || 0}
            </span>
          </button>

          {/* Falta propio */}
          <button
            className="tag-btn cat-tiros"
            style={{ padding: '0.8rem 1rem', fontSize: '0.95rem' }}
            onClick={() => handleTag('falta', 'Falta Propio', 'propio')}
          >
            <div className="tag-btn-content">
              <span>FALTA PROPIO</span>
            </div>
            <span className="tag-counter-badge" style={{ background: '#0f172a', color: '#fff', fontSize: '0.9rem' }}>
              {counts['falta_propio'] || 0}
            </span>
          </button>

          {/* Ataque organizado */}
          <button
            className="tag-btn cat-yellow"
            style={{ padding: '0.8rem 1rem', fontSize: '0.95rem', marginTop: '1rem' }}
            onClick={() => handleTag('ataque', 'Ataque Organizado', 'propio')}
          >
            <div className="tag-btn-content">
              <span>ATAQUE ORGANIZADO</span>
            </div>
            <span className="tag-counter-badge" style={{ background: '#0f172a', color: '#fff', fontSize: '0.9rem' }}>
              {counts['ataque_organizado'] || 0}
            </span>
          </button>
        </div>

        {/* COLUMNA EQUIPO RIVAL */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f87171', textTransform: 'uppercase' }}>
            Acciones Rival
          </h4>

          {/* Inicio rival */}
          <button
            className="tag-btn"
            style={{ background: '#ffffff', color: '#0f172a', padding: '0.8rem 1rem', fontSize: '0.95rem' }}
            onClick={() => handleTag('inicio', 'Inicio Rival', 'rival')}
          >
            <div className="tag-btn-content">
              <span>inicio rival</span>
            </div>
            <span className="tag-counter-badge" style={{ background: '#0f172a', color: '#fff', fontSize: '0.9rem' }}>
              {counts['inicio_rival'] || 0}
            </span>
          </button>

          {/* Corner rival */}
          <button
            className="tag-btn cat-yellow"
            style={{ padding: '0.8rem 1rem', fontSize: '0.95rem' }}
            onClick={() => handleTag('corner', 'Córner Rival', 'rival')}
          >
            <div className="tag-btn-content">
              <span>CORNER RIVAL</span>
            </div>
            <span className="tag-counter-badge" style={{ background: '#0f172a', color: '#fff', fontSize: '0.9rem' }}>
              {counts['corner_rival'] || 0}
            </span>
          </button>

          {/* Falta rival */}
          <button
            className="tag-btn cat-tiros"
            style={{ padding: '0.8rem 1rem', fontSize: '0.95rem' }}
            onClick={() => handleTag('falta', 'Falta Rival', 'rival')}
          >
            <div className="tag-btn-content">
              <span>FALTA RIVAL</span>
            </div>
            <span className="tag-counter-badge" style={{ background: '#0f172a', color: '#fff', fontSize: '0.9rem' }}>
              {counts['falta_rival'] || 0}
            </span>
          </button>

          {/* Estructura */}
          <button
            className="tag-btn cat-lilac"
            style={{ padding: '0.8rem 1rem', fontSize: '0.95rem' }}
            onClick={() => handleTag('estructura', 'Estructura', 'rival')}
          >
            <div className="tag-btn-content">
              <span>ESTRUCTURA</span>
            </div>
            <span className="tag-counter-badge" style={{ background: '#0f172a', color: '#fff', fontSize: '0.9rem' }}>
              {counts['estructura'] || 0}
            </span>
          </button>

          {/* Goles */}
          <button
            className="tag-btn"
            style={{ background: '#c084fc', color: '#3b0764', padding: '0.8rem 1rem', fontSize: '0.95rem', fontWeight: 800 }}
            onClick={() => handleTag('goles', 'Gol Rival', 'rival')}
          >
            <div className="tag-btn-content">
              <span>GOLES</span>
            </div>
            <span className="tag-counter-badge" style={{ background: '#3b0764', color: '#fff', fontSize: '0.9rem' }}>
              {counts['goles_rival'] || 0}
            </span>
          </button>

          {/* Varios */}
          <button
            className="tag-btn"
            style={{ background: '#e2e8f0', color: '#334155', padding: '0.8rem 1rem', fontSize: '0.95rem', fontWeight: 700 }}
            onClick={() => handleTag('varios', 'Varios', 'ambos')}
          >
            <div className="tag-btn-content">
              <span>VARIOS</span>
            </div>
            <span className="tag-counter-badge" style={{ background: '#334155', color: '#fff', fontSize: '0.9rem' }}>
              {counts['varios'] || 0}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
