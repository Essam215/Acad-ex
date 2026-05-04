// AI Client targeting OCR.space and Groq
const OCR_API_KEY = process.env.REACT_APP_OCR_API_KEY;
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

// 1. Extract Text from PDF
export async function extractTextFromPDF(pdfUrl) {
  try {
    // Fetch the local PDF file as a blob
    const response = await fetch(pdfUrl);
    if (!response.ok) throw new Error("Could not fetch the PDF file.");
    const blob = await response.blob();

    // Check if filename suggests Arabic
    const isArabic = pdfUrl.toLowerCase().includes('arabic');
    const language = isArabic ? 'ara' : 'eng';

    // Prepare form data for OCR.space
    const formData = new FormData();
    formData.append('file', blob, 'document.pdf');
    formData.append('language', language);
    formData.append('isOverlayRequired', 'false');
    formData.append('OCREngine', '2'); // Engine 2 is better for scanned documents and most languages
    formData.append('isTable', 'true'); // Helps with text layout

    const ocrResponse = await fetch('https://api.ocr.space/parse/image', {
      method: 'POST',
      headers: {
        'apikey': OCR_API_KEY,
      },
      body: formData
    });

    const ocrData = await ocrResponse.json();

    if (ocrData.IsErroredOnProcessing) {
      const msg = ocrData.ErrorMessage ? ocrData.ErrorMessage[0] : 'OCR Processing failed';
      throw new Error(msg);
    }

    if (!ocrData.ParsedResults || ocrData.ParsedResults.length === 0) {
      // Sometimes Engine 2 fails on certain files, fallback to Engine 1 if no results
      console.warn("OCR Engine 2 returned no results, check if file is too large or complex.");
      throw new Error("No text could be extracted. The PDF might be too large (max 5MB for free tier) or the image quality is too low.");
    }

    // Combine all pages
    const extractedText = ocrData.ParsedResults.map(p => p.ParsedText).join('\n\n');
    
    if (!extractedText.trim()) {
      throw new Error("The PDF was scanned but no readable text was found inside.");
    }

    return extractedText;

  } catch (err) {
    console.error("OCR Extraction Error:", err);
    throw err;
  }
}

// 2. Query Groq
export async function queryGroq(prompt, extractedText, mode = 'summary') {
  try {
    const systemPrompt = `You are a strict, highly accurate AI teacher. 
You will be given raw, possibly messy text extracted via OCR from a student's textbook PDF.
Your job is to generate study materials based ONLY on the provided text. Do not make up external facts.`;

    // Depending on what we want to generate
    let taskPrompt = prompt;
    if (mode === 'quiz') {
      taskPrompt = `Based on the following text, generate a 5-question multiple choice quiz. 
Return ONLY a valid JSON array of objects, with NO surrounding markdown formatting. 
Each object must have exactly this shape: 
{"question": "...", "options": ["...", "...", "...", "..."], "answer": "exact correct option string"}\n\nTEXT:\n${extractedText}`;
    } else if (mode === 'flashcards') {
      taskPrompt = `Based on the following text, select 6 key concepts and generate flashcards. 
Return ONLY a valid JSON array of objects, with NO surrounding markdown formatting. 
Each object must have exactly this shape: 
{"front": "Concept/Question", "back": "Definition/Answer"}\n\nTEXT:\n${extractedText}`;
    } else if (mode === 'summary') {
      taskPrompt = `Based on the following text, provide a concise but comprehensive summary. Use bullet points and headers. Format as clean Markdown.\n\nTEXT:\n${extractedText}`;
    }

    const payload = {
      model: "llama3-70b-8192", // We use 70b for better reasoning
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: taskPrompt }
      ],
      temperature: 0.2, // Low temperature for factual accuracy
    };

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      throw new Error(`Groq API Error: ${errorText}`);
    }

    const result = await groqResponse.json();
    let content = result.choices[0].message.content.trim();

    // If JSON modes, attempt to parse
    if (mode === 'quiz' || mode === 'flashcards') {
      // Strip out markdown code blocks if the AI accidentally added them
      content = content.replace(/^```(json)?/, '').replace(/```$/, '').trim();
      try {
        return JSON.parse(content);
      } catch (e) {
        console.error("Failed to parse Groq JSON output:", content);
        throw new Error("AI returned malformed data. Try generating again.");
      }
    }

    return content;

  } catch (err) {
    console.error("Groq Gen Error:", err);
    throw err;
  }
}
