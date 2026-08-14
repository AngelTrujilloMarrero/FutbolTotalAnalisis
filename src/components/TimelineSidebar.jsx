import React, { useState } from 'react';

export default function TimelineSidebar({
  events = [],
  onDeleteEvent,
  onSelectEvent,
  currentMatch
}) {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const formatTime = (secs) => {
    if (secs === undefined || isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const filteredEvents = events.filter((ev) => {
    if (filter === 'goals' && !ev.type?.toLowerCase().includes('gol')) return false;
    if (filter === 'tiros' && ev.category !== 'tiros') return false;
    if (filter === 'abp' && ev.category !== 'abp') return false;
    if (filter === 'propio' && ev.team !== 'propio') return false;
    if (filter === 'rival' && ev.team !== 'rival') return false;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const text = `${ev.type || ''} ${ev.category || ''} ${ev.playerDorsal || ''} ${ev.zoneName || ''}`.toLowerCase();
      return text.includes(term);
    }
    return true;
  });

  return (
    <aside className="timeline-sidebar">
      <div className="timeline-header">
        <div className="timeline-title">
          <span>⏱ Minutado en Vivo</span>
          <span className="tag-counter-badge" style={{ background: '#38bdf8', color: '#0f172a' }}>
            {events.length}
          </span>
        </div>
      </div>

      {/* Filter & Search */}
      <div style={{ padding: '0.4rem 0.6rem', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        <input
          type="text"
          placeholder="Buscar jugada..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-control"
          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
        />
        <div style={{ display: 'flex', gap: '0.2rem', overflowX: 'auto', paddingBottom: '2px' }}>
          {['all', 'goals', 'tiros', 'abp', 'propio', 'rival'].map((f) => (
            <button
              key={f}
              className={`btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
              style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem', textTransform: 'capitalize' }}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'Todos' : f}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="timeline-list">
        {filteredEvents.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 1rem', fontSize: '0.8rem' }}>
            No hay jugadas registradas aún. Haz clic en cualquier botón de la matriz o campo para taguear en tiempo real.
          </div>
        ) : (
          filteredEvents.map((ev) => {
            const isGoal = ev.type?.toLowerCase().includes('gol');
            const isFoul = ev.type?.toLowerCase().includes('falta');

            return (
              <div 
                key={ev.id} 
                className={`event-item ${isGoal ? 'goal' : isFoul ? 'foul' : ''}`}
                onClick={() => onSelectEvent && onSelectEvent(ev)}
                style={{ cursor: 'pointer' }}
              >
                <span className="event-time-badge">
                  {ev.period} {formatTime(ev.timestamp)}
                </span>

                <div className="event-content">
                  <span className="event-title">
                    {ev.type || ev.category}
                  </span>
                  <div className="event-meta">
                    {ev.team && (
                      <span style={{ 
                        color: ev.team === 'propio' ? '#38bdf8' : '#f87171',
                        fontWeight: 700
                      }}>
                        {ev.team === 'propio' ? currentMatch?.homeTeam || 'PROPIO' : currentMatch?.awayTeam || 'RIVAL'}
                      </span>
                    )}
                    {ev.playerDorsal && (
                      <span>• #{ev.playerDorsal}</span>
                    )}
                    {ev.zoneName && (
                      <span>• {ev.zoneName}</span>
                    )}
                  </div>
                </div>

                <button
                  className="event-del-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('¿Eliminar este evento?')) {
                      onDeleteEvent(ev.id);
                    }
                  }}
                  title="Eliminar evento"
                >
                  ✕
                </button>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
