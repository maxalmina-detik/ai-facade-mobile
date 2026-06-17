import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Lazy-loaded Gemini AI client helper to secure API keys
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. AI functionality will fallback to offline mock responses.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// ======================== API ROUTES ========================

// 1. Ask detikAI Endpoint
app.post("/api/chat", async (req: Request, res: Response) => {
  try {
    const { messages, articleTitle, articleContent } = req.body;
    const client = getGeminiClient();

    if (!client) {
      // Graceful offline fallback
      const lastMsg = messages[messages.length - 1]?.text || "";
      return res.json({
        text: `[Offline Mode] Halo! Terima kasih atas pertanyaan Anda tentang "${articleTitle || "detikcom"}". (Konfigurasikan GEMINI_API_KEY di Secrets untuk mendapatkan analisis berita lengkap ricih bertenaga AI).\n\nAnda bertanya: "${lastMsg}"`
      });
    }

    const contextArticle = articleTitle 
      ? `Artikel Berita Terbuka saat ini:\nJudul: ${articleTitle}\nKonten: ${articleContent}\n\n`
      : "";

    const parsedMessages = messages.map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    // Inject system instructions and state context
    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          role: "user",
          parts: [{
            text: `Anda adalah "detikAI", asisten cerdas AI berita interaktif resmi dari portal terkemuka detikcom.
Tugas Anda:
1. Menjawab pertanyaan pengguna dengan gaya jurnalis yang cerdas, berwawasan luas, aktual, ramah, dan ringkas.
2. Gunakan bahasa Indonesia yang santun, kasual tapi profesional, diselingi sedikit istilah populer jika perlu.
3. Gunakan data artikel berita yang sedang dibaca pengguna apabila relevan.

${contextArticle}
Berikut adalah histori percakapan sebelumnya dan masukan pesan baru dari pengguna:`
          }]
        },
        ...parsedMessages
      ]
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("detikAI Chat Error:", error);
    res.status(500).json({ error: "Gagal memproses permintaan detikAI.", details: error.message });
  }
});

// 2. Article Summarization Endpoint ("Terangkum Kilat")
app.post("/api/summarize", async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    const client = getGeminiClient();

    if (!client) {
      // Graceful offline fallback
      return res.json({
        summary: [
          `Fasilitas JPO Lenteng Agung penting bagi penyandang disabilitas dan kelompok rentan lainnya.`,
          `Bina Marga DKI Jakarta mengonfirmasi adanya pemotongan kabel lift secara sengaja oleh pelaku tak dikenal.`,
          `Pramono Anung mendesak investigasi mendalam agar pelaku ditindak tegas dan kenyamanan warga pulih.`
        ]
      });
    }

    const prompt = `Silakan baca artikel berita berikut dan berikan ringkasan poin-poin penting terbaik dalam Bahasa Indonesia.
Berikan tepat 3 poin ringkasan yang paling menarik, tajam, padat, dan mudah dibaca (kurang dari 25 kata per poin).

Judul: ${title}
Konten: ${typeof content === 'string' ? content : content?.join('\n')}

Format JSON output yang diharapkan:
[
  "poin ringkasan kesatu...",
  "poin ringkasan kedua...",
  "poin ringkasan ketiga..."
]`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const summaryText = response.text || "[]";
    const summaryParsed = JSON.parse(summaryText);
    res.json({ summary: summaryParsed });
  } catch (error: any) {
    console.error("Summarization Error:", error);
    res.json({
      summary: [
        `Gagal memuat rangkuman otomatis AI secara penuh.`,
        `Tetapi Anda dapat terus membaca konten artikel lengkap di bawah.`,
        `Hubungkan kunci API Gemini Anda di Secrets panel.`
      ]
    });
  }
});

// 3. Milidetik Insights Generation ("Milidetik - Kabar Singkat Berwawasan AI")
app.post("/api/insights", async (req: Request, res: Response) => {
  try {
    const { topic } = req.body;
    const client = getGeminiClient();

    if (!client) {
      return res.json({
        insights: [
          {
            title: "Revolusi AI Skincare",
            summary: "Teknologi computer vision AI kini mampu membaca indeks pigmentasi kulit dari kamera ponsel dalam hitungan detik, memudahkan personalisasi skincare retail.",
            tag: "Tekno",
            readTime: "1 mnt baca"
          },
          {
            title: "Masa Depan Tim Apple pasca-Cook",
            summary: "Apple diramalkan akan memperluas fokus ke ranah Wearables dengan sensor medis non-invasif tercanggih di bawah kepemimpinan suksesor baru.",
            tag: "Bisnis",
            readTime: "2 mnt baca"
          },
          {
            title: "Piala Dunia 2026 & Generasi Emas",
            summary: "Lamine Yamal memimpin pilar serangan muda Spanyol dengan statistik akurasi umpan silang 84% di liga global.",
            tag: "Sport",
            readTime: "2 mnt baca"
          }
        ]
      });
    }

    const prompt = `Hasilkan 3 tren insight berita singkat yang bertenaga AI (disebut "Milidetik Insights") mengenai topik terbaru: ${topic || "Teknologi & Gaya Hidup Modern"}.
Setiap item harus bernada analitis, profesional, segar, dan sangat informatif bagi pembaca eksekutif detikcom.

Format output wajib berupa JSON array dengan struktur berikut:
[
  {
    "title": "Judul Insight Singkat",
    "summary": "Analisis tajuk 1-2 kalimat mengenai apa arti tren terbaru ini bagi masa depan.",
    "tag": "Satu kata Kategori (misal: Tekno, Bisnis, Sport, Gaya)",
    "readTime": "x mnt baca"
  }
]`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsedInsights = JSON.parse(response.text || "[]");
    res.json({ insights: parsedInsights });
  } catch (error: any) {
    console.error("Milidetik Insights Error:", error);
    res.status(500).json({ error: "Gagal memproses tren insight." });
  }
});

// ======================== STATIC & DEV VITE BUILD SERVER ========================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite dev server mounted as middleware");
  } else {
    // Serve static files in production environment from dist folder
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Static file server running from: " + distPath);
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running beautifully on http://localhost:${PORT}`);
  });
}

startServer();
