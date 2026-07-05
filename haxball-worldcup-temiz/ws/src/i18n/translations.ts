export type Lang = 'tr' | 'en' | 'fr' | 'de' | 'es';

export interface Translations {
  // Controls
  move: string;
  shoot: string;
  // HUD
  overtime: string;
  time: string;
  speedUp: string;
  goal: string;
  scored: string;
  draw: string;
  won: string;
  playAgain: string;
  returningToGroup: string;
  changeTeam: string;
  waterBreak: string;
  resume: string;
  restart: string;
  mainMenu: string;
  // TeamSelect
  worldCup: string;
  tournament: string;
  tournamentSub: string;
  quickMatch: string;
  quickMatchSub: string;
  pickOpponent: string;
  pickOpponentPlaceholder: string;
  pickTeamPlaceholder: string;
  continueBtn: string;
  back: string;
  backMenu: string;
  whichSide: string;
  leftSide: string;
  rightSide: string;
  playingAs: string;
  tournamentPick: string;
  quickPick: string;
  // GroupStage
  groupStage: string;
  standings: string;
  colTeam: string;
  colP: string;
  colW: string;
  colD: string;
  colL: string;
  colGD: string;
  colPts: string;
  matches: string;
  playMatch: string;
  groupDone: string;
  qualified1: string;
  qualified2: string;
  eliminated: string;
  continueGroup: string;
  // KnockoutStage
  tournamentOver: string;
  fifaWC: string;
  eliminatedMsg: string;
  worldChampion: string;
  congratsWin: string;
  finalResult: string;
  nextRound: string;
  nextRoundElim: string;
  backToMenu: string;
}

const tr: Translations = {
  move: 'Hareket',
  shoot: 'Şut',
  overtime: 'UZATMA',
  time: 'Süre',
  speedUp: '⚡ Maçı Hızlandır',
  goal: 'GOL!',
  scored: 'GOL ATTI!',
  draw: '🤝 Berabere!',
  won: 'Kazandı!',
  playAgain: 'Yeniden Oyna',
  returningToGroup: '⏳ Grup tablosuna dönülüyor...',
  changeTeam: 'Takım Değiştir',
  waterBreak: '☰ Menü',
  resume: '▶ Devam Et',
  restart: '🔄 Yeniden Başla',
  mainMenu: '🏠 Ana Menüye Dön',
  worldCup: '⚽ Dünya Kupası 2026',
  tournament: 'Turnuva',
  tournamentSub: 'Grup aşamasından finale',
  quickMatch: 'Hızlı Maç',
  quickMatchSub: 'Rakibini seç, direkt oyna',
  pickOpponent: 'Rakibini Seç',
  pickOpponentPlaceholder: 'Rakip seç...',
  pickTeamPlaceholder: 'Takım seç...',
  continueBtn: 'Devam Et →',
  back: '← Geri',
  backMenu: '← Ana Menü',
  whichSide: 'Hangi tarafta oynamak istersin?',
  leftSide: 'Sol Taraf',
  rightSide: 'Sağ Taraf',
  playingAs: 'ile oynuyorsun',
  tournamentPick: '🏆 Turnuva — Takımını Seç',
  quickPick: '⚡ Hızlı Maç — Takımını Seç',
  groupStage: 'Grup Aşaması',
  standings: 'Puan Tablosu',
  colTeam: 'Takım',
  colP: 'O',
  colW: 'G',
  colD: 'B',
  colL: 'M',
  colGD: 'Av',
  colPts: 'P',
  matches: 'Maçlar',
  playMatch: '▶ Maça Başla',
  groupDone: 'Grup Tamamlandı',
  qualified1: '🏆 Gruptan Çıktın!',
  qualified2: '✅ Gruptan Çıktın!',
  eliminated: '❌ Elendin',
  continueGroup: 'Devam Et',
  tournamentOver: 'Turnuva Bitti!',
  fifaWC: 'FIFA Dünya Kupası 2026',
  eliminatedMsg: '❌ Elendiniz — Diğer maçları izleyin',
  worldChampion: '🏆 Dünya Şampiyonu',
  congratsWin: '🎉 Tebrikler! Sen kazandın!',
  finalResult: 'Final Sonucu',
  nextRound: '⏭ Sonraki Tur',
  nextRoundElim: '⏭ Sonraki Tura Geç',
  backToMenu: '🏠 Ana Menüye Dön',
};

