import React from 'react';

export default function PossessionBar({
  currentPossession,
  onChangePossession,
  possessionStats
}) {
  return (
    <div className="possession-bar">
      <button
        className={`possession-btn ${currentPossession === 'propia' ? 'active-propia' : ''}`}
        onClick={() => onChangePossession('propia')}
      >
        <span className="tag-indicator-dot" style={{ background: '#38bdf8' }} />
        <span>Posesión propia</span>
        {possessionStats?.propia ? (
          <span style={{ fontSize: '0.7rem', opacity: 0.8, marginLeft: '4px' }}>
            ({possessionStats.propia}%)
          </span>
        ) : null}
      </button>

      <button
        className={`possession-btn ${currentPossession === 'disputa' ? 'active-disputa' : ''}`}
        onClick={() => onChangePossession('disputa')}
      >
        <span className="tag-indicator-dot" style={{ background: '#94a3b8' }} />
        <span>No posesión (S)</span>
        {possessionStats?.disputa ? (
          <span style={{ fontSize: '0.7rem', opacity: 0.8, marginLeft: '4px' }}>
            ({possessionStats.disputa}%)
          </span>
        ) : null}
      </button>

      <button
        className={`possession-btn ${currentPossession === 'rival' ? 'active-rival' : ''}`}
        onClick={() => onChangePossession('rival')}
      >
        <span className="tag-indicator-dot" style={{ background: '#ef4444' }} />
        <span>Posesión rival</span>
        {possessionStats?.rival ? (
          <span style={{ fontSize: '0.7rem', opacity: 0.8, marginLeft: '4px' }}>
            ({possessionStats.rival}%)
          </span>
        ) : null}
      </button>
    </div>
  );
}
