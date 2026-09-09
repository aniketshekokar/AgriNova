import json
import random
from http.server import HTTPServer, BaseHTTPRequestHandler

class AIServer(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_GET(self):
        if self.path == '/':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "AI service active", 
                "framework": "Python HTTP Server", 
                "ready_for_ml": True
            }).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path == '/api/ai/predict':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                request_data = json.loads(post_data.decode('utf-8'))
            except Exception:
                request_data = {}
                
            crop_name = request_data.get('crop_name', 'Tomato').capitalize()
            
            # Predictor logic representing Random Forest outputs
            AI_KNOWLEDGE = {
                "Tomato": {
                    "suggestion": "Wait 3-5 days if possible.",
                    "reason": "Monsoon arrivals are delayed in Maharashtra wholesale hubs. Low supply will push prices up by 10-15%.",
                    "base_price": 2800.0,
                    "trend": "up"
                },
                "Onion": {
                    "suggestion": "Sell immediately in local APMC.",
                    "reason": "High storage release and imports from neighboring states are causing severe warehouse saturation.",
                    "base_price": 2400.0,
                    "trend": "down"
                },
                "Wheat": {
                    "suggestion": "Hold stock in dry warehouse.",
                    "reason": "Corporate retail chains are bidding higher as state procurement limits close. Expected gains in 2 weeks.",
                    "base_price": 2250.0,
                    "trend": "up"
                }
            }
            
            info = AI_KNOWLEDGE.get(crop_name, {
                "suggestion": "Sell or hold based on cash flow needs.",
                "reason": "Market volumes are steady. Local demand matches current crop harvesting rates.",
                "base_price": 1500.0,
                "trend": "stable"
            })
            
            if info["trend"] == "up":
                mod = random.uniform(100.0, 300.0)
            elif info["trend"] == "down":
                mod = random.uniform(-250.0, -100.0)
            else:
                mod = random.uniform(-50.0, 100.0)
                
            response_data = {
                "crop_name": crop_name,
                "current_price": info["base_price"],
                "predicted_price": info["base_price"] + mod,
                "trend": info["trend"],
                "suggestion": info["suggestion"],
                "reason": info["reason"],
                "is_mock": True,
                "model_algorithm": "RandomForestRegressor - trained on eNAM price histories (Simulated)"
            }
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(response_data).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

def run(server_class=HTTPServer, handler_class=AIServer, port=8000):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    print(f"==================================================")
    print(f"AGRINOVA AI Python Engine listening on port {port}...")
    print(f"Standard HTTP server active. Zero compilation needed.")
    print(f"==================================================")
    httpd.serve_forever()

if __name__ == '__main__':
    run()
