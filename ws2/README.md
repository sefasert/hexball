# Hexball — World Cup 2026

Phaser 3 + Next.js ile yazilmis, ustten gorunumlu Haxball tarzi futbol oyunu.
Takimini sec, grup asamasini gec, Dunya Kupasi 2026'yi kazan. Coklu dil destekli.

## Calistirma

```bash
pnpm install
pnpm dev        # http://localhost:13000
```

## Yapi

- `game/`  — Phaser oyun kodu (sahneler, fizik, AI, takimlar, bayrak cizimleri, WC2026 verisi)
- `ui/`    — React arayuzu (HUD, takim secimi, grup/eleme ekranlari, canvas)
- `store/` — Zustand state (mac, turnuva, dil)
- `i18n/`  — ceviri metinleri
- `kit/`   — yardimci siniflar (BaseScene, input, doku uretimi, ses)
- `app/`   — Next.js sayfa + layout

## Derleme

```bash
pnpm build && pnpm start
```
