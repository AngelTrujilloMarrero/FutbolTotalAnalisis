import React, { useRef, useState } from 'react';

export default function PitchBoard({
  selectedZone,
  onSelectZone,
  markerPos,
  onSetMarkerPos,
  placedPlayers = [],
  onPlacePlayer,
  onMovePlacedPlayer,
  onRemovePlacedPlayer
}) {
  const pitchRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);

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

  const clamp = (value) => Math.min(100, Math.max(0, Math.round(value)));

  const coordsFromEvent = (e) => {
    if (!pitchRef.current) return null;
    const rect = pitchRef.current.getBoundingClientRect();
    const x = clamp(((e.clientX - rect.left) / rect.width) * 100);
    const y = clamp(((e.clientY - rect.top) / rect.height) * 100);
    return { x, y };
  };

  const handlePitchClick = (e) => {
    if (!pitchRef.current) return;
    const rect = pitchRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    onSetMarkerPos({ x: Math.round(x), y: Math.round(y) });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    if (!pitchRef.current?.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const coords = coordsFromEvent(e);
    if (!coords) return;

    let data;
    try {
      data = JSON.parse(e.dataTransfer.getData('text/plain'));
    } catch {
      return;
    }
    if (!data || !data.dorsal) return;

    if (data.repositioning) {
      onMovePlacedPlayer && onMovePlacedPlayer(data.dorsal, coords.x, coords.y);
    } else {
      onPlacePlayer && onPlacePlayer({ dorsal: data.dorsal, name: data.name, color: data.color }, coords.x, coords.y);
    }
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
        className={`pitch-container ${isDragOver ? 'drag-over' : ''}`}
        ref={pitchRef}
        onClick={handlePitchClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
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

        {/* Placed Player Dorsals */}
        {placedPlayers.map((player) => (
          <div
            key={player.dorsal}
            className="pitch-player-marker"
            style={{ left: `${player.x}%`, top: `${player.y}%` }}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData(
                'text/plain',
                JSON.stringify({ dorsal: player.dorsal, repositioning: true })
              );
              e.dataTransfer.effectAllowed = 'move';
            }}
            onClick={(e) => e.stopPropagation()}
            title={`Dorsal ${player.dorsal}${player.name ? ` - ${player.name}` : ''} (arrastra para mover)`}
          >
            <span className="pitch-player-shirt">
              <span className="pitch-player-number">{player.dorsal}</span>
            </span>
            <button
              className="pitch-player-remove"
              onClick={(e) => {
                e.stopPropagation();
                onRemovePlacedPlayer && onRemovePlacedPlayer(player.dorsal);
              }}
              title="Quitar del campo"
            >
              ✕
            </button>
          </div>
        ))}

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

      {placedPlayers.length > 0 && (
        <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textAlign: 'center' }}>
          {placedPlayers.length} dorsal(es) en el campo — arrastra para mover, ✕ para quitar
        </div>
      )}
    </div>
  );
}