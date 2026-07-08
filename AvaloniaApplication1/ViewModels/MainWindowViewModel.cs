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
    private void TrainModel()
    {
        if (DatasetImageCount == 0)
        {
            Log("Cannot train model: No training images loaded. Click the dropzone to load images.", "ERROR");
            return;
        }

        StatusText = "Training...";
        Log($"Starting training epoch with {DatasetImageCount} images...", "INFO");

        Task.Run(async () =>
        {
            for (int i = 1; i <= 5; i++)
            {
                await Task.Delay(800);
                string logMsg = $"Epoch {i}/5 - loss: {(0.5 / i):F4} - accuracy: {(0.7 + i * 0.05):F4}";
                
                Avalonia.Threading.Dispatcher.UIThread.Post(() =>
                {
                    Log(logMsg, "TRAIN");
                });
            }

            Avalonia.Threading.Dispatcher.UIThread.Post(() =>
            {
                StatusText = "Idle";
                Log("Training completed successfully.", "SUCCESS");
            });
        });
    }

    [RelayCommand]
    private void RunPrediction()
    {
        if (IsTrainingMode)
        {
            Log("Prediction is not available in Training Mode.", "WARNING");
            return;
        }

        StatusText = "Predicting...";
        Log("Running prediction pipeline on input test image...", "INFO");

        Task.Delay(1200).ContinueWith(_ =>
        {
            StatusText = "Idle";
            Log("Prediction finished: Detected 3 objects with confidence > 92%.", "SUCCESS");
        }, TaskScheduler.FromCurrentSynchronizationContext());
    }

    [RelayCommand]
    private void SelectImages()
    {
        DatasetImageCount += 5;
        Log($"Imported 5 training images (Total: {DatasetImageCount} images).", "INFO");
    }
}
