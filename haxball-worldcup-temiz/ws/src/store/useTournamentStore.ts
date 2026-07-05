import { create } from 'zustand';
import { Team, TEAMS } from '@/game/teams';
import { REAL_GROUP_DATA } from '@/game/wc2026data';

export interface GroupTeamStat {
  team: Team;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  gf: number; // goals for
  ga: number; // goals against
  points: number;
}

export interface KOMatch {
  id: string;
  home: Team | null;
  away: Team | null;
  homeGoals: number | null;
  awayGoals: number | null;
  played: boolean;
  isPlayerMatch: boolean;
  round: 'R32' | 'R16' | 'QF' | 'SF' | 'F';
  slot: number; // bracket pozisyonu
}

export interface Fixture {
  id: string;
  home: Team;
  away: Team;
  homeGoals: number | null;
  awayGoals: number | null;
  played: boolean;
  isPlayerMatch: boolean; // oyuncunun oynadığı maç
}

export type TournamentPhase = 'GROUP' | 'R32' | 'R16' | 'QF' | 'SF' | 'F' | 'DONE';

interface TournamentState {
  active: boolean;
  phase: TournamentPhase;
  groupId: string;
  playerTeam: Team | null;
  stats: GroupTeamStat[];
  fixtures: Fixture[];
  koMatches: KOMatch[];
  eliminated: boolean; // oyuncu elendi mi

  initGroup: (playerTeam: Team, groupId: string) => void;
  recordPlayerMatch: (homeGoals: number, awayGoals: number, playerIsHome: boolean) => void;
  simulateRound: () => void;
  buildR32: () => void;         // grup aşaması bitince R32 kur
  recordKOMatch: (matchId: string, homeGoals: number, awayGoals: number) => void;
  advanceKO: () => void;        // mevcut KO round'ını simüle et, sonraki round'u kur
  reset: () => void;
}

function makeStats(teams: Team[]): GroupTeamStat[] {
  return teams.map((t) => ({ team: t, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, points: 0 }));
}

function makeFixtures(teams: Team[], playerTeam: Team, groupId: string): Fixture[] {
  const realData = REAL_GROUP_DATA[groupId];
  // Gerçek fikstür sırasını kullan — oyuncunun maçları gerçek takvime göre gelir
  if (realData) {
    const all = realData.fixtures.map((f, i) => {
      const home = teams.find(t => t.id === f.home)!;
      const away = teams.find(t => t.id === f.away)!;
      if (!home || !away) return null;
      const isPlayerMatch = home.id === playerTeam.id || away.id === playerTeam.id;
      return { id: `f${i}`, home, away, isPlayerMatch, hg: f.hg, ag: f.ag };
    }).filter(Boolean) as Array<{ id: string; home: Team; away: Team; isPlayerMatch: boolean; hg: number; ag: number }>;

    // Oyuncunun ilk maçının index'ini bul
    const firstPlayerIdx = all.findIndex(f => f.isPlayerMatch);

    return all.map((f, i) => {
      // Oyuncunun ilk maçından ÖNCE gelen maçlar: gerçek sonuçla önceden oynanmış say
      // Oyuncunun maçı ve sonrasındaki tüm maçlar: başlangıçta boş
      if (!f.isPlayerMatch && i < firstPlayerIdx) {
        return { id: f.id, home: f.home, away: f.away, isPlayerMatch: false, homeGoals: f.hg, awayGoals: f.ag, played: true };
      }
      return { id: f.id, home: f.home, away: f.away, isPlayerMatch: f.isPlayerMatch, homeGoals: null, awayGoals: null, played: false };
    });
  }
  // Fallback: manuel oluştur
  const fixtures: Fixture[] = [];
  let id = 0;
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      const home = teams[i], away = teams[j];
      const isPlayerMatch = home.id === playerTeam.id || away.id === playerTeam.id;
      fixtures.push({ id: `f${id++}`, home, away, homeGoals: null, awayGoals: null, played: false, isPlayerMatch });
    }
  }
  return fixtures;
}

