const os = require('os');

// Basic system information
console.log(`OS Platform: ${os.platform()}`);
console.log(`OS Type: ${os.type()}`);
console.log(`OS Release: ${os.release()}`);
console.log(`CPU Architecture: ${os.arch()}`);
console.log(`Hostname: ${os.hostname()}`);

// Memory information
const totalMemGB = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
const freeMemGB = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);
console.log(`Memory: ${freeMemGB}GB free of ${totalMemGB}GB`);

// User information
const userInfo = os.userInfo();
console.log(`Current User: ${userInfo.username}`);
console.log(`Home Directory: ${os.homedir()}`);

// Get CPU information
const cpus = os.cpus();
console.log(`Number of CPU Cores: ${cpus.length}`);

// Display information about each CPU core
cpus.forEach((cpu, index) => {
  console.log(`\nCPU Core ${index + 1}:`);
  console.log(`- Model: ${cpu.model}`);
  console.log(`- Speed: ${cpu.speed} MHz`);
  console.log('- Times (ms):', {     user: cpu.times.user,
    nice: cpu.times.nice,
    sys: cpu.times.sys,
    idle: cpu.times.idle,
    irq: cpu.times.irq
  });
});
// Calculate total CPU usage (example, requires two measurements)
function calculateCpuUsage(prevCpus) {
  const currentCpus = os.cpus();
  const usage = [];

  for (let i = 0; i < currentCpus.length; i++) {
    const current = currentCpus[i];
    const prev = prevCpus ? prevCpus[i] : { times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 } };

    const prevIdle = prev.times.idle;
    const idle = current.times.idle - prevIdle;

    let total = 0;
    for (const type in current.times) {
      total += current.times[type] - (prev.times[type] || 0);
    }

    const usagePercent = ((1 - idle / total) * 100).toFixed(1);
    usage.push(parseFloat(usagePercent));
  }

  return {
    perCore: usage,
    average: (usage.reduce((a, b) => a + b, 0) / usage.length).toFixed(1),
    cpus: currentCpus
  };
}

// Example usage of CPU usage calculation
console.log('\nCPU Usage (requires two measurements):');
const firstMeasure = os.cpus();

// Simulate some CPU work
for (let i = 0; i < 1000000000; i++) {}
const usage = calculateCpuUsage(firstMeasure);
console.log(`Average CPU Usage: ${usage.average}%`);

// Format bytes to human-readable format
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Get memory information
const totalMem = os.totalmem();
const freeMem = os.freemem();
const usedMem = totalMem - freeMem;
const usagePercent = ((usedMem / totalMem) * 100).toFixed(2);

console.log('Memory Information:');
console.log(`- Total Memory: ${formatBytes(totalMem)}`);
console.log(`- Free Memory: ${formatBytes(freeMem)} (${((freeMem / totalMem) * 100).toFixed(2)}%)`);
console.log(`- Used Memory: ${formatBytes(usedMem)} (${usagePercent}%)`);

// Example: Check if there's enough free memory
const MIN_FREE_MEMORY = 200 * 1024 * 1024; // 200MB
if (freeMem < MIN_FREE_MEMORY) {
  console.warn('Warning: Low on memory!');
} else {
  console.log('System has sufficient memory available');
}

const networkInterfaces = os.networkInterfaces();

console.log('Network Interfaces:');

// Iterate over each network interface
Object.entries(networkInterfaces).forEach(([name, addresses]) => {
  console.log(`\nInterface: ${name}`);
  addresses.forEach((address) => {
    console.log(`- Family: ${address.family}`);
    console.log(` Address: ${address.address}`);
    console.log(` Netmask: ${address.netmask}`);
    console.log(` MAC: ${address.mac || 'N/A'}`);
    console.log(` Internal: ${address.internal}`);
  });
});

// Example: Find the first non-internal IPv4 address
function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1'; // Fallback to localhost
}

const localIp = getLocalIpAddress();
console.log(`\nLocal IP Address: ${localIp}`);


const uptime = os.uptime();
console.log(`System Uptime: ${uptime} seconds`);

// Format uptime in a more readable way
const uptimeDays = Math.floor(uptime / (60 * 60 * 24));
const uptimeHours = Math.floor((uptime % (60 * 60 * 24)) / (60 * 60));
const uptimeMinutes = Math.floor((uptime % (60 * 60)) / 60);
const uptimeSeconds = Math.floor(uptime % 60);

console.log(`System has been running for: ${uptimeDays} days, ${uptimeHours} hours, ${uptimeMinutes} minutes, ${uptimeSeconds} seconds`);

