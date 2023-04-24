package com.netease.nim.rn.push;

import android.app.Activity;
import android.content.Intent;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.netease.nimlib.mixpush.MixPushConfig;
import com.netease.nimlib.mixpush.MixPushState;
import com.netease.nimlib.mixpush.model.MixPushToken;
import com.netease.nimlib.sdk.RNLibClient;
import com.netease.nimlib.sdk.RNLibEventHandler;
import com.netease.nimlib.sdk.RNLibOptions;

import java.util.Map;

import javax.annotation.Nullable;

public class NIMPushModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    public NIMPushModule(ReactApplicationContext reactContext) {
        super(reactContext);

        // handle new intent
        reactContext.addActivityEventListener(this);
    }

    @Override
    public String getName() {
        return "NIMPushModule";
    }


    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        return super.getConstants();
    }

    @ReactMethod
    public void toast(String message) {
        Toast.makeText(getReactApplicationContext(), message, Toast.LENGTH_SHORT).show();
    }

    @ReactMethod
    public void init(
            String xmAppId,
            String xmAppKey,
            String xmCertificateName,
            String hwAppId,
            String hwCertificateName,
            String mzAppId,
            String mzAppKey,
            String mzCertificateName,
            String fcmCertificateName,
            String vivoCertificateName,
            String oppoAppId,
            String oppoAppKey,
            String oppoAppSercet,
            String oppoCertificateName,
            final Callback tokenCallback) {

        RNLibOptions options = new RNLibOptions();

        // 1. 推送配置
        MixPushConfig pushConfig = new MixPushConfig();

        pushConfig.xmAppId = xmAppId;
        pushConfig.xmAppKey = xmAppKey;
        pushConfig.xmCertificateName = xmCertificateName;

        pushConfig.mzAppId = mzAppId;
        pushConfig.mzAppKey = mzAppKey;
        pushConfig.mzCertificateName = mzCertificateName;

        pushConfig.hwAppId = hwAppId;
        pushConfig.hwCertificateName = hwCertificateName;

        pushConfig.fcmCertificateName = fcmCertificateName;
        pushConfig.vivoCertificateName = vivoCertificateName;
        pushConfig.oppoAppId = oppoAppId;
        pushConfig.oppoAppKey = oppoAppKey;
        pushConfig.oppoAppSercet = oppoAppSercet;
        pushConfig.oppoCertificateName = oppoCertificateName;


        options.mixPushConfig = pushConfig;

        // 2. 事件回调
        options.eventHandler = new RNLibEventHandler() {
            @Override
            public void onPushToken(MixPushToken mixPushToken) {
                // 提交 token 到服务器
                if (mixPushToken != null) {
                    tokenCallback.invoke(mixPushToken.getType(), mixPushToken.getTokenName(), mixPushToken.getToken());
                }
            }
        };

        RNLibClient.init(getReactApplicationContext(), options);
    }

    @ReactMethod
    public void showNotification(String icon, String title, String content, String time) {
        Log.e(getName(), "showNotification");
        RNLibClient.showNotification(icon, title, content, time);
    }

    @ReactMethod
    public void clearAllNotification() {
        RNLibClient.clearAllNotification();
    }

    @ReactMethod
    public void onLogin(String account,
                        int pushType,
                        boolean hasPushed,
                        String lastDeviceId) {
        Log.e(getName(), "onLogin account = " + account + " pushtype = " + pushType + " haspushed = " + hasPushed + " deviceInfo = " + lastDeviceId);
        RNLibClient.onLogined(account, new MixPushState(pushType, hasPushed, lastDeviceId));

        if (getCurrentActivity() != null) {
            handleIntent(getCurrentActivity().getIntent());
        }
    }

    @ReactMethod
    public void setDeviceId(String deviceId) {
        Log.e(getName(), "setDeviceId deviceId = " + deviceId);
        RNLibClient.saveDeviceId(deviceId);
    }

    @ReactMethod
    public void getDeviceInfo(Callback callback) {
        String deviceInfo = RNLibClient.getDeviceInfo();
        callback.invoke(deviceInfo);
    }

    @ReactMethod
    public void onLogout() {
        RNLibClient.onLogout();
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {

    }

    private void handleIntent(Intent intent) {
        if (intent == null) {
            return;
        }

        RNLibClient.clearAllNotification();
    }

    @Override
    public void onNewIntent(Intent intent) {
        // new intent
        // 来自notification 或者 来自launcher点击
        if (RNLibClient.fromNotification(intent) || fromLauncher(intent)) {
            handleIntent(intent);
        }
    }

    private static boolean fromLauncher(Intent intent) {
        return intent != null
                && intent.getCategories() != null
                && intent.getCategories().contains(Intent.CATEGORY_LAUNCHER);

    }
}
