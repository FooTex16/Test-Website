# ========================================================
# EduVerse Auto-Push ke GitHub & Vercel
# Script ini otomatis mem-push setiap ada perubahan file.
# ========================================================

$ErrorActionPreference = "Continue"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "   🚀 EDUVERSE AUTO-SYNC GIT & VERCEL AKTIF" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Setiap kali ada file yang diedit/ditambah/dihapus," -ForegroundColor White
Write-Host "script ini akan otomatis commit dan push ke GitHub!`n" -ForegroundColor White
Write-Host "Tekan Ctrl + C untuk menghentikan auto-push kapan saja.`n" -ForegroundColor DarkGray

# Pindah ke direktori script
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -LiteralPath $scriptDir

function Sync-GitChanges {
    try {
        $changes = git status --porcelain
        if ($changes) {
            $time = Get-Date -Format "HH:mm:ss"
            Write-Host "[$time] 📝 Perubahan terdeteksi pada file:" -ForegroundColor Yellow
            $changes | ForEach-Object { Write-Host "   $_" -ForegroundColor DarkYellow }

            Write-Host "[$time] 📦 Menambahkan ke Git (git add .)..." -ForegroundColor Cyan
            git add .

            $commitMsg = "auto: update website code ($(Get-Date -Format 'dd MMM yyyy HH:mm:ss'))"
            Write-Host "[$time] 💾 Membuat commit: '$commitMsg'..." -ForegroundColor Cyan
            git commit -m "$commitMsg"

            Write-Host "[$time] 🚀 Mem-push ke GitHub (origin main)..." -ForegroundColor Green
            git push origin main

            if ($LASTEXITCODE -eq 0) {
                Write-Host "[$time] ✅ Berhasil ter-update di GitHub! Vercel otomatis redeploy!`n" -ForegroundColor Green
            } else {
                Write-Host "[$time] ⚠️ Push membutuhkan autorisasi atau terdapat kendala jaringan.`n" -ForegroundColor Red
            }
        }
    } catch {
        Write-Host "Terjadi kendala: $_" -ForegroundColor Red
    }
}

# 1. Jalankan langsung sinkronisasi pertama untuk file yang ada sekarang
Write-Host "[Mulai] Memeriksa dan mem-push file yang ada saat ini..." -ForegroundColor Cyan
Sync-GitChanges

# 2. Loop pemantauan perubahan file setiap 4 detik
Write-Host "👀 Memantau perubahan file secara realtime..." -ForegroundColor Magenta

while ($true) {
    Start-Sleep -Seconds 4
    Sync-GitChanges
}
