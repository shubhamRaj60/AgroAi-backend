import sys
import numpy as np
import pickle

# 1. Load the saved model
with open('model/crop_model.pkl', 'rb') as f:
    model = pickle.load(f)

# 2. Get values from command-line arguments
N = float(sys.argv[1])
P = float(sys.argv[2])
K = float(sys.argv[3])
temperature = float(sys.argv[4])
humidity = float(sys.argv[5])
ph = float(sys.argv[6])
rainfall = float(sys.argv[7])

# 3. Prepare input
input_data = np.array([[N, P, K, temperature, humidity, ph, rainfall]])

# 4. Predict crop
prediction = model.predict(input_data)
print(prediction[0])
