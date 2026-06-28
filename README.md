# UY Gym Log — Android app (with exercise reminders)

Your `gym-logger-5.html` wrapped in Capacitor as a real Android app, plus a new
**REMIND** tab that fires local notifications at preset times — even when the app
is closed. Tapping an alert lets you snooze it or log the set straight into the
day's session.

Everything compiles **in the cloud via GitHub Actions** — you never need Android
Studio, the Android SDK, a Mac, or a Windows machine. You push the files, GitHub
builds the APK, you download it onto your phone.

---

## 1. Build the APK (one-time, in the cloud)

1. **Create a new repository** on GitHub (private is fine). Don't add a README.
2. **Add these files to it.** Two ways:
   - *Desktop browser (no terminal):* on the empty repo page, click **Add file →
     Upload files**, then drag the **contents of this folder** in. In Chrome you
     can drag the whole folder and it keeps the structure. Commit.
   - *Or via git (one command set):*
     ```
     git init && git add . && git commit -m "init"
     git branch -M main
     git remote add origin https://github.com/<you>/<repo>.git
     git push -u origin main
     ```
3. The push triggers the workflow automatically. Open the **Actions** tab and
   watch "Build Android APK" run (first run ~5–10 min).
4. When it's green, open the run → scroll to **Artifacts** → download
   **UY-Gym-Log-apk**. You can do this step **directly in your phone's browser**.
   It downloads a zip containing `app-debug.apk`.

> No build server of mine can produce this for you — Android compilation needs
> Google's SDK/Gradle servers, which my sandbox can't reach. GitHub's runners
> can, for free. This workflow is the whole bridge.

## 2. Install on your phone

1. Unzip the downloaded artifact to get `app-debug.apk`.
2. Tap it. Android will ask to allow installing unknown apps for your
   browser/files app — allow it, then install.
3. Works on both the Huawei P30 Pro and the Xiaomi 15T. Local notifications do
   **not** need Google Play Services, so the Huawei is fine.

## 3. First launch — grant these (one time)

For alerts to fire reliably:

- **Notifications** — allow when prompted (Android 13+).
- **Alarms & reminders / "Schedule exact alarm"** — allow if asked, so alerts
  land on the exact minute.
- **Battery optimization** — set the app to **Unrestricted / Don't optimize**
  (Settings → Apps → UY Gym Log → Battery). Aggressive battery saving (very
  common on Huawei/Xiaomi) is the #1 reason scheduled alerts get delayed.

---

## Using reminders

Open the **REMIND** tab:

1. **Quick fill** — set a start time, an interval (e.g. every 45 min), and how
   many. Tap **Generate slots** to lay them out. Or **+ Add one reminder**.
2. For each slot, pick the **exercise** from the dropdown. The fields adapt to
   the exercise type — kg + reps, reps only, minutes, or incline + minutes.
3. Tap **SET REMINDERS**. They're armed for today through Android's alarm system.

When an alert fires you get **Did it — log** and **Snooze 10m** buttons (on the
notification and in-app). **Log** writes the set into today's session — the open
session if there is one, otherwise a new one is created. **Snooze** re-fires in
10 minutes.

---

## Notes

- This is a **debug** APK (unsigned for Play, perfect for sideloading). It installs
  and runs exactly like a normal app.
- Snooze/alerts in deep sleep (Doze) can fire at most once per ~9 minutes per app —
  Android's limit, not the app's. Spacing reminders a few minutes apart avoids it.
- Opening `www/index.html` in a plain browser still works as a **preview**, but
  alerts there only pop while the page is open. The real background alerts need
  the installed app.
- To change the app later: edit `www/index.html`, push, download the new APK,
  reinstall over the old one (your logged data stays — it's stored on-device).

## Project layout

```
www/index.html          your gym logger + the REMIND feature
capacitor.config.json   app id / name
package.json            pinned Capacitor 8 dependencies
android/                native Android project (manifest already has the
                        notification + exact-alarm + boot permissions)
.github/workflows/      the cloud build
```
