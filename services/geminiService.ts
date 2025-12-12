import { GoogleGenAI, Type } from "@google/genai";
import { AttackGraphData, Vulnerability } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const checkApiKey = (): boolean => {
  return !!apiKey;
};

// Simulation fallback in case API key is missing or fails, to ensure UI demo works
const MOCK_ATTACK_GRAPH: AttackGraphData = {
  nodes: [
    { id: '1', label: 'Public Web', type: 'entry', x: 50, y: 50, riskScore: 2 },
    { id: '2', label: 'Nginx 1.18', type: 'system', x: 50, y: 150, riskScore: 4 },
    { id: '3', label: 'CVE-2021-23017', type: 'vuln', x: 150, y: 250, riskScore: 9 },
    { id: '4', label: 'App Server', type: 'system', x: 50, y: 350, riskScore: 5 },
    { id: '5', label: 'Log4j Vuln', type: 'vuln', x: -50, y: 250, riskScore: 10 },
    { id: '6', label: 'DB Cluster', type: 'target', x: 50, y: 450, riskScore: 8 },
  ],
  links: [
    { source: '1', target: '2', method: 'HTTP Request' },
    { source: '2', target: '3', method: 'Buffer Overflow' },
    { source: '2', target: '5', method: 'JNDI Lookup' },
    { source: '3', target: '4', method: 'RCE' },
    { source: '5', target: '4', method: 'Shell Access' },
    { source: '4', target: '6', method: 'Data Exfiltration' },
  ],
  totalRiskScore: 85,
  pathCount: 2,
  criticalCve: 'CVE-2021-44228'
};

export const generateAttackSurface = async (domain: string, stack: string[]): Promise<AttackGraphData> => {
  if (!apiKey) {
    console.warn("No API Key, returning mock data");
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate delay
    return MOCK_ATTACK_GRAPH;
  }

  try {
    const prompt = `
      You are a red team specialist. Analyze the target: ${domain} running on ${stack.join(', ')}.
      Generate a hypothetical attack graph.
      Return a JSON object with:
      1. nodes: array of objects {id, label, type (entry|vuln|system|target), x (number -100 to 100), y (number 0 to 500), riskScore (1-10)}.
      2. links: array of objects {source (id), target (id), method}.
      3. totalRiskScore: number (0-100).
      4. pathCount: number.
      5. criticalCve: string (e.g. CVE-YYYY-NNNN).
      
      Arrange x/y coordinates so the graph flows from top (y=0) to bottom (y=500).
      Do not include markdown code blocks.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            nodes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  label: { type: Type.STRING },
                  type: { type: Type.STRING },
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                  riskScore: { type: Type.NUMBER },
                }
              }
            },
            links: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  source: { type: Type.STRING },
                  target: { type: Type.STRING },
                  method: { type: Type.STRING },
                }
              }
            },
            totalRiskScore: { type: Type.NUMBER },
            pathCount: { type: Type.NUMBER },
            criticalCve: { type: Type.STRING },
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AttackGraphData;
    }
    throw new Error("Empty response");
  } catch (error) {
    console.error("Gemini Gen Error", error);
    return MOCK_ATTACK_GRAPH;
  }
};

export const generateDefenses = async (attackGraph: AttackGraphData): Promise<Vulnerability[]> => {
  if (!apiKey) {
     // Mock Data
    return [
      {
        id: 'v1',
        cveId: attackGraph.criticalCve || 'CVE-2023-XXXX',
        name: 'Critical RCE Vulnerability',
        severity: 'high',
        description: 'Remote Code Execution possible via unauthenticated header injection.',
        mitigation: ['Upgrade library to v2.4+', 'Apply WAF rule #4092'],
        compliance: ['ISO 27001 A.12.6', 'PCI DSS 6.1']
      },
      {
        id: 'v2',
        cveId: 'CVE-2024-0012',
        name: 'Misconfigured Access Control',
        severity: 'medium',
        description: 'Internal API endpoint accessible from public gateway.',
        mitigation: ['Implement strict ACLs', 'Rotate API keys'],
        compliance: ['NIST SP 800-53 AC-3']
      }
    ];
  }

  try {
    const prompt = `
      Based on this attack graph summary: Critical CVE ${attackGraph.criticalCve}, Total Risk ${attackGraph.totalRiskScore}.
      Generate a list of 3 specific defensive mitigations.
      Return JSON: array of objects {id, cveId, name, severity (high/medium/low), description, mitigation (string array), compliance (string array like ISO/NIST)}.
    `;
    
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json'
        }
    });
    
    return JSON.parse(response.text || '[]') as Vulnerability[];

  } catch (e) {
      return [];
  }
};

export const chatWithExpert = async (message: string, history: {role: string, parts: {text: string}[]}[]): Promise<string> => {
    if (!apiKey) {
        return "I am operating in offline simulation mode. Please configure an API KEY to access the real-time Gemini expert.";
    }

    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            history: [
                {
                    role: 'user',
                    parts: [{text: "You are 'Intell_dragonfly AI', a cybersecurity expert. Provide professional, technical, and concise answers. Always cite MITRE ATT&CK IDs or CVEs where relevant. Use a serious, command-line style tone."}]
                },
                {
                    role: 'model',
                    parts: [{text: "ACKNOWLEDGED. INTELL_DRAGONFLY EXPERT SYSTEMS ONLINE. READY FOR INQUIRY."}]
                },
                ...history
            ]
        });

        const result = await chat.sendMessage(message);
        return result.text;
    } catch (error) {
        console.error("Chat Error", error);
        return "CONNECTION INTERRUPTED. RETRYING...";
    }
}
