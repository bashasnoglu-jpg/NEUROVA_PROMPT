# Assets & Media

This document tracks media assets used in the project.

- `tr/hero.mp4`: The background video for the homepage hero section. Please replace the placeholder file with a real video (1920x1080, mp4 format, optimized).
- `assets/img/hero-poster.jpg`: Fallback image for the hero video (mobile/low-power mode). Generated via Midjourney v6.

## Troubleshooting: Port 5500 is busy (Windows)

If Live Server fails to start or you suspect something else is using port 5500:

> Note: If PowerShell profile restrictions cause errors (e.g., dot-sourcing blocked), run PowerShell with `-NoProfile`:
> `powershell -NoProfile`

- `tasklist` filters do **not** accept `<` / `>` placeholders. Use the numeric PID only:
  - **OK:** `tasklist /FI "PID eq 1234"`
  - **NO:** `tasklist /FI "PID eq <1234>"` → “Arama filtresi tanınmıyor.”

### CMD (step-by-step)

```bat
netstat -ano | findstr :5500
```

Then use the PID from the output:

```bat
tasklist /FI "PID eq 1234"
```

### CMD (one-liner)

```bat
for /f "tokens=5" %a in ('netstat -ano ^| findstr :5500') do tasklist /FI "PID eq %a"
```

> If you put the one-liner into a `.bat` file, use `%%a` instead of `%a`:
>
> ```bat
> for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5500') do tasklist /FI "PID eq %%a"
> ```

### PowerShell (one-liner)

```powershell
$pid = (netstat -ano | Select-String ":5500").ToString().Split()[-1]
tasklist /FI "PID eq $pid"
```
