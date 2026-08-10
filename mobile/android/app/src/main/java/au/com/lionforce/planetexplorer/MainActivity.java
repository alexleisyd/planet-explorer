package au.com.lionforce.planetexplorer;

import android.os.Build;
import android.os.Bundle;
import android.view.WindowManager;

import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;

import com.getcapacitor.BridgeActivity;

/**
 * The game is the whole screen. It already has its own hide-HUD control and a
 * black sky, so there is nothing a status bar or a navigation bar can add —
 * both are hidden and stay hidden.
 *
 * Set in code rather than in the theme on purpose: the manifest launches this
 * activity with the splash theme, and whether `postSplashScreenTheme` has been
 * applied by the time the window exists depends on the splash plugin being
 * installed. Doing it here holds regardless of which theme won.
 */
public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        /* Draw into the display cutout. This is what makes the WebView report a
           real env(safe-area-inset-*) on a notched phone, which the HUD folds
           into --edgeT/--edgeB/--edgeL/--edgeR; without it the notch is letter-
           boxed away and the game loses the strip of screen beside it. */
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
            getWindow().getAttributes().layoutInDisplayCutoutMode =
                WindowManager.LayoutParams.LAYOUT_IN_DISPLAY_CUTOUT_MODE_SHORT_EDGES;
        }
        goImmersive();
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        /* A swipe from an edge, a permission dialog, or returning from the
           recents screen all bring the bars back. Put them away again on the
           way in rather than trusting them to stay gone. */
        if (hasFocus) goImmersive();
    }

    private void goImmersive() {
        WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        WindowInsetsControllerCompat controller =
            WindowCompat.getInsetsController(getWindow(), getWindow().getDecorView());
        controller.hide(WindowInsetsCompat.Type.systemBars());
        /* Transient, by swipe: a game that eats a system gesture to get its bars
           back is a game you cannot leave. */
        controller.setSystemBarsBehavior(
            WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
    }
}