function applyResult(stats: GroupTeamStat[], homeId: string, awayId: string, hg: number, ag: number) {
  const h = stats.find((s) => s.team.id === homeId)!;
  const a = stats.find((s) => s.team.id === awayId)!;
  h.played++; a.played++;
  h.gf += hg; h.ga += ag;
  a.gf += ag; a.ga += hg;
  if (hg > ag) { h.won++; h.points += 3; a.lost++; }
  else if (hg < ag) { a.won++; a.points += 3; h.lost++; }
  else { h.drawn++; h.points++; a.drawn++; a.points++; }
}

function simScore(hStrength = 70, aStrength = 70): [number, number] {
  // Strength farkına göre beklenen gol dağılımı
  const total = hStrength + aStrength;
  const hAdv = hStrength / total;
  const avgGoals = 2.5;
  const hExpected = avgGoals * hAdv * 1.1; // ev avantajı
  const aExpected = avgGoals * (1 - hAdv);
  const randGoals = (expected: number) => {
    const r = Math.random();
    if (r < 0.20) return 0;
    if (r < 0.45) return Math.round(expected * 0.5);
    if (r < 0.75) return Math.round(expected);
    if (r < 0.92) return Math.round(expected * 1.5);
    return Math.round(expected * 2);
  };
  const h = Math.max(0, randGoals(hExpected));
  const a = Math.max(0, randGoals(aExpected));
  return [h, a];
}

// Her gruptan ilk 2 takımı çıkar, 12 grup × 2 = 24 + en iyi 3. takım 8 tane = 32
function getQualifiers(allStats: Record<string, GroupTeamStat[]>): Team[] {
  const groups = Object.keys(allStats).sort();
  const topTwo: Team[] = [];
  const thirds: GroupTeamStat[] = [];

  for (const g of groups) {
    const sorted = [...allStats[g]].sort(
      (a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga) || b.gf - a.gf
    );
    topTwo.push(sorted[0].team, sorted[1].team);
    thirds.push(sorted[2]);
  }

  // En iyi 8 üçüncü
  const best8thirds = thirds
    .sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga))
    .slice(0, 8)
    .map((s) => s.team);

  return [...topTwo, ...best8thirds]; // 24 + 8 = 32
}

function makeR32(qualifiers: Team[], playerTeam: Team): KOMatch[] {
  const matches: KOMatch[] = [];
  // 16 maç: eşleşme 0 vs 31, 1 vs 30 ... (güçlü-zayıf çapraz)
  const seeded = [...qualifiers].sort((a, b) => b.strength - a.strength);
  for (let i = 0; i < 16; i++) {
    const home = seeded[i];
    const away = seeded[31 - i];
    const isPlayerMatch = home.id === playerTeam.id || away.id === playerTeam.id;
    matches.push({ id: `r32_${i}`, home, away, homeGoals: null, awayGoals: null, played: false, isPlayerMatch, round: 'R32', slot: i });
  }
  return matches;
}

const ROUND_ORDER: TournamentPhase[] = ['R32', 'R16', 'QF', 'SF', 'F', 'DONE'];

function nextRound(current: TournamentPhase): TournamentPhase {
  const idx = ROUND_ORDER.indexOf(current);
  return ROUND_ORDER[Math.min(idx + 1, ROUND_ORDER.length - 1)];
}

const ROUND_LABELS: Record<string, Record<string, string>> = {
  R32: { tr: 'Son 32',       en: 'Round of 32',    fr: 'Huitièmes de finale', de: 'Achtelfinale',     es: 'Dieciseisavos'   },
  R16: { tr: 'Son 16',       en: 'Round of 16',    fr: 'Seizième de finale',  de: 'Sechzehntelfinale',es: 'Octavos'         },
  QF:  { tr: 'Çeyrek Final', en: 'Quarter-Final',  fr: 'Quart de finale',     de: 'Viertelfinale',    es: 'Cuartos'         },
  SF:  { tr: 'Yarı Final',   en: 'Semi-Final',     fr: 'Demi-finale',         de: 'Halbfinale',       es: 'Semifinales'     },
  F:   { tr: 'Final',        en: 'Final',          fr: 'Finale',              de: 'Finale',           es: 'Final'           },
};

function roundLabel(r: TournamentPhase, lang = 'tr'): string {
  return ROUND_LABELS[r]?.[lang] ?? ROUND_LABELS[r]?.['en'] ?? r;
}
export { roundLabel };

