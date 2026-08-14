import React from 'react';

export default function StatsModal({
  isOpen,
  onClose,
  events = [],
  currentMatch,
  possessionStats
}) {
  if (!isOpen) return null;

  // Compute key stats
  const totalEvents = events.length;
  const tiros = events.filter((e) => e.category === 'tiros' || e.type?.toLowerCase().includes('tiro') || e.type?.toLowerCase().includes('gol'));
  const tirosPuerta = events.filter((e) => e.subCategory === 'a_puerta' || e.subCategory === 'gol');
  const goles = events.filter((e) => e.subCategory === 'gol' || e.type?.toLowerCase().includes('gol'));
  const abps = events.filter((e) => e.category === 'abp' || e.type?.toLowerCase().includes('corner') || e.type?.toLowerCase().includes('falta'));
  const transiciones = events.filter((e) => e.category?.startsWith('transicion'));

  const tirosPropio = tiros.filter((e) => e.team === 'propio').length;
  const tirosRival = tiros.filter((e) => e.team === 'rival').length;

  const exportCSV = () => {
    const headers = ['ID', 'Periodo', 'Segundo', 'Minuto', 'Equipo', 'Categoria', 'Subcategoria', 'Tipo', 'Dorsal', 'Zona'];
    const rows = events.map(e => [
      e.id,
      e.period,
      e.timestamp,
      `${Math.floor((e.timestamp || 0) / 60)}:${((e.timestamp || 0) % 60).toString().padStart(2, '0')}`,
      e.team || '',
      e.category || '',
      e.subCategory || '',
      `"${(e.type || '').replace(/"/g, '""')}"`,
      e.playerDorsal || '',
      `"${(e.zoneName || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `analisis_${currentMatch?.homeTeam || 'partido'}_vs_${currentMatch?.awayTeam || 'rival'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ match: currentMatch, events }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `partido_analisis_${currentMatch?.id || 'match'}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '750px' }}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
            📊 Informe y Estadísticas Tácticas
          </h3>
          <button className="btn-sm btn-secondary" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem' }}>
            <div className="tag-card" style={{ textAlign: 'center', padding: '0.8rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TOTAL ACCIONES</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#38bdf8' }}>{totalEvents}</div>
            </div>
            <div className="tag-card" style={{ textAlign: 'center', padding: '0.8rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TIROS TOTALES</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10b981' }}>{tiros.length}</div>
            </div>
            <div className="tag-card" style={{ textAlign: 'center', padding: '0.8rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GOLES REGISTRADOS</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#f59e0b' }}>{goles.length}</div>
            </div>
            <div className="tag-card" style={{ textAlign: 'center', padding: '0.8rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>ACCIONES BALÓN PARADO</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#c084fc' }}>{abps.length}</div>
            </div>
          </div>

          {/* Possession Breakdown */}
          <div className="tag-card">
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.6rem' }}>
              Estimación de Posesión de Balón
            </h4>
            <div style={{ display: 'flex', height: '26px', borderRadius: '6px', overflow: 'hidden' }}>
              <div 
                style={{ 
                  width: `${possessionStats?.propia || 50}%`, 
                  background: '#0284c7', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}
              >
                {currentMatch?.homeTeam || 'Propio'} ({possessionStats?.propia || 50}%)
              </div>
              <div 
                style={{ 
                  width: `${possessionStats?.disputa || 10}%`, 
                  background: '#475569', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '0.7rem'
                }}
              >
                Disputa ({possessionStats?.disputa || 0}%)
              </div>
              <div 
                style={{ 
                  width: `${possessionStats?.rival || 40}%`, 
                  background: '#dc2626', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700
                }}
              >
                {currentMatch?.awayTeam || 'Rival'} ({possessionStats?.rival || 40}%)
              </div>
            </div>
          </div>

          {/* Tiros Comparison */}
          <div className="tag-card">
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.6rem' }}>
              Eficacia de Remates ({tirosPuerta.length} a puerta de {tiros.length} tiros)
            </h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: '6px' }}>
              <div>
                <span style={{ color: '#38bdf8', fontWeight: 700 }}>{currentMatch?.homeTeam || 'Propio'}:</span> {tirosPropio} remates
              </div>
              <div>
                <span style={{ color: '#f87171', fontWeight: 700 }}>{currentMatch?.awayTeam || 'Rival'}:</span> {tirosRival} remates
              </div>
            </div>
          </div>

          {/* Transiciones Distribution */}
          <div className="tag-card">
            <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '0.6rem' }}>
              Transiciones Registradas ({transiciones.length})
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.8rem' }}>
              <div style={{ padding: '0.4rem', background: 'var(--bg-secondary)', borderRadius: '4px' }}>
                <strong>Ataque-Defensa:</strong> {events.filter(e => e.category === 'transicion_ad').length} veces
              </div>
              <div style={{ padding: '0.4rem', background: 'var(--bg-secondary)', borderRadius: '4px' }}>
                <strong>Defensa-Ataque (Contras):</strong> {events.filter(e => e.category === 'transicion_da').length} veces
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-emerald btn-sm" onClick={exportCSV}>
            📥 Exportar CSV (Excel)
          </button>
          <button className="btn-primary btn-sm" onClick={exportJSON}>
            💾 Exportar JSON
          </button>
          <button className="btn-secondary btn-sm" onClick={() => window.print()}>
            🖨 Imprimir Informe
          </button>
          <button className="btn-secondary btn-sm" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
