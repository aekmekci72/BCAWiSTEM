from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore, storage
import tempfile
import os
from dotenv import load_dotenv
load_dotenv() 


# Initialize Flask app
app = Flask(__name__)
CORS(app)  

# Initialize Firebase
cred = credentials.Certificate({
    "type": "service_account",
    "project_id": os.environ.get("FIREBASE_PROJECT_ID"),
    "private_key_id": os.environ.get("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.environ.get("FIREBASE_PRIVATE_KEY").replace('\\n', '\n'),
    "client_email": os.environ.get("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.environ.get("FIREBASE_CLIENT_ID"),
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": os.environ.get("FIREBASE_CLIENT_X509_CERT_URL")
})
firebase_admin.initialize_app(cred, {
    'storageBucket': os.environ.get("FIREBASE_STORAGE_BUCKET")
})
# Get Firestore client
db = firestore.client()

bucket = storage.bucket()


@app.route('/data')
def get_data():
    try:
        # Fetch data from Firestore
        collection_ref = db.collection('data')  # Replace 'data' with your collection name
        docs = collection_ref.stream()

        # Prepare the response
        data = {}
        for doc in docs:
            data[doc.id] = doc.to_dict()

        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/updates')
def get_updates():
    try:
        # Fetch updates from Firestore
        updates_ref = db.collection('updates')
        docs = updates_ref.order_by('timestamp', direction=firestore.Query.DESCENDING).stream()

        # Prepare the response
        updates = []
        for doc in docs:
            update = doc.to_dict()
            update['id'] = doc.id
            # Convert Firestore Timestamp to ISO format string
            update['timestamp'] = update['timestamp'].isoformat() if update.get('timestamp') else None
            updates.append(update)

        return jsonify(updates)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/resources')
def get_events():
    try:
        resources_ref = db.collection('resources')
        resources_ref = resources_ref.stream()

        # Prepare the response
        resources = []
        for doc in resources_ref:
            resource = doc.to_dict()
            resource['id'] = doc.id
            resources.append(resource)

        return jsonify(resources)
    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)