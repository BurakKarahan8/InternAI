module.exports = function(api) {
  api.cache(true); // Babel'in cache mekanizmasını kullanmasını sağlar
  return {
    presets: ['babel-preset-expo'], // Expo'nun varsayılan Babel preset'i
    plugins: [
      [
        'module:react-native-dotenv', // react-native-dotenv plugin'i
        {
          moduleName: '@env',         // Değişkenlere erişim için kullanılacak import adı (örn: import ... from '@env')
          path: '.env',             // .env dosyasının yolu (kök dizin)
          blacklist: null,
          whitelist: null,
          safe: false,
          allowUndefined: true,     // Tanımlanmamış .env değişkenlerine izin ver (false yaparsanız hata alırsınız)
        },
      ],
      // Gelecekte başka Babel plugin'leri eklerseniz buraya gelecek
    ],
  };
};