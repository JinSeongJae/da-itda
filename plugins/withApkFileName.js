const { withAppBuildGradle } = require('@expo/config-plugins');

/**
 * EAS names the downloadable build artifact with a random content hash by default
 * (e.g. maJ0LA-l4iStOV_kJZilEQWkWUr1rEbbgCbNcUS5yyc.apk). This renames the actual APK
 * file produced by the Android build to "da-itda-v<version>.apk" so the artifact URL
 * (and the file if someone downloads/shares it) carries a recognizable name.
 */
module.exports = function withApkFileName(config) {
  const version = config.version ?? '1.0.0';

  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents = config.modResults.contents.replace(
        /android\s*\{/,
        `android {\n    applicationVariants.all { variant ->\n        variant.outputs.all { output ->\n            if (output.outputFile != null && output.outputFile.name.endsWith(".apk")) {\n                output.outputFileName = "da-itda-v${version}.apk"\n            }\n        }\n    }`
      );
    }
    return config;
  });
};
