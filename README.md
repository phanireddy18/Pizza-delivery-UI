# exsplit-ui-mob


Install npm node module using below command

```
npm install
```

To run android on emulator run this command

```
npm run android
```

To run iOS on Simulator run this command

```
npm run ios
```

## Building Apk File

### On Windows

To build assembleDebug android apk file in windows run this command

```
npm run android-wad
```

To build assembleRelease android apk file in windows run this command

```
npm run android-war
```

To build buildRelease android apk file in windows run this command

```
npm run android-wbr
```

### On Mac

To build assembleDebug android apk file in linux run this command

```
npm run android-ad
```

To build assembleRelease android apk file in linux run this command

```
npm run android-ar
```

To build buildRelease android apk file in linux run this command

```
npm run android-br
```

# ENV files command lines
## Anroid

1.(.env) file:

To run the .env file (cross-env ENVFILE=.env react-native run-android)
use this command line  ====>   npm run anroid

2.(.env.qa) file:

To run the .env.qa file (cross-env ENVFILE=.env.qa react-native run-android)
use this command line  ====>   npm run anroid:qa

3.(.env.prod) file:

To run the .env.prod file (cross-env ENVFILE=.env.prod react-native run-android)
use this command line  ====>   npm run anroid:prod

### Ios

1.(.env) file:

To run the .env file (cross-env ENVFILE=.env react-native run-ios)
use this command line  ====>   npm run ios

2.(.env.qa) file:

To run the .env.qa file (cross-env ENVFILE=.env.qa react-native run-ios)
use this command line  ====>   npm run ios:qa

3.(.env.prod) file:

To run the .env.prod file (cross-env ENVFILE=.env.prod react-native run-ios)
use this command line  ====>   npm run ios:prod