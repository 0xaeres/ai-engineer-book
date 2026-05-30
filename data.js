// Phase data extracted from the curriculum
window.PHASE_COLORS = ["teal-deep", "teal", "purple", "pink", "emerald", "amber", "rust", "mustard", "indigo"];
window.ROADMAP = [
  {
    id: 1,
    title: "Python & Async Foundations for AI",
    short: "Python & Async Foundations",
    color: "teal-deep",
    weeks: "Weeks 1–3",
    weeksDetail: "3 weeks · 2 modules",
    difficulty: 2,
    summary: "Every modern AI framework runs on Python. Skip its event-driven fundamentals and concurrent designs, and everything downstream stalls or breaks in production.",
    endState: "You can build an asynchronous FastAPI endpoint that coordinates multiple LLM calls in parallel, safeguards them with custom timeout controls, and streams responses without blocking the event loop.",
    sections: [
      {
        n: "1.1",
        title: "Asyncio & Cooperative Concurrency",
        items: [
          "Understanding the Single-Threaded Event Loop",
          "Synchronous Network Blocking vs Asynchronous Waiting",
          "Cooperative Concurrency using async/await",
          "Parallelizing Network I/O with asyncio.gather",
          "Latency Control with asyncio.wait_for timeouts",
          "Fire-and-forget Background Tasks via asyncio.create_task"
        ]
      },
      {
        n: "1.2",
        title: "FastAPI & Pydantic Service Design",
        items: [
          "Creating Robust API Service Boundaries",
          "Request/Response Parsing and Type Validation with Pydantic",
          "Managing Long-Lived Clients using FastAPI Dependency Injection",
          "Structured Logging (JSON formatting) for Network Audits",
          "Network Error Handling with custom retry policies using tenacity"
        ]
      }
    ]
  },
  {
    id: 2,
    title: "The Mental Model of LLMs",
    short: "LLM Mental Model",
    color: "teal",
    weeks: "Week 4",
    weeksDetail: "1 week · 2 modules",
    difficulty: 1,
    summary: "A conceptual framework to understand how models tokenize language, manage finite context, and reason. Essential for resolving 'why did this agent fail?' six months later.",
    endState: "You can explain why models struggle with character-level details, manage a sliding context window effectively, and dynamically route tasks to optimal model tiers.",
    sections: [
      {
        n: "2.1",
        title: "Tokenization & Context Dynamics",
        items: [
          "Byte-Pair Encoding (BPE) subword tokenization",
          "Why character-level tasks (reversals, math) are hard for token-level models",
          "Transformer Attention: how token coordinates exchange signal",
          "Context Windows: working memory limits and silent truncation",
          "The 'Lost in the Middle' degradation effect in long contexts"
        ]
      },
      {
        n: "2.2",
        title: "Reasoning Models & Dynamic Routing",
        items: [
          "Base/Chat Models (direct next-token predictions) vs Reasoning Models",
          "Reinforcement learning, intermediate thinking tokens, and planning loops",
          "Provider extended thinking budgets (Claude 3.7, Gemini 2.5, DeepSeek R1)",
          "Building dynamic, low-latency, cost-aware model routers"
        ]
      }
    ]
  },
  {
    id: 3,
    title: "Prompt Engineering & API Access",
    short: "Prompt Engineering",
    color: "purple",
    weeks: "Weeks 5–7",
    weeksDetail: "3 weeks · 2 modules",
    difficulty: 2,
    summary: "Pivot from a casual chatbot user into an engineer who programmatically controls probabilistic text engines.",
    endState: "You can systematically structure inputs with XML, configure API parameters for repeatability, cut system prompt costs via caching, and build automated critique loops.",
    sections: [
      {
        n: "3.1",
        title: "Prompt Anatomy & Core Patterns",
        items: [
          "Structure of a production prompt: task, constraints, role, and context data",
          "Utilizing structural XML and Markdown boundaries",
          "System instructions vs user turns vs assistant response prefilling",
          "Zero-shot vs Few-shot conditioning with curated examples",
          "Strict output formatting: JSON schemas and structured outputs"
        ]
      },
      {
        n: "3.2",
        title: "Advanced Reasoning & Cost Optimization",
        items: [
          "Chain of Thought ('think step-by-step') for math, logic, and planning",
          "Implementing Self-Reflection and critique-and-refinement loops",
          "Prompt Caching mechanics (Anthropic cache_control and OpenAI cached pricing)",
          "Cut prompt latency and billings up to 10x in production",
          "Overview of Programmatic Prompt Optimization (DSPy concepts)"
        ]
      }
    ]
  },
  {
    id: 4,
    title: "Production RAG Pipelines",
    short: "RAG & Document Ingestion",
    color: "pink",
    weeks: "Weeks 8–12",
    weeksDetail: "5 weeks · 3 modules",
    difficulty: 4,
    summary: "RAG is simple in a 10-line tutorial and brutally complex in a production environment with messy tables, structured layouts, and massive corpus drift.",
    endState: "You can build an ingestion pipeline that parses structured PDFs, executes hybrid keyword-vector retrieval, and scores performance using automated LLM judges.",
    sections: [
      {
        n: "4.1",
        title: "Document Parsing & Semantic Chunking",
        items: [
          "Moving beyond PyMuPDF: Layout identification with Docling",
          "Extracting clean headers, list sections, and tables",
          "Fixed-width character chunking vs structural semantic chunking",
          "Parent-child chunk expansion strategies",
          "Chunk Enrichment: Named Entity Recognition (NER) and PII redaction"
        ]
      },
      {
        n: "4.2",
        title: "Hybrid Retrieval & Cross-Encoder Reranking",
        items: [
          "Vector Embeddings: mapping text to multi-dimensional coordinate spaces",
          "Dense vector similarity search (cosine distance) vs lexical BM25 search",
          "Implementing Hybrid Search with Reciprocal Rank Fusion (RRF)",
          "Applying Cross-Encoder Rerankers (Cohere, BGE) to filter candidates",
          "Advanced retrievers: late-interaction ColBERT and multi-modal ColPali"
        ]
      },
      {
        n: "4.3",
        title: "Evaluation & The RAG Triad",
        items: [
          "The danger of vibe-based testing at scale",
          "The RAG Triad: Context Relevance, Groundedness (Faithfulness), and Answer Relevance",
          "LLM-as-a-Judge frameworks (Ragas, custom prompt judges)",
          "Computing deterministic retrieval metrics: Precision@k, Recall@k, and Hit Rate",
          "Curating golden regression test sets for continuous integration"
        ]
      }
    ]
  },
  {
    id: 5,
    title: "Tools, MCP, & Single-Agent Systems",
    short: "Tools, MCP & Single Agents",
    color: "emerald",
    weeks: "Weeks 13–16",
    weeksDetail: "4 weeks · 3 modules",
    difficulty: 4,
    summary: "Connecting models to external environments: executing code, querying databases, reading directories, and exposing standard client-server interfaces.",
    endState: "You can build a single-agent system that queries directories, calls external APIs, follows the ReAct pattern, and pauses for human confirmation during high-risk steps.",
    sections: [
      {
        n: "5.1",
        title: "Function Calling & Tool Design",
        items: [
          "Tool Schemas: Pydantic schemas and JSON Schema specifications",
          "How LLMs parse descriptions and parameters to output structured calls",
          "Validating tool arguments and executing Python code safely",
          "Graceful tool exception handling and returning structured errors to the model"
        ]
      },
      {
        n: "5.2",
        title: "Model Context Protocol (MCP)",
        items: [
          "The Model Context Protocol: standardizing tool client-server boundaries",
          "Connecting clients to third-party filesystem, GitHub, and Slack servers",
          "Building a custom MCP server in Python from scratch",
          "Transports: stdio stream mapping vs HTTP server-sent events"
        ]
      },
      {
        n: "5.3",
        title: "Bounded Agent Loops & Human-in-the-Loop",
        items: [
          "The ReAct (Reasoning + Acting) loop pattern",
          "Setting run loop budgets (max iterations, max token costs)",
          "Checkpointers: persisting conversation state to disk/memory",
          "Human-in-the-loop: pausing agents for approval before sensitive actions"
        ]
      }
    ]
  },
  {
    id: 6,
    title: "Memory & Context Engineering",
    short: "Memory & Context Engineering",
    color: "amber",
    weeks: "Weeks 17–19",
    weeksDetail: "3 weeks · 2 modules",
    difficulty: 4,
    summary: "The art of managing working context. Deciding what a model sees, when it gets cached, when it gets compressed, and how to safely store user history.",
    endState: "You can build a chat memory layer that preserves critical conversational context under strict token budgets using semantic caches and Episodic retrieval.",
    sections: [
      {
        n: "6.1",
        title: "Sliding-Window History & Semantic Caching",
        items: [
          "Short-term session memory: sliding message-pair windows",
          "Preserving complete user-assistant turns to keep context coherent",
          "Strict token budget calculation and dynamic trimming",
          "Semantic caching with FAISS to skip LLM calls for highly similar user intents",
          "Caching thresholds, invalidation rules, and background logging threads"
        ]
      },
      {
        n: "6.2",
        title: "Long-Term Episodic Memory",
        items: [
          "Extracting persistent preferences, names, and structured user facts",
          "Episodic memory: embedding and indexing past user interaction highlights",
          "Memory compression and summarization triggers",
          "Durable persistence in vector databases vs relational profile databases",
          "Privacy engineering: GDPR compliance and data deletion flows"
        ]
      }
    ]
  },
  {
    id: 7,
    title: "Multi-Agent Orchestration",
    short: "Multi-Agent Orchestration",
    color: "rust",
    weeks: "Weeks 20–22",
    weeksDetail: "3 weeks · 2 modules",
    difficulty: 5,
    summary: "When a single agent cannot scale. Learn to decompose hard problems into directed workflows where nodes are specialized prompts and edges are routing code.",
    endState: "You can represent complex multi-agent architectures on a whiteboard and implement them cleanly in LangGraph with shared states and strict safety guarantees.",
    sections: [
      {
        n: "7.1",
        title: "Graph-Based Workflows with LangGraph",
        items: [
          "Decomposing agent execution into a StateGraph",
          "State management: Pydantic schemas, shared states, and state reducers",
          "Defining graph Nodes (actions) and Edges (transitions)",
          "Conditional Routing and executing cycles safely with loop budgets",
          "Checkpointers for time-travel debugging and workflow resumption"
        ]
      },
      {
        n: "7.2",
        title: "Orchestration Patterns & Specialist Hierarchies",
        items: [
          "Common patterns: Supervisor-workers, sequential pipelines, and plan-and-execute",
          "The lightweight alternative: Specialist agents exposed as standalone tools",
          "Framework trade-offs: LangGraph vs Pydantic AI vs lightweight custom asyncio state-machines",
          "Telemetry and multi-agent tracing with LangSmith/Langfuse"
        ]
      }
    ]
  },
  {
    id: 8,
    title: "Guardrails & LLMOps",
    short: "Guardrails & LLMOps",
    color: "mustard",
    weeks: "Weeks 23–24",
    weeksDetail: "2 weeks · 2 modules",
    difficulty: 3,
    summary: "Proving your agent is improving with release-over-release metrics, and installing reliable software guardrails so it never embarrasses you in production.",
    endState: "You can install a robust 3-layer guardrail architecture, capture and trace all network execution spans, and evaluate new prompts on CI/CD regression suites.",
    sections: [
      {
        n: "8.1",
        title: "Layered Guardrail Architectures",
        items: [
          "Three-Layer Guardrail: Input checks, Output verification, and Action constraints",
          "Input: Regex, substring matches, prompt-injection classifiers (Llama Guard)",
          "Output: Faithfulness verification, disclaimer injection, and fallback outputs",
          "Action: Safe tool constraints, rate limits, and isolated environments",
          "Managed Guardrail layers: AWS Bedrock Guardrails contextual grounding"
        ]
      },
      {
        n: "8.2",
        title: "Telemetry, Observability, & CI Evaluation",
        items: [
          "Multi-span execution tracing: tracking prompts, tools, and DB calls",
          "Capturing key production metrics: cost, latency, P95/P99 times, and error rates",
          "CI/CD regression testing: running automated evaluation tests on code commits",
          "Capturing user feedback loops (thumbs-up/thumbs-down ratings)"
        ]
      }
    ]
  },
  {
    id: 9,
    title: "Cloud Infrastructure & Deployment",
    short: "Cloud & Deployment",
    color: "indigo",
    weeks: "Weeks 25–26",
    weeksDetail: "2 weeks · 2 modules",
    difficulty: 3,
    summary: "The final mile. How to host your Python code, stream tokens to web clients, secure API keys, and load-test systems under concurrent user demand.",
    endState: "You can dockerize a FastAPI agent, host it on cloud servers, stream tokens using Server-Sent Events, manage secure credentials, and load-test model capacity.",
    sections: [
      {
        n: "9.1",
        title: "Realtime Delivery & SSE Streaming",
        items: [
          "FastAPI streaming responses with generator functions",
          "Server-Sent Events (SSE) protocol for one-way token streaming",
          "Managing SSE connection dropouts and client-side consumption",
          "WebSockets for bidirectional communication and multi-turn audio/text streaming",
          "Separately streaming text tokens and structured metadata (e.g., tool traces)"
        ]
      },
      {
        n: "9.2",
        title: "Production Cost Control & Load Testing",
        items: [
          "Dynamic Model Routing: choosing models based on calculated task complexity",
          "Load-testing model boundaries using Locust or k6",
          "Why concurrent systems fail at third-party model rate limits long before CPU limits",
          "Gateway rate-limiting and buffer queues",
          "Secrets management: securing API keys using AWS Secrets Manager or Vault",
          "Multi-stage promotion (dev -> staging -> prod)"
        ]
      }
    ]
  }
];

