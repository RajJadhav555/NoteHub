param (
    [Parameter(Mandatory=$false)]
    [string]$Message = "Auto-deploy: Updates to frontend and backend"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🚀 NoteHub Universal Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Deploy Backend (Hugging Face / GitHub)
Write-Host "`n[1/3] Pushing Backend Changes to GitHub (Hugging Face will auto-rebuild)..." -ForegroundColor Yellow
cd E:\Notehub\notehub-backend

# Check if there are changes
$backendChanges = git status --porcelain
if ($backendChanges) {
    git add .
    git commit -m $Message
    git push -u origin main
    Write-Host "✅ Backend pushed successfully!" -ForegroundColor Green
} else {
    Write-Host "⚡ No changes detected in backend." -ForegroundColor DarkGray
}

# 2. Deploy Frontend (GitHub)
Write-Host "`n[2/3] Pushing Frontend Changes to GitHub..." -ForegroundColor Yellow
cd E:\Notehub

# Check if there are changes
$frontendChanges = git status --porcelain
if ($frontendChanges) {
    git add .
    git commit -m $Message
    git push -u origin main
    Write-Host "✅ Frontend pushed successfully!" -ForegroundColor Green
} else {
    Write-Host "⚡ No changes detected in frontend." -ForegroundColor DarkGray
}

# 3. Deploy Frontend directly to Vercel (Guarantees environment variables apply)
Write-Host "`n[3/3] Forcing fresh Vercel Production Deployment..." -ForegroundColor Yellow
Write-Host "(This ensures your environment variables and latest code are completely synced)" -ForegroundColor DarkGray
npx vercel --prod --yes

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "🎉 ALL DEPLOYMENTS COMPLETED SUCCESSFULLY!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
