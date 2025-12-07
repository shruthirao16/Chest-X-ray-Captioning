Model Information

This project relies on a trained deep learning model to generate captions for chest X-ray images. 
The backend needs access to this model during runtime, which means the application will not work unless the model file is available locally.

To run the project properly, you must place the trained model file directly inside the server folder. 
Example structure:

project/
   server/
      model.h5
      tokenizer.json
      server.py


When the backend starts, it automatically loads the model from this location. Anyone using or cloning this project will also need to manually place 
the required model files into the server folder before running the application.
