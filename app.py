from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from keras.models import load_model
from PIL import Image
import io
import traceback  # For error logging

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)

# Load your Keras model (ensure the path is correct)
try:
    model = load_model('generator_final.keras')
    print("Model loaded successfully.")
except Exception as e:
    print("Error loading the model:", e)
    traceback.print_exc()
    model = None

@app.route('/process-image', methods=['POST'])
def process_image():
    try:
        # Check if the file is part of the request
        if 'imageInput' not in request.files:
            return jsonify({'error': 'No image uploaded'}), 400
        image_file = request.files['imageInput']
        print(f"Image uploaded: {image_file.filename}")

        # Read the image file
        image = Image.open(io.BytesIO(image_file.read()))
        print("Original image size:", image.size)

        # Convert to RGB and resize to 256x256 (as expected by the model)
        image = image.convert('RGB')
        image = image.resize((256, 256))  # Resize to 256x256
        print(f"Resized image to: {image.size}")

        # Normalize the image for the model
        image_array = np.array(image) / 255.0
        print(f"Image array shape after normalization: {image_array.shape}")

        # Ensure correct shape for the model (4D array)
        image_array = np.expand_dims(image_array, axis=0)
        print(f"Image array shape after expand_dims: {image_array.shape}")

        if model is None:
            raise Exception("Model not loaded properly")

        # Get the model's prediction (image generation)
        print("Generating image using the model.")
        generated_image = model.predict(image_array)
        print("Image generation completed.")

        # Convert the generated image back to uint8 and save as PNG
        generated_image = (generated_image[0] * 255).astype(np.uint8)

        if generated_image.shape[-1] == 1:  # Grayscale image
            generated_image = generated_image.squeeze(axis=-1)

        generated_image = Image.fromarray(generated_image)

        # Convert to byte array to send back in the response
        img_byte_arr = io.BytesIO()
        generated_image.save(img_byte_arr, format='PNG')
        img_byte_arr.seek(0)

        return img_byte_arr.getvalue(), 200, {'Content-Type': 'image/png'}

    except Exception as e:
        # Catch and log detailed error
        print("Error occurred while processing image:", e)
        print(traceback.format_exc())  # Detailed traceback
        return jsonify({'error': 'An internal error occurred while processing the image. Please try again later.'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
