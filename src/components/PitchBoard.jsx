import React, { useRef } from 'react';

export default function PitchBoard({
  selectedZone,
  onSelectZone,
  markerPos,
  onSetMarkerPos
}) {
  const pitchRef = useRef(null);

  // 9 Tactical Zones (3 Tercios: Defensivo, Medio, Ofensivo x 3 Carriles: Izquierda, Centro, Derecha)
  const zones = [
    { id: 'def_izq', label: 'Def Izq', tercio: 'Defensivo', carril: 'Izquierdo' },
    { id: 'med_izq', label: 'Med Izq', tercio: 'Medio', carril: 'Izquierdo' },
    { id: 'ofe_izq', label: 'Ofe Izq', tercio: 'Ofensivo', carril: 'Izquierdo' },
    
    { id: 'def_cen', label: 'Def Cen', tercio: 'Defensivo', carril: 'Central' },
    { id: 'med_cen', label: 'Med Cen', tercio: 'Medio', carril: 'Central' },
    { id: 'ofe_cen', label: 'Ofe Cen', tercio: 'Ofensivo', carril: 'Central' },

    { id: 'def_der', label: 'Def Der', tercio: 'Defensivo', carril: 'Derecho' },
    { id: 'med_der', label: 'Med Der', tercio: 'Medio', carril: 'Derecho' },
    { id: 'ofe_der', label: 'Ofe Der', tercio: 'Ofensivo', carril: 'Derecho' },
  ];

  const handlePitchClick = (e) => {
    if (!pitchRef.current) return;
    const rect = pitchRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onSetMarkerPos({ x: Math.round(x), y: Math.round(y) });
  };

  return (
    <div className="pitch-card">
      <div className="tag-card-title">
        <span>Campo Táctico / Zonas</span>
        {markerPos && (
          <span style={{ color: '#10b981', fontSize: '0.7rem' }}>
            Pos: {markerPos.x}%, {markerPos.y}%
          </span>
        )}
      </div>

      <div 
        className="pitch-container"
        ref={pitchRef}
        onClick={handlePitchClick}
      >
        {/* Pitch Lines */}
        <div className="pitch-center-line" />
        <div className="pitch-center-circle" />
        <div className="pitch-center-spot" />
        <div className="pitch-box-left" />
        <div className="pitch-box-right" />

        {/* 3 Tercios Grid */}
        <div className="pitch-zones-grid">
          {zones.map((zone) => (
            <div
              key={zone.id}
              className={`pitch-zone ${selectedZone?.id === zone.id ? 'selected' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                onSelectZone(selectedZone?.id === zone.id ? null : zone);
              }}
              title={`${zone.tercio} - ${zone.carril}`}
            >
              {zone.label}
            </div>
          ))}
        </div>

        {/* Click Marker */}
        {markerPos && (
          <div
            className="pitch-marker-dot"
            style={{
              left: `${markerPos.x}%`,
              top: `${markerPos.y}%`
            }}
          />
        )}
      </div>
    </div>
  );
}
