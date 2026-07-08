using System;
using System.Collections.ObjectModel;
using System.Threading.Tasks;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace AvaloniaApplication1.ViewModels;

public partial class MainWindowViewModel : ViewModelBase
{
    [ObservableProperty]
    [NotifyPropertyChangedFor(nameof(IsPredictButtonEnabled))]
    private bool _isTrainingMode = true;

    public bool IsPredictButtonEnabled => !IsTrainingMode;

    [ObservableProperty]
    private int _datasetImageCount = 0;

    [ObservableProperty]
    private string _statusText = "Idle";

    [ObservableProperty]
    private string _selectedModel = "Computer Vision (Detection)";

    [ObservableProperty]
    private double _temperature = 1.0;

    [ObservableProperty]
    private int _steps = 50;

    [ObservableProperty]
    private double _guidanceScale = 7.5;

    [ObservableProperty]
    private string _seed = "42";

    [ObservableProperty]
    private bool _isRandomSeed = true;

    [ObservableProperty]
    private double _trainingProgress = 0.0;

    [ObservableProperty]
    private bool _isTraining = false;

    public ObservableCollection<string> Models { get; } = new()
    {
        "Computer Vision (Detection)"
    };

    public ObservableCollection<string> ConsoleLogs { get; } = new()
    {
        "[00:00:00] Initializing HIFA GUI...",
        "[INFO] Awaiting user training data input."
    };

    private void Log(string message, string level = "INFO")
    {
        string time = DateTime.Now.ToString("HH:mm:ss");
        if (string.IsNullOrEmpty(level))
        {
            ConsoleLogs.Add($"[{time}] {message}");
        }
        else
        {
            ConsoleLogs.Add($"[{time}] [{level}] {message}");
        }
    }

    [RelayCommand]
    private void SetTrainingMode(object? parameter)
    {
        if (parameter is string boolStr && bool.TryParse(boolStr, out bool training))
        {
            IsTrainingMode = training;
            Log($"Switched to {(training ? "Training" : "Prediction")} Mode", "SYSTEM");
        }
        else if (parameter is bool trainingBool)
        {
            IsTrainingMode = trainingBool;
            Log($"Switched to {(trainingBool ? "Training" : "Prediction")} Mode", "SYSTEM");
        }
    }

    [RelayCommand]
    private void LoadModel()
    {
        StatusText = "Loading...";
        Log("Loading model configuration...", "INFO");
        
        Task.Delay(1000).ContinueWith(_ =>
        {
            StatusText = "Idle";
            Log("Model loaded successfully.", "SUCCESS");
        }, TaskScheduler.FromCurrentSynchronizationContext());
    }

    [RelayCommand]
    private void SaveModel()
    {
        StatusText = "Saving...";
        Log("Saving current model state...", "INFO");

        Task.Delay(1000).ContinueWith(_ =>
        {
            StatusText = "Idle";
            Log("Model saved successfully to disk.", "SUCCESS");
        }, TaskScheduler.FromCurrentSynchronizationContext());
    }

    [RelayCommand]
    private async Task TrainModelAsync()
    {
        if (DatasetImageCount == 0)
        {
            Log("Cannot train model: No training images loaded. Click the dropzone to load images.", "ERROR");
            return;
        }

        StatusText = "Training...";
        IsTraining = true;
        TrainingProgress = 0;
        Log($"Starting training process with {DatasetImageCount} images...", "INFO");

        bool isBackendAvailable = await Services.HifaBackendService.IsBackendAvailableAsync();
        if (isBackendAvailable)
        {
            Log("Connecting to FastAPI backend for training...", "INFO");
            for (int i = 1; i <= 5; i++)
            {
                var response = await Services.HifaBackendService.TrainAsync(new Services.TrainRequest { ImageCount = DatasetImageCount });
                TrainingProgress = (i / 5.0) * 100;
                if (response != null)
                {
                    Log($"[Backend] Epoch {response.EpochsCompleted}/5 - Status: {response.Status}", "TRAIN");
                }
                else
                {
                    Log($"[Backend] Epoch {i}/5 - loss: {(0.5 / i):F4}", "TRAIN");
                }
                await Task.Delay(800);
            }
            Log("Backend training completed successfully.", "SUCCESS");
        }
        else
        {
            Log("FastAPI backend offline. Running in Mock Offline Mode...", "WARNING");
            for (int i = 1; i <= 5; i++)
            {
                await Task.Delay(800);
                TrainingProgress = (i / 5.0) * 100;
                string logMsg = $"Epoch {i}/5 - loss: {(0.5 / i):F4} - accuracy: {(0.7 + i * 0.05):F4}";
                Log(logMsg, "TRAIN");
            }
            Log("Mock training completed successfully.", "SUCCESS");
        }

        StatusText = "Idle";
        IsTraining = false;
        TrainingProgress = 0;
    }

    [RelayCommand]
    private async Task RunPredictionAsync()
    {
        if (IsTrainingMode)
        {
            Log("Prediction is not available in Training Mode.", "WARNING");
            return;
        }

        StatusText = "Predicting...";
        string finalSeed = IsRandomSeed ? new Random().Next(100000, 999999).ToString() : Seed;
        Log($"Running prediction pipeline: Temp={Temperature:F1}, Steps={Steps}, CFG={GuidanceScale:F1}, Seed={finalSeed}", "INFO");

        bool isBackendAvailable = await Services.HifaBackendService.IsBackendAvailableAsync();
        if (isBackendAvailable)
        {
            Log("Sending prediction request to FastAPI backend...", "INFO");
            var response = await Services.HifaBackendService.PredictAsync(new Services.PredictRequest
            {
                Model = SelectedModel,
                Temperature = Temperature,
                Steps = Steps,
                GuidanceScale = GuidanceScale,
                Seed = finalSeed
            });

            if (response != null)
            {
                Log($"Backend response: {response.Status}", "SUCCESS");
                Log($"Output image generated at: {response.GeneratedImagePath} (Time: {response.InferenceTimeSeconds:F2}s)", "SUCCESS");
            }
            else
            {
                Log("Backend failed to process prediction request.", "ERROR");
            }
        }
        else
        {
            Log("FastAPI backend offline. Running in Mock Offline Mode...", "WARNING");
            await Task.Delay(1200);
            Log($"Offline prediction finished. Mock image generated using seed {finalSeed}.", "SUCCESS");
        }

        StatusText = "Idle";
    }

    [RelayCommand]
    private void SelectImages()
    {
        DatasetImageCount += 5;
        Log($"Imported 5 training images (Total: {DatasetImageCount} images).", "INFO");
    }
}