const en: Translations = {
  move: 'Move',
  shoot: 'Shoot',
  overtime: 'EXTRA TIME',
  time: 'Time',
  speedUp: '⚡ Speed Up',
  goal: 'GOAL!',
  scored: 'SCORED!',
  draw: '🤝 Draw!',
  won: 'Won!',
  playAgain: 'Play Again',
  returningToGroup: '⏳ Returning to group...',
  changeTeam: 'Change Team',
  waterBreak: '☰ Menu',
  resume: '▶ Resume',
  restart: '🔄 Restart',
  mainMenu: '🏠 Main Menu',
  worldCup: '⚽ World Cup 2026',
  tournament: 'Tournament',
  tournamentSub: 'From group stage to final',
  quickMatch: 'Quick Match',
  quickMatchSub: 'Pick opponent, play now',
  pickOpponent: 'Pick Your Opponent',
  pickOpponentPlaceholder: 'Select opponent...',
  pickTeamPlaceholder: 'Select team...',
  continueBtn: 'Continue →',
  back: '← Back',
  backMenu: '← Main Menu',
  whichSide: 'Which side do you want to play?',
  leftSide: 'Left Side',
  rightSide: 'Right Side',
  playingAs: 'playing as',
  tournamentPick: '🏆 Tournament — Pick Your Team',
  quickPick: '⚡ Quick Match — Pick Your Team',
  groupStage: 'Group Stage',
  standings: 'Standings',
  colTeam: 'Team',
  colP: 'P',
  colW: 'W',
  colD: 'D',
  colL: 'L',
  colGD: 'GD',
  colPts: 'Pts',
  matches: 'Matches',
  playMatch: '▶ Play Match',
  groupDone: 'Group Complete',
  qualified1: '🏆 Qualified!',
  qualified2: '✅ Qualified!',
  eliminated: '❌ Eliminated',
  continueGroup: 'Continue',
  tournamentOver: 'Tournament Over!',
  fifaWC: 'FIFA World Cup 2026',
  eliminatedMsg: '❌ Eliminated — Watch other matches',
  worldChampion: '🏆 World Champion',
  congratsWin: '🎉 Congratulations! You won!',
  finalResult: 'Final Result',
  nextRound: '⏭ Next Round',
  nextRoundElim: '⏭ Skip to Next Round',
  backToMenu: '🏠 Back to Menu',
};

const fr: Translations = {
  move: 'Déplacer',
  shoot: 'Tirer',
  overtime: 'PROLONGATION',
  time: 'Temps',
  speedUp: '⚡ Accélérer',
  goal: 'BUT!',
  scored: 'A MARQUÉ!',
  draw: '🤝 Match nul!',
  won: 'A gagné!',
  playAgain: 'Rejouer',
  returningToGroup: '⏳ Retour au groupe...',
  changeTeam: 'Changer d\'équipe',
  waterBreak: '☰ Menu',
  resume: '▶ Continuer',
  restart: '🔄 Recommencer',
  mainMenu: '🏠 Menu principal',
  worldCup: '⚽ Coupe du Monde 2026',
  tournament: 'Tournoi',
  tournamentSub: 'De la phase de groupes à la finale',
  quickMatch: 'Match rapide',
  quickMatchSub: 'Choisir adversaire, jouer',
  pickOpponent: 'Choisir l\'adversaire',
  pickOpponentPlaceholder: 'Sélectionner...',
  pickTeamPlaceholder: 'Sélectionner équipe...',
  continueBtn: 'Continuer →',
  back: '← Retour',
  backMenu: '← Menu principal',
  whichSide: 'Quel côté voulez-vous jouer?',
  leftSide: 'Côté gauche',
  rightSide: 'Côté droit',
  playingAs: 'vous jouez avec',
  tournamentPick: '🏆 Tournoi — Choisir équipe',
  quickPick: '⚡ Match rapide — Choisir équipe',
  groupStage: 'Phase de groupes',
  standings: 'Classement',
  colTeam: 'Équipe',
  colP: 'J',
  colW: 'V',
  colD: 'N',
  colL: 'D',
  colGD: 'DB',
  colPts: 'Pts',
  matches: 'Matchs',
  playMatch: '▶ Jouer',
  groupDone: 'Groupe terminé',
  qualified1: '🏆 Qualifié!',
  qualified2: '✅ Qualifié!',
  eliminated: '❌ Éliminé',
  continueGroup: 'Continuer',
  tournamentOver: 'Tournoi terminé!',
  fifaWC: 'Coupe du Monde FIFA 2026',
  eliminatedMsg: '❌ Éliminé — Regardez les autres matchs',
  worldChampion: '🏆 Champion du Monde',
  congratsWin: '🎉 Félicitations! Vous avez gagné!',
  finalResult: 'Résultat final',
  nextRound: '⏭ Tour suivant',
  nextRoundElim: '⏭ Passer au tour suivant',
  backToMenu: '🏠 Menu principal',
};

