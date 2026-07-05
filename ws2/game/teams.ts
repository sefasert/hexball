export interface Team {
  id: string;
  name: string; // Türkçe (varsayılan)
  names: Record<string, string>; // çok dilli isimler
  abbr: string;
  flag: string;
  primary: number;
  secondary: number;
  group: string;
  strength: number;
}

export function teamName(team: Team, lang: string): string {
  return team.names[lang] ?? team.names['en'] ?? team.name;
}

// FIFA World Cup 2026 — Resmi 48 takım, 12 grup (A–L) — Gerçek kura sonuçları
export const TEAMS: Team[] = [
  // Grup A — Meksika 1., G.Afrika 2. (son 32'ye gitti)
  { id: 'mex', name: 'Meksika',      names: { tr: 'Meksika',       en: 'Mexico',       fr: 'Mexique',      de: 'Mexiko',        es: 'México'        }, abbr: 'MEX', flag: '🇲🇽', primary: 0x006847, secondary: 0xCE1126, group: 'A', strength: 78 },
  { id: 'rsa', name: 'Güney Afrika', names: { tr: 'Güney Afrika',  en: 'South Africa', fr: 'Afrique du Sud',de: 'Südafrika',     es: 'Sudáfrica'     }, abbr: 'RSA', flag: '🇿🇦', primary: 0x007A4D, secondary: 0xFFB612, group: 'A', strength: 52 },
  { id: 'cze', name: 'Çekya',        names: { tr: 'Çekya',         en: 'Czechia',      fr: 'Tchéquie',     de: 'Tschechien',    es: 'Chequia'       }, abbr: 'CZE', flag: '🇨🇿', primary: 0xD7141A, secondary: 0xFFFFFF, group: 'A', strength: 55 },
  { id: 'kor', name: 'Güney Kore',   names: { tr: 'Güney Kore',   en: 'South Korea',  fr: 'Corée du Sud', de: 'Südkorea',      es: 'Corea del Sur' }, abbr: 'KOR', flag: '🇰🇷', primary: 0xCD2E3A, secondary: 0x003478, group: 'A', strength: 58 },

  // Grup B — İsviçre 1., Kanada 2., Bosna 3. (3. olarak son 32'ye)
  { id: 'bih', name: 'Bosna-Hersek', names: { tr: 'Bosna-Hersek', en: 'Bosnia & Herz.',fr: 'Bosnie-Herzég.',de: 'Bosnien-Herzeg.',es: 'Bosnia y Herz.' }, abbr: 'BIH', flag: '🇧🇦', primary: 0x002395, secondary: 0xFFC72C, group: 'B', strength: 57 },
  { id: 'can', name: 'Kanada',       names: { tr: 'Kanada',        en: 'Canada',       fr: 'Canada',       de: 'Kanada',        es: 'Canadá'        }, abbr: 'CAN', flag: '🇨🇦', primary: 0xFF0000, secondary: 0xFFFFFF, group: 'B', strength: 74 },
  { id: 'qat', name: 'Katar',        names: { tr: 'Katar',         en: 'Qatar',        fr: 'Qatar',        de: 'Katar',         es: 'Catar'         }, abbr: 'QAT', flag: '🇶🇦', primary: 0x8D1B3D, secondary: 0xFFFFFF, group: 'B', strength: 32 },
  { id: 'sui', name: 'İsviçre',      names: { tr: 'İsviçre',       en: 'Switzerland',  fr: 'Suisse',       de: 'Schweiz',       es: 'Suiza'         }, abbr: 'SUI', flag: '🇨🇭', primary: 0xFF0000, secondary: 0xFFFFFF, group: 'B', strength: 83 },

  // Grup C — Brezilya 1., Fas 2.
  { id: 'bra', name: 'Brezilya',     names: { tr: 'Brezilya',      en: 'Brazil',       fr: 'Brésil',       de: 'Brasilien',     es: 'Brasil'        }, abbr: 'BRA', flag: '🇧🇷', primary: 0x009C3B, secondary: 0xFEDF00, group: 'C', strength: 90 },
  { id: 'mar', name: 'Fas',          names: { tr: 'Fas',           en: 'Morocco',      fr: 'Maroc',        de: 'Marokko',       es: 'Marruecos'     }, abbr: 'MAR', flag: '🇲🇦', primary: 0xC1272D, secondary: 0x006233, group: 'C', strength: 79 },
  { id: 'sco', name: 'İskoçya',      names: { tr: 'İskoçya',       en: 'Scotland',     fr: 'Écosse',       de: 'Schottland',    es: 'Escocia'       }, abbr: 'SCO', flag: '🔵',  primary: 0x003087, secondary: 0xFFFFFF, group: 'C', strength: 56 },
  { id: 'hai', name: 'Haiti',        names: { tr: 'Haiti',         en: 'Haiti',        fr: 'Haïti',        de: 'Haiti',         es: 'Haití'         }, abbr: 'HAI', flag: '🇭🇹', primary: 0x00209F, secondary: 0xD21034, group: 'C', strength: 24 },

  // Grup D — ABD 1., Avustralya 2., Paraguay 3. (3. olarak son 32'ye)
  { id: 'usa', name: 'Amerika B.D.',  names: { tr: 'Amerika B.D.',  en: 'USA',          fr: 'États-Unis',   de: 'USA',           es: 'EE. UU.'       }, abbr: 'USA', flag: '🇺🇸', primary: 0x002868, secondary: 0xBF0A30, group: 'D', strength: 80 },
  { id: 'aus', name: 'Avustralya',   names: { tr: 'Avustralya',    en: 'Australia',    fr: 'Australie',    de: 'Australien',    es: 'Australia'     }, abbr: 'AUS', flag: '🇦🇺', primary: 0x00008B, secondary: 0xFFD700, group: 'D', strength: 70 },
  { id: 'par', name: 'Paraguay',     names: { tr: 'Paraguay',      en: 'Paraguay',     fr: 'Paraguay',     de: 'Paraguay',      es: 'Paraguay'      }, abbr: 'PAR', flag: '🇵🇾', primary: 0xD52B1E, secondary: 0x0038A8, group: 'D', strength: 60 },
  { id: 'tur', name: 'Türkiye',       names: { tr: 'Türkiye',        en: 'Turkey',       fr: 'Turquie',      de: 'Türkei',        es: 'Turquía'       }, abbr: 'TUR', flag: '🇹🇷', primary: 0xE30A17, secondary: 0xFFFFFF, group: 'D', strength: 62 },

  // Grup E — Almanya 1., Fildişi 2., Ekvador 3. (3. olarak son 32'ye)
  { id: 'ger', name: 'Almanya',      names: { tr: 'Almanya',       en: 'Germany',      fr: 'Allemagne',    de: 'Deutschland',   es: 'Alemania'      }, abbr: 'GER', flag: '🇩🇪', primary: 0x000000, secondary: 0xFFFFFF, group: 'E', strength: 86 },
  { id: 'civ', name: 'Fildişi Sah.', names: { tr: 'Fildişi Sah.',  en: 'Ivory Coast',  fr: 'Côte d\'Ivoire',de: 'Elfenbeinküste',es: 'Costa de Marfil'}, abbr: 'CIV', flag: '🇨🇮', primary: 0xF77F00, secondary: 0x009A44, group: 'E', strength: 68 },
  { id: 'ecu', name: 'Ekvador',      names: { tr: 'Ekvador',       en: 'Ecuador',      fr: 'Équateur',     de: 'Ecuador',       es: 'Ecuador'       }, abbr: 'ECU', flag: '🇪🇨', primary: 0xFFD100, secondary: 0x003087, group: 'E', strength: 59 },
  { id: 'cur', name: 'Curaçao',      names: { tr: 'Curaçao',       en: 'Curaçao',      fr: 'Curaçao',      de: 'Curaçao',       es: 'Curazao'       }, abbr: 'CUW', flag: '🇨🇼', primary: 0x003DA5, secondary: 0xFFFFFF, group: 'E', strength: 28 },

  // Grup F — Hollanda 1., Japonya 2., İsveç 3. (3. olarak son 32'ye)
  { id: 'ned', name: 'Hollanda',     names: { tr: 'Hollanda',      en: 'Netherlands',  fr: 'Pays-Bas',     de: 'Niederlande',   es: 'Países Bajos'  }, abbr: 'NED', flag: '🇳🇱', primary: 0xFF6600, secondary: 0xFFFFFF, group: 'F', strength: 85 },
  { id: 'jpn', name: 'Japonya',      names: { tr: 'Japonya',       en: 'Japan',        fr: 'Japon',        de: 'Japan',         es: 'Japón'         }, abbr: 'JPN', flag: '🇯🇵', primary: 0x003087, secondary: 0xFFFFFF, group: 'F', strength: 78 },
  { id: 'swe', name: 'İsveç',        names: { tr: 'İsveç',         en: 'Sweden',       fr: 'Suède',        de: 'Schweden',      es: 'Suecia'        }, abbr: 'SWE', flag: '🇸🇪', primary: 0x006AA7, secondary: 0xFECC02, group: 'F', strength: 72 },
  { id: 'tun', name: 'Tunus',        names: { tr: 'Tunus',         en: 'Tunisia',      fr: 'Tunisie',      de: 'Tunesien',      es: 'Túnez'         }, abbr: 'TUN', flag: '🇹🇳', primary: 0xE70013, secondary: 0xFFFFFF, group: 'F', strength: 38 },

  // Grup G — Belçika 1., Mısır 2.
  { id: 'bel', name: 'Belçika',      names: { tr: 'Belçika',       en: 'Belgium',      fr: 'Belgique',     de: 'Belgien',       es: 'Bélgica'       }, abbr: 'BEL', flag: '🇧🇪', primary: 0xEF3340, secondary: 0x000000, group: 'G', strength: 77 },
  { id: 'egy', name: 'Mısır',        names: { tr: 'Mısır',         en: 'Egypt',        fr: 'Égypte',       de: 'Ägypten',       es: 'Egipto'        }, abbr: 'EGY', flag: '🇪🇬', primary: 0xCE1126, secondary: 0xFFFFFF, group: 'G', strength: 65 },
  { id: 'irn', name: 'İran',         names: { tr: 'İran',          en: 'Iran',         fr: 'Iran',         de: 'Iran',          es: 'Irán'          }, abbr: 'IRN', flag: '🇮🇷', primary: 0x239F40, secondary: 0xDA0000, group: 'G', strength: 54 },
  { id: 'nzl', name: 'Yeni Zelanda', names: { tr: 'Yeni Zelanda',  en: 'New Zealand',  fr: 'Nouvelle-Zél.', de: 'Neuseeland',   es: 'Nueva Zelanda' }, abbr: 'NZL', flag: '🇳🇿', primary: 0x00247D, secondary: 0xFFFFFF, group: 'G', strength: 36 },

  // Grup H — İspanya 1., Yeşil Burun 2.
  { id: 'esp', name: 'İspanya',      names: { tr: 'İspanya',       en: 'Spain',        fr: 'Espagne',      de: 'Spanien',       es: 'España'        }, abbr: 'ESP', flag: '🇪🇸', primary: 0xAA151B, secondary: 0xF1BF00, group: 'H', strength: 93 },
  { id: 'cpv', name: 'Yeşil Burun Adaları', names: { tr: 'Yeşil Burun Adaları', en: 'Cape Verde', fr: 'Cap-Vert', de: 'Kap Verde', es: 'Cabo Verde' }, abbr: 'CPV', flag: '🇨🇻', primary: 0x003893, secondary: 0xFFFFFF, group: 'H', strength: 55 },
  { id: 'uru', name: 'Uruguay',      names: { tr: 'Uruguay',       en: 'Uruguay',      fr: 'Uruguay',      de: 'Uruguay',       es: 'Uruguay'       }, abbr: 'URU', flag: '🇺🇾', primary: 0x5EB6E4, secondary: 0xFFFFFF, group: 'H', strength: 69 },
  { id: 'sau', name: 'Suudi Arab.',  names: { tr: 'Suudi Arab.',   en: 'Saudi Arabia', fr: 'Arabie Saoud.', de: 'Saudi-Arabien', es: 'Arabia Saudita'}, abbr: 'KSA', flag: '🇸🇦', primary: 0x006C35, secondary: 0xFFFFFF, group: 'H', strength: 48 },

  // Grup I — Fransa 1., Norveç 2., Senegal 3. (3. olarak son 32'ye)
  { id: 'fra', name: 'Fransa',       names: { tr: 'Fransa',        en: 'France',       fr: 'France',       de: 'Frankreich',    es: 'Francia'       }, abbr: 'FRA', flag: '🇫🇷', primary: 0x002395, secondary: 0xED2939, group: 'I', strength: 97 },
  { id: 'nor', name: 'Norveç',       names: { tr: 'Norveç',        en: 'Norway',       fr: 'Norvège',      de: 'Norwegen',      es: 'Noruega'       }, abbr: 'NOR', flag: '🇳🇴', primary: 0xEF2B2D, secondary: 0x002868, group: 'I', strength: 76 },
  { id: 'sen', name: 'Senegal',      names: { tr: 'Senegal',       en: 'Senegal',      fr: 'Sénégal',      de: 'Senegal',       es: 'Senegal'       }, abbr: 'SEN', flag: '🇸🇳', primary: 0x00853F, secondary: 0xFCDD09, group: 'I', strength: 71 },
  { id: 'irq', name: 'Irak',         names: { tr: 'Irak',          en: 'Iraq',         fr: 'Irak',         de: 'Irak',          es: 'Irak'          }, abbr: 'IRQ', flag: '🇮🇶', primary: 0xCE1126, secondary: 0x007A3D, group: 'I', strength: 36 },

  // Grup J — Arjantin 1., Avusturya 2., Cezayir 3. (3. olarak son 32'ye)
  { id: 'arg', name: 'Arjantin',     names: { tr: 'Arjantin',      en: 'Argentina',    fr: 'Argentine',    de: 'Argentinien',   es: 'Argentina'     }, abbr: 'ARG', flag: '🇦🇷', primary: 0x74ACDF, secondary: 0xFFFFFF, group: 'J', strength: 98 },
  { id: 'aut', name: 'Avusturya',    names: { tr: 'Avusturya',     en: 'Austria',      fr: 'Autriche',     de: 'Österreich',    es: 'Austria'       }, abbr: 'AUT', flag: '🇦🇹', primary: 0xED2939, secondary: 0xFFFFFF, group: 'J', strength: 73 },
  { id: 'alg', name: 'Cezayir',      names: { tr: 'Cezayir',       en: 'Algeria',      fr: 'Algérie',      de: 'Algerien',      es: 'Argelia'       }, abbr: 'ALG', flag: '🇩🇿', primary: 0x006233, secondary: 0xFFFFFF, group: 'J', strength: 61 },
  { id: 'jor', name: 'Ürdün',        names: { tr: 'Ürdün',         en: 'Jordan',       fr: 'Jordanie',     de: 'Jordanien',     es: 'Jordania'      }, abbr: 'JOR', flag: '🇯🇴', primary: 0x007A3D, secondary: 0xCE1126, group: 'J', strength: 30 },

  // Grup K — Kolombiya 1., Portekiz 2., Kongo DR 3. (3. olarak son 32'ye)
  { id: 'col', name: 'Kolombiya',    names: { tr: 'Kolombiya',     en: 'Colombia',     fr: 'Colombie',     de: 'Kolumbien',     es: 'Colombia'      }, abbr: 'COL', flag: '🇨🇴', primary: 0xFCD116, secondary: 0x003087, group: 'K', strength: 82 },
  { id: 'por', name: 'Portekiz',     names: { tr: 'Portekiz',      en: 'Portugal',     fr: 'Portugal',     de: 'Portugal',      es: 'Portugal'      }, abbr: 'POR', flag: '🇵🇹', primary: 0x006600, secondary: 0xFF0000, group: 'K', strength: 89 },
  { id: 'cod', name: 'Kongo DR',     names: { tr: 'Kongo DR',      en: 'DR Congo',     fr: 'RD Congo',     de: 'DR Kongo',      es: 'RD Congo'      }, abbr: 'COD', flag: '🇨🇩', primary: 0x007FFF, secondary: 0xF7D618, group: 'K', strength: 57 },
  { id: 'uzb', name: 'Özbekistan',   names: { tr: 'Özbekistan',    en: 'Uzbekistan',   fr: 'Ouzbékistan',  de: 'Usbekistan',    es: 'Uzbekistán'    }, abbr: 'UZB', flag: '🇺🇿', primary: 0x1EB53A, secondary: 0x0099B5, group: 'K', strength: 33 },

  // Grup L — İngiltere 1., Hırvatistan 2., Gana 3. (3. olarak son 32'ye)
  { id: 'eng', name: 'İngiltere',    names: { tr: 'İngiltere',     en: 'England',      fr: 'Angleterre',   de: 'England',       es: 'Inglaterra'    }, abbr: 'ENG', flag: '🏴', primary: 0xCF111A, secondary: 0xFFFFFF, group: 'L', strength: 88 },
  { id: 'cro', name: 'Hırvatistan',  names: { tr: 'Hırvatistan',   en: 'Croatia',      fr: 'Croatie',      de: 'Kroatien',      es: 'Croacia'       }, abbr: 'CRO', flag: '🇭🇷', primary: 0xFF0000, secondary: 0xFFFFFF, group: 'L', strength: 76 },
  { id: 'gha', name: 'Gana',         names: { tr: 'Gana',          en: 'Ghana',        fr: 'Ghana',        de: 'Ghana',         es: 'Ghana'         }, abbr: 'GHA', flag: '🇬🇭', primary: 0x006B3F, secondary: 0xFCD116, group: 'L', strength: 58 },
  { id: 'pan', name: 'Panama',       names: { tr: 'Panama',        en: 'Panama',       fr: 'Panama',       de: 'Panama',        es: 'Panamá'        }, abbr: 'PAN', flag: '🇵🇦', primary: 0xDA121A, secondary: 0x003893, group: 'L', strength: 40 },
];
