// Simple health check for Docker
const http = require('http');

const options = {
  hostname: 'localhost',
  port: process.env.PORT || 3001,
  path: '/graphql',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 3000,
};

const req = http.request(options, (res) => {
  if (res.statusCode === 200 || res.statusCode === 400) {
    // 400 es OK para GraphQL sin query
    process.exit(0);
  } else {
    process.exit(1);
  }
});

req.on('error', () => {
  process.exit(1);
});

req.on('timeout', () => {
  req.destroy();
  process.exit(1);
});

// Simple ping query
req.write(JSON.stringify({
  query: '{ __schema { queryType { name } } }'
}));

req.end();