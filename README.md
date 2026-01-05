# 🍌 Ripeness Detector 3000

A modern web application that uses Roboflow's object detection API to analyze banana ripeness from uploaded images.

## Features

- **Image Upload**: Drag & drop or click to upload banana images
- **Object Detection**: Uses Roboflow's serverless inference API
- **Visual Results**: Bounding boxes overlaid on the image with class labels
- **Confidence Filtering**: Adjustable threshold slider to filter predictions
- **Results Table**: Sorted list of detections with confidence scores
- **Raw JSON**: Expandable panel showing the complete API response

## Setup

### 1. Configure the Roboflow API Key

The app requires a Roboflow API key to function. The key is stored securely as a backend secret.

**In Lovable:**
1. Open your project settings
2. Navigate to **Cloud** → **Secrets**
3. Add a secret named `ROBOFLOW_API_KEY`
4. Enter your Roboflow API key as the value

You can get your API key from [Roboflow Settings](https://app.roboflow.com/settings/api).

### 2. Model Configuration

The default model is `ripeness-detection_1/1`. You can change this in the UI's "Model ID" field to use any Roboflow model you have access to.

Model ID format: `project-name/version-number`

## Architecture

### Frontend (React + Vite)
- Modern React with TypeScript
- Tailwind CSS for styling
- shadcn/ui components
- Canvas API for drawing bounding boxes

### Backend (Edge Function)
- Serverless edge function at `/functions/v1/infer`
- Securely stores and uses the Roboflow API key
- Proxies requests to Roboflow's serverless API
- Returns JSON responses to the frontend

## API Reference

### POST /functions/v1/infer

Request body:
```json
{
  "image": "<base64-encoded-image>",
  "model_id": "ripeness-detection_1/1",
  "confidence": 0.25,
  "overlap": 0.5
}
```

Response:
```json
{
  "predictions": [
    {
      "x": 150,
      "y": 200,
      "width": 100,
      "height": 80,
      "class": "ripe",
      "confidence": 0.95
    }
  ],
  "image": { "width": 640, "height": 480 }
}
```

## Deployment

The app is automatically deployed when you click **Publish** in Lovable. Both the frontend and the edge function are deployed together.

## Troubleshooting

### 403 Error from Roboflow
- Verify your API key is correct
- Check that you have access to the specified model
- Ensure the model ID format is correct (project/version)

### No Predictions Returned
- Try lowering the confidence threshold
- Ensure the image contains bananas
- Check that the model is trained for banana detection

### Connection Errors
- Verify your internet connection
- Check that the Lovable Cloud backend is running
- Look at the browser console for detailed errors

## Technologies Used

- React 18 + Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lovable Cloud
- Roboflow Serverless Inference API
