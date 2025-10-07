from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    """
    Webhook endpoint to receive POST requests
    """
    try:
        data = request.get_json()
        print(f"Received webhook data: {data}")
        
        # Process the webhook data here
        response = {
            "status": "success",
            "message": "Webhook received successfully",
            "data": data
        }
        
        return jsonify(response), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 400

@app.route('/health', methods=['GET'])
def health():
    """
    Health check endpoint
    """
    return jsonify({"status": "healthy"}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
