import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

// Resolve __dirname since we are in ES module mode
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to get local network IP address
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  let bestIP = 'localhost';
  
  for (const name of Object.keys(interfaces)) {
    // Skip virtual adapters (WSL, Hyper-V, VirtualBox, VMware)
    if (name.toLowerCase().includes('vethernet') || 
        name.toLowerCase().includes('vbox') || 
        name.toLowerCase().includes('vmware') || 
        name.toLowerCase().includes('wsl')) {
      continue;
    }
    
    for (const iface of interfaces[name]) {
      // Look for non-internal IPv4 address (like 192.168.x.x)
      if (iface.family === 'IPv4' && !iface.internal) {
        bestIP = iface.address;
      }
    }
  }
  
  // Fallback to any non-internal IPv4 if physical ones weren't found
  if (bestIP === 'localhost') {
    for (const name of Object.keys(interfaces)) {
      for (const iface of interfaces[name]) {
        if (iface.family === 'IPv4' && !iface.internal) {
          return iface.address;
        }
      }
    }
  }
  
  return bestIP;
}

const localIP = getLocalIP();
console.log(`\n========================================`);
console.log(`📡 Detected Local LAN IP: ${localIP}`);
console.log(`========================================`);

// Sync mobile .env
const mobileEnvPath = path.resolve(__dirname, '../mobile/.env');
const port = 5300;
const targetApiUrl = `http://${localIP}:${port}/api`;

let mobileEnvContent = '';
if (fs.existsSync(mobileEnvPath)) {
  mobileEnvContent = fs.readFileSync(mobileEnvPath, 'utf8');
}

// Check if EXPO_PUBLIC_API_URL already exists in mobile/.env
const lines = mobileEnvContent.split('\n');
let keyFound = false;
const newLines = lines.map(line => {
  if (line.trim().startsWith('EXPO_PUBLIC_API_URL=')) {
    keyFound = true;
    return `EXPO_PUBLIC_API_URL=${targetApiUrl}`;
  }
  return line;
});

if (!keyFound) {
  newLines.push(`EXPO_PUBLIC_API_URL=${targetApiUrl}`);
}

fs.writeFileSync(mobileEnvPath, newLines.join('\n').trim() + '\n', 'utf8');
console.log(`✅ Synced mobile/.env: EXPO_PUBLIC_API_URL set to ${targetApiUrl}`);

// Also update/sync backend configuration in root .env if CORS needs updating
const rootEnvPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(rootEnvPath)) {
  let rootEnvContent = fs.readFileSync(rootEnvPath, 'utf8');
  const rootLines = rootEnvContent.split('\n');
  let corsFound = false;
  
  const updatedRootLines = rootLines.map(line => {
    if (line.trim().startsWith('CORS_ORIGIN=')) {
      corsFound = true;
      // Ensure the mobile dev IP with standard Expo ports is allowed in CORS
      const currentValue = line.split('=')[1] || '';
      const mobileDevOrigin = `http://${localIP}:8081`;
      const mobileDevOriginLan = `http://${localIP}:8080`;
      
      let origins = currentValue.split(',').map(o => o.trim());
      if (!origins.includes(mobileDevOrigin)) {
        origins.push(mobileDevOrigin);
      }
      if (!origins.includes(mobileDevOriginLan)) {
        origins.push(mobileDevOriginLan);
      }
      
      return `CORS_ORIGIN=${origins.join(',')}`;
    }
    return line;
  });
  
  fs.writeFileSync(rootEnvPath, updatedRootLines.join('\n').trim() + '\n', 'utf8');
  console.log(`✅ Synced root .env CORS_ORIGIN to allow local LAN IP access.`);
}

console.log(`========================================\n`);
