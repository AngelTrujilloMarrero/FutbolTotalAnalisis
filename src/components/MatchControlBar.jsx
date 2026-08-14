import React, { useState, useEffect } from 'react';

export default function MatchControlBar({
  match,
  timerSeconds,
  isRunning,
  onToggleTimer,
  onResetTimer,
  onAdjustTimer,
  period,
  onChangePeriod,
  onUpdateScore
}) {
  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="match-control-bar">
      {/* Period Selection (1er tiempo / 2o tiempo) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <button
          className={`btn-sm ${period === '1T' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => onChangePeriod('1T')}
        >
          1er Tiempo
        </button>
        <button
          className={`btn-sm ${period === '2T' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => onChangePeriod('2T')}
        >
          2º Tiempo
        </button>
        <button
          className={`btn-sm ${period === 'ET' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => onChangePeriod('ET')}
        >
          Prórroga
        </button>
      </div>

      {/* Stopwatch Timer */}
      <div className="timer-widget">
        <span className={`period-badge ${period === '1T' ? 'p1' : period === '2T' ? 'p2' : 'extra'}`}>
          {period}
        </span>
        <div className="timer-display">{formatTime(timerSeconds)}</div>
        <button
          className={`btn-sm ${isRunning ? 'btn-danger' : 'btn-emerald'}`}
          onClick={onToggleTimer}
          style={{ minWidth: '68px', textAlign: 'center' }}
        >
          {isRunning ? '⏸ Pausar' : '▶ Iniciar'}
        </button>
        <button
          className="btn-sm btn-secondary"
          onClick={() => onAdjustTimer(60)}
          title="Sumar 1 minuto"
        >
          +1m
        </button>
        <button
          className="btn-sm btn-secondary"
          onClick={() => onAdjustTimer(-60)}
          title="Restar 1 minuto"
        >
          -1m
        </button>
        <button
          className="btn-sm btn-secondary"
          onClick={onResetTimer}
          title="Reiniciar cronómetro"
        >
          ↺
        </button>
      </div>

      {/* Score Tracker */}
      <div className="score-widget">
        <span className="team-label" style={{ color: '#38bdf8' }}>
          {match?.homeTeam || 'PROPIO'}
        </span>
        <button 
          className="btn-sm btn-secondary" 
          onClick={() => onUpdateScore('home', -1)} 
          style={{ padding: '0.1rem 0.4rem' }}
        >
          -
        </button>
        <span className="score-number">{match?.homeScore || 0}</span>
        <button 
          className="btn-sm btn-secondary" 
          onClick={() => onUpdateScore('home', 1)} 
          style={{ padding: '0.1rem 0.4rem' }}
        >
          +
        </button>

        <span style={{ fontWeight: 800, color: 'var(--text-muted)' }}>:</span>

        <button 
          className="btn-sm btn-secondary" 
          onClick={() => onUpdateScore('away', -1)} 
          style={{ padding: '0.1rem 0.4rem' }}
        >
          -
        </button>
        <span className="score-number" style={{ color: '#f87171' }}>{match?.awayScore || 0}</span>
        <button 
          className="btn-sm btn-secondary" 
          onClick={() => onUpdateScore('away', 1)} 
          style={{ padding: '0.1rem 0.4rem' }}
        >
          +
        </button>
        <span className="team-label" style={{ color: '#f87171' }}>
          {match?.awayTeam || 'RIVAL'}
        </span>
      </div>
    </div>
  );
}
