# Ban Sync Bot

Ana sunucu / yan sunucu ban senkronizasyon botu.

## Mantık

| Durum | Sonuç |
|---|---|
| Kullanıcı **yan sunucuya katılır** ama **ana sunucuda yoktur** | Yan sunucudan **ban** |
| Kullanıcı **her iki sunucuda da vardır**, sonradan **ana sunucudan ayrılır** | Yan sunucudan **ban** |

## Kurulum

```bash
npm install
```

## Ayarlar

`config.json` dosyasını oluştur ve doldur:

```json
{
  "token": "BOT_TOKEN_BURAYA",
  "clientId": "BOT_CLIENT_ID_BURAYA",
  "anaid": "ANA_SUNUCU_ID_BURAYA",
  "yanid": "YAN_SUNUCU_ID_BURAYA",
  "botdurum": "Ban Sync 🔨"
}
```

> ⚠️ `config.json` dosyası `.gitignore`'a eklenmiştir, GitHub'a yüklenmez.

## Bot İzinleri

Discord Developer Portal'dan bota şu izinleri ver:

- `Ban Members`
- `Server Members Intent` (Privileged Gateway Intents)

## Başlatma

```bash
node index.js
```

PM2 ile:

```bash
pm2 start index.js --name ban-sync-bot
```
