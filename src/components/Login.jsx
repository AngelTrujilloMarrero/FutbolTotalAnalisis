import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '../firebase';

export default function Login() {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Introduce email y contraseña.');
      return;
    }
    if (mode === 'register' && password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (mode === 'register' && password !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      let msg = 'Error al iniciar sesión. Inténtalo de nuevo.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Email o contraseña incorrectos.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'Ya existe una cuenta con ese email.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'El email no es válido.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'La contraseña es demasiado débil (mínimo 6 caracteres).';
      } else if (err.code === 'auth/network-request-failed') {
        msg = 'Sin conexión. Comprueba tu red.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-brand">
          <div className="brand-logo">FT</div>
          <h1 className="login-title">
            FútbolTotal <span>Análisis</span>
          </h1>
          <p className="login-subtitle">Tagueo Táctico &amp; Scouting en Tiempo Real</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-mode-switch">
            <button
              type="button"
              className={mode === 'login' ? 'mode-btn active' : 'mode-btn'}
              onClick={() => { setMode('login'); setError(''); }}
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              className={mode === 'register' ? 'mode-btn active' : 'mode-btn'}
              onClick={() => { setMode('register'); setError(''); }}
            >
              Crear cuenta
            </button>
          </div>

          <label className="login-label">
            Email
            <input
              type="email"
              className="input-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              autoComplete="email"
            />
          </label>

          <label className="login-label">
            Contraseña
            <input
              type="password"
              className="input-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            />
          </label>

          {mode === 'register' && (
            <label className="login-label">
              Confirmar contraseña
              <input
                type="password"
                className="input-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </label>
          )}

          {error && <div className="login-error">{error}</div>}

          <button type="submit" className="btn-emerald login-submit" disabled={loading}>
            {loading
              ? 'Procesando…'
              : mode === 'login'
                ? 'Entrar'
                : 'Registrarse'}
          </button>
        </form>

        <p className="login-footnote">
          Acceso restringido. Solo usuarios autorizados.
        </p>
      </div>
    </div>
  );
}