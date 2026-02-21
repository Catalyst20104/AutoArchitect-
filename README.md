# AutoArchitect – AI System Design Builder

## 🚀 What It Does

Type a natural language system description (e.g., "Design Netflix") → AutoArchitect generates:
- **📐 Architecture Diagram** (Mermaid flowchart): services, queues, caches, DBs, CDN
- **🗄️ Database Schema** (SQL DDL): normalized tables with indexes and relationships
- **📈 Scaling Plan**: load balancing, replication, caching, bottleneck analysis
- **🔌 API Structure** (JSON/OpenAPI): endpoints, request/response schemas, auth, rate limits

## 🛠️ Tech Stack

- **Frontend**: React + Next.js + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes
- **LLM**: Google Gemini Pro (FREE, 60 requests/min)
- **Visualization**: Mermaid.js for diagrams
- **Deployment**: Vercel (free)

## ⚙️ Setup & Installation

### Prerequisites
- Node.js 18+ (install from https://nodejs.org)
- Google Gemini API Key (free from https://aistudio.google.com/app/apikey)

### Local Development

1. **Clone/Navigate to project**:
   ```bash
   cd /Users/utkarsh/Aya_Hackthon_project
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the project root:
   ```
   GOOGLE_GENERATIVE_AI_KEY=your-api-key-here
   ```

4. **Run dev server**:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 in your browser.

5. **Build for production**:
   ```bash
   npm run build
   npm start
   ```

## 📝 Usage

1. Open http://localhost:3000
2. Type a system description (e.g., "Design a real-time collaborative document editor like Google Docs")
3. Click **Generate Design**
4. View and download:
   - Architecture diagram (Mermaid syntax)
   - Database schema (SQL)
   - Scaling plan (text)
   - API endpoints (JSON)

## 📂 Project Structure

```
.
├── app/
│   ├── api/generate/route.ts       # OpenAI integration + generation logic
│   ├── layout.tsx                   # Root layout
│   ├── page.tsx                     # Main UI
│   └── styles/globals.css           # Tailwind + custom styles
├── components/
│   ├── MermaidDiagram.tsx          # Diagram renderer
│   ├── CodeBlock.tsx               # Code syntax highlighting
│   └── OutputPanel.tsx             # Tab-based output display
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
└── README.md
```

## 🎯 36-Hour Breakdown

| Phase | Hours | Checklist |
|-------|-------|-----------|
| **Setup & Infra** | 4h | ✅ Next.js scaffold, UI boilerplate, OpenAI client |
| **LLM Prompts** | 8h | ✅ Tune prompts for architecture, schema, scaling, APIs |
| **Generators** | 10h | ✅ Mermaid parser, SQL DDL builder, JSON schema generator |
| **Frontend & Viz** | 8h | ✅ Input form, output tabs, diagram rendering, export |
| **Polish & Deploy** | 6h | ⏳ Error handling, edge cases, styling, Vercel deploy |

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Set OPENAI_API_KEY environment variable
export OPENAI_API_KEY=sk-...

# Run local development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📦 Features (MVP)

✅ Natural language input  
✅ Parallel LLM calls for 4 output types  
✅ Mermaid diagram rendering  
✅ SQL schema generation  
✅ API structure in JSON  
✅ Scaling plan text  
✅ Download individual outputs  
✅ Responsive design  
✅ Error handling & loading states  

## 🔄 Future Enhancements (Post-Hackathon)

- [ ] User authentication & history
- [ ] Save/share designs
- [ ] Multiple LLM provider support (Claude, Ollama)
- [ ] Real-time diagram editing
- [ ] Cost estimation calculator
- [ ] Performance benchmarking templates
- [ ] AI-powered review/suggestions

## 🤝 Contributing

Feel free to fork and submit PRs. This is a hackathon project built in 36 hours.

## 📄 License

MIT

---

**Built with ❤️ for the Aya Hackathon 2026**
