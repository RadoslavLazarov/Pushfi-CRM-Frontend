let baseUrl;

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  // dev code
  baseUrl = 'https://localhost:44375';
} else {
  // production code
  baseUrl = 'https://pushfi-api.azurewebsites.net';
}

export default baseUrl;
