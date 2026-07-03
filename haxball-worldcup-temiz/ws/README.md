# Haxball World Cup 2026

Phaser 3 + Next.js ile yazilmis, ustten gorunumlu Haxball tarzi futbol oyunu.
Takimini sec, grup asamasini gec, Dunya Kupasi 2026'yi kazan.

## Calistirma

```bash
pnpm install
pnpm dev        # http://localhost:13000
```

## Yapi

- `src/game/` — Phaser oyun kodu (sahneler, fizik, AI, takimlar, bayrak cizimleri)
- `src/ui/` — React arayuzu (HUD, takim secimi, grup/eleme ekranlari)
- `src/store/` — Zustand state (mac + turnuva durumu)
- `src/kit/` — yardimci siniflar (BaseScene, input, doku uretimi, ses)

## Derleme

```bash
pnpm build && pnpm start
```
