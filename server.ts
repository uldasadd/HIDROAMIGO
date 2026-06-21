import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Lazy initialization of GoogleGenAI client as recommended
  let aiClient: GoogleGenAI | null = null;
  function getAiClient() {
    if (!aiClient) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        console.warn("ADVERTENCIA: GEMINI_API_KEY no configurada. El asesor virtual funcionará en modo simulado.");
        return null;
      }
      aiClient = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
    return aiClient;
  }

  // API Route: Water Quality Smart Consultant / AI Advisor
  app.post('/api/water-adviser', async (req, res) => {
    try {
      const { prompt, waterData, contextType } = req.body;
      const ai = getAiClient();

      if (!ai) {
        // Rich mock response if API key is not present, ensuring a robust local experience
        let mockResponse = "### 💧 Informe Hídrico Inteligente (Modo Simulación)\n\n*Nota: El asesor virtual se encuentra en modo local porque no se ha aportado un API Key.*\n\n";
        
        if (contextType === 'analisis') {
          const purityLevel = waterData?.purity || 94.5;
          const metalStatus = purityLevel >= 95 ? "aceptables para filtrado inicial" : "críticos que requieren purificación inmediata";
          
          mockResponse += `#### 🔍 Análisis Tecnológico de Datos
- **Pureza Registrada:** \`${purityLevel}%\`
- **Sólidos Disueltos Totales (TDS):** \`${waterData?.tds || 210} ppm\`
- **Nivel de pH:** \`${waterData?.ph || 7.2}\` (Rango Neutro)
- **Metales Pesados:** Los niveles detectados de Plomo y Arsénico están en rangos **${metalStatus}**.

#### ⚠️ Peligros para la Salud de los Metales Pesados
1. **Plomo (Pb):** Es una neurotoxina persistente. El consumo continuo puede producir problemas cardiovasculares y daños en el sistema nervioso.
2. **Arsénico (As):** Comúnmente derivado de actividades metalúrgicas o geológicas regionales. La exposición prolongada puede provocar lesiones cutáneas y toxicidad sistémica.

#### 💡 Recomendación del Sistema HIDROAMIGA
- Activar el **Ciclo de Ósmosis Inversa de 4 Estapas**.
- Al realizar este filtrado, conseguirás remover más del **99.5% de metales pesados**, devolviendo el agua a un estado 100% potable y libre de elementos tóxicos.
- Tu filtro actual está al \`${waterData?.filterLife || 85}%\` de vida útil, por lo que opera con óptimo rendimiento.`;
        } else if (contextType === 'mineria') {
          mockResponse += `` +
`#### ⛰️ Conciencia Minera e Impacto Hídrico Local

La minería de gran escala es un motor económico, pero también plantea serios desafíos ambientales para los recursos hídricos superficiales y subterráneos:

1. **Drenaje Ácido de Mina (DAM):** Ocurre cuando los minerales de sulfuro expuestos al aire y agua se oxidan, generando ácido sulfúrico que disuelve metales pesados de las rocas circundantes (como cobre, cadmio o plomo) hacia los ríos sagrados de los valles.
2. **Contaminación por Arsénico y Plomo:** Estos minerales pesados no se degradan; se bioacumulan en el suelo, en los cultivos de riego y finalmente en la cadena alimenticia de las poblaciones rurales.
3. **Escasez Hídrica Directa:** Los procesos de concentración de mineral requieren cantidades masivas de agua por segundo, lo que desplaza el agua superficial destinada a la agricultura local y consume las reservas glaciares de la cordillera.

#### 🛡️ Cómo Protegernos con Tecnología de Filtrado
- **Carbón Activado Granular:** Retiene gases disueltos, cloro y compuestos orgánicos volátiles.
- **Membrana de Ósmosis Inversa:** Es la barrera física más potente. Sus poros de 0.0001 micrones retienen hasta el **99.9% de los metales pesados e iones disueltos** como plomo, arsénico, mercurio y cobre residuales.`;
        } else {
          mockResponse += `` +
`#### 🌿 Consejos para Mitigar el Desgaste de Agua
- **Duchas de 5 Minutos:** Reducir la ducha de 10 a 5 minutos ahorra de media **40 litros de agua por día**.
- **Cierre del Grifo al Cepillarse:** Evita el desperdicio de 12 litros por minuto.
- **Detección de Fugas:** Un grifo que gotea pierde hasta 30 litros diarios. ¡Repáralo de inmediato!`;
        }
        return res.json({ text: mockResponse });
      }

      let systemInstruction = "Eres un Asesor Científico experto en hidrología y purificación de agua llamado 'Asesor HIDROAMIGA AI'. Tu lenguaje de comunicación debe ser español formal de Latinoamérica. Ayuda al usuario con opiniones rigurosas pero amables, ilustrando siempre conceptos prácticos. Usa viñetas o listas en markdown, y proporciona números claros.";
      
      let contents = prompt;
      if (contextType === 'analisis' && waterData) {
        contents = `Aquí tienes las mediciones en tiempo real del filtro físico para analizar:
- Pureza: ${waterData.purity}%
- Sólidos Disueltos (TDS): ${waterData.tds} ppm
- pH: ${waterData.ph}
- Turbidez: ${waterData.turbidity} NTU
- Metales Pesados: Plomo (${waterData.metals.lead} mg/L), Arsénico (${waterData.metals.arsenic} mg/L), Cobre (${waterData.metals.copper} mg/L), Mercurio (${waterData.metals.mercury} mg/L)
- Vida útil del filtro: ${waterData.filterLife}%

Consulta del usuario: ${prompt || 'Analiza detallada e inteligentemente estas métricas de pureza, señalando el peligro de los metales pesados en la salud y explicando cómo el filtro ayuda a normalizarlos.'}`;
      } else if (contextType === 'mineria') {
        contents = `Consulta sobre el impacto de la minería en los ecosistemas locales y el agua: ${prompt}. Explica de forma científica pero clara cómo ocurre la contaminación de napas por metales pesados (plomo, arsénico) debido a la minería o la erosión natural, y cómo las tecnologías domésticas de microfiltración por ósmosis y carbón activado asisten a las familias ante la escasez y contaminación hídrica.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents,
        config: {
          systemInstruction,
        }
      });

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Error al procesar Gemini en servidor:", error);
      res.status(500).json({ error: "Ocurrió un error con el HidroAsesor AI.", details: error.message });
    }
  });

  // Serve static UI assets and handle dev/production integration
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
