// Vercel serverless function. The API key remains on the server and no text is persisted.
export default async function handler(request, response) {
  if (request.method !== 'POST') return response.status(405).json({ error: 'Method not allowed.' });
  if (!process.env.OPENAI_API_KEY) return response.status(500).json({ error: 'Server is missing OPENAI_API_KEY.' });

  const { letter, department = 'General', tone = 'Professional', language = 'English' } = request.body || {};
  if (!letter || !letter.trim()) return response.status(400).json({ error: 'Please enter an official letter first.' });
  if (letter.length > 30000) return response.status(400).json({ error: 'Please limit the letter to 30,000 characters.' });
  if (language !== 'English') return response.status(400).json({ error: `${language} support is coming soon. Please select English.` });

  const prompt = `You are an expert Government Correspondence Officer.\n\nConvert the following Official Letter into a proper Government Demi-Official Letter.\n\nRules:\n\nDo not change the meaning.\n\nMake it more personal.\n\nMaintain official dignity.\n\nUse proper D.O. letter language.\n\nKeep important dates.\n\nKeep reference numbers.\n\nKeep names.\n\nUse courteous Government English.\n\nOutput only the D.O. Letter.\n\nDepartment: ${department}\nTone: ${tone}\n\nOfficial Letter:\n\n${letter.trim()}`;
  try {
    const ai = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'gpt-4.1-mini', input: prompt, temperature: 0.35 })
    });
    const payload = await ai.json();
    if (!ai.ok) throw new Error(payload?.error?.message || 'OpenAI request failed.');
    const result = payload.output_text || payload.output?.flatMap(item => item.content || []).map(part => part.text || '').join('');
    if (!result) throw new Error('The AI did not return a letter. Please try again.');
    response.status(200).json({ letter: result.trim() });
  } catch (error) {
    response.status(502).json({ error: error.message || 'Could not generate the D.O. letter.' });
  }
}