export const useTournamentStore = create<TournamentState>((set, get) => ({
  active: false,
  phase: 'GROUP',
  groupId: '',
  playerTeam: null,
  stats: [],
  fixtures: [],
  koMatches: [],
  eliminated: false,

  initGroup(playerTeam, groupId) {
    const teams = TEAMS.filter((t) => t.group === groupId);
    const fixtures = makeFixtures(teams, playerTeam, groupId);
    // Gerçek sonuçları stats'a uygula (oyuncunun maçı hariç zaten played:true geldi)
    const stats = makeStats(teams);
    fixtures.filter(f => f.played).forEach(f => {
      applyResult(stats, f.home.id, f.away.id, f.homeGoals!, f.awayGoals!);
    });
    set({
      active: true,
      phase: 'GROUP',
      groupId,
      playerTeam,
      stats,
      fixtures,
      koMatches: [],
      eliminated: false,
    });
  },

  recordPlayerMatch(homeGoals, awayGoals, playerIsHome) {
    const { fixtures, stats, playerTeam } = get();
    const fx = fixtures.find((f) => f.isPlayerMatch && !f.played);
    if (!fx || !playerTeam) return;
    const hg = playerIsHome ? homeGoals : awayGoals;
    const ag = playerIsHome ? awayGoals : homeGoals;
    const newFixtures = fixtures.map((f) =>
      f.id === fx.id ? { ...f, homeGoals: hg, awayGoals: ag, played: true } : f
    );
    const newStats = stats.map((s) => ({ ...s }));
    applyResult(newStats, fx.home.id, fx.away.id, hg, ag);
    set({ fixtures: newFixtures, stats: newStats });
  },

  buildR32() {
    const { stats, groupId, playerTeam } = get();
    if (!playerTeam) return;

    // Sadece kendi grubu var, diğer grupları strength bazlı simüle et
    const allStats: Record<string, GroupTeamStat[]> = {};

    // Oyuncunun gerçek grubu
    allStats[groupId] = stats;

    // Diğer 11 grubu simüle et
    const groups = ['A','B','C','D','E','F','G','H','I','J','K','L'].filter(g => g !== groupId);
    for (const g of groups) {
      const teams = TEAMS.filter(t => t.group === g);
      const gStats = makeStats(teams);
      // Strength bazlı basit simülasyon
      const fixtures = makeFixtures(teams, teams[0], g);
      for (const f of fixtures) {
        const [hg, ag] = simScore(f.home.strength, f.away.strength);
        applyResult(gStats, f.home.id, f.away.id, hg, ag);
      }
      allStats[g] = gStats;
    }

    const qualifiers = getQualifiers(allStats);
    // Oyuncu elendiyse (grupta son 2'de değilse) eliminated yap
    const topTwo = [...allStats[groupId]]
      .sort((a, b) => b.points - a.points || (b.gf - b.ga) - (a.gf - a.ga))
      .slice(0, 2)
      .map(s => s.team.id);
    const thirds = Object.values(allStats)
      .map(gs => [...gs].sort((a,b) => b.points-a.points||(b.gf-b.ga)-(a.gf-a.ga))[2])
      .sort((a,b) => b.points-a.points||(b.gf-b.ga)-(a.gf-a.ga))
      .slice(0,8).map(s => s.team.id);

    const playerQualified = qualifiers.some(t => t.id === playerTeam.id);
    const koMatches = playerQualified ? makeR32(qualifiers, playerTeam) : makeR32(qualifiers, qualifiers[0]);

    set({ phase: 'R32', koMatches, eliminated: !playerQualified });
  },

  recordKOMatch(matchId, homeGoals, awayGoals) {
    const { koMatches, playerTeam } = get();
    const newMatches = koMatches.map(m =>
      m.id === matchId ? { ...m, homeGoals, awayGoals, played: true } : m
    );
    // Oyuncu bu maçı oynadıysa elendi mi?
    const match = koMatches.find(m => m.id === matchId);
    let eliminated = get().eliminated;
    if (match?.isPlayerMatch && playerTeam) {
      const playerIsHome = match.home?.id === playerTeam.id;
      const playerGoals = playerIsHome ? homeGoals : awayGoals;
      const oppGoals = playerIsHome ? awayGoals : homeGoals;
      if (playerGoals < oppGoals) eliminated = true; // sadece yenilince elenir
    }
    set({ koMatches: newMatches, eliminated });
  },

  advanceKO() {
    const { koMatches, playerTeam, phase } = get();
    const currentRound = phase as 'R32'|'R16'|'QF'|'SF'|'F';
    const current = koMatches.filter(m => m.round === currentRound);

    // Oynanmamış maçları simüle et
    const newMatches = koMatches.map(m => {
      if (m.round !== currentRound || m.played) return m;
      const [hg, ag] = simScore();
      return { ...m, homeGoals: hg, awayGoals: ag, played: true };
    });

    // Kazananları belirle ve sonraki round'u oluştur
    const next = nextRound(currentRound);
    if (next === 'DONE') { set({ koMatches: newMatches, phase: 'DONE' }); return; }

    const winners: Team[] = [];
    for (const m of [...current.map(m => newMatches.find(nm => nm.id === m.id)!)]) {
      if (m.homeGoals === null || m.awayGoals === null || !m.home || !m.away) continue;
      if (m.homeGoals > m.awayGoals) winners.push(m.home);
      else if (m.awayGoals > m.homeGoals) winners.push(m.away);
      else {
        // Berabere → oyuncu varsa oyuncu kazanır, yoksa random
        if (playerTeam && (m.home.id === playerTeam.id || m.away.id === playerTeam.id)) {
          winners.push(m.home.id === playerTeam.id ? m.home : m.away);
        } else {
          winners.push(Math.random() > 0.5 ? m.home : m.away);
        }
      }
    }

    const nextMatches: KOMatch[] = [];
    for (let i = 0; i < winners.length / 2; i++) {
      const home = winners[i * 2];
      const away = winners[i * 2 + 1];
      const isPlayerMatch = !!(playerTeam && (home?.id === playerTeam.id || away?.id === playerTeam.id));
      nextMatches.push({ id: `${next.toLowerCase()}_${i}`, home, away, homeGoals: null, awayGoals: null, played: false, isPlayerMatch, round: next as KOMatch['round'], slot: i });
    }

    set({ koMatches: [...newMatches, ...nextMatches], phase: next });
  },

  // Oyuncu maçını oynadıktan sonra çağrılır.
  // Bir sonraki oyuncu maçına kadar sıradaki AI maçlarını simüle edip played:true yapar,
  // gerçek veriden (wc2026data) skorları alır; yoksa random üretir.
  simulateRound() {
    const { fixtures, stats, playerTeam, groupId } = get();
    const realData = REAL_GROUP_DATA[groupId];

    // Bir sonraki oyuncu maçının index'ini bul (henüz oynanmamış)
    const nextPlayerIdx = fixtures.findIndex(f => f.isPlayerMatch && !f.played);

    // Oynanması gereken AI maçlarını belirle:
    // son played index'inden sonra, nextPlayerIdx'e kadar (hariç) olan played:false AI maçları
    let lastPlayedIdx = -1;
    for (let i = 0; i < fixtures.length; i++) {
      if (fixtures[i].played) lastPlayedIdx = i;
    }

    const toSimulate = fixtures
      .map((f, i) => ({ f, i }))
      .filter(({ f, i }) => !f.played && !f.isPlayerMatch && (nextPlayerIdx === -1 || i < nextPlayerIdx));

    if (toSimulate.length === 0) return;

    const newStats = stats.map(s => ({ ...s }));
    const newFixtures = fixtures.map(f => ({ ...f }));

    for (const { f, i } of toSimulate) {
      // Gerçek veriyi kullan — original index ile eşleştir
      let hg: number, ag: number;
      if (realData) {
        const realF = realData.fixtures[i];
        hg = realF ? realF.hg : simScore()[0];
        ag = realF ? realF.ag : simScore()[1];
      } else {
        [hg, ag] = simScore();
      }
      newFixtures[i] = { ...f, homeGoals: hg, awayGoals: ag, played: true };
      applyResult(newStats, f.home.id, f.away.id, hg, ag);
    }

    set({ fixtures: newFixtures, stats: newStats });
  },

  reset() {
    set({ active: false, phase: 'GROUP', groupId: '', playerTeam: null, stats: [], fixtures: [], koMatches: [], eliminated: false });
  },
}));
