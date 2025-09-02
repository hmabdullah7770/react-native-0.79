const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {wrapWithAudioAPIMetroConfig} = require('react-native-audio-api/metro-config');

const baseConfig = mergeConfig(getDefaultConfig(__dirname), {
  resolver: {
    unstable_enablePackageExports: false,
  },
});

module.exports = wrapWithAudioAPIMetroConfig(baseConfig);



// const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

// /**
//  * Metro configuration
//  * https://reactnative.dev/docs/metro
//  *
//  * @type {import('@react-native/metro-config').MetroConfig}
//  * 
//  */


// const {
//   wrapWithAudioAPIMetroConfig,
// } = require('react-native-audio-api/metro-config');
// const config = {
//     //doing this only redux saga
//     // Add the resolver configuration here
//   resolver: {
//     unstable_enablePackageExports: false, // <--- Add this line
//   },
// };

// module.exports = mergeConfig(getDefaultConfig(__dirname), config);
// module.exports = wrapWithAudioAPIMetroConfig(config);
