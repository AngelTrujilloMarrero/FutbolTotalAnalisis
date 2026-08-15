import React, { useState, useEffect } from 'react';
import { auth, db, onAuthStateChanged, signOut, ref, set, push, onValue, update } from './firebase';
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
  const [matches, setMatches] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (!user) return;
    const matchesRef = ref(db, 'matches');
    const unsubscribe = onValue(matchesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
        setMatches(list);
      } else {
        setMatches([]);
      }
    });
    return () => unsubscribe();
  }, [user]);

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

  const handleEdit = (match) => {
    setEditingId(match.id);
    setHomeTeam(match.homeTeam);
    setAwayTeam(match.awayTeam);
    setMatchday(match.matchday);
  };

  const handleUpdateMatch = async (e) => {
    e.preventDefault();
    if (!homeTeam || !awayTeam || !matchday || !editingId) return;
    try {
      await update(ref(db, `matches/${editingId}`), {
        homeTeam,
        awayTeam,
        matchday: Number(matchday)
      });
      setEditingId(null);
      setHomeTeam('');
      setAwayTeam('');
      setMatchday('');
    } catch (err) {
      console.error('Error actualizando partido:', err);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setHomeTeam('');
    setAwayTeam('');
    setMatchday('');
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

      <main style={{ flex: 1, padding: '2rem', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '100%', maxWidth: '520px' }}>

          {/* Formulario */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            marginBottom: '2rem'
          }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center' }}>
              {editingId ? 'Editar Partido' : 'Nuevo Partido'}
            </h2>

            <form onSubmit={editingId ? handleUpdateMatch : handleSaveMatch} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn-emerald" style={{ flex: 1, justifyContent: 'center', padding: '0.6rem', fontWeight: 700 }}>
                  {editingId ? 'Actualizar' : 'Guardar Partido'}
                </button>
                {editingId && (
                  <button type="button" className="btn-secondary" onClick={handleCancelEdit} style={{ padding: '0.6rem 1rem', fontWeight: 700 }}>
                    Cancelar
                  </button>
                )}
              </div>
            </form>

            {saved && (
              <div style={{ marginTop: '1rem', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)', color: '#34d399', borderRadius: 'var(--radius-md)', padding: '0.5rem 0.75rem', fontSize: '0.8rem', fontWeight: 600, textAlign: 'center' }}>
                Partido guardado correctamente
              </div>
            )}
          </div>

          {/* Lista de partidos */}
          {matches.length > 0 && (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem'
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>Partidos guardados</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {matches.map((m) => (
                  <div key={m.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '0.75rem 1rem',
                    gap: '1rem'
                  }}>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontWeight: 700, color: '#38bdf8' }}>{m.homeTeam}</span>
                      <span style={{ margin: '0 0.4rem', color: 'var(--text-muted)', fontWeight: 700 }}>vs</span>
                      <span style={{ fontWeight: 700, color: '#f87171' }}>{m.awayTeam}</span>
                      <span style={{ marginLeft: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        J{m.matchday}
                      </span>
                    </div>
                    <button className="btn-sm btn-secondary" onClick={() => handleEdit(m)}>
                      Editar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
