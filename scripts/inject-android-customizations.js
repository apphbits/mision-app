// ====================================================================
// MISIÓN — Android Customizations Injector for Capacitor
// - Deep Links Scheme in AndroidManifest.xml
// - Native Navigation Bar & Status Bar Dark Mode Bridge in MainActivity.java
// - DayNight Theme in styles.xml
// ====================================================================

const fs = require('fs');
const path = require('path');

console.log('--- Injecting Android Customizations ---');

// 1. AndroidManifest.xml: OAuth & App Custom Scheme
const manifestFile = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'AndroidManifest.xml');
if (fs.existsSync(manifestFile)) {
  let content = fs.readFileSync(manifestFile, 'utf8');
  const filter = '            <intent-filter>\n                <action android:name="android.intent.action.VIEW" />\n                <category android:name="android.intent.category.DEFAULT" />\n                <category android:name="android.intent.category.BROWSABLE" />\n                <data android:scheme="app.mision.santuario" />\n            </intent-filter>';
  if (!content.includes('app.mision.santuario')) {
    content = content.replace('</activity>', filter + '\n        </activity>');
    fs.writeFileSync(manifestFile, content, 'utf8');
    console.log('✓ Custom scheme injected into AndroidManifest.xml');
  }
} else {
  console.log('Notice: AndroidManifest.xml not found at', manifestFile);
}

// 2. MainActivity.java: Dynamic Navigation Bar & Status Bar Theme Bridge
function findMainActivity(dir) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      const found = findMainActivity(full);
      if (found) return found;
    } else if (f === 'MainActivity.java') {
      return full;
    }
  }
  return null;
}

const javaDir = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'java');
const mainActivityPath = findMainActivity(javaDir);
if (mainActivityPath) {
  const javaCode = `package app.mision.santuario;

import android.os.Bundle;
import android.graphics.Color;
import android.view.Window;
import android.webkit.JavascriptInterface;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        
        // Add native bridge to dynamically color the bottom Navigation Bar and Status Bar
        if (this.bridge != null && this.bridge.getWebView() != null) {
            this.bridge.getWebView().addJavascriptInterface(new Object() {
                @JavascriptInterface
                public void setSystemBarsTheme(final boolean isDark) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            try {
                                Window window = getWindow();
                                if (window != null) {
                                    int bgColor = isDark ? Color.parseColor("#111A15") : Color.parseColor("#F8F8F5");
                                    window.setNavigationBarColor(bgColor);
                                    window.setStatusBarColor(bgColor);
                                    
                                    WindowInsetsControllerCompat insetsController = WindowCompat.getInsetsController(window, window.getDecorView());
                                    if (insetsController != null) {
                                        insetsController.setAppearanceLightNavigationBars(!isDark);
                                        insetsController.setAppearanceLightStatusBars(!isDark);
                                    }
                                }
                            } catch (Exception e) {
                                e.printStackTrace();
                            }
                        }
                    });
                }
            }, "AndroidNativeBars");
        }
    }
}
`;
  fs.writeFileSync(mainActivityPath, javaCode, 'utf8');
  console.log('✓ MainActivity.java updated with AndroidNativeBars bridge');
} else {
  console.log('Notice: MainActivity.java not found in', javaDir);
}

// 3. styles.xml: Default DayNight Theme Setup
const stylesFile = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'res', 'values', 'styles.xml');
if (fs.existsSync(stylesFile)) {
  let styles = fs.readFileSync(stylesFile, 'utf8');
  if (!styles.includes('android:navigationBarColor')) {
    styles = styles.replace(
      '<style name="AppTheme.NoActionBar" parent="Theme.AppCompat.DayNight.NoActionBar">',
      '<style name="AppTheme.NoActionBar" parent="Theme.AppCompat.DayNight.NoActionBar">\n        <item name="android:navigationBarColor">#F8F8F5</item>\n        <item name="android:windowLightNavigationBar">true</item>'
    );
    fs.writeFileSync(stylesFile, styles, 'utf8');
    console.log('✓ styles.xml updated with navigationBarColor');
  }
}

console.log('--- Customizations Complete ---');
