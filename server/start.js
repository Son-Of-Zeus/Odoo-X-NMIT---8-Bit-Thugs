const { exec } = require('child_process');
const { spawn } = require('child_process');

const PORT = process.env.PORT || 5001;

// Function to kill process on port
function killProcessOnPort(port) {
  return new Promise((resolve) => {
    exec(`lsof -ti:${port}`, (error, stdout) => {
      if (stdout) {
        const pids = stdout.trim().split('\n');
        console.log(`Found existing processes on port ${port}:`, pids);
        
        pids.forEach(pid => {
          exec(`kill -9 ${pid}`, (killError) => {
            if (!killError) {
              console.log(`Killed process ${pid}`);
            }
          });
        });
        
        setTimeout(resolve, 1000); // Wait a bit for processes to be killed
      } else {
        console.log(`No existing processes found on port ${port}`);
        resolve();
      }
    });
  });
}

// Start the server
async function startServer() {
  console.log(`Checking for existing processes on port ${PORT}...`);
  await killProcessOnPort(PORT);
  
  console.log('Starting server...');
  const server = spawn('node', ['index.js'], { 
    stdio: 'inherit',
    cwd: process.cwd()
  });

  server.on('error', (error) => {
    console.error('Failed to start server:', error);
  });

  // Handle Ctrl+C
  process.on('SIGINT', () => {
    console.log('\nShutting down...');
    server.kill('SIGINT');
    process.exit(0);
  });
}

startServer().catch(console.error);