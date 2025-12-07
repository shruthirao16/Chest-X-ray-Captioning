from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.preprocessing import image as keras_image
from tensorflow.keras.models import load_model
from keras.models import Model
from keras.preprocessing.sequence import pad_sequences
from keras.applications.inception_v3 import InceptionV3, preprocess_input
from PIL import Image
import numpy as np
import io
import json

app = Flask(__name__)
CORS(app)

# ================================
# LOAD MODEL 1: DISEASE CLASSIFIER
# ================================
try:
    disease_model = tf.keras.models.load_model("dlmodel.h5")
    print("Disease model loaded successfully.")
except Exception as e:
    print("Error loading disease model:", str(e))


# ================================
# LOAD MODEL 2: CAPTIONING MODEL
# ================================
try:
    caption_model = load_model('indianamodel.keras')

    # Load tokenizer mappings
    with open('wordtoidx.json', 'r') as f:
        wordtoix = json.load(f)

    with open('idxtoword.json', 'r') as f:
        ixtoword = json.load(f)

    # Load InceptionV3 encoder
    base_model = InceptionV3(weights='imagenet')
    encoder_model = Model(base_model.input, base_model.layers[-2].output)

    print("Caption model loaded successfully.")
except Exception as e:
    print("Error loading caption model:", str(e))


# ======================================
# IMAGE PREPROCESSING FOR DISEASE MODEL
# ======================================
def preprocess_disease_image(img):
    img_array = keras_image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0
    return img_array


# ======================================
# IMAGE PREPROCESSING FOR INCEPTIONV3
# ======================================
def preprocess_caption_image(image):
    image = image.convert('RGB')
    image = image.resize((299, 299))
    image = np.array(image)
    image = np.expand_dims(image, axis=0)
    image = preprocess_input(image)
    return image


# ======================================
# ENCODE IMAGE FOR CAPTIONING (2048 DIM)
# ======================================
def encode(image):
    img = preprocess_caption_image(image)
    vec = encoder_model.predict(img)
    return vec.reshape(1, 2048)


# ======================================
# CAPTION GENERATION
# ======================================
def generate_caption(image_features):
    caption = "startseq"
    max_length = 40

    for i in range(max_length):
        sequence = [wordtoix[w] for w in caption.split() if w in wordtoix]
        sequence = pad_sequences([sequence], maxlen=max_length)

        yhat = caption_model.predict([image_features, sequence], verbose=0)
        yhat = np.argmax(yhat)

        word = ixtoword[str(yhat)]
        caption += " " + word

        if word == "endseq":
            break

    return " ".join(caption.split()[1:-1])


# ======================================
# HOME ROUTE
# ======================================
@app.route('/')
def home():
    return "Flask Combined Server Running!"


# ======================================
# 1️⃣ DISEASE CLASSIFICATION ENDPOINT
# ======================================
@app.route('/predictdl', methods=['POST'])
def predict():
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image uploaded'}), 400

        file = request.files['image']
        img = keras_image.load_img(io.BytesIO(file.read()), target_size=(224, 224))

        img_array = preprocess_disease_image(img)
        predicted_prob = disease_model.predict(img_array)[0][0]

        predicted_class = "Normal" if predicted_prob > 0.5 else "Effusion"

        return jsonify({'prediction': predicted_class})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ======================================
# 2️⃣ IMAGE CAPTIONING ENDPOINT
# ======================================
@app.route('/predictnlp', methods=['POST'])
def upload_image():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file uploaded'}), 400

        file = request.files['file']
        image = Image.open(io.BytesIO(file.read()))

        image_features = encode(image)
        caption = generate_caption(image_features)

        return jsonify({'caption': caption})
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ======================================
# RUN THE SERVER
# ======================================
if __name__ == '__main__':
    app.run(debug=True)
