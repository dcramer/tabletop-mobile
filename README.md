# Contributing

Probably the setup instructions:

- Install Xcode
- Install iOS Simulator (Xcode -> Preferences -> Components)
- Install Cocoapods (``brew install cocoapods``)
- Install Watchman (``brew install watchman``)
- Configure build settings in Xcode: https://github.com/facebook/react-native/issues/11265#issuecomment-312155357
- ``cd ios && pod install``
- ``yarn install``
- ``yarn run ios``

Probably gucci.

You can also split up Metro (aka webpack) and simulator:

- ``yarn start`` -- starts metro compiler in the foreground)
- ``react-native run-ios`` - starts the simulator and runs the app
