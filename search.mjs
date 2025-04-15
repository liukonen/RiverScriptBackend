export async function getInfo(request) {
    try {
      const response = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(request)}&format=json&kp=-2`);
      if (!response.ok) throw new Error("DuckDuckGo API error");
  
      const result = await response.json();
  
      if (result.AbstractText) {
        return `DuckDuckGo says: ${result.AbstractText}`;
      }
  
      if (result.AbstractURL) {
        return `Try this from ${result.AbstractSource}: ${result.Heading} — ${result.AbstractURL}`;
      }
  
      return "Sorry, I couldn't find anything useful.";
    } catch (error) {
      console.error("DuckDuckGo fetch failed:", error);
      return "Sorry, I'm having a bit of a headache right now.";
    }
  }