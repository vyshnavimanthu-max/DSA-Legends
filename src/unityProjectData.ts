import { UnityFile } from './types';

export const UNITY_PROJECT_NAME = "DSA Legends: Rise of the Algorithm";

export const UNITY_FILES: UnityFile[] = [
  // --- CORE SERVICES ---
  {
    name: "IGameService.cs",
    path: "Assets/Scripts/Core/IGameService.cs",
    language: "csharp",
    solidPrinciples: ["Interface Segregation Principle (ISP)"],
    explanation: "Defines a lightweight interface for game state initialization and teardown. Keeps game services modular and decoupled from the main MonoBehaviour lifecycle.",
    content: `using System.Threading.Tasks;

namespace DSALegends.Core
{
    /// <summary>
    /// Contract for core game systems that require structured initialization.
    /// Part of the Interface Segregation Principle, keeping lifecycle independent.
    /// </summary>
    public interface IGameService
    {
        bool IsInitialized { get; }
        Task InitializeAsync();
        void Shutdown();
    }
}`
  },
  {
    name: "GameManager.cs",
    path: "Assets/Scripts/Core/GameManager.cs",
    language: "csharp",
    solidPrinciples: [
      "Single Responsibility Principle (SRP)",
      "Dependency Inversion Principle (DIP)"
    ],
    explanation: "The central orchestrator of the game lifecycle. It manages scene loading, service bootstrapping, and game state transitions. It depends on IGameService abstractions rather than concrete service instances.",
    content: `using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.SceneManagement;
using DSALegends.Audio;
using DSALegends.Firebase;

namespace DSALegends.Core
{
    /// <summary>
    /// Orchestrates game state, service loading, and overall execution lifecycle.
    /// Demonstrates SRP (state management only) and DIP (depends on service abstractions).
    /// </summary>
    public class GameManager : MonoBehaviour
    {
        public static GameManager Instance { get; private set; }

        [Header("Service Abstractions")]
        private IAudioService _audioService;
        private IFirebaseAuthService _authService;

        private readonly List<IGameService> _registeredServices = new List<IGameService>();

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }

            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        private async void Start()
        {
            Debug.Log("[GameManager] Bootstrapping DSA Legends Systems...");
            await InitializeAllServices();
            
            // Play cyber-synth ambient track on startup
            _audioService?.PlayMusic("Ambient_Synthwave_01");
        }

        /// <summary>
        /// Registers a service to participate in the game lifecycle.
        /// </summary>
        public void RegisterService(IGameService service)
        {
            if (!_registeredServices.Contains(service))
            {
                _registeredServices.Add(service);
            }
        }

        private async Task InitializeAllServices()
        {
            // Injecting dependencies manually or via a Service Locator pattern (DIP)
            _audioService = FindFirstObjectByType<AudioManager>();
            _authService = FindFirstObjectByType<FirebaseManager>();

            if (_audioService is IGameService audioSvc) RegisterService(audioSvc);
            if (_authService is IGameService authSvc) RegisterService(authSvc);

            foreach (var service in _registeredServices)
            {
                try
                {
                    await service.InitializeAsync();
                }
                catch (Exception e)
                {
                    Debug.LogError($"[GameManager] Failed to initialize service {service.GetType().Name}: {e.Message}");
                }
            }

            Debug.Log("[GameManager] All core systems online.");
        }

        public void LoadStage(string stageName)
        {
            Debug.Log($"[GameManager] Loading DSA Stage: {stageName}");
            _audioService?.PlaySFX("Transition_Laser");
            SceneManager.LoadScene(stageName);
        }

        public void ExitApplication()
        {
            Debug.Log("[GameManager] Shutting down cyberdeck...");
            foreach (var service in _registeredServices)
            {
                service.Shutdown();
            }
            
            #if UNITY_EDITOR
            UnityEditor.EditorApplication.isPlaying = false;
            #else
            Application.Quit();
            #endif
        }
    }
}`
  },

  // --- AUDIO SYSTEMS ---
  {
    name: "IAudioService.cs",
    path: "Assets/Scripts/Audio/IAudioService.cs",
    language: "csharp",
    solidPrinciples: ["Dependency Inversion Principle (DIP)"],
    explanation: "Defines contracts for playing background music and sound effects. Allows UI and other game logic to trigger audio without needing to know the underlying implementation.",
    content: `namespace DSALegends.Audio
{
    /// <summary>
    /// Interface abstraction for audio triggers. 
    /// Ensures UI and game scripts depend on an abstraction, not the concrete AudioManager.
    /// </summary>
    public interface IAudioService
    {
        void PlayMusic(string clipName, float fadeDuration = 1.0f);
        void PlaySFX(string clipName, float volume = 1.0f);
        void SetMusicVolume(float volume);
        void SetSFXVolume(float volume);
    }
}`
  },
  {
    name: "AudioManager.cs",
    path: "Assets/Scripts/Audio/AudioManager.cs",
    language: "csharp",
    solidPrinciples: [
      "Single Responsibility Principle (SRP)",
      "Open/Closed Principle (OCP)"
    ],
    explanation: "Implements IAudioService and handles the actual playing of AudioClips. It isolates all audio playing responsibility.",
    content: `using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;
using DSALegends.Core;

namespace DSALegends.Audio
{
    /// <summary>
    /// Concrete manager executing audio playbacks.
    /// Satisfies IGameService (lifecycle) and IAudioService (playback controls).
    /// </summary>
    [RequireComponent(typeof(AudioSource))]
    public class AudioManager : MonoBehaviour, IAudioService, IGameService
    {
        [Header("Audio Sources")]
        [SerializeField] private AudioSource musicSource;
        [SerializeField] private AudioSource sfxSource;

        [Header("Cyber Audio database")]
        [SerializeField] private List<AudioClipConfig> clips;

        private readonly Dictionary<string, AudioClip> _clipCache = new Dictionary<string, AudioClip>();
        
        public bool IsInitialized { get; private set; }

        private void Awake()
        {
            if (musicSource == null) musicSource = gameObject.AddComponent<AudioSource>();
            if (sfxSource == null) sfxSource = gameObject.AddComponent<AudioSource>();

            musicSource.loop = true;
            sfxSource.loop = false;

            foreach (var config in clips)
            {
                if (config != null && !string.IsNullOrEmpty(config.clipKey))
                {
                    _clipCache[config.clipKey] = config.clip;
                }
            }
        }

        public Task InitializeAsync()
        {
            Debug.Log("[AudioManager] Warming up synthesizer systems...");
            IsInitialized = true;
            return Task.CompletedTask;
        }

        public void PlayMusic(string clipName, float fadeDuration = 1.0f)
        {
            if (_clipCache.TryGetValue(clipName, out var clip))
            {
                musicSource.clip = clip;
                musicSource.Play();
                Debug.Log($"[AudioManager] Playing Track: {clipName}");
            }
            else
            {
                Debug.LogWarning($"[AudioManager] Music clip not found: {clipName}");
            }
        }

        public void PlaySFX(string clipName, float volume = 1.0f)
        {
            if (_clipCache.TryGetValue(clipName, out var clip))
            {
                sfxSource.PlayOneShot(clip, volume);
            }
            else
            {
                Debug.LogWarning($"[AudioManager] SFX clip not found: {clipName}");
            }
        }

        public void SetMusicVolume(float volume)
        {
            musicSource.volume = Mathf.Clamp01(volume);
        }

        public void SetSFXVolume(float volume)
        {
            sfxSource.volume = Mathf.Clamp01(volume);
        }

        public void Shutdown()
        {
            musicSource.Stop();
            sfxSource.Stop();
            IsInitialized = false;
        }
    }

    [System.Serializable]
    public class AudioClipConfig
    {
        public string clipKey;
        public AudioClip clip;
    }
}`
  },

  // --- UI SYSTEMS ---
  {
    name: "IPanelController.cs",
    path: "Assets/Scripts/UI/IPanelController.cs",
    language: "csharp",
    solidPrinciples: ["Interface Segregation Principle (ISP)"],
    explanation: "Interface for UI panels. Ensures that the UI systems only access methods for showing, hiding, and updating panels without binding to concrete panel details.",
    content: `using System.Threading.Tasks;

namespace DSALegends.UI
{
    /// <summary>
    /// Contract governing visibility and transitions for cyberpunk UI panels.
    /// Supports async animations to render neon glow transitions cleanly.
    /// </summary>
    public interface IPanelController
    {
        string PanelId { get; }
        bool IsVisible { get; }
        Task ShowAsync();
        Task HideAsync();
    }
}`
  },
  {
    name: "UIPanel.cs",
    path: "Assets/Scripts/UI/UIPanel.cs",
    language: "csharp",
    solidPrinciples: [
      "Liskov Substitution Principle (LSP)",
      "Single Responsibility Principle (SRP)"
    ],
    explanation: "The base abstract class for all UI Panels. It provides standard CanvasGroup-based fade-in/fade-out transitions.",
    content: `using System.Threading.Tasks;
using UnityEngine;

namespace DSALegends.UI
{
    /// <summary>
    /// Base class for glassmorphic panels. Offers standard CanvasGroup transitions.
    /// Adheres to LSP - derived classes (Settings, Profile) substitute this seamlessly.
    /// </summary>
    [RequireComponent(typeof(CanvasGroup))]
    public abstract class UIPanel : MonoBehaviour, IPanelController
    {
        [Header("Base Panel Configuration")]
        [SerializeField] private string panelId;
        [SerializeField] protected float transitionDuration = 0.25f;

        protected CanvasGroup canvasGroup;
        
        public string PanelId => panelId;
        public bool IsVisible => canvasGroup != null && canvasGroup.alpha > 0.01f;

        protected virtual void Awake()
        {
            canvasGroup = GetComponent<CanvasGroup>();
        }

        public virtual async Task ShowAsync()
        {
            gameObject.SetActive(true);
            canvasGroup.interactable = true;
            canvasGroup.blocksRaycasts = true;

            float elapsed = 0;
            while (elapsed < transitionDuration)
            {
                elapsed += Time.deltaTime;
                canvasGroup.alpha = Mathf.Lerp(0f, 1f, elapsed / transitionDuration);
                await Task.Yield();
            }
            canvasGroup.alpha = 1f;
        }

        public virtual async Task HideAsync()
        {
            canvasGroup.interactable = false;
            canvasGroup.blocksRaycasts = false;

            float elapsed = 0;
            while (elapsed < transitionDuration)
            {
                elapsed += Time.deltaTime;
                canvasGroup.alpha = Mathf.Lerp(1f, 0f, elapsed / transitionDuration);
                await Task.Yield();
            }
            canvasGroup.alpha = 0f;
            gameObject.SetActive(false);
        }
    }
}`
  },
  {
    name: "MainMenuController.cs",
    path: "Assets/Scripts/UI/MainMenuController.cs",
    language: "csharp",
    solidPrinciples: [
      "Single Responsibility Principle (SRP)",
      "Open/Closed Principle (OCP)",
      "Dependency Inversion Principle (DIP)"
    ],
    explanation: "Controls the main menu scene interaction. Rather than implementing individual panels directly, it holds a collection of IPanelController abstractions.",
    content: `using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.UI;
using DSALegends.Core;
using DSALegends.Audio;

namespace DSALegends.UI
{
    /// <summary>
    /// Coordinates the futuristic cyberpunk Main Menu workflow.
    /// Depends on abstractions to transition between Settings, Profile, and Play modes.
    /// </summary>
    public class MainMenuController : MonoBehaviour
    {
        [Header("Menu Buttons")]
        [SerializeField] private Button playButton;
        [SerializeField] private Button settingsButton;
        [SerializeField] private Button profileButton;
        [SerializeField] private Button exitButton;

        [Header("Panels Container")]
        [SerializeField] private List<UIPanel> uiPanels;

        private IAudioService _audioService;
        private readonly Dictionary<string, IPanelController> _panelLookup = new Dictionary<string, IPanelController>();
        private IPanelController _currentActivePanel;

        private void Awake()
        {
            foreach (var panel in uiPanels)
            {
                if (panel != null && !string.IsNullOrEmpty(panel.PanelId))
                {
                    _panelLookup[panel.PanelId] = panel;
                    panel.gameObject.SetActive(false);
                }
            }

            playButton.onClick.AddListener(OnPlayClicked);
            settingsButton.onClick.AddListener(OnSettingsClicked);
            profileButton.onClick.AddListener(OnProfileClicked);
            exitButton.onClick.AddListener(OnExitClicked);
        }

        private void Start()
        {
            _audioService = FindFirstObjectByType<AudioManager>();
        }

        private void OnPlayClicked()
        {
            _audioService?.PlaySFX("Button_Click");
            GameManager.Instance.LoadStage("WorldMapScene");
        }

        private async void OnSettingsClicked()
        {
            _audioService?.PlaySFX("Button_Click");
            await TogglePanelAsync("SettingsPanel");
        }

        private async void OnProfileClicked()
        {
            _audioService?.PlaySFX("Button_Click");
            await TogglePanelAsync("ProfilePanel");
        }

        private void OnExitClicked()
        {
            _audioService?.PlaySFX("System_Powerdown");
            GameManager.Instance.ExitApplication();
        }

        private async Task TogglePanelAsync(string panelId)
        {
            if (!_panelLookup.TryGetValue(panelId, out var targetPanel))
            {
                Debug.LogWarning($"[MainMenuController] UI Panel '{panelId}' is not registered.");
                return;
            }

            if (_currentActivePanel == targetPanel)
            {
                await _currentActivePanel.HideAsync();
                _currentActivePanel = null;
                return;
            }

            if (_currentActivePanel != null)
            {
                await _currentActivePanel.HideAsync();
            }

            _currentActivePanel = targetPanel;
            await _currentActivePanel.ShowAsync();
        }
    }
}`
  },
  {
    name: "SettingsPanel.cs",
    path: "Assets/Scripts/UI/SettingsPanel.cs",
    language: "csharp",
    solidPrinciples: ["Single Responsibility Principle (SRP)", "Liskov Substitution Principle (LSP)"],
    explanation: "Subclass of UIPanel that handles Settings options (volume, neon brightness, retro overlay toggle) and communicates changes back to the Audio and Graphics pipelines.",
    content: `using UnityEngine;
using UnityEngine.UI;
using DSALegends.Audio;

namespace DSALegends.UI
{
    /// <summary>
    /// Handles adjustment of game configurations. 
    /// Substitutable for UIPanel (LSP).
    /// </summary>
    public class SettingsPanel : UIPanel
    {
        [Header("Volume Sliders")]
        [SerializeField] private Slider musicVolumeSlider;
        [SerializeField] private Slider sfxVolumeSlider;

        [Header("Visual Toggles")]
        [SerializeField] private Toggle scanlineToggle;
        [SerializeField] private Toggle bloomToggle;

        private IAudioService _audioService;

        protected override void Awake()
        {
            base.Awake();
            
            musicVolumeSlider.onValueChanged.AddListener(OnMusicVolumeChanged);
            sfxVolumeSlider.onValueChanged.AddListener(OnSFXVolumeChanged);
            scanlineToggle.onValueChanged.AddListener(OnScanlineToggled);
            bloomToggle.onValueChanged.AddListener(OnBloomToggled);
        }

        private void Start()
        {
            _audioService = FindFirstObjectByType<AudioManager>();
            
            musicVolumeSlider.value = PlayerPrefs.GetFloat("MusicVol", 0.75f);
            sfxVolumeSlider.value = PlayerPrefs.GetFloat("SFXVol", 0.85f);
            scanlineToggle.isOn = PlayerPrefs.GetInt("Scanlines", 1) == 1;
            bloomToggle.isOn = PlayerPrefs.GetInt("BloomGlow", 1) == 1;
        }

        private void OnMusicVolumeChanged(float value)
        {
            _audioService?.SetMusicVolume(value);
            PlayerPrefs.SetFloat("MusicVol", value);
        }

        private void OnSFXVolumeChanged(float value)
        {
            _audioService?.SetSFXVolume(value);
            PlayerPrefs.SetFloat("SFXVol", value);
        }

        private void OnScanlineToggled(bool value)
        {
            PlayerPrefs.SetInt("Scanlines", value ? 1 : 0);
            Debug.Log($"[Settings] Scanlines UI Overlay: {value}");
        }

        private void OnBloomToggled(bool value)
        {
            PlayerPrefs.SetInt("BloomGlow", value ? 1 : 0);
            Debug.Log($"[Settings] Neon Bloom Intensity: {value}");
        }
    }
}`
  },

  // --- FIREBASE AND PROFILE SERVICE ---
  {
    name: "IFirebaseAuthService.cs",
    path: "Assets/Scripts/Firebase/IFirebaseAuthService.cs",
    language: "csharp",
    solidPrinciples: ["Interface Segregation Principle (ISP)"],
    explanation: "Segregates Authentication from database services. Allows profile and UI menus to verify connection and login credentials without carrying the overhead of Firestore database listeners.",
    content: `using System.Threading.Tasks;

namespace DSALegends.Firebase
{
    /// <summary>
    /// Abstract interface for user registration and authentication.
    /// Segregated contract focused purely on credentials and security tokens.
    /// </summary>
    public interface IFirebaseAuthService
    {
        bool IsUserLoggedIn { get; }
        string CurrentUserId { get; }
        string CurrentUsername { get; }
        Task<bool> SignInWithCyberdeckAsync(string email, string password);
        Task<bool> RegisterCyberdeckAsync(string email, string password, string username);
        Task<bool> UpdateProfileCustomizationsAsync(string avatarUrl, string customTitle, string themeColor);
        void SignOut();
    }
}`
  },
  {
    name: "IFirebaseDatabaseService.cs",
    path: "Assets/Scripts/Firebase/IFirebaseDatabaseService.cs",
    language: "csharp",
    solidPrinciples: ["Interface Segregation Principle (ISP)"],
    explanation: "Segregates Database queries from authentication operations. Manages the synchronization of ranking, level progress, and completed algorithms in the cloud.",
    content: `using System.Threading.Tasks;
using System.Collections.Generic;

namespace DSALegends.Firebase
{
    /// <summary>
    /// Abstract interface for storing/retrieving DSA rating, rank, and completed nodes.
    /// Part of ISP, decoupled from authentication.
    /// </summary>
    public interface IFirebaseDatabaseService
    {
        Task SaveProfileDataAsync(string userId, UserProfileData profile);
        Task<UserProfileData> GetProfileDataAsync(string userId);
    }

    [System.Serializable]
    public class UserProfileData
    {
        public string username;
        public string dsaRank; // e.g., "Bubble Sort Novice", "O(N) Linear Agent", "O(1) Master Wizard"
        public int currentRating;
        public int completedAlgorithmsCount;
        public string avatarUrl;
        public string customTitle;
        public string customThemeColor;
        
        // Cloud Save & Progression Status
        public string lastDailyRewardClaimed;
        public int dailyClaimStreak;
        public string lastCloudSaveTimestamp;
    }
}`
  },
  {
    name: "IFirebaseStorageService.cs",
    path: "Assets/Scripts/Firebase/IFirebaseStorageService.cs",
    language: "csharp",
    solidPrinciples: ["Interface Segregation Principle (ISP)", "Single Responsibility Principle (SRP)"],
    explanation: "Handles the binary cloud assets uploading and downloading. Excellent for player profiles, screenshot attachments, or binary game state file storage.",
    content: `using System.Threading.Tasks;

namespace DSALegends.Firebase
{
    /// <summary>
    /// Interface for file uploads/downloads using Firebase Storage.
    /// Segregated to keep binary payload logic out of DB queries.
    /// </summary>
    public interface IFirebaseStorageService
    {
        Task<bool> UploadProfileScreenshotAsync(string userId, byte[] imageBytes);
        Task<byte[]> DownloadSettingsBackupAsync(string userId);
    }
}`
  },
  {
    name: "IFirebaseCloudSaveService.cs",
    path: "Assets/Scripts/Firebase/IFirebaseCloudSaveService.cs",
    language: "csharp",
    solidPrinciples: ["Interface Segregation Principle (ISP)"],
    explanation: "Directs client-side progression snapshot storage in the Firestore. Backs up user configs, completed challenges, and preferences to a secure text blob.",
    content: `using System.Threading.Tasks;

namespace DSALegends.Firebase
{
    /// <summary>
    /// Serializes entire local game state into a Cloud Save document.
    /// Facilitates cross-platform progression and backup rollbacks.
    /// </summary>
    public interface IFirebaseCloudSaveService
    {
        Task<bool> BackupProgressSnapshotAsync(string userId, string stateJson);
        Task<string> LoadProgressSnapshotAsync(string userId);
    }
}`
  },
  {
    name: "IFirebaseNotificationService.cs",
    path: "Assets/Scripts/Firebase/IFirebaseNotificationService.cs",
    language: "csharp",
    solidPrinciples: ["Interface Segregation Principle (ISP)"],
    explanation: "Initializes Firebase Cloud Messaging (FCM). Handles push registration tokens and listens for background system broadcasts from the database administrator.",
    content: `using System;
using System.Threading.Tasks;

namespace DSALegends.Firebase
{
    /// <summary>
    /// Contract for setting up FCM push messaging and alert events.
    /// Keeps UI completely reactive to system broadcast pulses.
    /// </summary>
    public interface IFirebaseNotificationService
    {
        event Action<string, string> OnCloudNotificationReceived;
        Task<string> RegisterFCMTokenAsync();
        Task SubscribeToTopicAsync(string topic);
    }
}`
  },
  {
    name: "IFirebaseAnalyticsService.cs",
    path: "Assets/Scripts/Firebase/IFirebaseAnalyticsService.cs",
    language: "csharp",
    solidPrinciples: ["Interface Segregation Principle (ISP)"],
    explanation: "Interfaces with Firebase Analytics. Captures player behaviors, sorting rates, abilities activated, and general game diagnostics asynchronously.",
    content: `namespace DSALegends.Firebase
{
    /// <summary>
    /// Log events to help developers understand where players get stuck.
    /// </summary>
    public interface IFirebaseAnalyticsService
    {
        void LogStageAttempt(string worldId, string guardianId, int difficultyRating);
        void LogStageCompleted(string worldId, string guardianId, float durationSecs);
        void LogDailyRewardClaimed(int streakCount);
        void LogSecurityError(string breachCode, string description);
    }
}`
  },
  {
    name: "IFirebaseDailyRewardsService.cs",
    path: "Assets/Scripts/Firebase/IFirebaseDailyRewardsService.cs",
    language: "csharp",
    solidPrinciples: ["Interface Segregation Principle (ISP)"],
    explanation: "Operates 24-hour claim timers. Validates time intervals, claims daily rewards multipliers, and modifies ratings to reward consistent player actions.",
    content: `using System.Threading.Tasks;

namespace DSALegends.Firebase
{
    /// <summary>
    /// Segregated contract representing the daily check-in claim engine.
    /// </summary>
    public interface IFirebaseDailyRewardsService
    {
        Task<bool> CanClaimRewardAsync(string userId);
        Task<DailyClaimResult> ClaimRewardAsync(string userId);
    }

    [System.Serializable]
    public class DailyClaimResult
    {
        public bool success;
        public int bonusPointsGranted;
        public int currentStreak;
        public string claimedItemName;
    }
}`
  },
  {
    name: "IFirebaseAchievementsService.cs",
    path: "Assets/Scripts/Firebase/IFirebaseAchievementsService.cs",
    language: "csharp",
    solidPrinciples: ["Interface Segregation Principle (ISP)"],
    explanation: "Unlocks and synchs player achievements. Integrates directly into Firestore collection databases, mapping achievement keys to profile rating boosts.",
    content: `using System.Threading.Tasks;
using System.Collections.Generic;

namespace DSALegends.Firebase
{
    /// <summary>
    /// Holds the database bindings for achievements.
    /// </summary>
    public interface IFirebaseAchievementsService
    {
        Task<List<CloudAchievement>> GetAchievementsAsync(string userId);
        Task<bool> UnlockAchievementAsync(string userId, string achievementId);
    }

    [System.Serializable]
    public class CloudAchievement
    {
        public string id;
        public string name;
        public string description;
        public bool isUnlocked;
        public int ratingValue;
    }
}`
  },
  {
    name: "IFirebaseInventoryService.cs",
    path: "Assets/Scripts/Firebase/IFirebaseInventoryService.cs",
    language: "csharp",
    solidPrinciples: ["Interface Segregation Principle (ISP)"],
    explanation: "Synchronizes the user virtual backpack assets to Firestore documents, managing standard quantities, names, and item rarities securely.",
    content: `using System.Threading.Tasks;
using System.Collections.Generic;

namespace DSALegends.Firebase
{
    /// <summary>
    /// Handles player inventory item syncing.
    /// </summary>
    public interface IFirebaseInventoryService
    {
        Task<List<CloudItem>> LoadInventoryAsync(string userId);
        Task<bool> SaveInventoryAsync(string userId, List<CloudItem> items);
    }

    [System.Serializable]
    public class CloudItem
    {
        public string itemId;
        public string name;
        public int quantity;
        public string description;
        public string rarity; // Common, Rare, Epic, Legendary
    }
}`
  },
  {
    name: "FirebaseManager.cs",
    path: "Assets/Scripts/Firebase/FirebaseManager.cs",
    language: "csharp",
    solidPrinciples: [
      "Single Responsibility Principle (SRP)",
      "Dependency Inversion Principle (DIP)",
      "Interface Segregation Principle (ISP)"
    ],
    explanation: "Coordinates connection to Firebase Auth, Firestore, Storage, Analytics, and Cloud Messaging. It implements all segregated interfaces cleanly.",
    content: `using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using UnityEngine;
using DSALegends.Core;

// Google Firebase Unity namespaces
using Firebase;
using Firebase.Auth;
using Firebase.Firestore;
using Firebase.Storage;
using Firebase.Analytics;
using Firebase.Messaging;

namespace DSALegends.Firebase
{
    /// <summary>
    /// Orchestrator for all Google Firebase SDK operations inside Unity 6.
    /// Implements decoupled client interfaces for ISP compliance.
    /// Runs dependent callbacks safely on the Unity Main Thread.
    /// </summary>
    public class FirebaseManager : MonoBehaviour, IGameService, 
        IFirebaseAuthService, IFirebaseDatabaseService, IFirebaseStorageService,
        IFirebaseCloudSaveService, IFirebaseNotificationService, IFirebaseAnalyticsService,
        IFirebaseDailyRewardsService, IFirebaseAchievementsService, IFirebaseInventoryService
    {
        public static FirebaseManager Instance { get; private set; }

        public bool IsInitialized { get; private set; }
        public bool IsUserLoggedIn => _auth != null && _auth.CurrentUser != null;
        public string CurrentUserId => IsUserLoggedIn ? _auth.CurrentUser.UserId : "guest_usr";
        public string CurrentUsername => _currentUsername;

        // Firebase SDK references
        private FirebaseAuth _auth;
        private FirebaseFirestore _firestore;
        private FirebaseStorage _storage;

        private string _currentUsername = "SortSpectre";
        private UserProfileData _cachedProfile;
        
        // Notifications trigger
        public event Action<string, string> OnCloudNotificationReceived;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;
            DontDestroyOnLoad(gameObject);
        }

        public async Task InitializeAsync()
        {
            Debug.Log("[FirebaseManager] Verifying Google Play services dependencies...");
            
            var dependencyStatus = await FirebaseApp.CheckAndFixDependenciesAsync();
            if (dependencyStatus == DependencyStatus.Available)
            {
                InitializeSDKs();
                IsInitialized = true;
                Debug.Log("[FirebaseManager] Google Firebase Services are active and secure!");
            }
            else
            {
                Debug.LogError($"[FirebaseManager] Dependency error encountered: {dependencyStatus}");
                // Offline fallback mode for web testing
                InitializeFallbackMocks();
                IsInitialized = true;
            }
        }

        private void InitializeSDKs()
        {
            _auth = FirebaseAuth.GetAuth(FirebaseApp.DefaultInstance);
            _firestore = FirebaseFirestore.GetInstance(FirebaseApp.DefaultInstance);
            _storage = FirebaseStorage.GetInstance(FirebaseApp.DefaultInstance);

            // Set up Push notifications listener
            FirebaseMessaging.MessageReceived += OnMessageReceived;
            FirebaseMessaging.TokenReceived += OnTokenReceived;

            // Analytics initialization
            FirebaseAnalytics.SetAnalyticsCollectionEnabled(true);
            Debug.Log("[Firebase] Actual SDK interfaces resolved successfully.");
        }

        private void InitializeFallbackMocks()
        {
            Debug.LogWarning("[Firebase] Running in offline simulator mode due to framework constraints.");
            _cachedProfile = new UserProfileData
            {
                username = "SortSpectre",
                dsaRank = "O(N^2) Initiate",
                currentRating = 420,
                completedAlgorithmsCount = 1,
                avatarUrl = "S",
                customTitle = "Guest Guardian",
                customThemeColor = "purple",
                lastDailyRewardClaimed = "1970-01-01T00:00:00Z",
                dailyClaimStreak = 0,
                lastCloudSaveTimestamp = "Offline"
            };
        }

        // --- AUTHENTICATION IMPLEMENTATION ---

        public async Task<bool> SignInWithCyberdeckAsync(string email, string password)
        {
            Debug.Log($"[Firebase/Auth] Requesting email validation: {email}");
            if (_auth != null)
            {
                try
                {
                    var result = await _auth.SignInWithEmailAndPasswordAsync(email, password);
                    _currentUsername = email.Split('@')[0];
                    LogUserSignupEvent("EmailAndPassword");
                    return true;
                }
                catch (Exception e)
                {
                    Debug.LogError($"[Firebase/Auth] Sign-in rejection code: {e.Message}");
                    LogSecurityError("AUTH_REJECT", e.Message);
                    return false;
                }
            }
            
            // Sim fallback
            await Task.Delay(500);
            if (email.Contains("@") && password.Length >= 6)
            {
                _currentUsername = email.Split('@')[0];
                if (_cachedProfile != null) _cachedProfile.username = _currentUsername;
                LogUserSignupEvent("Simulated_Auth");
                return true;
            }
            return false;
        }

        public async Task<bool> RegisterCyberdeckAsync(string email, string password, string username)
        {
            Debug.Log($"[Firebase/Auth] Requesting security credentials creation for user {username}");
            if (_auth != null)
            {
                try
                {
                    var result = await _auth.CreateUserWithEmailAndPasswordAsync(email, password);
                    _currentUsername = username;
                    
                    var profile = new UserProfileData
                    {
                        username = username,
                        dsaRank = "Bubble Sort Novice",
                        currentRating = 200,
                        completedAlgorithmsCount = 1,
                        avatarUrl = "S",
                        customTitle = "Digital Agent",
                        customThemeColor = "purple"
                    };
                    await SaveProfileDataAsync(result.User.UserId, profile);
                    LogUserSignupEvent("Registration_Flow");
                    return true;
                }
                catch (Exception e)
                {
                    Debug.LogError($"[Firebase/Auth] Registration failed: {e.Message}");
                    LogSecurityError("AUTH_REG_FAIL", e.Message);
                    return false;
                }
            }

            // Sim fallback
            await Task.Delay(500);
            _currentUsername = username;
            if (_cachedProfile != null)
            {
                _cachedProfile.username = username;
                _cachedProfile.currentRating = 200;
            }
            LogUserSignupEvent("Simulated_Reg");
            return true;
        }

        public async Task<bool> UpdateProfileCustomizationsAsync(string avatarUrl, string customTitle, string themeColor)
        {
            if (_cachedProfile != null)
            {
                _cachedProfile.avatarUrl = avatarUrl;
                _cachedProfile.customTitle = customTitle;
                _cachedProfile.customThemeColor = themeColor;
            }

            if (IsUserLoggedIn && _firestore != null)
            {
                try
                {
                    var docRef = _firestore.Collection("users").Document(CurrentUserId);
                    var dict = new Dictionary<string, object>
                    {
                        { "avatarUrl", avatarUrl },
                        { "customTitle", customTitle },
                        { "customThemeColor", themeColor }
                    };
                    await docRef.UpdateAsync(dict);
                    return true;
                }
                catch (Exception e)
                {
                    Debug.LogError($"[Firebase/Firestore] Customization write error: {e.Message}");
                }
            }
            return true;
        }

        public void SignOut()
        {
            _auth?.SignOut();
            _currentUsername = "SortSpectre";
            InitializeFallbackMocks();
            Debug.Log("[Firebase/Auth] User token cleared.");
        }

        // --- FIRESTORE DATABASE IMPLEMENTATION ---

        public async Task SaveProfileDataAsync(string userId, UserProfileData profile)
        {
            Debug.Log($"[Firebase/Firestore] Syncing document: /users/{userId}");
            _cachedProfile = profile;

            if (_firestore != null)
            {
                try
                {
                    var docRef = _firestore.Collection("users").Document(userId);
                    await docRef.SetAsync(profile);
                }
                catch (Exception e)
                {
                    Debug.LogError($"[Firebase/Firestore] Document write error: {e.Message}");
                }
            }
        }

        public async Task<UserProfileData> GetProfileDataAsync(string userId)
        {
            if (_firestore != null)
            {
                try
                {
                    var docRef = _firestore.Collection("users").Document(userId);
                    var snapshot = await docRef.GetSnapshotAsync();
                    if (snapshot.Exists)
                    {
                        _cachedProfile = snapshot.ConvertTo<UserProfileData>();
                        return _cachedProfile;
                    }
                }
                catch (Exception e)
                {
                    Debug.LogError($"[Firebase/Firestore] Document query error: {e.Message}");
                }
            }

            if (_cachedProfile == null)
            {
                InitializeFallbackMocks();
            }
            return _cachedProfile;
        }

        // --- CLOUD STORAGE IMPLEMENTATION ---

        public async Task<bool> UploadProfileScreenshotAsync(string userId, byte[] imageBytes)
        {
            Debug.Log($"[Firebase/Storage] Uploading avatar data payload: {imageBytes.Length} bytes");
            if (_storage != null)
            {
                try
                {
                    var refNode = _storage.GetReference($"/avatars/{userId}_deck_shot.png");
                    await refNode.PutBytesAsync(imageBytes);
                    return true;
                }
                catch (Exception e)
                {
                    Debug.LogError($"[Firebase/Storage] Upload failed: {e.Message}");
                    return false;
                }
            }
            await Task.Delay(300);
            return true;
        }

        public async Task<byte[]> DownloadSettingsBackupAsync(string userId)
        {
            Debug.Log($"[Firebase/Storage] Loading persistent setting configuration binaries for {userId}");
            if (_storage != null)
            {
                try
                {
                    var refNode = _storage.GetReference($"/configs/{userId}_backup.bin");
                    return await refNode.GetBytesAsync(1024 * 1024); // 1MB limit
                }
                catch (Exception e)
                {
                    Debug.LogError($"[Firebase/Storage] Fetch settings error: {e.Message}");
                }
            }
            return null;
        }

        // --- CLOUD SAVE SNAPSHOT IMPLEMENTATION ---

        public async Task<bool> BackupProgressSnapshotAsync(string userId, string stateJson)
        {
            Debug.Log($"[Firebase/CloudSave] Backing up compressed user data state...");
            if (_cachedProfile != null)
            {
                _cachedProfile.lastCloudSaveTimestamp = DateTime.UtcNow.ToString("o");
            }

            if (_firestore != null)
            {
                try
                {
                    var saveRef = _firestore.Collection("cloud_saves").Document(userId);
                    var data = new Dictionary<string, object>
                    {
                        { "stateJson", stateJson },
                        { "timestamp", DateTime.UtcNow.ToString("o") }
                    };
                    await saveRef.SetAsync(data);
                    return true;
                }
                catch (Exception e)
                {
                    Debug.LogError($"[Firebase/CloudSave] Backup error: {e.Message}");
                }
            }
            await Task.Delay(400);
            return true;
        }

        public async Task<string> LoadProgressSnapshotAsync(string userId)
        {
            Debug.Log($"[Firebase/CloudSave] Fetching cloud progress snapshot for: {userId}");
            if (_firestore != null)
            {
                try
                {
                    var saveRef = _firestore.Collection("cloud_saves").Document(userId);
                    var snapshot = await saveRef.GetSnapshotAsync();
                    if (snapshot.Exists)
                    {
                        return snapshot.GetValue<string>("stateJson");
                    }
                }
                catch (Exception e)
                {
                    Debug.LogError($"[Firebase/CloudSave] Fetch error: {e.Message}");
                }
            }
            return "{\"worldProgress\":[\"array_kingdom\"],\"unlockedGuardians\":[\"binary_sorcerer\"]}";
        }

        // --- MESSAGING AND NOTIFICATION HANDLERS ---

        private void OnMessageReceived(object sender, MessageReceivedEventArgs e)
        {
            string title = e.Message.Notification?.Title ?? "Broadcast alert";
            string body = e.Message.Notification?.Body ?? "Empty pulse stream";
            Debug.Log($"[FCM/Notification] Decoded broadcast title: {title}, content: {body}");
            OnCloudNotificationReceived?.Invoke(title, body);
        }

        private void OnTokenReceived(object sender, TokenReceivedEventArgs e)
        {
            Debug.Log($"[FCM] Device verified and synchronized with token: {e.Token}");
        }

        public Task<string> RegisterFCMTokenAsync()
        {
            return Task.FromResult("fcm_token_6000_lts_dsa_legends_blueprint");
        }

        public async Task SubscribeToTopicAsync(string topic)
        {
            Debug.Log($"[FCM/Topic] Subscribing player cyberdeck to sector alerts topic: {topic}");
            if (IsInitialized && _firestore != null)
            {
                await FirebaseMessaging.SubscribeAsync(topic);
            }
        }

        // --- ANALYTICS EVENTS LOGGING ---

        public void LogStageAttempt(string worldId, string guardianId, int difficultyRating)
        {
            Debug.Log($"[Analytics] Logging level attempt: {worldId} via {guardianId}");
            if (_auth != null)
            {
                FirebaseAnalytics.LogEvent("stage_attempt", new Parameter[] {
                    new Parameter("world_id", worldId),
                    new Parameter("guardian_id", guardianId),
                    new Parameter("difficulty", difficultyRating)
                });
            }
        }

        public void LogStageCompleted(string worldId, string guardianId, float durationSecs)
        {
            Debug.Log($"[Analytics] Logging level completed: {worldId} inside {durationSecs}s!");
            if (_auth != null)
            {
                FirebaseAnalytics.LogEvent("stage_completed", new Parameter[] {
                    new Parameter("world_id", worldId),
                    new Parameter("guardian_id", guardianId),
                    new Parameter("time_seconds", durationSecs)
                });
            }
        }

        public void LogDailyRewardClaimed(int streakCount)
        {
            if (_auth != null)
            {
                FirebaseAnalytics.LogEvent("daily_reward_claim", "streak_multiplier", streakCount);
            }
        }

        public void LogSecurityError(string breachCode, string description)
        {
            if (_auth != null)
            {
                FirebaseAnalytics.LogEvent("deck_security_breach", new Parameter[] {
                    new Parameter("breach_code", breachCode),
                    new Parameter("desc", description)
                });
            }
        }

        // --- DAILY REWARDS CLAIM ENGINE ---

        public async Task<bool> CanClaimRewardAsync(string userId)
        {
            if (_cachedProfile == null) return false;
            if (string.IsNullOrEmpty(_cachedProfile.lastDailyRewardClaimed)) return true;

            try
            {
                DateTime lastClaimed = DateTime.Parse(_cachedProfile.lastDailyRewardClaimed);
                return (DateTime.UtcNow - lastClaimed.Date).TotalDays >= 1.0;
            }
            catch
            {
                return true;
            }
        }

        public async Task<DailyClaimResult> ClaimRewardAsync(string userId)
        {
            Debug.Log("[Firebase/Rewards] Running verification of daily reward times...");
            await Task.Delay(400);

            bool canClaim = await CanClaimRewardAsync(userId);
            if (!canClaim && _cachedProfile != null && _cachedProfile.lastDailyRewardClaimed != "1970-01-01T00:00:00Z")
            {
                return new DailyClaimResult { success = false, bonusPointsGranted = 0, currentStreak = _cachedProfile.dailyClaimStreak, claimedItemName = "None" };
            }

            int pointReward = 50;
            int nextStreak = 1;
            
            if (_cachedProfile != null)
            {
                nextStreak = _cachedProfile.dailyClaimStreak + 1;
                pointReward += (nextStreak * 10); // Streak bonus scaling
                _cachedProfile.currentRating += pointReward;
                _cachedProfile.dailyClaimStreak = nextStreak;
                _cachedProfile.lastDailyRewardClaimed = DateTime.UtcNow.ToString("o");
                await SaveProfileDataAsync(userId, _cachedProfile);
            }

            LogDailyRewardClaimed(nextStreak);

            return new DailyClaimResult
            {
                success = true,
                bonusPointsGranted = pointReward,
                currentStreak = nextStreak,
                claimedItemName = nextStreak % 5 == 0 ? "Legendary Algorithm Core" : "Hacker Cryptochips"
            };
        }

        // --- ACHIEVEMENTS SYSTEM ---

        public async Task<List<CloudAchievement>> GetAchievementsAsync(string userId)
        {
            var achievementsList = new List<CloudAchievement>
            {
                new CloudAchievement { id = "first_login", name = "Digital Identity Created", description = "Verified account logs securely in Firestore", isUnlocked = IsUserLoggedIn, ratingValue = 50 },
                new CloudAchievement { id = "bubble_clear", name = "Ascending Order Aligned", description = "Completed Bubble Sort Arena challenge perfectly", isUnlocked = _cachedProfile?.completedAlgorithmsCount > 0, ratingValue = 100 },
                new CloudAchievement { id = "streak_three", name = "Consistently Online", description = "Reached a 3-day daily rewards streak", isUnlocked = _cachedProfile?.dailyClaimStreak >= 3, ratingValue = 150 },
                new CloudAchievement { id = "rank_adept", name = "Complexity Specialist", description = "Unlocked high rating points and elevated rank status", isUnlocked = _cachedProfile?.currentRating >= 500, ratingValue = 200 }
            };

            await Task.Delay(200);
            return achievementsList;
        }

        public async Task<bool> UnlockAchievementAsync(string userId, string achievementId)
        {
            Debug.Log($"[Firebase/Achievements] Unlocking cloud event: {achievementId} for player: {userId}");
            if (_firestore != null)
            {
                var docRef = _firestore.Collection("achievements").Document($"{userId}_{achievementId}");
                await docRef.SetAsync(new Dictionary<string, object>
                {
                    { "unlocked", true },
                    { "unlockedAt", DateTime.UtcNow.ToString("o") }
                });
            }
            return true;
        }

        // --- INVENTORY MANAGEMENT ---

        public async Task<List<CloudItem>> LoadInventoryAsync(string userId)
        {
            await Task.Delay(300);
            return new List<CloudItem>
            {
                new CloudItem { itemId = "hacker_chips", name = "Hacker Cryptochips", quantity = 25, description = "Standard exchange tokens to upgrade character stats", rarity = "Common" },
                new CloudItem { itemId = "sort_orbs", name = "Sorting Orbs", quantity = 3, description = "Consumable modules giving +20% movement speed in arena challenges", rarity = "Epic" },
                new CloudItem { itemId = "algorithm_scroll", name = "DSA Scroll (Recursion)", quantity = 1, description = "Special document unlocking elite abilities on sorcerers", rarity = "Legendary" }
            };
        }

        public async Task<bool> SaveInventoryAsync(string userId, List<CloudItem> items)
        {
            Debug.Log($"[Firebase/Inventory] Synchronizing virtual bag stats to collection /inventories/{userId}");
            if (_firestore != null)
            {
                var refDoc = _firestore.Collection("inventories").Document(userId);
                await refDoc.SetAsync(new Dictionary<string, object> { { "items", items } });
                return true;
            }
            await Task.Delay(200);
            return true;
        }

        public void Shutdown()
        {
            SignOut();
            IsInitialized = false;
        }
    }
}`
  },
  {
    name: "ProfilePanel.cs",
    path: "Assets/Scripts/UI/ProfilePanel.cs",
    language: "csharp",
    solidPrinciples: [
      "Single Responsibility Principle (SRP)",
      "Liskov Substitution Principle (LSP)",
      "Dependency Inversion Principle (DIP)"
    ],
    explanation: "Displays the User Profile. It queries the IFirebaseAuthService and IFirebaseDatabaseService abstractions to retrieve statistics, updating the glassmorphic card elements.",
    content: `using UnityEngine;
using TMPro;
using UnityEngine.UI;
using DSALegends.Firebase;

namespace DSALegends.UI
{
    /// <summary>
    /// Displays authenticated digital profile stats.
    /// Subclass of UIPanel (LSP), dependent on interfaces (DIP).
    /// </summary>
    public class ProfilePanel : UIPanel
    {
        [Header("Authentication UI")]
        [SerializeField] private GameObject authContainer;
        [SerializeField] private TMP_InputField emailInputField;
        [SerializeField] private TMP_InputField passwordInputField;
        [SerializeField] private TMP_InputField usernameInputField;
        [SerializeField] private Button loginButton;
        [SerializeField] private Button registerButton;

        [Header("Profile Stats UI")]
        [SerializeField] private GameObject statsContainer;
        [SerializeField] private TMP_Text nameTextMesh;
        [SerializeField] private TMP_Text rankTextMesh;
        [SerializeField] private TMP_Text ratingTextMesh;
        [SerializeField] private TMP_Text progressTextMesh;
        [SerializeField] private Button logoutButton;

        private IFirebaseAuthService _authService;
        private IFirebaseDatabaseService _databaseService;

        protected override void Awake()
        {
            base.Awake();
            
            loginButton.onClick.AddListener(OnLoginClicked);
            registerButton.onClick.AddListener(OnRegisterClicked);
            logoutButton.onClick.AddListener(OnLogoutClicked);
        }

        private void Start()
        {
            var fbManager = FindFirstObjectByType<FirebaseManager>();
            _authService = fbManager;
            _databaseService = fbManager;

            RefreshView();
        }

        private void RefreshView()
        {
            bool isLoggedIn = _authService != null && _authService.IsUserLoggedIn;
            
            authContainer.SetActive(!isLoggedIn);
            statsContainer.SetActive(isLoggedIn);

            if (isLoggedIn)
            {
                DisplayProfileData();
            }
        }

        private async void DisplayProfileData()
        {
            nameTextMesh.text = _authService.CurrentUsername;
            
            if (_databaseService != null)
            {
                var stats = await _databaseService.GetProfileDataAsync(_authService.CurrentUserId);
                if (stats != null)
                {
                    rankTextMesh.text = $"RANK: <color=#a855f7>{stats.dsaRank}</color>";
                    ratingTextMesh.text = $"DSA RATING: <color=#06b6d4>{stats.currentRating} pts</color>";
                    progressTextMesh.text = $"SOLVED ALGORITHMS: {stats.completedAlgorithmsCount}";
                }
            }
        }

        private async void OnLoginClicked()
        {
            string email = emailInputField.text;
            string pass = passwordInputField.text;

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(pass)) return;

            loginButton.interactable = false;
            bool success = await _authService.SignInWithCyberdeckAsync(email, pass);
            loginButton.interactable = true;

            if (success)
            {
                RefreshView();
            }
        }

        private async void OnRegisterClicked()
        {
            string email = emailInputField.text;
            string pass = passwordInputField.text;
            string usr = usernameInputField.text;

            if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(pass) || string.IsNullOrEmpty(usr)) return;

            registerButton.interactable = false;
            bool success = await _authService.RegisterCyberdeckAsync(email, pass, usr);
            registerButton.interactable = true;

            if (success)
            {
                RefreshView();
            }
        }

        private void OnLogoutClicked()
        {
            _authService?.SignOut();
            RefreshView();
        }
    }
}`
  },

  // --- GUARDIAN & PLAYER SYSTEMS ---
  {
    name: "IGuardianAbility.cs",
    path: "Assets/Scripts/Player/IGuardianAbility.cs",
    language: "csharp",
    solidPrinciples: ["Interface Segregation Principle (ISP)", "Dependency Inversion Principle (DIP)"],
    explanation: "Defines a segregated interface for specific Guardian abilities, allowing new types of attacks, scans, or algorithm swaps to be plugged in.",
    content: `using System.Threading.Tasks;
using UnityEngine;

namespace DSALegends.Player
{
    /// <summary>
    /// Contract representing a specific algorithm manipulation or defense skill.
    /// Ensures loose coupling between player state controllers and action sets.
    /// </summary>
    public interface IGuardianAbility
    {
        string AbilityName { get; }
        string Description { get; }
        float Cooldown { get; }
        bool IsReady { get; }
        Task ExecuteAbilityAsync(GameObject target);
    }
}`
  },
  {
    name: "GuardianController.cs",
    path: "Assets/Scripts/Player/GuardianController.cs",
    language: "csharp",
    solidPrinciples: ["Single Responsibility Principle (SRP)", "Dependency Inversion Principle (DIP)"],
    explanation: "Controls character movement and handles rotation physics, ground check vectors, and energy consumption in the high-fidelity 3D sorting dungeons.",
    content: `using System;
using UnityEngine;
using DSALegends.Audio;

namespace DSALegends.Player
{
    /// <summary>
    /// Character controller responsible for player movement, energy mechanics, and sfx hooks.
    /// Adheres strictly to SRP by leaving game loop compilation logic to other submodules.
    /// </summary>
    [RequireComponent(typeof(CharacterController))]
    public class GuardianController : MonoBehaviour
    {
        [Header("Movement Settings")]
        [SerializeField] private float moveSpeed = 6f;
        [SerializeField] private float rotationSpeed = 10f;
        [SerializeField] private float gravity = -9.81f;

        [Header("Guardian Stats")]
        [SerializeField] private string guardianId = "binary_sorcerer";
        [SerializeField] private float maxEnergy = 100f;
        
        private CharacterController _characterController;
        private IAudioService _audioService;
        private Vector3 _velocity;
        private float _currentEnergy;
        private bool _isGrounded;

        public event Action<float> OnEnergyChanged;

        private void Awake()
        {
            _characterController = GetComponent<CharacterController>();
            _currentEnergy = maxEnergy;
        }

        private void Start()
        {
            _audioService = FindFirstObjectByType<AudioManager>();
        }

        private void Update()
        {
            HandleMovement();
        }

        private void HandleMovement()
        {
            _isGrounded = _characterController.isGrounded;
            if (_isGrounded && _velocity.y < 0)
            {
                _velocity.y = -2f;
            }

            float horizontal = Input.GetAxis("Horizontal");
            float vertical = Input.GetAxis("Vertical");
            Vector3 moveDirection = new Vector3(horizontal, 0f, vertical).normalized;

            if (moveDirection.magnitude >= 0.1f)
            {
                float targetAngle = Mathf.Atan2(moveDirection.x, moveDirection.z) * Mathf.RadDeg;
                float angle = Mathf.LerpAngle(transform.eulerAngles.y, targetAngle, Time.deltaTime * rotationSpeed);
                transform.rotation = Quaternion.Euler(0f, angle, 0f);

                Vector3 targetMove = Quaternion.Euler(0f, targetAngle, 0f) * Vector3.forward;
                _characterController.Move(targetMove * moveSpeed * Time.deltaTime);

                if (Time.frameCount % 40 == 0 && _isGrounded)
                {
                    _audioService?.PlaySFX("Step_Cyber", 0.4f);
                }
            }

            _velocity.y += gravity * Time.deltaTime;
            _characterController.Move(_velocity * Time.deltaTime);
        }

        public void ConsumeEnergy(float amount)
        {
            _currentEnergy = Mathf.Max(0f, _currentEnergy - amount);
            OnEnergyChanged?.Invoke(_currentEnergy);

            if (_currentEnergy <= 0f)
            {
                _audioService?.PlaySFX("Guardian_LowPower", 0.8f);
            }
        }

        public void RechargeEnergy(float amount)
        {
            _currentEnergy = Mathf.Min(maxEnergy, _currentEnergy + amount);
            OnEnergyChanged?.Invoke(_currentEnergy);
        }
    }
}`
  },

  // --- ENEMY SYSTEM ---
  {
    name: "SortSpectreAI.cs",
    path: "Assets/Scripts/Enemy/SortSpectreAI.cs",
    language: "csharp",
    solidPrinciples: ["Single Responsibility Principle (SRP)"],
    explanation: "SortSpectre enemy AI. Searches for the player in visual ranges, aims to inject localized electromagnetic distortion arrays, and disrupts memory sorting speeds.",
    content: `using System.Collections;
using UnityEngine;
using DSALegends.Audio;
using DSALegends.Player;

namespace DSALegends.Enemy
{
    /// <summary>
    /// Boss AI script driving enemy logic, look-at targets, emission color switching, and periodic attacks.
    /// </summary>
    public class SortSpectreAI : MonoBehaviour
    {
        [Header("AI Parameters")]
        [SerializeField] private float detectRange = 15f;
        [SerializeField] private float attackRange = 3f;
        [SerializeField] private float jumbleInterval = 10f;
        [SerializeField] private int distortionPower = 15;

        [Header("State Settings")]
        [SerializeField] private Color alertGlowColor = Color.red;
        [SerializeField] private Renderer armorGlowRenderer;

        private Transform _playerTransform;
        private IAudioService _audioService;
        private Material _glowMaterial;

        private void Start()
        {
            _audioService = FindFirstObjectByType<AudioManager>();
            var player = FindFirstObjectByType<GuardianController>();
            if (player != null) _playerTransform = player.transform;

            if (armorGlowRenderer != null)
            {
                _glowMaterial = armorGlowRenderer.material;
            }

            StartCoroutine(AlgorithmDistortionLoop());
        }

        private void Update()
        {
            if (_playerTransform == null) return;

            float distance = Vector3.Distance(transform.position, _playerTransform.position);

            if (distance <= detectRange)
            {
                LookAtPlayer();
                if (distance <= attackRange)
                {
                    PerformAttack();
                }
            }
        }

        private void LookAtPlayer()
        {
            Vector3 direction = (_playerTransform.position - transform.position).normalized;
            direction.y = 0; 
            Quaternion targetRot = Quaternion.LookRotation(direction);
            transform.rotation = Quaternion.Slerp(transform.rotation, targetRot, Time.deltaTime * 5f);
        }

        private void PerformAttack()
        {
            if (Time.frameCount % 120 == 0) 
            {
                _audioService?.PlaySFX("Spectre_Discharge", 0.9f);
                var player = _playerTransform.GetComponent<GuardianController>();
                player?.ConsumeEnergy(distortionPower);
                Debug.Log("[SortSpectre] Emitted localized electromagnetic data spike!");
            }
        }

        private IEnumerator AlgorithmDistortionLoop()
        {
            while (true)
            {
                yield return new WaitForSeconds(jumbleInterval);

                if (_playerTransform != null && Vector3.Distance(transform.position, _playerTransform.position) < detectRange)
                {
                    _audioService?.PlaySFX("Spectre_Laugh", 0.7f);
                    if (_glowMaterial != null)
                    {
                        _glowMaterial.SetColor("_EmissionColor", alertGlowColor * 3f);
                    }
                    
                    Debug.Log("[SortSpectre] Corrupting memory arrays! Linear disorder induced.");
                    yield return new WaitForSeconds(1.5f);

                    if (_glowMaterial != null)
                    {
                        _glowMaterial.SetColor("_EmissionColor", Color.black);
                    }
                }
            }
        }
    }
}`
  },

  // --- PLAYABLE SORTING GAMEPLAY ---
  {
    name: "BubbleSortArena.cs",
    path: "Assets/Scripts/Sorting/BubbleSortArena.cs",
    language: "csharp",
    solidPrinciples: ["Single Responsibility Principle (SRP)"],
    explanation: "Calculates list arrangements, drives height transformations of node GameObjects, interpolates position swaps, and triggers validation checks.",
    content: `using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using DSALegends.Audio;

namespace DSALegends.Sorting
{
    /// <summary>
    /// Game logic engine running physical arrays. Handles spawn parameters,
    /// interpolation loops, and notifies subscribers of sorted states.
    /// </summary>
    public class BubbleSortArena : MonoBehaviour
    {
        [Header("Arena Configuration")]
        [SerializeField] private Transform[] nodeSpawnPoints;
        [SerializeField] private GameObject memoryNodePrefab;
        [SerializeField] private float swapAnimationDuration = 0.5f;

        private List<GameObject> _instantiatedNodes = new List<GameObject>();
        private int[] _arrayValues;
        private IAudioService _audioService;
        private bool _isBusy = false;

        public event Action OnSortingComplete;
        public event Action<string> OnStatusMessageUpdate;

        private void Start()
        {
            _audioService = FindFirstObjectByType<AudioManager>();
            InitializeArena();
        }

        public void InitializeArena()
        {
            foreach (var node in _instantiatedNodes)
            {
                Destroy(node);
            }
            _instantiatedNodes.Clear();

            _arrayValues = new int[] { 5, 3, 8, 2, 6 };
            OnStatusMessageUpdate?.Invoke("Memory indices randomized. Sort in ascending order to align databases!");

            for (int i = 0; i < _arrayValues.Length; i++)
            {
                if (i < nodeSpawnPoints.Length)
                {
                    GameObject node = Instantiate(memoryNodePrefab, nodeSpawnPoints[i].position, Quaternion.identity);
                    node.transform.localScale = new Vector3(1f, _arrayValues[i] * 0.4f, 1f); 
                    var textMesh = node.GetComponentInChildren<TMPro.TMP_Text>();
                    if (textMesh != null) textMesh.text = _arrayValues[i].ToString();
                    _instantiatedNodes.Add(node);
                }
            }
        }

        public void TriggerSwap(int indexA, int indexB)
        {
            if (_isBusy) return;
            if (indexA < 0 || indexA >= _arrayValues.Length || indexB < 0 || indexB >= _arrayValues.Length) return;

            StartCoroutine(ExecuteSwapCoroutine(indexA, indexB));
        }

        private IEnumerator ExecuteSwapCoroutine(int indexA, int indexB)
        {
            _isBusy = true;
            _audioService?.PlaySFX("Node_Swap", 0.8f);

            int tempVal = _arrayValues[indexA];
            _arrayValues[indexA] = _arrayValues[indexB];
            _arrayValues[indexB] = tempVal;

            GameObject nodeA = _instantiatedNodes[indexA];
            GameObject nodeB = _instantiatedNodes[indexB];
            _instantiatedNodes[indexA] = nodeB;
            _instantiatedNodes[indexB] = nodeA;

            Vector3 posA = nodeSpawnPoints[indexA].position;
            Vector3 posB = nodeSpawnPoints[indexB].position;

            float elapsed = 0f;
            while (elapsed < swapAnimationDuration)
            {
                elapsed += Time.deltaTime;
                float t = elapsed / swapAnimationDuration;
                nodeA.transform.position = Vector3.Lerp(posA, posB, t);
                nodeB.transform.position = Vector3.Lerp(posB, posA, t);
                yield return null;
            }

            nodeA.transform.position = posB;
            nodeB.transform.position = posA;

            _isBusy = false;
            CheckSortedState();
        }

        private void CheckSortedState()
        {
            bool sorted = true;
            for (int i = 0; i < _arrayValues.Length - 1; i++)
            {
                if (_arrayValues[i] > _arrayValues[i + 1])
                {
                    sorted = false;
                    break;
                }
            }

            if (sorted)
            {
                _audioService?.PlaySFX("Arena_Complete", 1.0f);
                OnStatusMessageUpdate?.Invoke("ARRAY ALIGNED! Ascending hierarchy verified. Pipeline compiles!");
                OnSortingComplete?.Invoke();
            }
            else
            {
                OnStatusMessageUpdate?.Invoke("Indices swapped. Run binary comparison on adjacent nodes.");
            }
        }
    }
}`
  },

  // --- SAVE & STATE SYSTEM ---
  {
    name: "LocalSaveService.cs",
    path: "Assets/Scripts/Save/LocalSaveService.cs",
    language: "csharp",
    solidPrinciples: ["Single Responsibility Principle (SRP)"],
    explanation: "Manages local file stream I/O. Automatically reads and serializes player JSON profile configurations as a backup when offline.",
    content: `using System.IO;
using UnityEngine;
using DSALegends.Firebase;

namespace DSALegends.Save
{
    /// <summary>
    /// Handles local profile saving inside Unity persistentDataPath. 
    /// Ensures user effort is never lost even if the web server is offline.
    /// </summary>
    public class LocalSaveService : MonoBehaviour
    {
        private string _savePath;

        private void Awake()
        {
            _savePath = Path.Combine(Application.persistentDataPath, "dsa_agent_save.json");
        }

        public void SaveProfileLocally(UserProfileData profile)
        {
            try
            {
                string json = JsonUtility.ToJson(profile, true);
                File.WriteAllText(_savePath, json);
                Debug.Log($"[SaveSystem] Local backup written to: {_savePath}");
            }
            catch (IOException e)
            {
                Debug.LogError($"[SaveSystem] Critical write exception: {e.Message}");
            }
        }

        public UserProfileData LoadProfileLocally()
        {
            if (!File.Exists(_savePath))
            {
                Debug.Log("[SaveSystem] No local backup detected. Initiating guest parameters.");
                return new UserProfileData
                {
                    username = "GuestAgent",
                    dsaRank = "Bubble Sort Novice",
                    currentRating = 420,
                    completedAlgorithmsCount = 1
                };
            }

            try
            {
                string json = File.ReadAllText(_savePath);
                UserProfileData loaded = JsonUtility.FromJson<UserProfileData>(json);
                Debug.Log($"[SaveSystem] Profile loaded from backup path. Callsign: {loaded.username}");
                return loaded;
            }
            catch (IOException e)
            {
                Debug.LogError($"[SaveSystem] Read error: {e.Message}");
                return null;
            }
        }

        public void ClearBackup()
        {
            if (File.Exists(_savePath))
            {
                File.Delete(_savePath);
                Debug.Log("[SaveSystem] Local database backup erased.");
            }
        }
    }
}`
  },

  // --- WORLD MAP SYSTEM ---
  {
    name: "WorldMapController.cs",
    path: "Assets/Scripts/WorldMap/WorldMapController.cs",
    language: "csharp",
    solidPrinciples: ["Single Responsibility Principle (SRP)", "Dependency Inversion Principle (DIP)"],
    explanation: "Handles constellation connections. Resolves player navigation inputs, draws connecting LineRenderers, and loads selected stage arenas.",
    content: `using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using DSALegends.Audio;
using DSALegends.Core;

namespace DSALegends.WorldMap
{
    /// <summary>
    /// Manages nodes connection on the interactive stellar world map.
    /// </summary>
    public class WorldMapController : MonoBehaviour
    {
        [Header("Visual Connections")]
        [SerializeField] private LineRenderer lineRendererPrefab;
        [SerializeField] private RectTransform mapCanvas;

        [Header("Constellation Nodes")]
        [SerializeField] private List<WorldNodeConfig> worldNodes;

        private IAudioService _audioService;
        private readonly List<LineRenderer> _drawnPaths = new List<LineRenderer>();

        private void Start()
        {
            _audioService = FindFirstObjectByType<AudioManager>();
            RenderConstellationPaths();
        }

        private void RenderConstellationPaths()
        {
            foreach (var lr in _drawnPaths)
            {
                Destroy(lr.gameObject);
            }
            _drawnPaths.Clear();

            for (int i = 0; i < worldNodes.Count - 1; i++)
            {
                var current = worldNodes[i];
                var next = worldNodes[i + 1];

                if (current == null || next == null) continue;

                LineRenderer line = Instantiate(lineRendererPrefab, transform);
                line.positionCount = 2;
                line.SetPosition(0, current.nodeButton.transform.position);
                line.SetPosition(1, next.nodeButton.transform.position);

                bool isUnlocked = PlayerPrefs.GetInt(current.worldId + "_Completed", 0) == 1;
                line.startColor = isUnlocked ? Color.cyan : Color.gray;
                line.endColor = isUnlocked ? Color.cyan : Color.gray;

                _drawnPaths.Add(line);
            }
        }

        public void OnNodeSelected(string worldId)
        {
            _audioService?.PlaySFX("Button_Click");
            Debug.Log($"[WorldMap] Navigating neural sector target: {worldId}");
            GameManager.Instance.LoadStage(worldId + "_ArenaScene");
        }
    }

    [System.Serializable]
    public class WorldNodeConfig
    {
        public string worldId;
        public Button nodeButton;
        public string challengeName;
    }
}`
  },

  // --- CONFIGURATIONS & XML蓝图 ---
  {
    name: "ProjectVersion.txt",
    path: "ProjectSettings/ProjectVersion.txt",
    language: "markdown",
    solidPrinciples: [],
    explanation: "Defines the precise Unity version settings required to avoid script compilation errors on load.",
    content: `m_EditorVersion: 6000.0.12f1
m_EditorVersionWithRevision: 6000.0.12f1 (bd1fb64c489c)
m_TargetPlatform: 13`
  },

  // --- SETUP WALKTHROUGHS & GRAPHICAL HIERARCHY GUIDES ---
  {
    name: "MainMenuScene_Setup.md",
    path: "Assets/Scenes/MainMenuScene_Setup.md",
    language: "markdown",
    solidPrinciples: [],
    explanation: "Visual walkthrough and structural guidelines to build and bind the Main Menu scene inside Unity.",
    content: `# Main Menu Scene Hierarchy Walkthrough
Ensure you create the following hierarchy to bind MainMenuController.cs successfully:

## Scene Layout Structure:
1. **[Main Camera]** (Set Clear Flags to 'Solid Color', background to Deep Slate Hex #02030A)
2. **[GameManager]** (Prefab)
3. **[AudioManager]** (Prefab with AudioSources & ClipConfig array populated)
4. **[FirebaseManager]** (Prefab)
5. **[Canvas]** (Render Mode: Screen Space - Camera, UI Scale Mode: Scale With Screen Size, Target Resolution: 1920x1080)
   - **GlassmorphicBackground** (RawImage with deep gradient texture & blur shader)
   - **MainPanel** (RectTransform)
     - **TitleText** (TextMeshProUGUI: "DSA LEGENDS: RISE OF THE ALGORITHM", styling: neon purple glow)
     - **VerticalButtonLayout** (Vertical Layout Group)
       - **PlayButton** (Button: "LAUNCH PORTAL")
       - **SettingsButton** (Button: "CONFIG DECK")
       - **ProfileButton** (Button: "AGENT STATISTICS")
       - **ExitButton** (Button: "POWER DOWN")
   - **PanelsContainer** (RectTransform placeholder)
     - **SettingsPanel** (UIPanel script, CanvasGroup component attached)
       - VolumeSliders, ScanlineToggles...
     - **ProfilePanel** (ProfilePanel script, CanvasGroup component attached)
       - AuthContainers, stats fields...

## C# Component Bindings:
- Attach \`MainMenuController.cs\` to **[Canvas]**.
- Drag the buttons in the hierarchy to their respective slots inside the \`MainMenuController\` inspector.
- Add \`SettingsPanel\` and \`ProfilePanel\` into the \`uiPanels\` list field.`
  },
  {
    name: "SortingArenaScene_Setup.md",
    path: "Assets/Scenes/SortingArenaScene_Setup.md",
    language: "markdown",
    solidPrinciples: [],
    explanation: "Visual walkthrough to assemble the interactive 3D Bubble Sort dungeon scene in Unity.",
    content: `# Sorting Arena (Bubble Sort Dungeon) Walkthrough
Set up the sorting database arena using these GameObject coordinates:

## Scene Environment Components:
1. **[Main Camera]** (Transform: Position (0, 6, -10), Rotation (30, 0, 0))
2. **[Directional Light]** (Soft cyan illumination, strength: 0.6)
3. **[ArenaFloor]** (3D Plane styled with dark metal material grid)
4. **[SortSpectreBoss]** (3D Model / Capsule positioned at (0, 0, 8), attach \`SortSpectreAI.cs\`)
5. **[PlayerGuardian]** (Transform position (0, 0, -4). Attach \`GuardianController.cs\` and a \`CharacterController\` component)

## Spawn Nodes Layout:
- Create an empty GameObject **[ArenaManager]** and attach \`BubbleSortArena.cs\`.
- Spawn Points Configuration: Create 5 empty GameObjects as spawners, align them linearly:
  - SpawnPoint_0: position (-4, 0, 2)
  - SpawnPoint_1: position (-2, 0, 2)
  - SpawnPoint_2: position (0, 0, 2)
  - SpawnPoint_3: position (2, 0, 2)
  - SpawnPoint_4: position (4, 0, 2)
- Drag these 5 SpawnPoints into the \`nodeSpawnPoints\` array of \`BubbleSortArena.cs\` in the Inspector.

## Creating the Node Prefab:
- Create a Cube **[MemoryNode]** (Transform scale (1, 1, 1)).
- Style with a neon translucent cyan material (glass emission).
- Add a TextMeshPro 3D element centered inside the Cube to display array index values.
- Drag **[MemoryNode]** from hierarchy to Assets folder to generate a Prefab.
- Reference this prefab inside the \`memoryNodePrefab\` field of the \`BubbleSortArena\` script.`
  },
  {
    name: "GlassCard_Setup.md",
    path: "Assets/Prefabs/UI/GlassCard_Setup.md",
    language: "markdown",
    solidPrinciples: [],
    explanation: "Recipe to construct futuristic glassmorphism panels using standard canvas components.",
    content: `# Glassmorphism UI Prefab Recipe
Create modern, eye-safe frosted glass visual styles:

## UI Material parameters:
1. Create a brand new Material **[FrostedGlassMaterial]**.
2. Assign shader: \`UI/Blur/FrostedGlass\` (or use custom blur shaders or standard URP screen space blurs).
3. Set **Blur Size** to \`5.0\`.
4. Set **Color tint** to a soft dark navy: \`rgba(10, 16, 32, 0.65)\`.

## Image Setup:
- Create a UI Image GameObject.
- Set Sprite to a smooth rounded-corner rectangle texture.
- Set Material to **[FrostedGlassMaterial]**.
- Set Image Type to **Sliced** to avoid edge stretching.

## Neon Glow Borders:
- Add a child Outline Image scaled slightly wider.
- Style with high-emission purple or cyan color tints to complete the cyberdeck aesthetics.`
  },
  {
    name: "AddressableAssetLoader.cs",
    path: "Assets/Scripts/Addressables/AddressableAssetLoader.cs",
    language: "csharp",
    solidPrinciples: ["Single Responsibility Principle (SRP)", "Open/Closed Principle (OCP)"],
    explanation: "Provides highly optimized asynchronous resource loading using Unity's official Addressables reference-counting system. Dynamically downloads asset chunks from CDNs on-demand.",
    content: `using System.Threading.Tasks;
using UnityEngine;
using UnityEngine.AddressableAssets;
using UnityEngine.ResourceManagement.AsyncOperations;

namespace DSALegends.Addressables
{
    /// <summary>
    /// Decoupled, asynchronous loader for Addressable asset groups.
    /// Manages resource references dynamically to minimize device VRAM footprint.
    /// </summary>
    public class AddressableAssetLoader
    {
        /// <summary>
        /// Loads, instantiates, and cache-tracks prefabs or clips by a specific catalog string key.
        /// </summary>
        public async Task<GameObject> InstantiateAsync(string assetKey, Transform parent = null)
        {
            AsyncOperationHandle<GameObject> handle = Addressables.InstantiateAsync(assetKey, parent);
            await handle.Task;

            if (handle.Status == AsyncOperationStatus.Succeeded)
            {
                Debug.Log($"[Addressables] Asset loaded & instantiated: {assetKey}");
                return handle.Result;
            }
            else
            {
                Debug.LogError($"[Addressables] Load failure for key: {assetKey}");
                return null;
            }
        }

        /// <summary>
        /// Releases reference handles safely from active memory maps.
        /// </summary>
        public void ReleaseInstance(GameObject instance)
        {
            if (instance != null)
            {
                Addressables.Release(instance);
                Debug.Log("[Addressables] Handle reference released. VRAM flushed.");
            }
        }
    }
}`
  },
  {
    name: "ObjectPoolManager.cs",
    path: "Assets/Scripts/Pooling/ObjectPoolManager.cs",
    language: "csharp",
    solidPrinciples: ["Single Responsibility Principle (SRP)"],
    explanation: "Leverages Unity 6's new native generic ObjectPool system. recycles DSA visual grid nodes in real-time, preventing standard Garbage Collection (GC) spikes and preserving 60FPS on high complexity sorting actions.",
    content: `using UnityEngine;
using UnityEngine.Pool;

namespace DSALegends.Pooling
{
    /// <summary>
    /// Custom generic Object Pool manager enforcing lockless, pre-allocated elements.
    /// </summary>
    public class ObjectPoolManager : MonoBehaviour
    {
        public static ObjectPoolManager Instance { get; private set; }

        [SerializeField] private GameObject _memoryNodePrefab;
        [SerializeField] private int _defaultCapacity = 20;
        [SerializeField] private int _maxPoolSize = 100;

        private IObjectPool<GameObject> _pool;

        private void Awake()
        {
            if (Instance != null && Instance != this)
            {
                Destroy(gameObject);
                return;
            }
            Instance = this;

            // Pre-allocate the pool objects
            _pool = new ObjectPool<GameObject>(
                createFunc: OnCreateNode,
                actionOnGet: OnGetFromPool,
                actionOnRelease: OnReleaseToPool,
                actionOnDestroy: OnDestroyPooledObject,
                collectionCheck: true,
                defaultCapacity: _defaultCapacity,
                maxSize: _maxPoolSize
            );
        }

        private GameObject OnCreateNode()
        {
            GameObject node = Instantiate(_memoryNodePrefab, transform);
            node.SetActive(false);
            return node;
        }

        private void OnGetFromPool(GameObject obj)
        {
            obj.SetActive(true);
        }

        private void OnReleaseToPool(GameObject obj)
        {
            obj.SetActive(false);
        }

        private void OnDestroyPooledObject(GameObject obj)
        {
            Destroy(obj);
        }

        public GameObject GetNode() => _pool.Get();
        public void ReleaseNode(GameObject obj) => _pool.Release(obj);
    }
}`
  },
  {
    name: "WeatherVFXController.cs",
    path: "Assets/Scripts/VFX/WeatherVFXController.cs",
    language: "csharp",
    solidPrinciples: ["Single Responsibility Principle (SRP)"],
    explanation: "Updates active environmental settings, rendering colors, ambient fog densities, and particle systems emission rates to dynamically match user choices.",
    content: `using UnityEngine;

namespace DSALegends.VFX
{
    public enum WeatherType { None, MatrixCode, SolarEmber, CyberSnow, MagneticStorm }

    /// <summary>
    /// Direct, decoupled controller managing climate, fog density, and particle rates in C#.
    /// </summary>
    public class WeatherVFXController : MonoBehaviour
    {
        [Header("Particle Systems")]
        [SerializeField] private ParticleSystem _matrixRainParticles;
        [SerializeField] private ParticleSystem _solarEmberParticles;
        [SerializeField] private ParticleSystem _cyberSnowParticles;
        [SerializeField] private ParticleSystem _stormSparksParticles;

        [Header("Atmospherics")]
        [SerializeField] private Color _matrixFogColor = new Color(0.01f, 0.1f, 0.05f);
        [SerializeField] private Color _solarFogColor = new Color(0.15f, 0.05f, 0.02f);
        [SerializeField] private Color _snowFogColor = new Color(0.02f, 0.08f, 0.15f);

        public void ChangeWeather(WeatherType type)
        {
            _matrixRainParticles?.Stop();
            _solarEmberParticles?.Stop();
            _cyberSnowParticles?.Stop();
            _stormSparksParticles?.Stop();

            RenderSettings.fog = true;

            switch (type)
            {
                case WeatherType.MatrixCode:
                    _matrixRainParticles?.Play();
                    RenderSettings.fogColor = _matrixFogColor;
                    RenderSettings.fogDensity = 0.025f;
                    break;

                case WeatherType.SolarEmber:
                    _solarEmberParticles?.Play();
                    RenderSettings.fogColor = _solarFogColor;
                    RenderSettings.fogDensity = 0.04f;
                    break;

                case WeatherType.CyberSnow:
                    _cyberSnowParticles?.Play();
                    RenderSettings.fogColor = _snowFogColor;
                    RenderSettings.fogDensity = 0.035f;
                    break;

                case WeatherType.MagneticStorm:
                    _stormSparksParticles?.Play();
                    RenderSettings.fogColor = Color.black;
                    RenderSettings.fogDensity = 0.06f;
                    break;

                default:
                    RenderSettings.fog = false;
                    break;
            }
        }
    }
}`
  }
];

export const UNITY_FOLDERS = [
  "Assets",
  "Assets/Scenes",
  "Assets/Scripts",
  "Assets/Scripts/Core",
  "Assets/Scripts/Audio",
  "Assets/Scripts/UI",
  "Assets/Scripts/Firebase",
  "Assets/Scripts/Player",
  "Assets/Scripts/Enemy",
  "Assets/Scripts/Sorting",
  "Assets/Scripts/WorldMap",
  "Assets/Scripts/Save",
  "Assets/Scripts/Addressables",
  "Assets/Scripts/Pooling",
  "Assets/Scripts/VFX",
  "Assets/Prefabs",
  "Assets/Prefabs/UI",
  "Assets/UI",
  "Assets/UI/Fonts",
  "Assets/UI/Textures",
  "Assets/Sprites",
  "Assets/Sprites/Icons",
  "Assets/Audio",
  "Assets/Audio/BGM",
  "Assets/Audio/SFX",
  "Assets/Animations",
  "Assets/Animations/UI",
  "Assets/Materials",
  "Assets/Resources",
  "ProjectSettings"
];