const de: Translations = {
  move: 'Bewegen',
  shoot: 'Schießen',
  overtime: 'VERLÄNGERUNG',
  time: 'Zeit',
  speedUp: '⚡ Beschleunigen',
  goal: 'TOR!',
  scored: 'HAT GETROFFEN!',
  draw: '🤝 Unentschieden!',
  won: 'Gewonnen!',
  playAgain: 'Nochmal spielen',
  returningToGroup: '⏳ Zurück zur Gruppe...',
  changeTeam: 'Team wechseln',
  waterBreak: '☰ Menü',
  resume: '▶ Fortsetzen',
  restart: '🔄 Neustart',
  mainMenu: '🏠 Hauptmenü',
  worldCup: '⚽ Weltmeisterschaft 2026',
  tournament: 'Turnier',
  tournamentSub: 'Von der Gruppenphase zum Finale',
  quickMatch: 'Schnelles Spiel',
  quickMatchSub: 'Gegner wählen, direkt spielen',
  pickOpponent: 'Gegner wählen',
  pickOpponentPlaceholder: 'Gegner auswählen...',
  pickTeamPlaceholder: 'Team auswählen...',
  continueBtn: 'Weiter →',
  back: '← Zurück',
  backMenu: '← Hauptmenü',
  whichSide: 'Welche Seite möchtest du spielen?',
  leftSide: 'Linke Seite',
  rightSide: 'Rechte Seite',
  playingAs: 'spielst als',
  tournamentPick: '🏆 Turnier — Team wählen',
  quickPick: '⚡ Schnelles Spiel — Team wählen',
  groupStage: 'Gruppenphase',
  standings: 'Tabelle',
  colTeam: 'Team',
  colP: 'Sp',
  colW: 'S',
  colD: 'U',
  colL: 'N',
  colGD: 'TD',
  colPts: 'Pkt',
  matches: 'Spiele',
  playMatch: '▶ Spielen',
  groupDone: 'Gruppe abgeschlossen',
  qualified1: '🏆 Qualifiziert!',
  qualified2: '✅ Qualifiziert!',
  eliminated: '❌ Ausgeschieden',
  continueGroup: 'Weiter',
  tournamentOver: 'Turnier beendet!',
  fifaWC: 'FIFA Weltmeisterschaft 2026',
  eliminatedMsg: '❌ Ausgeschieden — Andere Spiele ansehen',
  worldChampion: '🏆 Weltmeister',
  congratsWin: '🎉 Glückwunsch! Du hast gewonnen!',
  finalResult: 'Endergebnis',
  nextRound: '⏭ Nächste Runde',
  nextRoundElim: '⏭ Zur nächsten Runde',
  backToMenu: '🏠 Hauptmenü',
};

const es: Translations = {
  move: 'Mover',
  shoot: 'Disparar',
  overtime: 'PRÓRROGA',
  time: 'Tiempo',
  speedUp: '⚡ Acelerar',
  goal: '¡GOL!',
  scored: '¡MARCÓ!',
  draw: '🤝 ¡Empate!',
  won: '¡Ganó!',
  playAgain: 'Jugar de nuevo',
  returningToGroup: '⏳ Volviendo al grupo...',
  changeTeam: 'Cambiar equipo',
  waterBreak: '☰ Menú',
  resume: '▶ Continuar',
  restart: '🔄 Reiniciar',
  mainMenu: '🏠 Menú principal',
  worldCup: '⚽ Copa del Mundo 2026',
  tournament: 'Torneo',
  tournamentSub: 'De la fase de grupos a la final',
  quickMatch: 'Partido rápido',
  quickMatchSub: 'Elige rival, juega ya',
  pickOpponent: 'Elige tu rival',
  pickOpponentPlaceholder: 'Seleccionar rival...',
  pickTeamPlaceholder: 'Seleccionar equipo...',
  continueBtn: 'Continuar →',
  back: '← Atrás',
  backMenu: '← Menú principal',
  whichSide: '¿En qué lado quieres jugar?',
  leftSide: 'Lado izquierdo',
  rightSide: 'Lado derecho',
  playingAs: 'jugando como',
  tournamentPick: '🏆 Torneo — Elige tu equipo',
  quickPick: '⚡ Partido rápido — Elige tu equipo',
  groupStage: 'Fase de grupos',
  standings: 'Clasificación',
  colTeam: 'Equipo',
  colP: 'PJ',
  colW: 'G',
  colD: 'E',
  colL: 'P',
  colGD: 'DG',
  colPts: 'Pts',
  matches: 'Partidos',
  playMatch: '▶ Jugar',
  groupDone: 'Grupo completado',
  qualified1: '🏆 ¡Clasificado!',
  qualified2: '✅ ¡Clasificado!',
  eliminated: '❌ Eliminado',
  continueGroup: 'Continuar',
  tournamentOver: '¡Torneo terminado!',
  fifaWC: 'Copa del Mundo FIFA 2026',
  eliminatedMsg: '❌ Eliminado — Mira otros partidos',
  worldChampion: '🏆 Campeón del Mundo',
  congratsWin: '🎉 ¡Felicidades! ¡Ganaste!',
  finalResult: 'Resultado final',
  nextRound: '⏭ Siguiente ronda',
  nextRoundElim: '⏭ Saltar a siguiente ronda',
  backToMenu: '🏠 Menú principal',
};

export const TRANSLATIONS: Record<Lang, Translations> = { tr, en, fr, de, es };
