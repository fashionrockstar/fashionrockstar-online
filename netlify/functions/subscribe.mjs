const upstream = 'https://fashionrockstar-launch.zavyer.chatgpt.site';
const reply = (data, status = 200) => Response.json(data, {
  status, headers: { 'Cache-Control': 'no-store' }
});

// Retain the original mailing-list service, consent checks, database and emails.
// Validate the visitor's origin here, then send an exact same-origin upstream request.
export default async (request) => {
  if (request.method !== 'POST') return reply({ error: 'Unsupported request.' }, 405);
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) {
    return reply({ error: 'Please submit the form from this website.' }, 403);
  }
  if (!request.headers.get('content-type')?.includes('application/json')) {
    return reply({ error: 'Unsupported request.' }, 415);
  }
  if (Number(request.headers.get('content-length') || 0) > 4096) {
    return reply({ error: 'Request too large.' }, 413);
  }
  try {
    const body = await request.text();
    if (body.length > 4096) return reply({ error: 'Request too large.' }, 413);
    const response = await fetch(upstream + '/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: upstream },
      body,
      signal: AbortSignal.timeout(15000)
    });
    return new Response(await response.text(), {
      status: response.status,
      headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
    });
  } catch {
    return reply({ error: 'Your signup could not be saved right now. Please try again shortly.' }, 503);
  }
};
