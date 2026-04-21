// A simple Cache to save API calls
const getCache = () => JSON.parse(localStorage.getItem('lang_cache')) || {};
const setCache = (cache) => localStorage.setItem('lang_cache', JSON.stringify(cache));

export const translateText = async (text, targetLang) => {
  // If English, just return the text
  if (targetLang === 'en') return text;

  const cache = getCache();
  const cacheKey = `${text}_${targetLang}`;

  // Check if we already translated this!
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  try {
    // Replace with your actual Google Translate API Key
    const API_KEY = 'YOUR_GOOGLE_API_KEY';
    const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: text,
        target: targetLang,
        format: 'text'
      })
    });

    const data = await response.json();
    const translatedText = data.data.translations[0].translatedText;

    // Save to cache for next time
    cache[cacheKey] = translatedText;
    setCache(cache);

    return translatedText;

  } catch (error) {
    console.error("Translation Error:", error);
    return text; // Fallback to English if the API fails
  }
};