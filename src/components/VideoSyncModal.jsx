import React, { useState, useRef } from 'react';

export default function VideoSyncModal({
  isOpen,
  onClose,
  events = [],
  timerSeconds
}) {
  const [videoSrc, setVideoSrc] = useState(null);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const videoRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    if (videoUrlInput.trim()) {
      setVideoSrc(videoUrlInput.trim());
    }
  };

  const jumpToTime = (seconds) => {
    if (videoRef.current) {
      // Seek 4 seconds before the event so the coach sees the leadup
      const targetTime = Math.max(0, seconds - 4);
      videoRef.current.currentTime = targetTime;
      videoRef.current.play();
    }
  };

  const formatTime = (secs) => {
    if (secs === undefined || isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '900px' }}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>
            🎬 Sincronizador de Videoanálisis
          </h3>
          <button className="btn-sm btn-secondary" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
          {/* Video Player Side */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {!videoSrc ? (
              <div style={{
                background: 'var(--bg-secondary)',
                border: '2px dashed var(--border-strong)',
                borderRadius: '8px',
                padding: '2rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '2rem' }}>📹</div>
                <div style={{ fontWeight: 700 }}>Cargar video del partido (MP4 / WebM)</div>
                <input 
                  type="file" 
                  accept="video/*" 
                  onChange={handleFileChange}
                  style={{ fontSize: '0.8rem' }} 
                />
                
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>O introduce URL directa de video:</div>
                <form onSubmit={handleUrlSubmit} style={{ display: 'flex', gap: '0.4rem', width: '100%' }}>
                  <input
                    type="url"
                    placeholder="https://servidor.com/partido.mp4"
                    value={videoUrlInput}
                    onChange={(e) => setVideoUrlInput(e.target.value)}
                    className="input-control"
                    style={{ fontSize: '0.8rem' }}
                  />
                  <button type="submit" className="btn-primary btn-sm">Cargar</button>
                </form>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <video
                  ref={videoRef}
                  src={videoSrc}
                  controls
                  style={{ width: '100%', borderRadius: '8px', background: '#000', maxHeight: '380px' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <button 
                    className="btn-sm btn-secondary"
                    onClick={() => setVideoSrc(null)}
                  >
                    Cambiar video
                  </button>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Haz clic en una jugada a la derecha para saltar al momento exacto (-4s leadup)
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Tagged Events List for Video */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '420px', overflowY: 'auto' }}>
            <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Cortes Tácticos ({events.length})
            </div>

            {events.length === 0 ? (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem 0' }}>
                No hay marcas de tiempo en este partido todavía.
              </div>
            ) : (
              events.map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => jumpToTime(ev.timestamp)}
                  style={{
                    background: 'var(--bg-secondary)',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '0.78rem'
                  }}
                  title="Reproducir esta jugada"
                >
                  <div>
                    <strong style={{ color: '#38bdf8' }}>[{formatTime(ev.timestamp)}]</strong>{' '}
                    <span>{ev.type || ev.category}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>▶ Ver</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary btn-sm" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}