window.CAPSTONES = [
  {
    n: 1,
    title: "Distributed Document Ingestion + RAG Pipeline",
    phase: "Built during Phase 4 · Weeks 10–12",
    domain: "Unstructured document Q&A (legal, pharma, technical docs)",
    build: [
      "PDF Ingestion: Docling layout detection -> semantic chunking -> PII redaction -> entity extraction -> embeddings -> Pinecone + Neo4j",
      "Distributed async workers on ECS Fargate processing thousands of PDFs concurrently",
      "DynamoDB state tracking per document (queued / processing / done / failed)",
      "Hybrid retrieval (vector + BM25 + graph) with reranking",
      "Evaluation harness with golden dataset, Precision@k / Recall@k / RAG Triad",
      "FastAPI Q&A endpoint with citation-backed answers"
    ],
    stack: ["Docling", "Pinecone", "Neo4j", "ECS Fargate", "DynamoDB", "S3", "Bedrock embeddings", "LangSmith"],
    proves: "You can build production RAG, not a Streamlit demo."
  },
  {
    n: 2,
    title: "Multi-Agent Natural Language → SQL on E-commerce Data",
    phase: "Built during Phase 7 · Weeks 21–22",
    domain: "E-commerce analytics for non-technical users",
    build: [
      "Multi-agent: Planner -> SQL Writer -> Validator -> Executor -> Explainer",
      "Schema-aware context injection per query (only relevant tables sent to writer)",
      "LangGraph orchestration with conditional routing and retry loops",
      "Read-only DB enforcement, query timeout, max-row caps",
      "Streamlit frontend, FastAPI backend, RDS PostgreSQL with realistic data",
      "Benchmarked on a golden NLQ test set, target 85%+ accuracy"
    ],
    stack: ["LangChain", "LangGraph", "LangSmith", "AgentCore", "RDS PostgreSQL", "FastAPI", "Streamlit", "Bedrock"],
    proves: "You can orchestrate multiple specialised agents safely against real production data."
  },
  {
    n: 3,
    title: "Clinical Trials Knowledge Base",
    phase: "Built during Phases 8–9 · Weeks 23–26",
    domain: "Life sciences AI (substitute legal, finance, or your industry)",
    build: [
      "Real ClinicalTrials.gov dataset ingestion (or your domain equivalent)",
      "Hybrid knowledge layer: Pinecone for unstructured PDFs + Neo4j for trial-drug-condition relationships",
      "Multi-hop relationship queries ('what other trials used drug X for condition Y?')",
      "Full three-layer guardrails — disclaimer auto-injection, contradiction checks, action limits",
      "Evidence-backed answers — every claim cites the source chunk",
      "Deployed on AWS with monitoring, regression tests in CI, semantic cache, cost dashboard"
    ],
    stack: ["LangChain", "LangGraph", "Neo4j + Cypher", "Pinecone", "Bedrock + AgentCore + Lambda", "S3", "LangSmith", "MLflow"],
    proves: "You can ship an agent into a regulated domain without it killing anyone (or your career)."
  }
];

