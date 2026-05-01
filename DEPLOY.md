# DEPLOY — VPS Hostinger

Guía completa para levantar Hormonitas desde cero en un VPS.

## Pre-requisitos en el VPS

Conectar por SSH e instalar:

```bash
# Docker + Docker Compose plugin (Ubuntu/Debian)
curl -fsSL https://get.docker.com | sh
sudo apt-get install -y docker-compose-plugin

# Verificar
docker --version           # debe decir 24.x o superior
docker compose version     # debe decir v2.x
```

Agregar tu user al grupo docker (para no usar sudo cada vez):
```bash
sudo usermod -aG docker $USER
exit   # cerrar sesión y re-loggear para aplicar el cambio
```

## Primer deploy

```bash
# 1. Clonar el repo (privado — necesita PAT o SSH key configurada)
git clone https://github.com/TU_USUARIO/hormonitas.git
cd hormonitas

# 2. Crear el directorio de uploads con permisos correctos
#    El user `nextjs` dentro del container es UID 1001.
mkdir -p uploads/galeria
sudo chown -R 1001:1001 uploads/

# 3. Build y arranque
docker compose up -d --build

# 4. Ver logs (opcional, para confirmar que arrancó OK)
docker compose logs -f app
```

La primera vez tarda ~3-5 min porque baja node:20-alpine, postgres:15-alpine, instala deps y hace build.

Cuando ves `Ready in XXXms` en los logs, la app está corriendo en `http://IP_DEL_VPS:3000`.

## Updates posteriores

```bash
cd hormonitas
git pull
docker compose up -d --build
```

Eso es todo. Si solo cambiaste código (no `package.json` ni schema), Docker reusa cache y el rebuild es rápido (~30s).

## HTTPS con Caddy (recomendado)

Sin HTTPS no funciona como PWA en celular. Lo más simple es Caddy.

```bash
# Instalar Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install -y caddy
```

Editar `/etc/caddy/Caddyfile`:

```caddy
hormonitas.tu-dominio.com {
    reverse_proxy localhost:3000
}
```

Reiniciar:
```bash
sudo systemctl reload caddy
```

Caddy obtiene cert TLS de Let's Encrypt automáticamente. La app queda en `https://hormonitas.tu-dominio.com`.

**Importante:** apuntá tu dominio (registro `A`) a la IP del VPS antes de que Caddy intente obtener el certificado.

## Cron de notificaciones diarias

Para que las push del ciclo lleguen cada mañana, agregar al crontab del VPS:

```bash
crontab -e
```

Agregar esta línea (envía a las 9:00 AM hora del VPS):
```cron
0 9 * * * curl -fsS -X POST https://hormonitas.tu-dominio.com/api/push/cron -H "Authorization: Bearer hormonitas-prod-secret-2026-change-me-or-not" >> /var/log/hormonitas-cron.log 2>&1
```

(Reemplazá el bearer token con el valor real de `PUSH_ADMIN_SECRET` en `.env`.)

Verificar manualmente que el endpoint responde:
```bash
curl -X POST https://hormonitas.tu-dominio.com/api/push/cron \
  -H "Authorization: Bearer TU_PUSH_ADMIN_SECRET"
```

Debe devolver JSON con `dispatch: [...]`.

## Backups de la base de datos

Cada tanto (semanal):

```bash
# Backup
docker exec hormonitas-db pg_dump -U hormonitas hormonitas > backup-$(date +%F).sql

# Restore (si algo se rompe)
cat backup-2026-05-01.sql | docker exec -i hormonitas-db psql -U hormonitas -d hormonitas
```

Los uploads (`./uploads/galeria/`) se respaldan con el filesystem normal del VPS.

## Troubleshooting

### Container app no arranca
```bash
docker compose logs app | tail -50
```
Causas comunes:
- DB todavía inicializándose → esperar 30s y reintentar
- Schema mismatch → `docker compose down && docker compose up -d --build`

### "Permission denied" al subir foto
La carpeta `uploads/galeria/` no tiene permisos para el user 1001:
```bash
sudo chown -R 1001:1001 uploads/
```

### Push notifications no llegan
1. Verificar que la PWA está instalada al home screen (Safari iOS) o instalada como app (Chrome Android). Sin instalar, iOS no recibe push (iOS 16.4+).
2. Confirmar `Notification.permission === 'granted'` desde el sidebar.
3. Probar manual: `curl -X POST https://TU_DOMINIO/api/push/test -H "Authorization: Bearer ..." -H "Content-Type: application/json" -d '{"title":"hola","body":"prueba"}'`. Debe devolver `sent: N` con N >= 1.

### Resetear la base de datos
```bash
docker compose down -v   # -v borra el volumen postgres_data
docker compose up -d --build
```
**Cuidado:** esto borra todo (ciclo, antojos, fotos guardadas en BD, subscriptions push). Las fotos físicas en `uploads/galeria/` quedan, pero pierden su entry en la tabla.

## Archivos clave

- `docker-compose.yml` — orquesta postgres + app
- `Dockerfile` — multi-stage build de la app
- `.env` — variables de entorno (commiteado, repo privado)
- `prisma/schema.prisma` — schema de la BD
- `uploads/galeria/` (host) ↔ `/app/public/galeria` (container) — fotos persistidas

## Recursos

- App: `http://IP_DEL_VPS:3000` o `https://tu-dominio.com`
- Postgres: solo accesible desde `127.0.0.1:5433` del propio VPS (no expuesto)
- Logs: `docker compose logs -f app | db`
