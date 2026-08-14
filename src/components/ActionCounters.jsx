import React from 'react';

export default function ActionCounters({
  counts = {},
  onTagEvent
}) {
  const handleTag = (category, subCategory, defaultType, teamSide = 'propio') => {
    onTagEvent({
      category,
      subCategory,
      type: defaultType || category,
      team: teamSide
    });
  };

  return (
    <div className="tactical-column">
      {/* 1. TIROS */}
      <div className="tag-card">
        <div className="tag-card-title">
          <span>Tiros</span>
          <span className="tag-counter-badge">{counts['tiros'] || 0}</span>
        </div>
        <div className="tag-btn-group">
          <button 
            className="tag-btn cat-tiros"
            onClick={() => handleTag('tiros', 'general', 'Tiro General')}
          >
            <div className="tag-btn-content">
              <span className="tag-indicator-dot" />
              <span>TIROS</span>
            </div>
            <span className="tag-counter-badge">{counts['tiros_general'] || 0}</span>
          </button>

          <button 
            className="tag-btn cat-tiros-sub"
            onClick={() => handleTag('tiros', 'a_puerta', 'Tiro a Puerta')}
          >
            <div className="tag-btn-content">
              <span className="tag-indicator-dot" />
              <span>A puerta</span>
            </div>
            <span className="tag-counter-badge">{counts['tiros_a_puerta'] || 0}</span>
          </button>

          <button 
            className="tag-btn cat-tiros-sub"
            onClick={() => handleTag('tiros', 'fuera', 'Tiro Fuera')}
          >
            <div className="tag-btn-content">
              <span className="tag-indicator-dot" />
              <span>Fuera</span>
            </div>
            <span className="tag-counter-badge">{counts['tiros_fuera'] || 0}</span>
          </button>

          <button 
            className="tag-btn cat-tiros-sub"
            onClick={() => handleTag('tiros', 'parada', 'Parada de Portero')}
          >
            <div className="tag-btn-content">
              <span className="tag-indicator-dot" />
              <span>Parada</span>
            </div>
            <span className="tag-counter-badge">{counts['tiros_parada'] || 0}</span>
          </button>

          <button 
            className="tag-btn cat-tiros-sub"
            style={{ background: '#059669', color: '#ffffff', fontWeight: 800 }}
            onClick={() => handleTag('tiros', 'gol', '¡GOL! (G)', 'propio')}
          >
            <div className="tag-btn-content">
              <span className="tag-indicator-dot" style={{ background: '#34d399' }} />
              <span>Gol (G)</span>
            </div>
            <span className="tag-counter-badge">{counts['tiros_gol'] || 0}</span>
          </button>
        </div>
      </div>

      {/* 2. ACCIONES A BALÓN PARADO (ABP) */}
      <div className="tag-card">
        <div className="tag-card-title">
          <span>ABP (Balón Parado)</span>
          <span className="tag-counter-badge">{counts['abp'] || 0}</span>
        </div>
        <div className="tag-btn-group">
          <button 
            className="tag-btn cat-abp"
            onClick={() => handleTag('abp', 'general', 'ABP General')}
          >
            <div className="tag-btn-content">
              <span className="tag-indicator-dot" />
              <span>ABP</span>
            </div>
            <span className="tag-counter-badge">{counts['abp_general'] || 0}</span>
          </button>

          <button 
            className="tag-btn cat-abp-sub"
            onClick={() => handleTag('abp', 'saque_puerta', 'Saque de Puerta')}
          >
            <div className="tag-btn-content">
              <span className="tag-indicator-dot" />
              <span>Saque puerta</span>
            </div>
            <span className="tag-counter-badge">{counts['abp_saque_puerta'] || 0}</span>
          </button>

          <button 
            className="tag-btn cat-abp-sub"
            onClick={() => handleTag('abp', 'saque_banda', 'Saque de Banda')}
          >
            <div className="tag-btn-content">
              <span className="tag-indicator-dot" />
              <span>Saque banda</span>
            </div>
            <span className="tag-counter-badge">{counts['abp_saque_banda'] || 0}</span>
          </button>

          <button 
            className="tag-btn cat-abp-sub"
            onClick={() => handleTag('abp', 'falta', 'Falta')}
          >
            <div className="tag-btn-content">
              <span className="tag-indicator-dot" />
              <span>Falta</span>
            </div>
            <span className="tag-counter-badge">{counts['abp_falta'] || 0}</span>
          </button>

          <button 
            className="tag-btn cat-abp-sub"
            onClick={() => handleTag('abp', 'corner', 'Córner')}
          >
            <div className="tag-btn-content">
              <span className="tag-indicator-dot" />
              <span>Córner</span>
            </div>
            <span className="tag-counter-badge">{counts['abp_corner'] || 0}</span>
          </button>
        </div>
      </div>

      {/* 3. MODIFICADORES: A FAVOR / EN CONTRA & LATERAL / CENTRAL */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
        <div className="tag-card">
          <div className="tag-btn-group">
            <button 
              className="tag-btn cat-slate"
              onClick={() => handleTag('sentido', 'a_favor', 'Acción A Favor')}
            >
              <div className="tag-btn-content">
                <span className="tag-indicator-dot" style={{ background: '#38bdf8' }} />
                <span>A favor</span>
              </div>
              <span className="tag-counter-badge">{counts['sentido_a_favor'] || 0}</span>
            </button>

            <button 
              className="tag-btn cat-slate"
              onClick={() => handleTag('sentido', 'en_contra', 'Acción En Contra')}
            >
              <div className="tag-btn-content">
                <span className="tag-indicator-dot" style={{ background: '#ef4444' }} />
                <span>En contra</span>
              </div>
              <span className="tag-counter-badge">{counts['sentido_en_contra'] || 0}</span>
            </button>
          </div>
        </div>

        <div className="tag-card">
          <div className="tag-btn-group">
            <button 
              className="tag-btn cat-slate"
              onClick={() => handleTag('sector', 'lateral', 'Sector Lateral')}
            >
              <div className="tag-btn-content">
                <span className="tag-indicator-dot" />
                <span>Lateral</span>
              </div>
              <span className="tag-counter-badge">{counts['sector_lateral'] || 0}</span>
            </button>

            <button 
              className="tag-btn cat-slate"
              onClick={() => handleTag('sector', 'central', 'Sector Central')}
            >
              <div className="tag-btn-content">
                <span className="tag-indicator-dot" />
                <span>Central</span>
              </div>
              <span className="tag-counter-badge">{counts['sector_central'] || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
