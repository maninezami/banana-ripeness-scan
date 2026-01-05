import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ROBOFLOW_API_KEY = Deno.env.get('ROBOFLOW_API_KEY');
    
    if (!ROBOFLOW_API_KEY) {
      console.error('ROBOFLOW_API_KEY is not configured');
      return new Response(
        JSON.stringify({ error: 'ROBOFLOW_API_KEY is not configured on the server' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse the request body
    const { image, model_id, confidence, overlap } = await req.json();

    if (!image) {
      return new Response(
        JSON.stringify({ error: 'No image provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!model_id) {
      return new Response(
        JSON.stringify({ error: 'No model_id provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Calling Roboflow API for model: ${model_id}`);

    // Build the Roboflow URL with query parameters
    let roboflowUrl = `https://serverless.roboflow.com/${model_id}?api_key=${ROBOFLOW_API_KEY}`;
    
    if (confidence !== undefined) {
      roboflowUrl += `&confidence=${confidence}`;
    }
    if (overlap !== undefined) {
      roboflowUrl += `&overlap=${overlap}`;
    }

    // Call Roboflow API with base64 image
    const roboflowResponse = await fetch(roboflowUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: image, // Send base64 image directly
    });

    const responseText = await roboflowResponse.text();
    console.log(`Roboflow response status: ${roboflowResponse.status}`);

    if (!roboflowResponse.ok) {
      console.error(`Roboflow API error: ${roboflowResponse.status} - ${responseText}`);
      return new Response(
        JSON.stringify({ 
          error: `Roboflow API error: ${roboflowResponse.status}`,
          details: responseText
        }),
        { status: roboflowResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse and return the JSON response
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(responseText);
    } catch {
      console.error('Failed to parse Roboflow response as JSON');
      return new Response(
        JSON.stringify({ error: 'Invalid JSON response from Roboflow', raw: responseText }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Roboflow returned ${jsonResponse.predictions?.length || 0} predictions`);

    return new Response(JSON.stringify(jsonResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in infer function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error occurred' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
