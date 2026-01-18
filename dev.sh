#!/usr/bin/env bash

# ============================================================
# Netlify Dev Server with Functions Support
# ============================================================

# Set NODE_ENV to development
export NODE_ENV=development

# Clear the terminal for a clean startup
clear

# Get network information (cross-platform)
get_local_ip() {
  # macOS
  if command -v ipconfig &> /dev/null; then
    ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null
  # Linux
  elif command -v hostname &> /dev/null; then
    hostname -I | awk '{print $1}' 2>/dev/null
  # Fallback using ip command
  elif command -v ip &> /dev/null; then
    ip route get 8.8.8.8 | awk '{print $7}' | head -1 2>/dev/null
  # Final fallback
  else
    echo "192.168.1.100"
  fi
}

LOCAL_IP=$(get_local_ip)
LOCALHOST="localhost"
PORT=9500

# Display header with enhanced styling
echo ""
echo "🍦 IMAGE SCOOP DEV SERVER"
echo "══════════════════════════════════════════════════════"
echo ""

# Function to check if port is available
check_port() {
  local port=$1
  if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
    return 1
  else
    return 0
  fi
}

# Clean up any existing processes on port 8888
echo "🧹 Cleaning up existing processes..."
lsof -ti:$PORT | xargs kill -9 2>/dev/null || true
sleep 1

# Check if port is available after cleanup
if ! check_port $PORT; then
  echo "❌ Port $PORT is still in use after cleanup. Please manually free the port."
  exit 1
fi

# Start Netlify Dev (which starts Parcel and serves functions)
echo "⚡ Starting Netlify Dev server..."
echo "   This will start Parcel and Netlify Functions..."
echo ""

netlify dev &
NETLIFY_PID=$!

# Wait for server to initialize
echo "⏳ Initializing development environment..."

# Check if server is running with timeout
TIMEOUT=30
for i in $(seq 1 $TIMEOUT); do
  if curl -s http://$LOCALHOST:$PORT > /dev/null 2>&1; then
    break
  fi
  
  # Show progress
  printf "."
  sleep 1
done

echo ""

# Check if server started successfully
if ! curl -s http://$LOCALHOST:$PORT > /dev/null 2>&1; then
  echo "❌ Failed to start Netlify Dev server"
  kill $NETLIFY_PID 2>/dev/null
  exit 1
fi

echo ""
echo "✅ DEVELOPMENT SERVER READY"
echo "══════════════════════════════════════════════════════"
echo ""
echo "🖥️  LOCAL ACCESS:"
echo "   → App:           http://$LOCALHOST:$PORT"
echo "   → Functions:     http://$LOCALHOST:$PORT/.netlify/functions/"
echo ""
echo "🌐 NETWORK ACCESS:"
echo "   → App:       http://$LOCAL_IP:$PORT"
echo "   → Share:     http://$LOCAL_IP:$PORT (accessible from other devices)"
echo ""
echo "══════════════════════════════════════════════════════"
echo "📱 MOBILE ACCESS"
echo "   Scan this QR code with your phone to open the app:"
echo ""

# Generate QR code for the network URL with error handling
if command -v node &> /dev/null && node -e "require('qrcode-terminal')" &> /dev/null; then
  node -e "
    try {
      require('qrcode-terminal').generate('http://$LOCAL_IP:$PORT', { small: true });
    } catch (e) {
      console.log('   QR code generation failed. Install qrcode-terminal: npm install qrcode-terminal');
    }
  "
else
  echo "   📱 Manual URL: http://$LOCAL_IP:$PORT"
  echo "   💡 Install qrcode-terminal for QR codes: yarn add -D qrcode-terminal"
fi

echo ""
echo "🔄 Server running... Press Ctrl+C to stop"
echo ""

# Function to cleanup on exit
cleanup() {
  echo ""
  echo "🛑 Shutting down development server..."
  
  # Kill Netlify Dev process
  if [ ! -z "$NETLIFY_PID" ]; then
    kill $NETLIFY_PID 2>/dev/null
    echo "   ✓ Netlify Dev stopped"
  fi
  
  # Clean up any remaining processes on port
  lsof -ti:$PORT | xargs kill -9 2>/dev/null
  
  echo "🏁 Development environment shut down cleanly"
  exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep the script running and monitor process
while true; do
  # Check if process is still running
  if ! kill -0 $NETLIFY_PID 2>/dev/null; then
    echo "❌ Netlify Dev stopped unexpectedly"
    cleanup
  fi
  
  sleep 2
done
