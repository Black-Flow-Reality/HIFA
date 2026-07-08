
# HIFA

## ▶️ Run the Avalonia app

This project is an Avalonia desktop app targeting .NET 10. You can run it in two common ways:

### 1. Run it with dotnet in the terminal

From the repository root:

```bash
cd /home/jimmy/HIFA
dotnet build AvaloniaApplication1.sln
dotnet run --project AvaloniaApplication1/AvaloniaApplication1.csproj
```

If you only want to run the already-built app:

```bash
dotnet run --project AvaloniaApplication1/AvaloniaApplication1.csproj --no-build
```

### 2. Run it directly in VS Code

1. Open the folder in VS Code.
2. Make sure the .NET SDK is installed and the C# extension is available.
3. Open the Run and Debug view.
4. Start the app with F5 or the Run button.
5. If VS Code prompts you to select a debugger, choose the .NET option for the project.

If you see a prompt to create launch configuration, choose the option for launching a local .NET project.

---
## 🛠️ Onboarding: Git & GitHub Setup Guide

Welcome to the team! If you are new to Git and version control, follow this step-by-step guide to set up your environment and learn how to share your code with the team.

### Step 1: Configure Your Local Git Account
Before you make any changes, you need to tell Git who you are. This ensures your commits are properly attributed to you.

1. Open your terminal (Mac/Linux) or Command Prompt/Git Bash (Windows).
2. Set your name and email by running the following commands (replace the text inside the quotes with your actual information):
   ```bash
   git config --global user.name "Your First and Last Name"
   git config --global user.email "your_email@example.com"


*Note: Use the same email address you used to create your GitHub account.*

### Step 2: Log In to GitHub via CLI (`gh auth login`)

Instead of messing with complicated Personal Access Tokens (PATs) or SSH keys, we use the official **GitHub CLI** tool to log in securely.

1. Make sure you have downloaded and installed the GitHub CLI (`gh`). (https://cli.github.com/)
2. In your terminal, type the following command and press Enter:
```bash
gh auth login

```

3. Use your arrow keys and Enter key to answer the prompts exactly like this:
* **What account do you want to log into?** `GitHub.com`
* **What is your preferred protocol for Git operations on this host?** `HTTPS`
* **Authenticate Git with your GitHub credentials?** `Yes`
* **How would you like to authenticate GitHub CLI?** `Login with a web browser`
4. A **one-time activation code** (8 characters) will appear in your terminal. Copy it.
5. Press **Enter** to open your browser automatically. Paste the code into the GitHub prompt, then click **Authorize github**.

Once the terminal says you are logged in, you are good to go!

### Step 3: Configure the folder
*BEFORE YOU CONFIGURE THE FOLDER, MAKE SURE YOU KNOW WHERE YOU SAVE YOUR PROJECT

#### 1. Go to the folder.
```bash
cd "To your location"

```
#### 2. Create your git config
```bash
git init

```
#### 3. Link your current project folder to the repository.
```bash
git remote add origin "https://github.com/your-repository.git" # IT MUST BE .git in the end of the URL

```
#### 4. Fetch & Pull (Do this BEFORE you start working)

Always get the latest code from your team before you begin editing files. This prevents merge conflicts later.

* **`git fetch`** checks the GitHub repository to see if anyone has uploaded new work, without touching your local files:
```bash
git fetch origin

```

* **`git pull`** downloads those changes and merges them directly into your local workspace:
```bash
git pull origin main

```


---

## 🔄 Daily Workflow: Syncing Your Code

When working with Godot scenes, scripts, or Blender assets, you need to constantly pull your teammates' changes and push your own. Here is the daily workflow order:






### 1. Add & Commit (Do this when you finish a task)

Once you have created or edited a file (like designing a UI element or adding a 3D model), save a "snapshot" of your progress locally.

* **`git add`** tells Git which files you want to include in your next snapshot.
```bash
# To add a specific file:
git add path/to/file.gd

# To add ALL changed and new files at once:
git add .

```


* **`git commit`** locks in your snapshot with a required description of what you did. Keep messages short and meaningful!
```bash
git commit -m "Add basic UI interface for asset selection"

```



### 2. Push (Do this to share your work)

Right now, your commit only exists on your own computer. To upload it to GitHub so Clark, Albert, and the rest of the team can see it, use push.

* **`git push`** sends your committed changes to the cloud:
```bash
git push origin main

```

---

## 🌿 Advanced Workflow: Branching & Merging

To prevent multiple people from breaking the main game code at the same time, we use **branches**. Think of a branch as a parallel copy of the project where you can safely build features without affecting the `main` game.

### 1. Create and Switch to a New Branch

Before starting a new feature (e.g., UI building or adding 3D model processing), create a brand new branch named after your feature:

```bash
# Create and instantly switch to your new branch:
git checkout -b feature-ui-layout

```

### 2. Add Progress to Your Branch

Work normally in Godot or Blender. When you are ready to save snapshots to this specific branch, use the exact same sync process:

```bash
git add .
git commit -m "Designed the main UI panel background"

```

To share this branch with the team on GitHub for the first time, run:

```bash
git push origin feature-ui-layout

```

### 3. Requesting to Merge Your Work into Main (Pull Request) (IMPORTANT)

When your feature is fully complete, working, and tested, you need to ask the team to merge your branch back into the `main` branch. This is called a **Pull Request (PR)**.

You can quickly create a PR directly using the GitHub CLI:

```bash
gh pr create --title "Add completed UI interface" --body "This adds the complete functional UI canvas layer for object placement."

```

*Alternatively, you can go to the project repository on GitHub.com in your web browser, where you will see a green button that says **"Compare & pull request"**.*

### 4. Merging Your Branch into Main

Once the team reviews your code and approves the Pull Request, it needs to be merged into `main`.

**Option A: Merging via Terminal**
If you prefer to manually merge it locally yourself:

1. Switch back to the main branch:
```bash
git checkout main

```


2. Make sure your local main is up to date:
```bash
git pull origin main

```


3. Merge your feature branch into main:
```bash
git merge feature-ui-layout

```


4. Push the newly updated main back up to GitHub:
```bash
git push origin main

```



**Option B: Merging via GitHub Web**
Simply click the big green **"Merge pull request"** button on the GitHub PR webpage. This is the preferred method for the team!

### 5. Remove the Finished Branch

Once a feature is safely merged into `main`, clean up the branch so the workspace stays tidy.

* **Delete the local branch** on your computer:
```bash
git branch -d feature-ui-layout

```


* **Delete the remote branch** on GitHub:
```bash
git push origin --delete feature-ui-layout

```
# Important  Notes
### Before pushing, create a branch and ask other members to avoid `PUSH CONFLICT`
