import React from 'react';

const JerseyIcon = ({ number, color = "#ea580c" }) => (
  <div className="jersey-icon-wrap">
    <svg className="jersey-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 20 L35 10 C45 22 55 22 65 10 L80 20 L75 40 L65 35 L65 85 L35 85 L35 35 L25 40 Z"
        fill={color}
        stroke="#ffffff"
        strokeWidth="3"
        strokeLinejoin="round"
      />
    </svg>
    <span className="jersey-number">{number}</span>
  </div>
);

export default function SquadBoard({
  selectedPlayer,
  onSelectPlayer,
  onTagPlayerDirect,
  squad = []
}) {
  // Default 1-4-4-2 lineup matching Photo 2:
  // GK: 1
  // DEF: 2, 4, 5, 3
  // MID: 8, 10, 6, 11
  // FWD: 9, 7
  const defaultLineup = [
    { row: 'GK', players: [{ dorsal: 1, name: 'Portero', pos: 'POR', color: '#0f172a' }] },
    { row: 'DEF', players: [
      { dorsal: 2, name: 'Lat Der', pos: 'LD', color: '#c2410c' },
      { dorsal: 4, name: 'Central', pos: 'DFC', color: '#c2410c' },
      { dorsal: 5, name: 'Central', pos: 'DFC', color: '#c2410c' },
      { dorsal: 3, name: 'Lat Izq', pos: 'LI', color: '#c2410c' }
    ]},
    { row: 'MID', players: [
      { dorsal: 8, name: 'Interior', pos: 'MC', color: '#c2410c' },
      { dorsal: 10, name: 'Mediapunta', pos: 'MCO', color: '#c2410c' },
      { dorsal: 6, name: 'Pivote', pos: 'MCD', color: '#c2410c' },
      { dorsal: 11, name: 'Extremo', pos: 'EI', color: '#c2410c' }
    ]},
    { row: 'FWD', players: [
      { dorsal: 9, name: 'Delantero', pos: 'DC', color: '#c2410c' },
      { dorsal: 7, name: 'Extremo', pos: 'ED', color: '#c2410c' }
    ]}
  ];

  return (
    <div className="squad-card">
      <div className="tag-card-title">
        <span>Alineación / Jugadores</span>
        {selectedPlayer && (
          <span style={{ color: '#38bdf8', fontSize: '0.7rem' }}>
            Activo: Dorsal {selectedPlayer.dorsal}
          </span>
        )}
      </div>

      <div className="squad-pitch-view">
        {defaultLineup.map((rowGroup, idx) => (
          <div key={idx} className="squad-row">
            {rowGroup.players.map((player) => {
              const isSelected = selectedPlayer?.dorsal === player.dorsal;
              return (
                <button
                  key={player.dorsal}
                  className={`player-jersey-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => onSelectPlayer(isSelected ? null : player)}
                  title={`Dorsal ${player.dorsal} - ${player.name} (${player.pos})`}
                >
                  <span className="player-dot" />
                  <JerseyIcon number={player.dorsal} color={player.color} />
                  <span className="jersey-name">#{player.dorsal}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
