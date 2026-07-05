// FIFA Dünya Kupası 2026 — Gerçek grup sonuçları ve Son 32 eşleşmeleri

export interface RealFixture {
  home: string; // team id
  away: string;
  hg: number;
  ag: number;
}

export interface RealGroupData {
  fixtures: RealFixture[];
}

// Her grubun gerçek 6 maç sonucu (BBC Sport / ESPN verisinden)
export const REAL_GROUP_DATA: Record<string, RealGroupData> = {
  A: { fixtures: [
    { home: 'mex', away: 'rsa', hg: 2, ag: 0 },
    { home: 'kor', away: 'cze', hg: 2, ag: 1 },
    { home: 'cze', away: 'rsa', hg: 1, ag: 1 },
    { home: 'mex', away: 'kor', hg: 1, ag: 0 },
    { home: 'cze', away: 'mex', hg: 0, ag: 3 },
    { home: 'rsa', away: 'kor', hg: 1, ag: 0 },
  ]},
  B: { fixtures: [
    { home: 'can', away: 'bih', hg: 1, ag: 1 },
    { home: 'qat', away: 'sui', hg: 1, ag: 1 },
    { home: 'sui', away: 'bih', hg: 4, ag: 1 },
    { home: 'can', away: 'qat', hg: 6, ag: 0 },
    { home: 'bih', away: 'qat', hg: 3, ag: 1 },
    { home: 'sui', away: 'can', hg: 2, ag: 1 },
  ]},
  C: { fixtures: [
    { home: 'bra', away: 'mar', hg: 1, ag: 1 },
    { home: 'hai', away: 'sco', hg: 0, ag: 1 },
    { home: 'sco', away: 'mar', hg: 0, ag: 1 },
    { home: 'bra', away: 'hai', hg: 3, ag: 0 },
    { home: 'mar', away: 'hai', hg: 4, ag: 2 },
    { home: 'sco', away: 'bra', hg: 0, ag: 3 },
  ]},
  D: { fixtures: [
    { home: 'usa', away: 'par', hg: 4, ag: 1 },
    { home: 'aus', away: 'tur', hg: 2, ag: 0 },
    { home: 'usa', away: 'aus', hg: 2, ag: 0 },
    { home: 'tur', away: 'par', hg: 0, ag: 1 },
    { home: 'par', away: 'aus', hg: 0, ag: 0 },
    { home: 'tur', away: 'usa', hg: 3, ag: 2 },
  ]},
  E: { fixtures: [
    { home: 'ger', away: 'cur', hg: 7, ag: 1 },
    { home: 'civ', away: 'ecu', hg: 1, ag: 0 },
    { home: 'ger', away: 'civ', hg: 2, ag: 1 },
    { home: 'ecu', away: 'cur', hg: 0, ag: 0 },
    { home: 'cur', away: 'civ', hg: 0, ag: 2 },
    { home: 'ecu', away: 'ger', hg: 2, ag: 1 },
  ]},
  F: { fixtures: [
    { home: 'ned', away: 'jpn', hg: 2, ag: 2 },
    { home: 'swe', away: 'tun', hg: 5, ag: 1 },
    { home: 'ned', away: 'swe', hg: 5, ag: 1 },
    { home: 'tun', away: 'jpn', hg: 0, ag: 4 },
    { home: 'jpn', away: 'swe', hg: 1, ag: 1 },
    { home: 'tun', away: 'ned', hg: 1, ag: 3 },
  ]},
  G: { fixtures: [
    { home: 'bel', away: 'egy', hg: 1, ag: 1 },
    { home: 'irn', away: 'nzl', hg: 2, ag: 2 },
    { home: 'bel', away: 'irn', hg: 0, ag: 0 },
    { home: 'nzl', away: 'egy', hg: 1, ag: 3 },
    { home: 'egy', away: 'irn', hg: 1, ag: 1 },
    { home: 'nzl', away: 'bel', hg: 1, ag: 5 },
  ]},
  H: { fixtures: [
    { home: 'esp', away: 'cpv', hg: 0, ag: 0 },
    { home: 'sau', away: 'uru', hg: 1, ag: 1 },
    { home: 'esp', away: 'sau', hg: 4, ag: 0 },
    { home: 'uru', away: 'cpv', hg: 2, ag: 2 },
    { home: 'cpv', away: 'sau', hg: 0, ag: 0 },
    { home: 'uru', away: 'esp', hg: 0, ag: 1 },
  ]},
  I: { fixtures: [
    { home: 'fra', away: 'sen', hg: 3, ag: 1 },
    { home: 'irq', away: 'nor', hg: 1, ag: 4 },
    { home: 'fra', away: 'irq', hg: 3, ag: 0 },
    { home: 'nor', away: 'sen', hg: 3, ag: 2 },
    { home: 'nor', away: 'fra', hg: 1, ag: 4 },
    { home: 'sen', away: 'irq', hg: 5, ag: 0 },
  ]},
  J: { fixtures: [
    { home: 'arg', away: 'alg', hg: 3, ag: 0 },
    { home: 'aut', away: 'jor', hg: 3, ag: 1 },
    { home: 'arg', away: 'aut', hg: 2, ag: 0 },
    { home: 'jor', away: 'alg', hg: 1, ag: 2 },
    { home: 'alg', away: 'aut', hg: 3, ag: 3 },
    { home: 'jor', away: 'arg', hg: 1, ag: 3 },
  ]},
  K: { fixtures: [
    { home: 'por', away: 'cod', hg: 1, ag: 1 },
    { home: 'uzb', away: 'col', hg: 1, ag: 3 },
    { home: 'por', away: 'uzb', hg: 5, ag: 0 },
    { home: 'col', away: 'cod', hg: 1, ag: 0 },
    { home: 'col', away: 'por', hg: 0, ag: 0 },
    { home: 'cod', away: 'uzb', hg: 3, ag: 1 },
  ]},
  L: { fixtures: [
    { home: 'eng', away: 'cro', hg: 4, ag: 2 },
    { home: 'gha', away: 'pan', hg: 1, ag: 0 },
    { home: 'eng', away: 'gha', hg: 0, ag: 0 },
    { home: 'pan', away: 'cro', hg: 0, ag: 1 },
    { home: 'cro', away: 'gha', hg: 2, ag: 1 },
    { home: 'pan', away: 'eng', hg: 0, ag: 2 },
  ]},
};

