// Canvas-based flag painters for each WC2026 team
// Each function draws into a CanvasRenderingContext2D at (0,0) with given size

export type FlagPainter = (ctx: CanvasRenderingContext2D, s: number) => void;

// ── Helpers ──────────────────────────────────────────────────────────────────

function hStripes(ctx: CanvasRenderingContext2D, s: number, colors: string[]) {
  const h = s / colors.length;
  colors.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(0, i * h, s, h + 1);
  });
}

function vStripes(ctx: CanvasRenderingContext2D, s: number, colors: string[]) {
  const w = s / colors.length;
  colors.forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.fillRect(i * w, 0, w + 1, s);
  });
}

function circle(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, fill: string) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = fill;
  ctx.fill();
}

export const FLAG_PAINTERS: Record<string, FlagPainter> = {

  // ── GRUP A ───────────────────────────────────────────────────────────────

  mex(ctx, s) { // Meksika — yeşil-beyaz-kırmızı dikey, ortada kartal arması
    vStripes(ctx, s, ['#006847', '#FFFFFF', '#CE1126']);
    // Kartal arması (basit kartal silüeti)
    const cx = s/2, cy = s/2;
    circle(ctx, cx, cy, s*0.14, '#8B6914');
    circle(ctx, cx, cy, s*0.1, '#228B22');
    // Kartal başı
    circle(ctx, cx, cy - s*0.08, s*0.04, '#8B6914');
    // Kanatlar
    ctx.fillStyle = '#8B6914';
    ctx.beginPath(); ctx.ellipse(cx - s*0.1, cy, s*0.08, s*0.04, -0.3, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.ellipse(cx + s*0.1, cy, s*0.08, s*0.04, 0.3, 0, Math.PI*2); ctx.fill();
  },

  cze(ctx, s) { // Beyaz üst, kırmızı alt, mavi üçgen solda
    hStripes(ctx, s, ['#FFFFFF', '#D7141A']);
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.lineTo(s * 0.55, s / 2); ctx.lineTo(0, s);
    ctx.fillStyle = '#11457E'; ctx.fill();
  },

  rsa(ctx, s) { // Güney Afrika — doğru sıralama ile
    // Arka plan: kırmızı üst, mavi alt, yeşil orta bantlar
    ctx.fillStyle = '#DE3831'; ctx.fillRect(0, 0, s, s * 0.34);
    ctx.fillStyle = '#002395'; ctx.fillRect(0, s * 0.66, s, s * 0.34);
    ctx.fillStyle = '#007A4D'; ctx.fillRect(0, s * 0.34, s, s * 0.32);
    // Beyaz yatay ince bantlar
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, s*0.32, s, s*0.04);
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, s*0.64, s, s*0.04);
    // Sarı üçgen (Y şeklinin dış hattı)
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(s*0.44,s/2); ctx.lineTo(0,s);
    ctx.fillStyle = '#FFB612'; ctx.fill();
    // Siyah üçgen (iç)
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(s*0.35,s/2); ctx.lineTo(0,s);
    ctx.fillStyle = '#000000'; ctx.fill();
    // Yeşil yatay şerit (ortadan sağa)
    ctx.fillStyle = '#007A4D'; ctx.fillRect(s*0.35, s*0.38, s*0.65, s*0.24);
    // Beyaz yatay ince bantlar (Y'nin üzeri)
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(s*0.35, s*0.36, s*0.65, s*0.04);
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(s*0.35, s*0.6, s*0.65, s*0.04);
  },

  kor(ctx, s) { // Güney Kore — beyaz, Taeguk + 4 trigram
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, s, s);
    const cx = s/2, cy = s/2, r = s*0.22;
    // Taeguk kırmızı alt yarı
    circle(ctx, cx, cy, r, '#CD2E3A');
    // Mavi üst yarı
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, r, Math.PI, 0); ctx.clip();
    ctx.fillStyle = '#003478'; ctx.fillRect(cx-r, cy-r, r*2, r); ctx.restore();
    // Küçük daireler Taeguk eğrisi için
    circle(ctx, cx, cy - r/2, r/2, '#003478');
    circle(ctx, cx, cy + r/2, r/2, '#CD2E3A');
    // 4 trigram (köşelerde 3'er çizgi)
    const drawTri = (ox: number, oy: number, angle: number, pattern: boolean[]) => {
      ctx.save(); ctx.translate(ox, oy); ctx.rotate(angle);
      pattern.forEach((solid, i) => {
        ctx.fillStyle = '#000000';
        if (solid) {
          ctx.fillRect(-s*0.1, (i-1)*s*0.065, s*0.2, s*0.035);
        } else {
          ctx.fillRect(-s*0.1, (i-1)*s*0.065, s*0.08, s*0.035);
          ctx.fillRect(s*0.02, (i-1)*s*0.065, s*0.08, s*0.035);
        }
      });
      ctx.restore();
    };
    drawTri(s*0.2, s*0.2, -Math.PI/4, [true,true,true]);
    drawTri(s*0.8, s*0.2, Math.PI/4, [true,false,true]);
    drawTri(s*0.2, s*0.8, -Math.PI*3/4, [false,true,false]);
    drawTri(s*0.8, s*0.8, Math.PI*3/4, [false,false,false]);
  },

  // ── GRUP B ───────────────────────────────────────────────────────────────

  can(ctx, s) { // Kanada — kırmızı-beyaz-kırmızı dikey
    vStripes(ctx, s, ['#FF0000', '#FFFFFF', '#FF0000']);
    // Akçaağaç yaprağı (basit)
    ctx.fillStyle = '#FF0000';
    ctx.font = `bold ${s*0.32}px serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('🍁', s/2, s/2);
  },

  bih(ctx, s) { // Bosna — lacivert zemin, sarı üçgen, çapraz beyaz yıldızlar
    ctx.fillStyle = '#002395'; ctx.fillRect(0, 0, s, s);
    ctx.beginPath(); ctx.moveTo(s*0.2, 0); ctx.lineTo(s, s*0.8); ctx.lineTo(s, 0);
    ctx.fillStyle = '#FECB00'; ctx.fill();
    // Çapraz yıldız dizisi
    for (let i = 0; i < 7; i++) {
      const px = s*(0.08 + i*0.13), py = s*(0.06 + i*0.13);
      ctx.save(); ctx.translate(px, py);
      ctx.beginPath();
      for (let j=0;j<5;j++){
        const a=(j*4*Math.PI/5)-Math.PI/2, b=((j*4+2)*Math.PI/5)-Math.PI/2;
        ctx.lineTo(Math.cos(a)*s*0.045, Math.sin(a)*s*0.045);
        ctx.lineTo(Math.cos(b)*s*0.018, Math.sin(b)*s*0.018);
      }
      ctx.closePath(); ctx.fillStyle='#FFFFFF'; ctx.fill(); ctx.restore();
    }
  },

  qat(ctx, s) { // Katar — beyaz sol (%28), bordo sağ, 9 dişli beyaz kenar
    ctx.fillStyle = '#8D1B3D'; ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, s*0.28, s);
    const teeth = 9, th = s / teeth;
    for (let i = 0; i < teeth; i++) {
      ctx.fillStyle = '#8D1B3D';
      ctx.beginPath();
      ctx.moveTo(s*0.28, i*th);
      ctx.lineTo(s*0.36, i*th + th/2);
      ctx.lineTo(s*0.28, (i+1)*th);
      ctx.fill();
    }
  },

  sui(ctx, s) { // İsviçre — kırmızı, beyaz haç
    ctx.fillStyle = '#FF0000'; ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(s*0.38, s*0.18, s*0.24, s*0.64);
    ctx.fillRect(s*0.18, s*0.38, s*0.64, s*0.24);
  },

  // ── GRUP C ───────────────────────────────────────────────────────────────

  bra(ctx, s) { // Brezilya — yeşil, sarı elmas, mavi daire, beyaz şerit
    ctx.fillStyle = '#009C3B'; ctx.fillRect(0, 0, s, s);
    ctx.beginPath();
    ctx.moveTo(s/2, s*0.08); ctx.lineTo(s*0.94, s/2);
    ctx.lineTo(s/2, s*0.92); ctx.lineTo(s*0.06, s/2);
    ctx.fillStyle = '#FEDF00'; ctx.fill();
    circle(ctx, s/2, s/2, s*0.24, '#002776');
    // Beyaz eğri şerit (clip ile dairenin içinde)
    ctx.save();
    ctx.beginPath(); ctx.arc(s/2, s/2, s*0.24, 0, Math.PI*2); ctx.clip();
    ctx.fillStyle = '#FFFFFF';
    // Hafif eğimli şerit
    ctx.save(); ctx.translate(s/2, s/2); ctx.rotate(-0.1);
    ctx.fillRect(-s*0.24, -s*0.05, s*0.48, s*0.1);
    ctx.restore(); ctx.restore();
    // "ORDEM E PROGRESSO" yeşil yazı
    ctx.save();
    ctx.beginPath(); ctx.arc(s/2, s/2, s*0.24, 0, Math.PI*2); ctx.clip();
    ctx.fillStyle = '#009C3B';
    ctx.font = `bold ${s*0.058}px sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.save(); ctx.translate(s/2, s/2); ctx.rotate(-0.1);
    ctx.fillText('ORDEM E PROGRESSO', 0, 0);
    ctx.restore(); ctx.restore();
  },

  hai(ctx, s) { // Haiti — mavi üst, kırmızı alt, ortada beyaz arma
    hStripes(ctx, s, ['#00209F', '#D21034']);
    // Beyaz arma şeridi
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(s*0.22, s*0.38, s*0.56, s*0.24);
    // Palmiye (basit)
    ctx.fillStyle = '#228B22';
    ctx.fillRect(s*0.48, s*0.4, s*0.04, s*0.18);
    ctx.beginPath(); ctx.arc(s*0.5, s*0.42, s*0.1, Math.PI, 0); ctx.fillStyle='#228B22'; ctx.fill();
    ctx.beginPath(); ctx.arc(s*0.5, s*0.44, s*0.08, 0, Math.PI); ctx.fill();
    // Top ve bayrak direği
    circle(ctx, s*0.5, s*0.5, s*0.04, '#8B0000');
  },

  mar(ctx, s) { // Fas — kırmızı zemin, ortada dolu yeşil 5 köşeli yıldız
    ctx.fillStyle = '#C1272D'; ctx.fillRect(0, 0, s, s);
    ctx.save(); ctx.translate(s/2, s/2);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i * 4 * Math.PI / 5) - Math.PI/2;
      const b = (i * 4 * Math.PI / 5 + 2 * Math.PI / 5) - Math.PI/2;
      ctx.lineTo(Math.cos(a)*s*0.28, Math.sin(a)*s*0.28);
      ctx.lineTo(Math.cos(b)*s*0.11, Math.sin(b)*s*0.11);
    }
    ctx.closePath();
    ctx.fillStyle = '#006233'; ctx.fill();
    ctx.restore();
  },

  sco(ctx, s) { // İskoçya — mavi, beyaz X (St. Andrew)
    ctx.fillStyle = '#003087'; ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = s*0.22;
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(s,s); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s,0); ctx.lineTo(0,s); ctx.stroke();
  },

  // ── GRUP D ───────────────────────────────────────────────────────────────

  usa(ctx, s) { // ABD — 13 şerit, mavi köşe, 50 yıldız (6x5 + 5x4 grid)
    for (let i = 0; i < 13; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#BF0A30' : '#FFFFFF';
      ctx.fillRect(0, i * (s/13), s, s/13 + 1);
    }
    ctx.fillStyle = '#002868'; ctx.fillRect(0, 0, s*0.45, s*0.54);
    // 50 yıldız: 5 sıra 6'lı + 4 sıra 5'li = 50
    const starR = s * 0.028;
    const cols6 = 6, cols5 = 5, rows = 9;
    const padX = s*0.045, padY = s*0.045;
    const boxW = s*0.45 - padX*2, boxH = s*0.54 - padY*2;
    const dx6 = boxW / (cols6 - 1), dy = boxH / (rows - 1);
    const dx5 = boxW / (cols5 - 1);
    for (let row = 0; row < rows; row++) {
      const isSixRow = row % 2 === 0;
      const cols = isSixRow ? cols6 : cols5;
      const dx = isSixRow ? dx6 : dx5;
      const offsetX = isSixRow ? 0 : dx6 / 2;
      for (let col = 0; col < cols; col++) {
        const x = padX + offsetX + col * dx;
        const y = padY + row * dy;
        ctx.save(); ctx.translate(x, y);
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const a = (i*4*Math.PI/5) - Math.PI/2;
          const b = ((i*4+2)*Math.PI/5) - Math.PI/2;
          ctx.lineTo(Math.cos(a)*starR, Math.sin(a)*starR);
          ctx.lineTo(Math.cos(b)*starR*0.4, Math.sin(b)*starR*0.4);
        }
        ctx.closePath(); ctx.fillStyle='#FFFFFF'; ctx.fill();
        ctx.restore();
      }
    }
  },

  aus(ctx, s) { // Avustralya — lacivert zemin, sol üstte Union Jack, sağda Güney Haçı
    ctx.fillStyle = '#00008B'; ctx.fillRect(0, 0, s, s);
    // Union Jack sol üst çeyrek
    const uw = s * 0.48, uh = s * 0.5;
    // Beyaz çapraz
    ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = s * 0.16;
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(uw, uh); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(uw,0); ctx.lineTo(0, uh); ctx.stroke();
    // Kırmızı çapraz
    ctx.strokeStyle = '#CF111A'; ctx.lineWidth = s * 0.08;
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(uw, uh); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(uw,0); ctx.lineTo(0, uh); ctx.stroke();
    // Beyaz dikey+yatay haç
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(uw*0.4,0,uw*0.2,uh);
    ctx.fillRect(0,uh*0.38,uw,uh*0.24);
    ctx.fillStyle = '#CF111A'; ctx.fillRect(uw*0.45,0,uw*0.1,uh);
    ctx.fillRect(0,uh*0.44,uw,uh*0.12);
    // Güney Haçı yıldızları (sağ taraf)
    const stars = [{x:0.76,y:0.28},{x:0.9,y:0.48},{x:0.76,y:0.7},{x:0.62,y:0.48},{x:0.86,y:0.24}];
    stars.forEach(p => circle(ctx, p.x*s, p.y*s, s*0.05, '#FFFFFF'));
  },

  par(ctx, s) { // Paraguay — kırmızı-beyaz-mavi yatay, ortada güneş arması
    hStripes(ctx, s, ['#D52B1E', '#FFFFFF', '#0038A8']);
    const cx = s / 2, cy = s / 2;
    // Dış altın halka
    ctx.beginPath(); ctx.arc(cx, cy, s * 0.18, 0, Math.PI * 2);
    ctx.strokeStyle = '#FFD700'; ctx.lineWidth = s * 0.03; ctx.stroke();
    // Güneş ışınları
    ctx.save(); ctx.translate(cx, cy);
    for (let i = 0; i < 8; i++) {
      ctx.save(); ctx.rotate(i * Math.PI / 4);
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(-s * 0.012, -s * 0.17, s * 0.024, s * 0.06);
      ctx.restore();
    }
    ctx.restore();
    // Merkez yeşil daire
    circle(ctx, cx, cy, s * 0.1, '#009B3A');
    // İç sarı daire
    circle(ctx, cx, cy, s * 0.07, '#FFD700');
    // Merkez mavi nokta
    circle(ctx, cx, cy, s * 0.04, '#0038A8');
  },

  tur(ctx, s) { // Türkiye — kırmızı, beyaz ay-yıldız
    ctx.fillStyle = '#E30A17'; ctx.fillRect(0, 0, s, s);
    circle(ctx, s*0.44, s/2, s*0.24, '#FFFFFF');
    circle(ctx, s*0.52, s/2, s*0.19, '#E30A17');
    // Yıldız
    ctx.save(); ctx.translate(s*0.72, s/2);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i*4*Math.PI/5) - Math.PI/2;
      const b = ((i*4+2)*Math.PI/5) - Math.PI/2;
      ctx.lineTo(Math.cos(a)*s*0.12, Math.sin(a)*s*0.12);
      ctx.lineTo(Math.cos(b)*s*0.05, Math.sin(b)*s*0.05);
    }
    ctx.closePath(); ctx.fillStyle='#FFFFFF'; ctx.fill();
    ctx.restore();
  },

  // ── GRUP E ───────────────────────────────────────────────────────────────

  cur(ctx, s) { // Curacao — mavi, sarı çizgi, beyaz yıldızlar
    ctx.fillStyle = '#003DA5'; ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#F9E814';
    ctx.fillRect(0, s*0.55, s, s*0.12);
    circle(ctx, s*0.28, s*0.28, s*0.07, '#FFFFFF');
    circle(ctx, s*0.42, s*0.18, s*0.05, '#FFFFFF');
    circle(ctx, s*0.38, s*0.36, s*0.04, '#FFFFFF');
  },

  ecu(ctx, s) { // Ekvador — sarı-mavi-kırmızı yatay
    hStripes(ctx, s, ['#FFD100', '#003087', '#EF3340']);
    // Sarı büyük olsun
    ctx.fillStyle = '#FFD100'; ctx.fillRect(0, 0, s, s*0.5);
    ctx.fillStyle = '#003087'; ctx.fillRect(0, s*0.5, s, s*0.25);
    ctx.fillStyle = '#EF3340'; ctx.fillRect(0, s*0.75, s, s*0.25);
  },

  ger(ctx, s) { // Almanya — siyah-kırmızı-sarı
    hStripes(ctx, s, ['#000000', '#DD0000', '#FFCE00']);
  },

  civ(ctx, s) { // Fildişi Sahili — turuncu-beyaz-yeşil dikey
    vStripes(ctx, s, ['#F77F00', '#FFFFFF', '#009A44']);
  },

  // ── GRUP F ───────────────────────────────────────────────────────────────

  ned(ctx, s) { // Hollanda — kırmızı-beyaz-mavi yatay
    hStripes(ctx, s, ['#AE1C28', '#FFFFFF', '#21468B']);
  },

  jpn(ctx, s) { // Japonya — beyaz, kırmızı daire
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, s, s);
    circle(ctx, s/2, s/2, s*0.3, '#BC002D');
  },

  swe(ctx, s) { // İsveç — mavi, sarı haç
    ctx.fillStyle = '#006AA7'; ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#FECC02';
    ctx.fillRect(0, s*0.38, s, s*0.24);
    ctx.fillRect(s*0.3, 0, s*0.22, s);
  },

  tun(ctx, s) { // Tunus — kırmızı zemin, beyaz daire, kırmızı ay-yıldız
    ctx.fillStyle = '#E70013'; ctx.fillRect(0, 0, s, s);
    circle(ctx, s/2, s/2, s*0.3, '#FFFFFF');
    // Kırmızı ay
    circle(ctx, s*0.46, s/2, s*0.18, '#E70013');
    circle(ctx, s*0.54, s/2, s*0.14, '#FFFFFF');
    // Kırmızı yıldız
    ctx.save(); ctx.translate(s*0.6, s/2);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i*4*Math.PI/5) - Math.PI/2;
      const b = ((i*4+2)*Math.PI/5) - Math.PI/2;
      ctx.lineTo(Math.cos(a)*s*0.1, Math.sin(a)*s*0.1);
      ctx.lineTo(Math.cos(b)*s*0.04, Math.sin(b)*s*0.04);
    }
    ctx.closePath(); ctx.fillStyle='#E70013'; ctx.fill();
    ctx.restore();
  },

  // ── GRUP G ───────────────────────────────────────────────────────────────

  bel(ctx, s) { // Belçika — siyah-sarı-kırmızı dikey
    vStripes(ctx, s, ['#000000', '#FAE042', '#EF3340']);
  },

  egy(ctx, s) { // Mısır — kırmızı-beyaz-siyah yatay, ortada altın Saladin kartalı
    hStripes(ctx, s, ['#CE1126', '#FFFFFF', '#000000']);
    const cx = s/2, cy = s/2;
    // Kartal gövde
    ctx.fillStyle = '#C09300';
    ctx.beginPath(); ctx.ellipse(cx, cy, s*0.1, s*0.13, 0, 0, Math.PI*2); ctx.fill();
    // Sol kanat
    ctx.beginPath(); ctx.ellipse(cx - s*0.14, cy - s*0.02, s*0.12, s*0.06, -0.4, 0, Math.PI*2); ctx.fill();
    // Sağ kanat
    ctx.beginPath(); ctx.ellipse(cx + s*0.14, cy - s*0.02, s*0.12, s*0.06, 0.4, 0, Math.PI*2); ctx.fill();
    // Baş
    circle(ctx, cx, cy - s*0.12, s*0.05, '#C09300');
    // Gaga
    ctx.fillStyle = '#8B6914';
    ctx.beginPath(); ctx.moveTo(cx, cy-s*0.1); ctx.lineTo(cx+s*0.04, cy-s*0.12); ctx.lineTo(cx, cy-s*0.14); ctx.fill();
    // Kalkan (göğüs)
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(cx-s*0.05, cy-s*0.06, s*0.1, s*0.1);
    ctx.strokeStyle = '#C09300'; ctx.lineWidth = s*0.015;
    ctx.strokeRect(cx-s*0.05, cy-s*0.06, s*0.1, s*0.1);
    // Pençeler
    ctx.strokeStyle = '#C09300'; ctx.lineWidth = s*0.02;
    ctx.beginPath(); ctx.moveTo(cx-s*0.04, cy+s*0.12); ctx.lineTo(cx-s*0.08, cy+s*0.17); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(cx+s*0.04, cy+s*0.12); ctx.lineTo(cx+s*0.08, cy+s*0.17); ctx.stroke();
  },

  irn(ctx, s) { // İran — yeşil-beyaz-kırmızı, ortada "الله" yazısı
    hStripes(ctx, s, ['#239F40', '#FFFFFF', '#DA0000']);
    // Şerit kenarı ince bant
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, s*0.305, s, s*0.02);
    ctx.fillStyle = '#DA0000'; ctx.fillRect(0, s*0.675, s, s*0.02);
    // Ortada büyük "الله" yazısı
    ctx.fillStyle = '#DA0000';
    ctx.font = `bold ${s*0.28}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('الله', s/2, s/2);
  },

  nzl(ctx, s) { // Yeni Zelanda — lacivert, sol üst Union Jack, sağda 4 kırmızı yıldız
    ctx.fillStyle = '#00247D'; ctx.fillRect(0, 0, s, s);
    const uw = s*0.48, uh = s*0.5;
    ctx.strokeStyle='#FFFFFF'; ctx.lineWidth=s*0.15;
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(uw,uh); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(uw,0); ctx.lineTo(0,uh); ctx.stroke();
    ctx.strokeStyle='#CF111A'; ctx.lineWidth=s*0.08;
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(uw,uh); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(uw,0); ctx.lineTo(0,uh); ctx.stroke();
    ctx.fillStyle='#FFFFFF'; ctx.fillRect(uw*0.4,0,uw*0.2,uh); ctx.fillRect(0,uh*0.38,uw,uh*0.24);
    ctx.fillStyle='#CF111A'; ctx.fillRect(uw*0.45,0,uw*0.1,uh); ctx.fillRect(0,uh*0.44,uw,uh*0.12);
    // 4 kırmızı yıldız sağ taraf (Güney Haçı)
    const drawStar = (ox: number, oy: number, r: number) => {
      ctx.save(); ctx.translate(ox, oy);
      ctx.beginPath();
      for (let i=0;i<5;i++){
        const a=(i*4*Math.PI/5)-Math.PI/2, b=((i*4+2)*Math.PI/5)-Math.PI/2;
        ctx.lineTo(Math.cos(a)*r, Math.sin(a)*r);
        ctx.lineTo(Math.cos(b)*r*0.4, Math.sin(b)*r*0.4);
      }
      ctx.closePath(); ctx.fillStyle='#CC142B'; ctx.fill();
      ctx.strokeStyle='#FFFFFF'; ctx.lineWidth=r*0.2; ctx.stroke();
      ctx.restore();
    };
    drawStar(s*0.72, s*0.22, s*0.07);
    drawStar(s*0.88, s*0.44, s*0.06);
    drawStar(s*0.76, s*0.68, s*0.07);
    drawStar(s*0.62, s*0.5, s*0.055);
  },

  // ── GRUP H ───────────────────────────────────────────────────────────────

  cpv(ctx, s) { // Yeşil Burun — mavi, kırmızı-beyaz çizgi
    ctx.fillStyle = '#003893'; ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#CF2027'; ctx.fillRect(0, s*0.58, s, s*0.09);
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, s*0.67, s, s*0.04);
    ctx.fillStyle = '#CF2027'; ctx.fillRect(0, s*0.71, s, s*0.09);
    // Sarı yıldız çemberi
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2 - Math.PI/2;
      circle(ctx, s/2 + Math.cos(a)*s*0.28, s/2 + Math.sin(a)*s*0.28, s*0.04, '#F7D116');
    }
  },

  sau(ctx, s) { // Suudi Arabistan — koyu yeşil, beyaz şehadet yazısı + kılıç
    ctx.fillStyle = '#006C35'; ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `bold ${s*0.14}px serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('لا إله إلا الله محمد رسول الله', s/2, s*0.42);
    // Kılıç — yatay, ortada
    const ky = s*0.68, klen = s*0.62, kx = (s - klen) / 2;
    // Namlu
    ctx.fillRect(kx, ky - s*0.022, klen*0.82, s*0.044);
    // Uç (üçgen)
    ctx.beginPath();
    ctx.moveTo(kx + klen*0.82, ky - s*0.022);
    ctx.lineTo(kx + klen,      ky);
    ctx.lineTo(kx + klen*0.82, ky + s*0.022);
    ctx.closePath(); ctx.fill();
    // Sap koruyucu (dikey)
    ctx.fillRect(kx + s*0.04, ky - s*0.055, s*0.03, s*0.11);
    // Sap
    ctx.fillRect(kx, ky - s*0.018, s*0.045, s*0.036);
  },

  esp(ctx, s) { // İspanya — kırmızı(%25) sarı(%50) kırmızı(%25) + arma
    // Şeritler
    ctx.fillStyle = '#AA151B'; ctx.fillRect(0, 0, s, s*0.25);
    ctx.fillStyle = '#F1BF00'; ctx.fillRect(0, s*0.25, s, s*0.5);
    ctx.fillStyle = '#AA151B'; ctx.fillRect(0, s*0.75, s, s*0.25);

    // Arma merkezi: sarı bölgenin sol çeyreğinde
    const cx = s*0.28, cy = s*0.5;

    // Taç — armadan üstte
    ctx.fillStyle = '#F6A800';
    ctx.fillRect(cx - s*0.09, cy - s*0.22, s*0.18, s*0.05);
    ctx.fillRect(cx - s*0.03, cy - s*0.27, s*0.06, s*0.06);
    ctx.fillRect(cx - s*0.09, cy - s*0.27, s*0.04, s*0.04);
    ctx.fillRect(cx + s*0.05, cy - s*0.27, s*0.04, s*0.04);

    // Kalkan
    const kw = s*0.2, kh = s*0.26, kx = cx - kw/2, ky = cy - s*0.13;
    // Sol yarı — Kastilya kalesi (kırmızı + altın kale)
    ctx.fillStyle = '#C8102E'; ctx.fillRect(kx, ky, kw/2, kh);
    // Sağ yarı — León aslanı (beyaz + mor)
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(kx+kw/2, ky, kw/2, kh);
    // Kale silueti sol
    ctx.fillStyle = '#F6A800';
    ctx.fillRect(kx+s*0.01, ky+s*0.02, s*0.04, s*0.07);
    ctx.fillRect(kx+s*0.06, ky+s*0.02, s*0.03, s*0.04);
    // Aslan mor nokta sağ
    circle(ctx, kx+kw*0.75, ky+kh*0.45, s*0.025, '#722F8A');
    // Kalkan kenarlığı
    ctx.strokeStyle = '#8B6914'; ctx.lineWidth = s*0.018;
    ctx.strokeRect(kx, ky, kw, kh);
    // Alt kısmı yuvarlat (basit yarım daire alt)
    ctx.fillStyle = '#8B6914';
    ctx.beginPath(); ctx.arc(cx, ky+kh, kw/2, 0, Math.PI); ctx.stroke();
  },

  uru(ctx, s) { // Uruguay — 9 yatay şerit, sol üstte güneş
    for (let i = 0; i < 9; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#FFFFFF' : '#5EB6E4';
      ctx.fillRect(0, i*(s/9), s, s/9 + 1);
    }
    // Sol üst beyaz kare
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, s*0.44, s*0.44);
    // Güneş ışınları
    const sx = s*0.22, sy = s*0.22;
    ctx.save(); ctx.translate(sx, sy);
    for (let i = 0; i < 8; i++) {
      ctx.save(); ctx.rotate(i * Math.PI/4);
      ctx.fillStyle = '#F4C400';
      ctx.fillRect(-s*0.014, -s*0.18, s*0.028, s*0.07);
      ctx.restore();
    }
    ctx.restore();
    circle(ctx, sx, sy, s*0.12, '#F4C400');
    // Güneş yüzü
    circle(ctx, sx - s*0.035, sy - s*0.02, s*0.018, '#333');
    circle(ctx, sx + s*0.035, sy - s*0.02, s*0.018, '#333');
    ctx.beginPath(); ctx.arc(sx, sy + s*0.01, s*0.035, 0, Math.PI); ctx.strokeStyle='#333'; ctx.lineWidth=s*0.014; ctx.stroke();
  },

  // ── GRUP I ───────────────────────────────────────────────────────────────

  fra(ctx, s) { // Fransa — mavi-beyaz-kırmızı dikey
    vStripes(ctx, s, ['#002395', '#FFFFFF', '#ED2939']);
  },

  nor(ctx, s) { // Norveç — kırmızı, mavi-beyaz haç
    ctx.fillStyle = '#EF2B2D'; ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, s*0.36, s, s*0.28);
    ctx.fillRect(s*0.25, 0, s*0.22, s);
    ctx.fillStyle = '#002868';
    ctx.fillRect(0, s*0.42, s, s*0.16);
    ctx.fillRect(s*0.31, 0, s*0.1, s);
  },

  sen(ctx, s) { // Senegal — yeşil-sarı-kırmızı dikey, yeşil yıldız
    vStripes(ctx, s, ['#00853F', '#FECB00', '#E31B23']);
    // Yeşil yıldız ortada
    ctx.save(); ctx.translate(s/2, s/2);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i*4*Math.PI/5)-Math.PI/2, b=(i*4*Math.PI/5+2*Math.PI/5)-Math.PI/2;
      ctx.lineTo(Math.cos(a)*s*0.18, Math.sin(a)*s*0.18);
      ctx.lineTo(Math.cos(b)*s*0.07, Math.sin(b)*s*0.07);
    }
    ctx.closePath(); ctx.fillStyle='#00853F'; ctx.fill();
    ctx.restore();
  },

  irq(ctx, s) { // Irak — kırmızı-beyaz-siyah yatay, yeşil yazı
    hStripes(ctx, s, ['#CE1126', '#FFFFFF', '#000000']);
    ctx.fillStyle = '#007A3D';
    ctx.font = `bold ${s*0.22}px serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('الله', s/2, s*0.5);
  },

  // ── GRUP J ───────────────────────────────────────────────────────────────

  alg(ctx, s) { // Cezayir — sol beyaz, sağ yeşil, ortada kırmızı ay-yıldız
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, s*0.5, s);
    ctx.fillStyle = '#006233'; ctx.fillRect(s*0.5, 0, s*0.5, s);
    // Kırmızı ay
    circle(ctx, s*0.44, s/2, s*0.2, '#D21034');
    circle(ctx, s*0.54, s/2, s*0.145, '#FFFFFF');
    // Kırmızı yıldız
    ctx.save(); ctx.translate(s*0.58, s/2 - s*0.05);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i*4*Math.PI/5) - Math.PI/2;
      const b = ((i*4+2)*Math.PI/5) - Math.PI/2;
      ctx.lineTo(Math.cos(a)*s*0.1, Math.sin(a)*s*0.1);
      ctx.lineTo(Math.cos(b)*s*0.04, Math.sin(b)*s*0.04);
    }
    ctx.closePath(); ctx.fillStyle='#D21034'; ctx.fill();
    ctx.restore();
  },

  arg(ctx, s) { // Arjantin — açık mavi-beyaz-açık mavi, Güneş May
    hStripes(ctx, s, ['#74ACDF', '#FFFFFF', '#74ACDF']);
    // Güneş May — altın daire + 32 ışın
    const cx = s/2, cy = s/2;
    ctx.save(); ctx.translate(cx, cy);
    for (let i = 0; i < 16; i++) {
      ctx.save(); ctx.rotate(i * Math.PI/8);
      ctx.fillStyle = '#F6B40E';
      // Düz ışın
      ctx.fillRect(-s*0.015, -s*0.26, s*0.03, s*0.1);
      // Dalgalı ışın
      ctx.save(); ctx.rotate(Math.PI/16);
      ctx.beginPath();
      ctx.moveTo(0, -s*0.26);
      ctx.lineTo(s*0.02, -s*0.2); ctx.lineTo(-s*0.02, -s*0.17); ctx.lineTo(0, -s*0.16);
      ctx.fillStyle = '#F6B40E'; ctx.fill();
      ctx.restore();
      ctx.restore();
    }
    ctx.restore();
    circle(ctx, cx, cy, s*0.13, '#F6B40E');
    circle(ctx, cx, cy, s*0.1, '#F6B40E');
    // Yüz
    ctx.fillStyle = '#8B6914';
    circle(ctx, cx - s*0.04, cy - s*0.02, s*0.02, '#8B6914');
    circle(ctx, cx + s*0.04, cy - s*0.02, s*0.02, '#8B6914');
    ctx.beginPath(); ctx.arc(cx, cy + s*0.01, s*0.04, 0, Math.PI); ctx.strokeStyle='#8B6914'; ctx.lineWidth=s*0.015; ctx.stroke();
  },

  aut(ctx, s) { // Avusturya — kırmızı-beyaz-kırmızı yatay
    hStripes(ctx, s, ['#ED2939', '#FFFFFF', '#ED2939']);
  },

  jor(ctx, s) { // Ürdün — siyah üst, beyaz orta, yeşil alt, sol kırmızı üçgen
    ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, s, s*0.33);
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, s*0.33, s, s*0.34);
    ctx.fillStyle = '#007A3D'; ctx.fillRect(0, s*0.67, s, s*0.33);
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(s*0.5,s/2); ctx.lineTo(0,s);
    ctx.fillStyle = '#CE1126'; ctx.fill();
    // Beyaz 7 köşeli yıldız
    ctx.save(); ctx.translate(s*0.2, s/2);
    ctx.beginPath();
    for (let i = 0; i < 7; i++) {
      const a = (i*2*Math.PI/7)-Math.PI/2;
      const b = ((i+0.5)*2*Math.PI/7)-Math.PI/2;
      ctx.lineTo(Math.cos(a)*s*0.1, Math.sin(a)*s*0.1);
      ctx.lineTo(Math.cos(b)*s*0.045, Math.sin(b)*s*0.045);
    }
    ctx.closePath(); ctx.fillStyle='#FFFFFF'; ctx.fill();
    ctx.restore();
  },

  // ── GRUP K ───────────────────────────────────────────────────────────────

  col(ctx, s) { // Kolombiya — sarı-mavi-kırmızı yatay
    ctx.fillStyle = '#FCD116'; ctx.fillRect(0, 0, s, s*0.5);
    ctx.fillStyle = '#003087'; ctx.fillRect(0, s*0.5, s, s*0.25);
    ctx.fillStyle = '#CE1126'; ctx.fillRect(0, s*0.75, s, s*0.25);
  },

  jam(ctx, s) { // Jamaika — siyah, sarı X, yeşil üçgen
    ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = '#FED100'; ctx.lineWidth = s*0.22;
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(s,s); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(s,0); ctx.lineTo(0,s); ctx.stroke();
    ctx.fillStyle = '#009B3A';
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(s*0.42,s/2); ctx.lineTo(0,s); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(s,0); ctx.lineTo(s*0.58,s/2); ctx.lineTo(s,s); ctx.closePath(); ctx.fill();
  },

  por(ctx, s) { // Portekiz — sol yeşil (%38), sağ kırmızı, ortada arma
    ctx.fillStyle = '#006600'; ctx.fillRect(0, 0, s*0.38, s);
    ctx.fillStyle = '#FF0000'; ctx.fillRect(s*0.38, 0, s*0.62, s);
    // Arma: altın daire
    ctx.beginPath(); ctx.arc(s*0.38, s/2, s*0.2, 0, Math.PI*2);
    ctx.strokeStyle = '#FFD700'; ctx.lineWidth = s*0.04; ctx.stroke();
    // İç beyaz kalkan
    ctx.fillStyle = '#FFFFFF';
    const kx = s*0.38, ky = s/2;
    ctx.fillRect(kx - s*0.1, ky - s*0.1, s*0.2, s*0.2);
    // Mavi kalkan kenarları
    ctx.strokeStyle = '#003399'; ctx.lineWidth = s*0.025;
    ctx.strokeRect(kx - s*0.1, ky - s*0.1, s*0.2, s*0.2);
    // 5 mavi nokta (quinas)
    [[0,0],[s*0.07,0],[-s*0.07,0],[0,s*0.07],[0,-s*0.07]].forEach(([dx,dy]) =>
      circle(ctx, kx+dx, ky+dy, s*0.025, '#003399'));
  },

  cod(ctx, s) { // Kongo DR — mavi zemin, sarı çapraz, kırmızı üçgen sol üst
    ctx.fillStyle = '#007FFF'; ctx.fillRect(0, 0, s, s);
    ctx.strokeStyle = '#F7D618'; ctx.lineWidth = s * 0.16;
    ctx.beginPath(); ctx.moveTo(0, s); ctx.lineTo(s, 0); ctx.stroke();
    ctx.fillStyle = '#CE1020';
    ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(s*0.38,0); ctx.lineTo(0,s*0.38); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#F7D618';
    ctx.beginPath(); ctx.moveTo(s*0.62,s); ctx.lineTo(s,s); ctx.lineTo(s,s*0.62); ctx.closePath(); ctx.fill();
    circle(ctx, s*0.06, s*0.06, s*0.06, '#F7D618');
  },

  uzb(ctx, s) { // Özbekistan — açık mavi üst, beyaz ince bant, yeşil alt
    ctx.fillStyle = '#0099B5'; ctx.fillRect(0, 0, s, s*0.32);
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, s*0.32, s, s*0.06);
    ctx.fillStyle = '#1EB53A'; ctx.fillRect(0, s*0.38, s, s*0.24);
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, s*0.62, s, s*0.06);
    ctx.fillStyle = '#0099B5'; ctx.fillRect(0, s*0.68, s, s*0.32);
    // Sol üstte ay ve yıldızlar
    circle(ctx, s*0.12, s*0.16, s*0.1, '#FFFFFF');
    circle(ctx, s*0.16, s*0.16, s*0.07, '#0099B5');
    [0,1,2].forEach(i => circle(ctx, s*(0.26+i*0.08), s*0.1, s*0.025, '#FFFFFF'));
    [0,1,2].forEach(i => circle(ctx, s*(0.22+i*0.08), s*0.22, s*0.025, '#FFFFFF'));
  },

  // ── GRUP L ───────────────────────────────────────────────────────────────

  cro(ctx, s) { // Hırvatistan — kırmızı-beyaz-mavi yatay, ortada dama kalkanı
    hStripes(ctx, s, ['#FF0000', '#FFFFFF', '#0038A8']);
    // Merkez dama kalkanı
    const kw = s*0.44, kh = s*0.5, kx = (s-kw)/2, ky = (s-kh)/2;
    const sq = kw/5;
    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        ctx.fillStyle = (row+col) % 2 === 0 ? '#FF0000' : '#FFFFFF';
        ctx.fillRect(kx + col*sq, ky + row*(kh/5), sq, kh/5);
      }
    }
    ctx.strokeStyle='#000000'; ctx.lineWidth=s*0.012;
    ctx.strokeRect(kx, ky, kw, kh);
  },

  eng(ctx, s) { // İngiltere — beyaz, kırmızı St. George haçı
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#CF111A';
    ctx.fillRect(0, s*0.38, s, s*0.24);
    ctx.fillRect(s*0.38, 0, s*0.24, s);
  },

  gha(ctx, s) { // Gana — kırmızı-sarı-yeşil yatay, ortada siyah 5 köşeli yıldız
    hStripes(ctx, s, ['#CE1126', '#FCD116', '#006B3F']);
    ctx.save(); ctx.translate(s/2, s/2);
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      const a = (i*4*Math.PI/5) - Math.PI/2;
      const b = ((i*4+2)*Math.PI/5) - Math.PI/2;
      ctx.lineTo(Math.cos(a)*s*0.18, Math.sin(a)*s*0.18);
      ctx.lineTo(Math.cos(b)*s*0.07, Math.sin(b)*s*0.07);
    }
    ctx.closePath(); ctx.fillStyle='#000000'; ctx.fill();
    ctx.restore();
  },

  pan(ctx, s) { // Panama — beyaz zemin, sol üst kırmızı, sağ alt mavi, yıldızlar
    ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, s, s);
    ctx.fillStyle = '#DA121A'; ctx.fillRect(0, 0, s/2, s/2);
    ctx.fillStyle = '#1C3F94'; ctx.fillRect(s/2, s/2, s/2, s/2);
    // Mavi yıldız sol alt (beyaz karede)
    ctx.save(); ctx.translate(s*0.25, s*0.75);
    ctx.beginPath();
    for (let i=0;i<5;i++){
      const a=(i*4*Math.PI/5)-Math.PI/2, b=((i*4+2)*Math.PI/5)-Math.PI/2;
      ctx.lineTo(Math.cos(a)*s*0.12,Math.sin(a)*s*0.12);
      ctx.lineTo(Math.cos(b)*s*0.05,Math.sin(b)*s*0.05);
    }
    ctx.closePath(); ctx.fillStyle='#1C3F94'; ctx.fill(); ctx.restore();
    // Kırmızı yıldız sağ üst (beyaz karede)
    ctx.save(); ctx.translate(s*0.75, s*0.25);
    ctx.beginPath();
    for (let i=0;i<5;i++){
      const a=(i*4*Math.PI/5)-Math.PI/2, b=((i*4+2)*Math.PI/5)-Math.PI/2;
      ctx.lineTo(Math.cos(a)*s*0.12,Math.sin(a)*s*0.12);
      ctx.lineTo(Math.cos(b)*s*0.05,Math.sin(b)*s*0.05);
    }
    ctx.closePath(); ctx.fillStyle='#DA121A'; ctx.fill(); ctx.restore();
  },
};
