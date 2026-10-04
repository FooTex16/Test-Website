const GAS_ENDPOINT_URL =
  'https://script.google.com/macros/s/AKfycbzKdfd9BvndyAVd_9CzdFt3vX3Rk37iGLqwkCPCVO8sQmiLNRtaVqzdsON66tJH2T92/exec';

export default async function handler(req: any, res: any) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const action = req.body?.action || req.query?.action || 'status';
    const username = req.body?.username || req.query?.username || '';
    const password = req.body?.password || req.query?.password || '';

    // Forward to Google Apps Script via POST (since GAS doPost is the active handler)
    const targetUrl = new URL(GAS_ENDPOINT_URL);
    targetUrl.searchParams.set('action', action);
    if (username) targetUrl.searchParams.set('username', username);
    if (password) targetUrl.searchParams.set('password', password);

    const gasResponse = await fetch(targetUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action, username, password }),
      redirect: 'follow',
    });

    const rawText = await gasResponse.text();
    let jsonResult: any;

    try {
      jsonResult = JSON.parse(rawText);
    } catch {
      const isOk =
        rawText.toLowerCase().includes('success') ||
        rawText.toLowerCase().includes('berhasil');
      jsonResult = {
        status: isOk ? 'success' : 'info',
        message: rawText.replace(/<[^>]*>?/gm, '').trim() || (isOk ? 'Operasi berhasil' : rawText),
      };
    }

    return res.status(200).json(jsonResult);
  } catch (err: any) {
    console.error('GAS Relay API error:', err);
    return res.status(500).json({
      status: 'error',
      message: err.message || 'Gagal menyambung ke server Google Sheets',
    });
  }
}
