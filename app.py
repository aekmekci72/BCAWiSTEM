from flask import Flask, jsonify, request, send_file, send_from_directory
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, firestore, storage
import tempfile
import os
from dotenv import load_dotenv
load_dotenv() 


# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}) 

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

UPLOAD_FOLDER = './public'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


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
        resources_ref = db.collection('resources').order_by('timestamp', direction=firestore.Query.DESCENDING).stream()
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

@app.route('/upload', methods=['POST'])
def upload_images():
    try:
        if 'images' not in request.files:
            return jsonify({"error": "No images part in the request"}), 400

        files = request.files.getlist('images')
        image_paths = []

        for file in files:
            file_path = os.path.join(UPLOAD_FOLDER, file.filename)
            file.save(file_path)
            image_paths.append(f'/{file.filename}')

        return jsonify({"imagePaths": image_paths}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/addupdate', methods=['POST'])
def add_update():
    try:
        # Get the JSON data from the request
        data = request.get_json()

        # Validate the incoming data
        if not data or 'author' not in data or 'content' not in data:
            return jsonify({"error": "Invalid data"}), 400

        # Create a new document in the 'updates' collection
        update_ref = db.collection('updates').add({
            'author': data['author'],
            'content': data['content'],
            'timestamp': firestore.SERVER_TIMESTAMP,
            'images': data.get('images', [])
        })

        # Retrieve the newly created document
        new_update = update_ref[1].get().to_dict()
        new_update['id'] = update_ref[1].id

        # Convert Firestore Timestamp to ISO format string
        new_update['timestamp'] = new_update['timestamp'].isoformat() if new_update.get('timestamp') else None

        return jsonify(new_update), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/delete_update', methods=['DELETE'])
def delete_update():
    try:
        # Get the update_id from the request body
        data = request.get_json()
        update_id = data.get('update_id')
        
        if not update_id:
            return jsonify({"error": "Update ID is required"}), 400
        
        # Reference the document in the 'updates' collection
        update_ref = db.collection('updates').document(update_id)
        
        # Check if the document exists
        if not update_ref.get().exists:
            return jsonify({"error": "Update not found"}), 404
        
        # Delete the document
        update_ref.delete()
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
@app.route('/delete_resource', methods=['DELETE'])
def delete_resource():
    try:
        # Get the resource_id from the request body
        data = request.get_json()
        resource_id = data.get('resource_id')
        
        if not resource_id:
            return jsonify({"error": "Resource ID is required"}), 400
        
        # Reference the document in the 'resources' collection
        resource_ref = db.collection('resources').document(resource_id)
        
        # Check if the document exists
        if not resource_ref.get().exists:
            return jsonify({"error": "Resource not found"}), 404
        
        # Delete the document
        resource_ref.delete()
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/get_role', methods=['POST'])
def get_role():
    try:
        # Get the email from the request body
        data = request.get_json()
        email = data.get('email')

        if not email:
            return jsonify({"error": "Email is required"}), 400

        # Reference the document in the 'users' collection using the email as the document ID
        user_ref = db.collection('users').document(email)
        user_doc = user_ref.get()

        # Check if the document exists
        if not user_doc.exists:
            return jsonify({"error": "User not found"}), 404

        # Get the role from the document
        user_data = user_doc.to_dict()
        role = user_data.get('role')

        if not role:
            return jsonify({"error": "Role not found"}), 404

        return jsonify({"role": role}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/addresource', methods=['POST'])
def add_resource():
    try:
        # Get the JSON data from the request
        data = request.get_json()

        # Validate the incoming data
        if not data or 'message' not in data or 'link' not in data:
            return jsonify({"error": "Invalid data"}), 400

        # Create a new document in the 'resources' collection
        resource_ref = db.collection('resources').add({
            'message': data['message'],
            'link': data['link'],
            'timestamp': firestore.SERVER_TIMESTAMP 
        })

        # Retrieve the newly created document
        new_resource = resource_ref[1].get().to_dict()
        new_resource['id'] = resource_ref[1].id

        return jsonify(new_resource), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)