window.OUT_OF_SCOPE = [
  {
    title: "Fine-tuning foundation models",
    why: "RAG, prompting, and tool use solve 95% of business problems faster, cheaper, and with no infra overhead. Fine-tuning earns its weight only when you have a narrow domain, lots of clean labelled data, and prompting has hit a wall — which almost never happens before you've shipped your first agent. Learn it after this roadmap, not during.",
    pointer: "Start with LoRA + a 7B open model (Llama, Mistral, Qwen) on a single A10/L4 once you have a real motivating use case."
  },
  {
    title: "Voice agents",
    why: "A whole sub-discipline — STT, TTS, turn-taking, latency budgets, barge-in. Worth its own track, not a side note. You can graft it on top of any agent you build in this roadmap.",
    pointer: "OpenAI Realtime API, Deepgram + ElevenLabs + LiveKit, or pipecat — pick after you've shipped one text agent."
  },
  {
    title: "ML fundamentals (gradient descent, backprop, transformers from scratch)",
    why: "Lovely to know. Not required to be an excellent agent engineer in 2026. The Karpathy series is there when you're curious — don't let it block you from shipping.",
    pointer: "Andrej Karpathy's 'Neural Networks: Zero to Hero' + the 'Let's build GPT' video, on weekends."
  },
  {
    title: "Frontend frameworks (Next.js, React, Tailwind)",
    why: "You need enough to ship a Streamlit or basic chat UI for capstones. Beyond that, partner with a frontend engineer or a design system. Don't get lost in framework wars.",
    pointer: "Streamlit for internal tools, Vercel AI SDK + Next.js when you need a real product UI."
  }
];