// Son 32 gerçek eşleşmeleri (BBC Sport / FIFA resmi bracket)
export interface R32Pairing { home: string; away: string; }
export const REAL_R32: R32Pairing[] = [
  { home: 'ger',  away: 'par'  }, // A1 vs D3
  { home: 'fra',  away: 'swe'  }, // I1 vs F3
  { home: 'rsa',  away: 'can'  }, // A2 vs B2 (3.ler dahil)
  { home: 'ned',  away: 'mar'  }, // F1 vs C2
  { home: 'por',  away: 'cro'  }, // K2 vs L2
  { home: 'esp',  away: 'aut'  }, // H1 vs J2
  { home: 'usa',  away: 'bih'  }, // D1 vs B3
  { home: 'bel',  away: 'sen'  }, // G1 vs I3
  { home: 'bra',  away: 'jpn'  }, // C1 vs F2
  { home: 'civ',  away: 'nor'  }, // E2 vs I2
  { home: 'mex',  away: 'ecu'  }, // A1(alt) vs E3
  { home: 'eng',  away: 'cod'  }, // L1 vs K3
  { home: 'arg',  away: 'cpv'  }, // J1 vs H2
  { home: 'aus',  away: 'egy'  }, // D2 vs G2
  { home: 'sui',  away: 'alg'  }, // B1 vs J3
  { home: 'col',  away: 'gha'  }, // K1 vs L3
];
