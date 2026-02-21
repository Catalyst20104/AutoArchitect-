const TOGETHER_API_KEY = process.env.TOGETHER_API_KEY
const TOGETHER_API_URL = 'https://api.together.ai/v1/chat/completions'

export async function POST(req: Request) {
  try {
    const { systemDescription } = await req.json()

    if (!systemDescription || systemDescription.trim().length === 0) {
      return Response.json(
        { error: 'System description is required' },
        { status: 400 }
      )
    }

    // Generate all outputs in parallel with structured prompts
    const [architectureResponse, schemaResponse, scalingResponse, apiResponse] =
      await Promise.all([
        generateArchitecture(systemDescription),
        generateDBSchema(systemDescription),
        generateScalingPlan(systemDescription),
        generateAPIStructure(systemDescription),
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

async function callTogetherAI(systemPrompt: string, userPrompt: string): Promise<string> {
  const response = await fetch(TOGETHER_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${TOGETHER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'meta-llama/Llama-3-70b-chat-hf',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2048,
      top_p: 0.9,
      top_k: 50,
      repetition_penalty: 1.0,
    }),
  })

  if (!response.ok) {
    throw new Error(`Together AI API error: ${response.statusText}`)
  }

  const data = await response.json()
  return data.choices[0].message.content || ''
}

async function generateArchitecture(description: string): Promise<string> {
  const systemPrompt = `You are an expert system architect. Generate a Mermaid diagram in flowchart format showing the system architecture. Include:
- Frontend services (Web, Mobile, Admin Dashboard)
- API Gateway/Load Balancer
- Microservices (list 4-6 relevant ones)
- Databases (specify which service uses which DB)
- Cache layers (Redis/Memcached)
- Message queues (RabbitMQ, Kafka)
- CDN and external integrations
Return ONLY valid Mermaid flowchart syntax, starting with 'graph TD' or 'graph LR'.`

  return callTogetherAI(systemPrompt, `Design the system architecture for: ${description}`)
}

async function generateDBSchema(description: string): Promise<string> {
  const systemPrompt = `You are an expert database designer. Generate a normalized SQL database schema with:
- 6-10 core tables relevant to the system
- Primary keys, foreign keys, and indexes
- Data types and constraints
- Relationships between tables
Return ONLY valid SQL DDL statements (CREATE TABLE, CREATE INDEX).`

  return callTogetherAI(systemPrompt, `Design the database schema for: ${description}`)
}

async function generateScalingPlan(description: string): Promise<string> {
  const systemPrompt = `You are a scaling and DevOps expert. Generate a detailed scaling plan with:
- Load balancing strategy (horizontal/vertical)
- Database replication and sharding approach
- Caching strategy
- CDN distribution plan
- Potential bottlenecks and mitigation
- Cost optimization tips
Keep it concise but comprehensive.`

  return callTogetherAI(systemPrompt, `Create a scaling plan for: ${description}`)
}

async function generateAPIStructure(description: string): Promise<string> {
  const systemPrompt = `You are a REST API designer. Generate a JSON structure representing OpenAPI 3.0 endpoints for the system. Include:
- 8-12 core endpoints (GET, POST, PUT, DELETE)
- Request and response schemas
- Authentication method (Bearer token)
- Rate limiting info
- Error codes
Return valid JSON formatted as a simple API spec (not full OpenAPI, but structured endpoint list).`

  return callTogetherAI(systemPrompt, `Design the API structure for: ${description}`)
}
