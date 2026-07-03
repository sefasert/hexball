export interface Team {
  id: string;
  name: string;
  abbr: string;   // 3 harfli FIFA kısaltması
  flag: string;
  primary: number;
  secondary: number;
  group: string;
  strength: number; // FIFA sıralaması bazlı güç: 1 (zayıf) → 100 (elit)
}

// FIFA World Cup 2026 — Resmi 48 takım, 12 grup (A–L) — Gerçek kura sonuçları
export const TEAMS: Team[] = [
  // Grup A: Meksika, Güney Afrika, Çekya, Güney Kore
  { id: 'mex', name: 'Meksika',      abbr: 'MEX', flag: '🇲🇽', primary: 0x006847, secondary: 0xCE1126, group: 'A', strength: 68 },
  { id: 'rsa', name: 'Güney Afrika', abbr: 'RSA', flag: '🇿🇦', primary: 0x007A4D, secondary: 0xFFB612, group: 'A', strength: 42 },
  { id: 'cze', name: 'Çekya',        abbr: 'CZE', flag: '🇨🇿', primary: 0xD7141A, secondary: 0xFFFFFF, group: 'A', strength: 62 },
  { id: 'kor', name: 'Güney Kore',   abbr: 'KOR', flag: '🇰🇷', primary: 0xCD2E3A, secondary: 0x003478, group: 'A', strength: 65 },

  // Grup B: Bosna-Hersek, Kanada, Katar, İsviçre
  { id: 'bih', name: 'Bosna-Hersek', abbr: 'BIH', flag: '🇧🇦', primary: 0x002395, secondary: 0xFFC72C, group: 'B', strength: 50 },
  { id: 'can', name: 'Kanada',       abbr: 'CAN', flag: '🇨🇦', primary: 0xFF0000, secondary: 0xFFFFFF, group: 'B', strength: 67 },
  { id: 'qat', name: 'Katar',        abbr: 'QAT', flag: '🇶🇦', primary: 0x8D1B3D, secondary: 0xFFFFFF, group: 'B', strength: 38 },
  { id: 'sui', name: 'İsviçre',      abbr: 'SUI', flag: '🇨🇭', primary: 0xFF0000, secondary: 0xFFFFFF, group: 'B', strength: 82 },

  // Grup C: Brezilya, Fas, İskoçya, Haiti
  { id: 'bra', name: 'Brezilya',     abbr: 'BRA', flag: '🇧🇷', primary: 0x009C3B, secondary: 0xFEDF00, group: 'C', strength: 92 },
  { id: 'mar', name: 'Fas',          abbr: 'MAR', flag: '🇲🇦', primary: 0xC1272D, secondary: 0x006233, group: 'C', strength: 74 },
  { id: 'sco', name: 'İskoçya',      abbr: 'SCO', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', primary: 0x003087, secondary: 0xFFFFFF, group: 'C', strength: 60 },
  { id: 'hai', name: 'Haiti',        abbr: 'HAI', flag: '🇭🇹', primary: 0x00209F, secondary: 0xD21034, group: 'C', strength: 28 },

  // Grup D: ABD, Avustralya, Paraguay, Türkiye
  { id: 'usa', name: 'ABD',          abbr: 'USA', flag: '🇺🇸', primary: 0x002868, secondary: 0xBF0A30, group: 'D', strength: 75 },
  { id: 'aus', name: 'Avustralya',   abbr: 'AUS', flag: '🇦🇺', primary: 0x00008B, secondary: 0xFFD700, group: 'D', strength: 63 },
  { id: 'par', name: 'Paraguay',     abbr: 'PAR', flag: '🇵🇾', primary: 0xD52B1E, secondary: 0x0038A8, group: 'D', strength: 52 },
  { id: 'tur', name: 'TÜRKİYE',      abbr: 'TUR', flag: '🇹🇷', primary: 0xE30A17, secondary: 0xFFFFFF, group: 'D', strength: 66 },

  // Grup E: Almanya, Fildişi Sahili, Ekvador, Curacao
  { id: 'ger', name: 'Almanya',      abbr: 'GER', flag: '🇩🇪', primary: 0x000000, secondary: 0xFFFFFF, group: 'E', strength: 88 },
  { id: 'civ', name: 'Fildişi Sah.', abbr: 'CIV', flag: '🇨🇮', primary: 0xF77F00, secondary: 0x009A44, group: 'E', strength: 58 },
  { id: 'ecu', name: 'Ekvador',      abbr: 'ECU', flag: '🇪🇨', primary: 0xFFD100, secondary: 0x003087, group: 'E', strength: 55 },
  { id: 'cur', name: 'Curacao',      abbr: 'CUW', flag: '🇨🇼', primary: 0x003DA5, secondary: 0xFFFFFF, group: 'E', strength: 35 },

  // Grup F: Hollanda, Japonya, İsveç, Tunus
  { id: 'ned', name: 'Hollanda',     abbr: 'NED', flag: '🇳🇱', primary: 0xFF6600, secondary: 0xFFFFFF, group: 'F', strength: 85 },
  { id: 'jpn', name: 'Japonya',      abbr: 'JPN', flag: '🇯🇵', primary: 0x003087, secondary: 0xFFFFFF, group: 'F', strength: 76 },
  { id: 'swe', name: 'İsveç',        abbr: 'SWE', flag: '🇸🇪', primary: 0x006AA7, secondary: 0xFECC02, group: 'F', strength: 70 },
  { id: 'tun', name: 'Tunus',        abbr: 'TUN', flag: '🇹🇳', primary: 0xE70013, secondary: 0xFFFFFF, group: 'F', strength: 48 },

  // Grup G: Belçika, Mısır, İran, Yeni Zelanda
  { id: 'bel', name: 'Belçika',      abbr: 'BEL', flag: '🇧🇪', primary: 0xEF3340, secondary: 0x000000, group: 'G', strength: 80 },
  { id: 'egy', name: 'Mısır',        abbr: 'EGY', flag: '🇪🇬', primary: 0xCE1126, secondary: 0xFFFFFF, group: 'G', strength: 54 },
  { id: 'irn', name: 'İran',         abbr: 'IRN', flag: '🇮🇷', primary: 0x239F40, secondary: 0xDA0000, group: 'G', strength: 57 },
  { id: 'nzl', name: 'Yeni Zelanda', abbr: 'NZL', flag: '🇳🇿', primary: 0x00247D, secondary: 0xFFFFFF, group: 'G', strength: 40 },

  // Grup H: İspanya, Yeşil Burun, Uruguay, Suudi Arabistan
  { id: 'esp', name: 'İspanya',      abbr: 'ESP', flag: '🇪🇸', primary: 0xAA151B, secondary: 0xF1BF00, group: 'H', strength: 95 },
  { id: 'cpv', name: 'Yeşil Burun',  abbr: 'CPV', flag: '🇨🇻', primary: 0x003893, secondary: 0xFFFFFF, group: 'H', strength: 45 },
  { id: 'uru', name: 'Uruguay',      abbr: 'URU', flag: '🇺🇾', primary: 0x5EB6E4, secondary: 0xFFFFFF, group: 'H', strength: 73 },
  { id: 'sau', name: 'Suudi Arab.',  abbr: 'KSA', flag: '🇸🇦', primary: 0x006C35, secondary: 0xFFFFFF, group: 'H', strength: 56 },

  // Grup I: Fransa, Norveç, Senegal, Irak
  { id: 'fra', name: 'Fransa',       abbr: 'FRA', flag: '🇫🇷', primary: 0x002395, secondary: 0xED2939, group: 'I', strength: 96 },
  { id: 'nor', name: 'Norveç',       abbr: 'NOR', flag: '🇳🇴', primary: 0xEF2B2D, secondary: 0x002868, group: 'I', strength: 71 },
  { id: 'sen', name: 'Senegal',      abbr: 'SEN', flag: '🇸🇳', primary: 0x00853F, secondary: 0xFCDD09, group: 'I', strength: 69 },
  { id: 'irq', name: 'Irak',         abbr: 'IRQ', flag: '🇮🇶', primary: 0xCE1126, secondary: 0x007A3D, group: 'I', strength: 44 },

  // Grup J: Arjantin, Avusturya, Cezayir, Ürdün
  { id: 'arg', name: 'Arjantin',     abbr: 'ARG', flag: '🇦🇷', primary: 0x74ACDF, secondary: 0xFFFFFF, group: 'J', strength: 98 },
  { id: 'aut', name: 'Avusturya',    abbr: 'AUT', flag: '🇦🇹', primary: 0xED2939, secondary: 0xFFFFFF, group: 'J', strength: 75 },
  { id: 'alg', name: 'Cezayir',      abbr: 'ALG', flag: '🇩🇿', primary: 0x006233, secondary: 0xFFFFFF, group: 'J', strength: 59 },
  { id: 'jor', name: 'Ürdün',        abbr: 'JOR', flag: '🇯🇴', primary: 0x007A3D, secondary: 0xCE1126, group: 'J', strength: 36 },

  // Grup K: Kolombiya, Portekiz, Kongo DR, Özbekistan
  { id: 'col', name: 'Kolombiya',    abbr: 'COL', flag: '🇨🇴', primary: 0xFCD116, secondary: 0x003087, group: 'K', strength: 77 },
  { id: 'por', name: 'Portekiz',     abbr: 'POR', flag: '🇵🇹', primary: 0x006600, secondary: 0xFF0000, group: 'K', strength: 91 },
  { id: 'cod', name: 'Kongo DR',     abbr: 'COD', flag: '🇨🇩', primary: 0x007FFF, secondary: 0xF7D618, group: 'K', strength: 50 },
  { id: 'uzb', name: 'Özbekistan',   abbr: 'UZB', flag: '🇺🇿', primary: 0x1EB53A, secondary: 0x0099B5, group: 'K', strength: 39 },

  // Grup L: İngiltere, Hırvatistan, Gana, Panama
  { id: 'eng', name: 'İngiltere',    abbr: 'ENG', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', primary: 0xCF111A, secondary: 0xFFFFFF, group: 'L', strength: 87 },
  { id: 'cro', name: 'Hırvatistan',  abbr: 'CRO', flag: '🇭🇷', primary: 0xFF0000, secondary: 0xFFFFFF, group: 'L', strength: 80 },
  { id: 'gha', name: 'Gana',         abbr: 'GHA', flag: '🇬🇭', primary: 0x006B3F, secondary: 0xFCD116, group: 'L', strength: 53 },
  { id: 'pan', name: 'Panama',       abbr: 'PAN', flag: '🇵🇦', primary: 0xDA121A, secondary: 0x003893, group: 'L', strength: 46 },
];
