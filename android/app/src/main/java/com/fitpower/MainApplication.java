package com.fitpower;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.amazonaws.RNAWSCognitoPackage;
import com.rusel.RCTBluetoothSerial.RCTBluetoothSerialPackage;
import com.polidea.reactnativeble.BlePackage;
import com.rusel.RCTBluetoothSerial.RCTBluetoothSerialPackage;
import com.polidea.reactnativeble.BlePackage;
import com.amazonaws.RNAWSCognitoPackage;
import com.amazonaws.RNAWSCognitoPackage;
import com.amazonaws.RNAWSCognitoPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.nozbe.watermelondb.WatermelonDBPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNAWSCognitoPackage(),
          new WatermelonDBPackage(),
            new RCTBluetoothSerialPackage(),
            new BlePackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);
  }
}
