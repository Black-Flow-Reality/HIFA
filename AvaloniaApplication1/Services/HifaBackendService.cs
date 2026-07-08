using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace AvaloniaApplication1.Services;

public class HifaBackendService
{
    private static readonly HttpClient _httpClient = new()
    {
        BaseAddress = new Uri("http://localhost:8000/"),
        Timeout = TimeSpan.FromSeconds(30)
    };

    public static async Task<bool> IsBackendAvailableAsync()
    {
        try
        {
            var response = await _httpClient.GetAsync("api/health");
            return response.IsSuccessStatusCode;
        }
        catch
        {
            return false;
        }
    }

    public static async Task<TrainResponse?> TrainAsync(TrainRequest request)
    {
        try
        {
            var response = await _httpClient.PostAsJsonAsync("api/train", request);
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<TrainResponse>();
            }
        }
        catch
        {
            // Fail silently, caller handles fallback
        }
        return null;
    }

    public static async Task<PredictResponse?> PredictAsync(PredictRequest request)
    {
        try
        {
            var response = await _httpClient.PostAsJsonAsync("api/predict", request);
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<PredictResponse>();
            }
        }
        catch
        {
            // Fail silently, caller handles fallback
        }
        return null;
    }
}

public class TrainRequest
{
    [JsonPropertyName("image_count")]
    public int ImageCount { get; set; }
}

public class TrainResponse
{
    [JsonPropertyName("status")]
    public string Status { get; set; } = "";

    [JsonPropertyName("epochs_completed")]
    public int EpochsCompleted { get; set; }
}

public class PredictRequest
{
    [JsonPropertyName("model")]
    public string Model { get; set; } = "";

    [JsonPropertyName("temperature")]
    public double Temperature { get; set; }

    [JsonPropertyName("steps")]
    public int Steps { get; set; }

    [JsonPropertyName("guidance_scale")]
    public double GuidanceScale { get; set; }

    [JsonPropertyName("seed")]
    public string Seed { get; set; } = "";
}

public class PredictResponse
{
    [JsonPropertyName("status")]
    public string Status { get; set; } = "";

    [JsonPropertyName("generated_image_path")]
    public string GeneratedImagePath { get; set; } = "";

    [JsonPropertyName("inference_time_seconds")]
    public double InferenceTimeSeconds { get; set; }
}
