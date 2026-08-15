import React, { useState, useEffect } from 'react';
import { auth, db, onAuthStateChanged, signOut, ref, set, push } from './firebase';
import Login from './components/Login';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const [homeTeam, setHomeTeam] = useState('');
  const [awayTeam, setAwayTeam] = useState('');
  const [matchday, setMatchday] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSaveMatch = async (e) => {
    e.preventDefault();
    if (!homeTeam || !awayTeam || !matchday) return;
    try {
      const matchesRef = ref(db, 'matches');
      const newMatchRef = push(matchesRef);
      await set(newMatchRef, {
        homeTeam,
        awayTeam,
        matchday: Number(matchday),
        homeScore: 0,
        awayScore: 0,
        createdAt: Date.now()
      });
      setHomeTeam('');
      setAwayTeam('');
      setMatchday('');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Error guardando partido:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  if (loading) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <div className="login-brand">
            <div className="brand-logo">FT</div>
            <h1 className="login-title">Cargando…</h1>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-subtle)',
        padding: '0.6rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="brand-logo">FT</div>
          <span style={{ fontWeight: 800, fontSize: '1.15rem' }}>FútbolTotal Análisis</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {user.email}
          </span>
          <button className="btn-sm btn-secondary" onClick={handleLogout}>Salir</button>
        </div>
      </header>

      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '480px',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem'
        }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center' }}>
            Nuevo Partido
          </h2>

          <form onSubmit={handleSaveMatch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
              Equipo Local
              <input
                type="text"
                className="input-control"
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                placeholder="Ej: Barcelona"
                required
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
              Equipo Visitante
              <input
                type="text"
                className="input-control"
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                placeholder="Ej: Real Madrid"
                required
              />
            </label>

            <label style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)' }}>
              Jornada
              <input
                type="number"
                className="input-control"
                value={matchday}
                onChange={(e) => setMatchday(e.target.value)}
                placeholder="Ej: 1"
                min="1"
                required
              />
            </label>

            <button type="submit" className="btn-emerald" style={{ justifyContent: 'center', padding: '0.6rem', fontWeight: 700, marginTop: '0.5rem' }}>
              Guardar Partido
            </button>
          </form>

          {saved && (
            <div style={{ marginTop: '1rem', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#34d399', borderRadius: 'var(--radius-md)', padding: '0.5rem 0.75rem', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center' }}>
              Partido guardado correctamente
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