window.NEXT_STEPS = [
  {
    label: "Portfolio",
    title: "Three repos, three READMEs, one demo video each",
    body: "The capstones are your portfolio. For each one: a clean GitHub repo with a README that explains the problem, the architecture, the trade-offs, and the eval numbers; a 90-second Loom walking through it; one screenshot of the trace UI showing it actually working."
  },
  {
    label: "LinkedIn",
    title: "Headline that says what you can ship",
    body: "Don't write 'AI Engineer' in your headline — write 'AI Engineer · production RAG, multi-agent systems, AWS Bedrock + LangGraph · shipping in regulated domains.' Specific gets interviews. Generic gets ignored."
  },
  {
    label: "60-second pitch",
    title: "What to say in the first interview round",
    body: "\"'I spent six months building three production-grade AI systems end-to-end: a distributed RAG pipeline that ingests thousands of PDFs, a multi-agent NL→SQL system with read-only enforcement, and a clinical-trials knowledge base with three-layer guardrails. I can show you the traces, the eval numbers, and the cost dashboard for any of them.' That's the whole pitch. Numbers and artefacts beat adjectives.\" That's the whole pitch. Numbers and artefacts beat adjectives."
  },
  {
    label: "Keep learning",
    title: "What to read once you're shipping",
    body: "Anthropic's 'Building effective agents' essay, the Latent Space podcast, the LangChain blog, Eugene Yan's writing on production ML, and the original papers when something keeps confusing you (Self-RAG, RAG-as-judge, ReAct). Skim, don't drown."
  }
];
