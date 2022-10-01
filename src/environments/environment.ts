// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  //baseUrl: 'http://a19f4e6281ad.ngrok.io',
 // baseUrl: 'https://ekmatra.store',
  baseUrl: 'https://staging-api.ekmatra.store/rest',
  //baseUrl:   'http://128.199.17.123:3001',
  // baseUrl:   'http://localhost:3001',
  // baseUrl: 'http://167.71.226.208:3001',
  //baseUrl: 'http://13.235.54.240/rest',
  videoUrl: 'http://128.199.17.123:3001',
  // videoUrl: 'http://localhost:3001',
  // videoUrl: 'http://167.71.226.208:3001',
  //baseUrl: 'https://1f4eb57dea7d.ngrok.io',
  adminUrl: 'http://128.199.17.123:3001',
  AssetsUrl: 'http://128.199.17.123:3001',
  encryptionKey: 'x90dh!2$bs',
 // appName: "Ek Matra",
 appName:'EKMATRA TECHNOLOGY PRIVATE LIMITED',
  appConfig: {
    currency: {
      code: 'INR',
      symbol: '₹'
    },
    defaultPageSize: 10
  },
  razorpay: {
    RAZORPAY_KEY_HERE: "",
  }
};
