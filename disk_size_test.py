import psutil
import os
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
@app.route('/get_usage', methods=['GET'])

def get_usage():
    path="C:\\"
    path2 = "C:\\trash_files"
    threshold_percentage=95

    """Returns free storage space of local disk in bytes."""
    usage = psutil.disk_usage(path)
    percentage_used= usage.percent
    response = {
        'percentage_used': f"{percentage_used:.2f}%",
        'deleted_files':[]
    }

    if percentage_used > threshold_percentage:
        log_files = [f for f in os.listdir(path2) if f.endswith('.txt')]

        # Get the 3 largest files

        largest_log_files =sorted(log_files, key=lambda x: os.path.getsize(os.path.join(path2,x)),reverse=True)[:3]

        # Delete files

        for log_file in largest_log_files:
            full_path = os.path.join(path2,log_file)
            os.remove(full_path)
            response['deleted_files'].append(f"Deleted log file: {log_file}")

    return jsonify(response)


if __name__ == "__main__":
    app.run(debug=True)


