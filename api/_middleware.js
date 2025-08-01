export default function middleware(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://mjo-at-github.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  return res;
}