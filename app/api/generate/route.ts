import { Groq } from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

export async function POST(req: Request) {
  try {
    const { systemDescription, detailLevel = 'balanced' } = await req.json()

    if (!systemDescription || systemDescription.trim().length === 0) {
      return Response.json(
        { error: 'System description is required' },
        { status: 400 }
      )
    }

    // Generate all outputs in parallel with structured prompts
    const [architectureResponse, schemaResponse, scalingResponse, apiResponse] =
      await Promise.all([
        generateArchitecture(systemDescription, detailLevel),
        generateDBSchema(systemDescription, detailLevel),
        generateScalingPlan(systemDescription, detailLevel),
        generateAPIStructure(systemDescription, detailLevel),
      ])

    return Response.json({
      architecture: architectureResponse,
      dbSchema: schemaResponse,
      scalingPlan: scalingResponse,
      apiStructure: apiResponse,
    })
  } catch (error: any) {
    console.error('API Error:', error)
    return Response.json(
      { error: error.message || 'Failed to generate design' },
      { status: 500 }
    )
  }
}

async function callGroq(systemPrompt: string, userPrompt: string, detailLevel: string = 'balanced'): Promise<string> {
  try {
    const detailInstruction = {
      concise: 'Keep response concise and brief (50% shorter).',
      balanced: 'Provide a balanced, comprehensive response.',
      detailed: 'Provide a detailed, comprehensive response with all nuances.',
    }[detailLevel] || 'Provide a balanced, comprehensive response.'

    const message = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 2048,
      messages: [
        {
          role: 'system',
          content: 'You are an expert system architect and API designer.',
        },
        {
          role: 'user',
          content: `${systemPrompt}\n\n${detailInstruction}\n\n${userPrompt}`,
        },
      ],
    })

    const textContent = message.choices[0]?.message?.content
    if (!textContent) {
      throw new Error('No response from Groq API')
    }
    
    return textContent
  } catch (error: any) {
    console.error('Groq API Error:', error)
    throw new Error(`Groq API error: ${error.message}`)
  }
}

async function generateArchitecture(description: string, detailLevel: string): Promise<string> {
  const systemPrompt = `Generate ONLY a Mermaid flowchart diagram. No explanations, no markdown, just the diagram code.

Rules:
1. Start with "graph TD" or "graph LR"
2. Use short node names: Frontend, API, Service1, DB, Cache, Queue
3. Connect nodes with -->
4. Use quotes for labels with spaces: ["My Service"]
5. Keep it simple with 6-8 nodes max

Example:
graph TD
    A["Web Frontend"]
    B["API Gateway"]
    C["Auth Service"]
    D["Database"]
    E["Cache"]
    A --> B
    B --> C
    B --> D
    D --> E`

  return callGroq(systemPrompt, `Create a Mermaid architecture diagram for: ${description}`, detailLevel)
}

async function generateDBSchema(description: string, detailLevel: string): Promise<string> {
  const systemPrompt = `You are an expert database designer. Generate a normalized SQL database schema with:
- 6-10 core tables relevant to the system
- Primary keys, foreign keys, and indexes
- Data types and constraints
- Relationships between tables
Return ONLY valid SQL DDL statements (CREATE TABLE, CREATE INDEX).`

  return callGroq(systemPrompt, `Design the database schema for: ${description}`, detailLevel)
}

async function generateScalingPlan(description: string, detailLevel: string): Promise<string> {
  const systemPrompt = `You are a scaling and DevOps expert. Generate a detailed scaling plan with:
- Load balancing strategy (horizontal/vertical)
- Database replication and sharding approach
- Caching strategy
- CDN distribution plan
- Potential bottlenecks and mitigation
- Cost optimization tips
Keep it concise but comprehensive.`

  return callGroq(systemPrompt, `Create a scaling plan for: ${description}`, detailLevel)
}

async function generateAPIStructure(description: string, detailLevel: string): Promise<string> {
  const systemPrompt = `You are a REST API designer. Generate a JSON structure representing OpenAPI 3.0 endpoints for the system. Include:
- 8-12 core endpoints (GET, POST, PUT, DELETE)
- Request and response schemas
- Authentication method (Bearer token)
- Rate limiting info
- Error codes
Return valid JSON formatted as a simple API spec (not full OpenAPI, but structured endpoint list).`

  return callGroq(systemPrompt, `Design the API structure for: ${description}`, detailLevel)
}
