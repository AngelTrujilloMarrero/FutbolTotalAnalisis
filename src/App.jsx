import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  db, 
  auth, 
  ref, 
  set, 
  push, 
  onValue, 
  update, 
  remove,
  onAuthStateChanged,
  signOut 
} from './firebase';

import Login from './components/Login';
import Header from './components/Header';
import MatchControlBar from './components/MatchControlBar';
import PossessionBar from './components/PossessionBar';
import TacticalMatrix from './components/TacticalMatrix';
import ActionCounters from './components/ActionCounters';
import SquadBoard from './components/SquadBoard';
import PitchBoard from './components/PitchBoard';
import QuickTagPhoto1 from './components/QuickTagPhoto1';
import TimelineSidebar from './components/TimelineSidebar';
import StatsModal from './components/StatsModal';
import VideoSyncModal from './components/VideoSyncModal';
import MatchManagerModal from './components/MatchManagerModal';

export default function App() {
  // Auth State
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Navigation & Modals
  const [activeTab, setActiveTab] = useState('pro'); // 'pro' (Photo 2) or 'quick' (Photo 1)
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isMatchManagerOpen, setIsMatchManagerOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);

  // Matches State
  const [matches, setMatches] = useState([]);
  const [currentMatchId, setCurrentMatchId] = useState(null);
  const [currentMatch, setCurrentMatch] = useState(null);
  const [events, setEvents] = useState([]);

  // Match Live Controls
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [period, setPeriod] = useState('1T');
  const [currentPossession, setCurrentPossession] = useState('propia'); // propia, disputa, rival

  // Interactive Tactical Selections
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [markerPos, setMarkerPos] = useState(null);
  const [selectedPhase, setSelectedPhase] = useState(null);

  // Players placed on the pitch (dorsals dragged from the lineup) - session only
  const [placedPlayers, setPlacedPlayers] = useState([]);

  const handlePlacePlayer = useCallback((player, x, y) => {
    setPlacedPlayers((prev) => {
      const exists = prev.find((p) => p.dorsal === player.dorsal);
      if (exists) {
        return prev.map((p) => (p.dorsal === player.dorsal ? { ...p, x, y } : p));
      }
      return [...prev, { dorsal: player.dorsal, name: player.name, color: player.color, x, y }];
    });
  }, []);

  const handleMovePlacedPlayer = useCallback((dorsal, x, y) => {
    setPlacedPlayers((prev) =>
      prev.map((p) => (p.dorsal === dorsal ? { ...p, x, y } : p))
    );
  }, []);

  const handleRemovePlacedPlayer = useCallback((dorsal) => {
    setPlacedPlayers((prev) => prev.filter((p) => p.dorsal !== dorsal));
  }, []);

  // 0. Firebase Auth Listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  // 1. Firebase Listeners: Matches List
  useEffect(() => {
    if (!user) return;
    const matchesRef = ref(db, 'matches');
    const unsubscribe = onValue(
      matchesRef,
      (snapshot) => {
        setIsOnline(true);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const matchList = Object.entries(data).map(([id, val]) => ({
            id,
            ...val
          }));
          setMatches(matchList);

          // If no active match is set, select the most recent one or the first one
          if (!currentMatchId && matchList.length > 0) {
            setCurrentMatchId(matchList[matchList.length - 1].id);
          }
        } else {
          setMatches([]);
          // Create an initial default match if none exists
          createInitialMatch();
        }
      },
      (error) => {
        console.error('Firebase read error:', error);
        setIsOnline(false);
      }
    );

    return () => unsubscribe();
  }, [user, currentMatchId]);

  // Initial match creator
  const createInitialMatch = useCallback(async () => {
    try {
      const matchesRef = ref(db, 'matches');
      const newMatchRef = push(matchesRef);
      const initialData = {
        homeTeam: 'Equipo Propio',
        awayTeam: 'Rival FC',
        category: 'Senior',
        date: new Date().toISOString().split('T')[0],
        homeScore: 0,
        awayScore: 0,
        period: '1T',
        timerSeconds: 0,
        currentPossession: 'propia',
        createdAt: Date.now()
      };
      await set(newMatchRef, initialData);
      setCurrentMatchId(newMatchRef.key);
    } catch (err) {
      console.error('Error creating initial match:', err);
    }
  }, []);

  // 2. Firebase Listener: Active Match & Events
  useEffect(() => {
    if (!currentMatchId) return;

    const matchRef = ref(db, `matches/${currentMatchId}`);
    const unsubscribeMatch = onValue(matchRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        setCurrentMatch({ id: currentMatchId, ...val });
        if (val.period) setPeriod(val.period);
        if (val.timerSeconds !== undefined && !isRunning) {
          setTimerSeconds(val.timerSeconds);
        }
        if (val.currentPossession) setCurrentPossession(val.currentPossession);
      }
    });

    const eventsRef = ref(db, `matches/${currentMatchId}/events`);
    const unsubscribeEvents = onValue(eventsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const evList = Object.entries(data).map(([id, val]) => ({
          id,
          ...val
        })).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)); // Most recent first
        setEvents(evList);
      } else {
        setEvents([]);
      }
    });

    return () => {
      unsubscribeMatch();
      unsubscribeEvents();
    };
  }, [currentMatchId, isRunning]);

  // 3. Local Timer interval
  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    } else if (!isRunning && timerSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timerSeconds]);

  // Sync timer to Firebase periodically when paused or on changes
  const saveTimerToFirebase = useCallback((newSecs) => {
    if (!currentMatchId) return;
    update(ref(db, `matches/${currentMatchId}`), {
      timerSeconds: newSecs
    }).catch(console.error);
  }, [currentMatchId]);

  const handleToggleTimer = () => {
    const nextState = !isRunning;
    setIsRunning(nextState);
    if (!nextState) {
      saveTimerToFirebase(timerSeconds);
    }
  };

  const handleResetTimer = () => {
    setIsRunning(false);
    setTimerSeconds(0);
    saveTimerToFirebase(0);
  };

  const handleAdjustTimer = (amount) => {
    setTimerSeconds((prev) => {
      const next = Math.max(0, prev + amount);
      saveTimerToFirebase(next);
      return next;
    });
  };

  const handleChangePeriod = (newPeriod) => {
    setPeriod(newPeriod);
    if (currentMatchId) {
      update(ref(db, `matches/${currentMatchId}`), { period: newPeriod }).catch(console.error);
    }
  };

  const handleChangePossession = (newPossession) => {
    setCurrentPossession(newPossession);
    if (currentMatchId) {
      update(ref(db, `matches/${currentMatchId}`), { currentPossession: newPossession }).catch(console.error);
    }
  };

  const handleUpdateScore = (team, delta) => {
    if (!currentMatch || !currentMatchId) return;
    const currentScore = team === 'home' ? (currentMatch.homeScore || 0) : (currentMatch.awayScore || 0);
    const newScore = Math.max(0, currentScore + delta);
    
    update(ref(db, `matches/${currentMatchId}`), {
      [team === 'home' ? 'homeScore' : 'awayScore']: newScore
    }).catch(console.error);
  };

  // 4. Tagging Event Function (combines current timer, selected player, zone, and coordinates)
  const handleTagEvent = async (eventDetails) => {
    if (!currentMatchId) return;

    try {
      const eventsRef = ref(db, `matches/${currentMatchId}/events`);
      const newEventRef = push(eventsRef);

      const isGoal = eventDetails.subCategory === 'gol' || eventDetails.type?.toLowerCase().includes('gol');

      const payload = {
        timestamp: timerSeconds,
        period: period,
        possession: currentPossession,
        team: eventDetails.team || (currentPossession === 'rival' ? 'rival' : 'propio'),
        category: eventDetails.category || 'general',
        subCategory: eventDetails.subCategory || '',
        type: eventDetails.type || eventDetails.category,
        playerDorsal: selectedPlayer ? selectedPlayer.dorsal : (eventDetails.playerDorsal || null),
        playerName: selectedPlayer ? selectedPlayer.name : null,
        zoneId: selectedZone ? selectedZone.id : null,
        zoneName: selectedZone ? `${selectedZone.tercio} - ${selectedZone.carril}` : null,
        markerPos: markerPos ? { ...markerPos } : null,
        createdAt: Date.now()
      };

      await set(newEventRef, payload);

      // If goal, auto-increment score
      if (isGoal) {
        const teamKey = payload.team === 'rival' ? 'awayScore' : 'homeScore';
        const currentVal = currentMatch ? (currentMatch[teamKey] || 0) : 0;
        update(ref(db, `matches/${currentMatchId}`), {
          [teamKey]: currentVal + 1
        }).catch(console.error);
      }

      // Reset single-use contextual selections
      setSelectedPlayer(null);
      setSelectedZone(null);
      setMarkerPos(null);
    } catch (err) {
      console.error('Error saving event:', err);
    }
  };

  // 5. Delete and Undo event
  const handleDeleteEvent = async (eventId) => {
    if (!currentMatchId) return;
    try {
      await remove(ref(db, `matches/${currentMatchId}/events/${eventId}`));
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const handleUndoLastEvent = async () => {
    if (events.length === 0) return;
    const lastEvent = events[0]; // because events are sorted newest first
    await handleDeleteEvent(lastEvent.id);
  };

  // 6. Calculate dynamic counts from real-time events for every button
  const counts = useMemo(() => {
    const c = {};
    events.forEach((ev) => {
      // General categories
      if (ev.category) {
        c[ev.category] = (c[ev.category] || 0) + 1;
      }
      // Subcategories
      if (ev.category && ev.subCategory) {
        const comboKey = `${ev.category}_${ev.subCategory}`;
        c[comboKey] = (c[comboKey] || 0) + 1;
      }
      // Photo 1 special mappings
      if (ev.type === 'Inicio Propio' || (ev.category === 'inicio' && ev.team === 'propio')) c['inicio_propio'] = (c['inicio_propio'] || 0) + 1;
      if (ev.type === 'Inicio Rival' || (ev.category === 'inicio' && ev.team === 'rival')) c['inicio_rival'] = (c['inicio_rival'] || 0) + 1;
      if (ev.type === 'Córner Propio' || (ev.category === 'corner' && ev.team === 'propio')) c['corner_propio'] = (c['corner_propio'] || 0) + 1;
      if (ev.type === 'Córner Rival' || (ev.category === 'corner' && ev.team === 'rival')) c['corner_rival'] = (c['corner_rival'] || 0) + 1;
      if (ev.type === 'Falta Propio' || (ev.category === 'falta' && ev.team === 'propio')) c['falta_propio'] = (c['falta_propio'] || 0) + 1;
      if (ev.type === 'Falta Rival' || (ev.category === 'falta' && ev.team === 'rival')) c['falta_rival'] = (c['falta_rival'] || 0) + 1;
      if (ev.type === 'Ataque Organizado' || ev.category === 'ataque') c['ataque_organizado'] = (c['ataque_organizado'] || 0) + 1;
      if (ev.type === 'Estructura' || ev.category === 'estructura') c['estructura'] = (c['estructura'] || 0) + 1;
      if (ev.type === 'Gol Rival' || (ev.category === 'goles' && ev.team === 'rival')) c['goles_rival'] = (c['goles_rival'] || 0) + 1;
      if (ev.type === 'Varios' || ev.category === 'varios') c['varios'] = (c['varios'] || 0) + 1;
    });
    return c;
  }, [events]);

  // 7. Calculate possession statistics
  const possessionStats = useMemo(() => {
    const total = events.length;
    if (total === 0) return { propia: 50, disputa: 0, rival: 50 };
    const propiaCount = events.filter((e) => e.possession === 'propia' || e.team === 'propio').length;
    const disputaCount = events.filter((e) => e.possession === 'disputa').length;
    const rivalCount = events.filter((e) => e.possession === 'rival' || e.team === 'rival').length;

    return {
      propia: Math.round((propiaCount / total) * 100),
      disputa: Math.round((disputaCount / total) * 100),
      rival: Math.round((rivalCount / total) * 100)
    };
  }, [events]);

  // 8. Keyboard Shortcuts (G: Gol, S: Disputa/No posesión, Space: Pause/Play)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept when typing in input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;

      if (e.key === 'g' || e.key === 'G') {
        handleTagEvent({ category: 'tiros', subCategory: 'gol', type: '¡GOL! (G)', team: 'propio' });
      } else if (e.key === 's' || e.key === 'S') {
        handleChangePossession('disputa');
      } else if (e.code === 'Space') {
        e.preventDefault();
        handleToggleTimer();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPossession, timerSeconds, period, selectedPlayer, selectedZone, markerPos, isRunning]);

  // Match management callbacks
  const handleCreateMatch = async (matchData) => {
    try {
      const matchesRef = ref(db, 'matches');
      const newMatchRef = push(matchesRef);
      await set(newMatchRef, {
        ...matchData,
        homeScore: 0,
        awayScore: 0,
        period: '1T',
        timerSeconds: 0,
        currentPossession: 'propia'
      });
      setCurrentMatchId(newMatchRef.key);
      setTimerSeconds(0);
      setIsRunning(false);
    } catch (err) {
      console.error('Error creating match:', err);
    }
  };

  const handleDeleteMatch = async (matchId) => {
    try {
      await remove(ref(db, `matches/${matchId}`));
      if (currentMatchId === matchId) {
        const remaining = matches.filter((m) => m.id !== matchId);
        setCurrentMatchId(remaining.length > 0 ? remaining[0].id : null);
      }
    } catch (err) {
      console.error('Error deleting match:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  if (authLoading) {
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
      {/* 1. Top Navbar */}
      <Header
        currentMatch={currentMatch}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenMatchManager={() => setIsMatchManagerOpen(true)}
        onOpenStats={() => setIsStatsOpen(true)}
        onOpenVideo={() => setIsVideoOpen(true)}
        isOnline={isOnline}
        onUndoLastEvent={handleUndoLastEvent}
        userEmail={user.email}
        onLogout={handleLogout}
      />

      {/* 2. Match Control Bar (Period, Stopwatch, Live Score) */}
      <MatchControlBar
        match={currentMatch}
        timerSeconds={timerSeconds}
        isRunning={isRunning}
        onToggleTimer={handleToggleTimer}
        onResetTimer={handleResetTimer}
        onAdjustTimer={handleAdjustTimer}
        period={period}
        onChangePeriod={handleChangePeriod}
        onUpdateScore={handleUpdateScore}
      />

      {/* 3. Possession Switcher Bar (Photo 2 Top Bar) */}
      <PossessionBar
        currentPossession={currentPossession}
        onChangePossession={handleChangePossession}
        possessionStats={possessionStats}
      />

      {/* 4. Main Workspace */}
      <main className="main-container">
        <section className="tagger-board">
          {activeTab === 'pro' ? (
            <div className="tactical-grid">
              {/* Left Column: Tactical Matrix (Inicio, Defensa, Transiciones AD/DA) */}
              <TacticalMatrix
                counts={counts}
                onTagEvent={handleTagEvent}
                selectedPhase={selectedPhase}
                setSelectedPhase={setSelectedPhase}
              />

              {/* Middle Column: Action Counters (Tiros, ABP, A favor/En contra, Lateral/Central) */}
              <ActionCounters
                counts={counts}
                onTagEvent={handleTagEvent}
              />

              {/* Right Column: Squad Lineup + Interactive Pitch */}
              <div className="right-tactical-panel">
                <SquadBoard
                  selectedPlayer={selectedPlayer}
                  onSelectPlayer={setSelectedPlayer}
                  onTagPlayerDirect={(player) => handleTagEvent({ playerDorsal: player.dorsal, playerName: player.name, type: `Acción Jugador #${player.dorsal}` })}
                />

                <PitchBoard
                  selectedZone={selectedZone}
                  onSelectZone={setSelectedZone}
                  markerPos={markerPos}
                  onSetMarkerPos={setMarkerPos}
                  placedPlayers={placedPlayers}
                  onPlacePlayer={handlePlacePlayer}
                  onMovePlacedPlayer={handleMovePlacedPlayer}
                  onRemovePlacedPlayer={handleRemovePlacedPlayer}
                />
              </div>
            </div>
          ) : (
            /* Mode Photo 1: Quick Tagging */
            <QuickTagPhoto1
              counts={counts}
              onTagEvent={handleTagEvent}
            />
          )}
        </section>

        {/* 5. Live Events Timeline Sidebar */}
        <TimelineSidebar
          events={events}
          onDeleteEvent={handleDeleteEvent}
          currentMatch={currentMatch}
        />
      </main>

      {/* 6. Modals */}
      <StatsModal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        events={events}
        currentMatch={currentMatch}
        possessionStats={possessionStats}
      />

      <VideoSyncModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        events={events}
        timerSeconds={timerSeconds}
      />

      <MatchManagerModal
        isOpen={isMatchManagerOpen}
        onClose={() => setIsMatchManagerOpen(false)}
        matches={matches}
        currentMatchId={currentMatchId}
        onSelectMatch={setCurrentMatchId}
        onCreateMatch={handleCreateMatch}
        onDeleteMatch={handleDeleteMatch}
      />
    </div>
  );
}
