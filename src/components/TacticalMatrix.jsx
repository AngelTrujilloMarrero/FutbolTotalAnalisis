import React from 'react';

export default function TacticalMatrix({
  counts = {},
  onTagEvent,
  selectedPhase,
  setSelectedPhase,
  onOpenQuick
}) {
  const handleTag = (category, subCategory, defaultType) => {
    onTagEvent({
      category,
      subCategory,
      type: defaultType || category
    });
  };

  return (
    <div className="tactical-column">
      {/* 1. INICIO DE JUEGO */}
      <div className="tag-card">
        <div className="tag-card-title">
          <span>Inicio Juego</span>
          <span className="tag-counter-badge">{counts['inicio_juego'] || 0}</span>
        </div>
        <div className="tag-btn-group">
          <button 
            className="tag-btn cat-inicio"
            onClick={() => handleTag('inicio_juego', 'general', 'Inicio General')}
          >
            <div className="tag-btn-content">
              <span className="tag-indicator-dot" />
              <span>INICIO JUEGO</span>
            </div>
            <span className="tag-counter-badge">{counts['inicio_juego_general'] || 0}</span>
          </button>

          <button 
            className="tag-btn cat-inicio-sub"
            onClick={() => {
              handleTag('corner', 'derecha', 'Córner Derecha');
              onOpenQuick && onOpenQuick();
            }}
          >
            <div className="tag-btn-content">
              <span className="tag-indicator-dot" />
              <span>Córner derecha</span>
            </div>
            <span className="tag-counter-badge">{counts['corner_derecha'] || 0}</span>
          </button>

          <button 
            className="tag-btn cat-inicio-sub"
            onClick={() => handleTag('corner', 'izquierda', 'Córner Izquierda')}
          >
            <div className="tag-btn-content">
              <span className="tag-indicator-dot" />
              <span>Córner izquierda</span>
            </div>
            <span className="tag-counter-badge">{counts['corner_izquierda'] || 0}</span>
          </button>

          <button 
            className="tag-btn cat-inicio-sub"
            onClick={() => handleTag('inicio_juego', 'combinativo', 'Inicio Combinativo')}
          >
            <div className="tag-btn-content">
              <span className="tag-indicator-dot" />
              <span>Combinativo</span>
            </div>
            <span className="tag-counter-badge">{counts['inicio_juego_combinativo'] || 0}</span>
          </button>

          <button 
            className="tag-btn cat-inicio-sub"
            onClick={() => handleTag('inicio_juego', 'directo', 'Inicio Directo')}
          >
            <div className="tag-btn-content">
              <span className="tag-indicator-dot" />
              <span>Directo</span>
            </div>
            <span className="tag-counter-badge">{counts['inicio_juego_directo'] || 0}</span>
          </button>
        </div>
      </div>

      {/* 2. DEFENSA */}
      <div className="tag-card">
        <div className="tag-card-title">
          <span>Defensa</span>
          <span className="tag-counter-badge">{counts['defensa'] || 0}</span>
        </div>
        <div className="tag-btn-group">
          <button 
            className="tag-btn cat-defensa"
            onClick={() => handleTag('defensa', 'general', 'Defensa General')}
          >
            <div className="tag-btn-content">
              <span className="tag-indicator-dot" />
              <span>DEFENSA</span>
            </div>
            <span className="tag-counter-badge">{counts['defensa_general'] || 0}</span>
          </button>

          <button 
            className="tag-btn cat-defensa-sub"
            onClick={() => handleTag('defensa', 'bloque_alto', 'Bloque Alto')}
          >
            <div className="tag-btn-content">
              <span className="tag-indicator-dot" />
              <span>Bloque alto</span>
            </div>
            <span className="tag-counter-badge">{counts['defensa_bloque_alto'] || 0}</span>
          </button>

          <button 
            className="tag-btn cat-defensa-sub"
            onClick={() => handleTag('defensa', 'bloque_medio', 'Bloque Medio')}
          >
            <div className="tag-btn-content">
              <span className="tag-indicator-dot" />
              <span>Bloque medio</span>
            </div>
            <span className="tag-counter-badge">{counts['defensa_bloque_medio'] || 0}</span>
          </button>

          <button 
            className="tag-btn cat-defensa-sub"
            onClick={() => handleTag('defensa', 'despliegue', 'Despliegue Defensivo')}
          >
            <div className="tag-btn-content">
              <span className="tag-indicator-dot" />
              <span>Despliegue</span>
            </div>
            <span className="tag-counter-badge">{counts['defensa_despliegue'] || 0}</span>
          </button>

          <button 
            className="tag-btn cat-defensa-sub"
            onClick={() => handleTag('defensa', 'presion_rival', 'Presión Rival')}
          >
            <div className="tag-btn-content">
              <span className="tag-indicator-dot" />
              <span>Presión rival</span>
            </div>
            <span className="tag-counter-badge">{counts['defensa_presion_rival'] || 0}</span>
          </button>
        </div>
      </div>

      {/* 3. TRANSICIÓN A-D & D-A */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
        {/* Transicion AD */}
        <div className="tag-card">
          <div className="tag-card-title">
            <span style={{ fontSize: '0.68rem' }}>TRANSICION A-D</span>
          </div>
          <div className="tag-btn-group">
            <button 
              className="tag-btn cat-transicion-ad"
              onClick={() => handleTag('transicion_ad', 'presion_perdida', 'Presión tras pérdida')}
            >
              <div className="tag-btn-content">
                <span className="tag-indicator-dot" />
                <span style={{ fontSize: '0.72rem' }}>Presión tras pérdida</span>
              </div>
              <span className="tag-counter-badge">{counts['transicion_ad_presion_perdida'] || 0}</span>
            </button>

            <button 
              className="tag-btn cat-transicion-ad"
              onClick={() => handleTag('transicion_ad', 'repliegue', 'Repliegue')}
            >
              <div className="tag-btn-content">
                <span className="tag-indicator-dot" />
                <span style={{ fontSize: '0.72rem' }}>Repliegue</span>
              </div>
              <span className="tag-counter-badge">{counts['transicion_ad_repliegue'] || 0}</span>
            </button>
          </div>
        </div>

        {/* Transicion DA */}
        <div className="tag-card">
          <div className="tag-card-title">
            <span style={{ fontSize: '0.68rem' }}>TRANSICION D-A</span>
          </div>
          <div className="tag-btn-group">
            <button 
              className="tag-btn cat-transicion-da"
              onClick={() => handleTag('transicion_da', 'contragolpe', 'Contragolpe')}
            >
              <div className="tag-btn-content">
                <span className="tag-indicator-dot" />
                <span style={{ fontSize: '0.72rem' }}>Contragolpe</span>
              </div>
              <span className="tag-counter-badge">{counts['transicion_da_contragolpe'] || 0}</span>
            </button>

            <button 
              className="tag-btn cat-transicion-da"
              onClick={() => handleTag('transicion_da', 'conservadora', 'Transición Conservadora')}
            >
              <div className="tag-btn-content">
                <span className="tag-indicator-dot" />
                <span style={{ fontSize: '0.72rem' }}>Conservadora</span>
              </div>
              <span className="tag-counter-badge">{counts['transicion_da_conservadora'] || 0}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
