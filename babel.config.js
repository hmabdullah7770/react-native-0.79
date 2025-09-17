// const ReactCompilerConfig = {
//   target: '19' // '17' | '18' | '19'
// };



module.exports = {
  presets: ['module:@react-native/babel-preset'],

   plugins: [
         
    //  [   'babel-plugin-react-compiler', ReactCompilerConfig],
    [
      'module:react-native-dotenv',
      {
        envName: 'APP_ENV',
        moduleName: '@env',
        path: '.env',
        blocklist: null,
        allowlist: null,
        blacklist: null, // DEPRECATED
        whitelist: null, // DEPRECATED
        safe: false,
        allowUndefined: true,
        verbose: false,
      },
    ],
      'react-native-reanimated/plugin',
    // ['react-native-unistyles/plugin', 
    //    // Includes all folders like screens/, components/, etc.
     
    //   ],
  ],
};
