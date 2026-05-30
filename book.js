const curriculum = window.ROADMAP || [];
const capstones = window.CAPSTONES || [];

const phaseGuides = {
  1: {
    why: "Python is the runtime host of AI engineering. It coordinates networks, validates raw data boundaries, and manages non-blocking concurrency.",
    lab: "Build a concurrent FastAPI chat service that schedules parallel dummy LLM tasks, times out the slow ones, and logs structured JSON without blocking new connections.",
    mistakes: ["Stalling the event loop with synchronous network calls.", "Using unvalidated dictionaries for data validation.", "Allowing API keys to drift into git commits."],
    resources: [["FastAPI Docs", "https://fastapi.tiangolo.com/"], ["Pydantic Validation", "https://docs.pydantic.dev/"], ["Asyncio Concurrency", "https://docs.python.org/3/library/asyncio.html"]]
  },
  2: {
    why: "LLM engineering starts with a sober, probabilistic mental model. Models do not fetch facts; they generate token sequences based on conditional probabilities.",
    lab: "Write a token budget analyzer that estimates the subword token count of inputs and routes complex tasks to reasoning models while using fast base models for extraction.",
    mistakes: ["Expecting models to invent missing private context.", "Treating public leaderboards as ultimate proof of task-specific quality.", "Ignoring the lost-in-the-middle context degradation effect."],
    resources: [["BPE Tokenizer Explanation", "https://github.com/openai/tiktoken"], ["Lost in the Middle Paper", "https://arxiv.org/abs/2307.03172"], ["DeepSeek R1 Paper", "https://arxiv.org/abs/2501.12948"]]
  },
  3: {
    why: "Prompts are programmatic interfaces. We control outputs by engineering context boundaries, few-shot templates, and cache configurations.",
    lab: "Implement a schema-validated prompt builder that injects few-shot XML examples and utilizes prompt caching headers to cut prompt billings in half.",
    mistakes: ["Relying on loose conversational instructions rather than strict XML/Markdown schema bounds.", "Writing prose constraints instead of supplying concrete examples.", "Drifting prompt versions in production without trace auditing."],
    resources: [["Anthropic Prompt Engineering", "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview"], ["OpenAI Prompt Caching", "https://platform.openai.com/docs/guides/prompt-caching"]]
  },
  4: {
    why: "Retrieval-Augmented Generation gives models access to custom information. The hard part is layout parsing, hybrid indexing, reranking, and quantitative evaluation.",
    lab: "Build a local RAG pipeline over structured documents: parse table elements with Docling, merge dense/BM25 scores with Reciprocal Rank Fusion, and evaluate via LLM-as-judge.",
    mistakes: ["Using raw character-slicing which breaks tables and sentences.", "Relying on cosine similarity alone for rare codes or exact product IDs.", "Vibe-checking answer quality instead of tracking quantitative metrics."],
    resources: [["Docling Ingestion", "https://ds4sd.github.io/docling/"], ["Ragas Eval Framework", "https://docs.ragas.io/"], ["BM25 & Hybrid Search", "https://github.com/pgvector/pgvector"]]
  },
  5: {
    why: "Tools give models hands and eyes. Building tools requires strict schema typing, execution sandboxes, error fallbacks, and human gates.",
    lab: "Construct a custom MCP tool server that queries filesystem data, parses model tool-calls safely, and pauses execution for human approval on high-risk operations.",
    mistakes: ["Exposing broad write tools without authentication or row-limits.", "Letting tool exceptions crash the parent agent loop.", "Allowing prompt injections from external sources to hijack tool execution."],
    resources: [["Model Context Protocol", "https://modelcontextprotocol.io/"], ["Pydantic AI Tool Schemas", "https://ai.pydantic.dev/"]]
  },
  6: {
    why: "Context engineering is the science of budget allocation. You must manage sliding session histories, semantic response caches, and GDPR-compliant episodic facts.",
    lab: "Write a chat server with sliding-window token management, a sub-millisecond semantic cache using FAISS, and a background daemon-thread cache writer.",
    mistakes: ["Dumping thousands of raw messages into a single prompt loop.", "Allowing cached answers to violate tenant authorization bounds.", "Retaining personal data in episodic memory without deletion pathways."],
    resources: [["LangChain Memory", "https://python.langchain.com/docs/concepts/memory/"], ["FAISS Semantic Cache", "https://faiss.ai/"]]
  },
  7: {
    why: "Multi-agent systems decompose complex workflows into specialized nodes, sharing states and avoiding runaway loops.",
    lab: "Build a natural-language-to-SQL planner, writer, validator, and executor using LangGraph with state reducers and iteration limits.",
    mistakes: ["Using multi-agent state machines when a single tool-using model suffices.", "Failing to define strict typed states between worker nodes.", "Allowing infinite agent dialogue cycles that exhaust API credits."],
    resources: [["LangGraph Concepts", "https://langchain-ai.github.io/langgraph/"], ["Pydantic AI state management", "https://ai.pydantic.dev/concepts/state/"]]
  },
  8: {
    why: "Guardrails validate that models stay safe, on-topic, and truthful. Observability maps traces to quantitative CI regression tests.",
    lab: "Deploy a three-layer guardrail checking prompt injection (input), formatting limits (actions), and faithfulness (output) with complete trace logging.",
    mistakes: ["Asking the generation model to police its own outputs.", "Tracing only final user answers instead of nested tool spans.", "Deploying prompt edits without running automated regression test suites."],
    resources: [["Llama Guard Safe Filters", "https://huggingface.co/meta-llama/Llama-Guard-3"], ["LangSmith Observability", "https://docs.smith.langchain.com/"]]
  },
  9: {
    why: "Production deployment turns a script into a highly concurrent service. You must handle streaming SSE connections, dynamic load limits, and secret rotations.",
    lab: "Dockerize a FastAPI assistant, stream tokens with Server-Sent Events, load-test limits with Locust, and route credentials via Secrets Manager.",
    mistakes: ["Hardcoding API keys in environment files committed to git.", "Load-testing only API servers and ignoring third-party model limits.", "Treating model costs as finance alerts instead of an engineering optimization metric."],
    resources: [["Server-Sent Events", "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events"], ["Locust Load Testing", "https://locust.io/"]]
  }
};

const chapterGuides = {
  1: {
    opening: "AI applications are distributed systems with slow network dependencies, structured interfaces, and dynamic concurrent workloads. Python is the ecosystem standard. Transitioning to AI engineering requires mastering event loops, schema validation, and structured request boundaries.",
    mechanics: "A secure service acts as a series of defensive barriers: request formats are parsed and validated at the edge with Pydantic, coordinated concurrently with non-blocking async event loops in FastAPI, and protected with exponential tenacity retries.",
    diagram: `User Request JSON\n       |\n       v\n[Pydantic Validator] -> [Async FastAPI Endpoint] -> [Concurrent model calls (asyncio.gather)]\n                                                              |\n       +------------------- retries with tenacity <-----------+\n       v\n[JSON Logging Engine] -> [SSE Stream Delivery]`
  },
  2: {
    opening: "A language model is a probabilistic matrix. It maps subword token IDs to attention coordinates, generating language one token at a time. Engineering requires mapping text token budgets, respecting position attention decay, and routing workloads.",
    mechanics: "Every text string is converted into integer subword tokens. Because long context windows suffer from positional attention dilution ('lost in the middle') and higher latencies, we build dynamic routers that analyze input signals and route simple queries to cheap base models and hard calculations to reasoning engines.",
    diagram: `Raw String Input -> [BPE Tokenizer] -> [Attention Layers] -> [Next-Token Probabilities]\n                                              |\n       +--------------------------------------+ (Attention decay in middle tokens)\n       v\n[Model Router Decision] -> Fast Base Model (Simple extraction)\n                       -> Reasoning Model (Math, complex code)`
  },
  3: {
    opening: "Prompts are programmatic API boundaries, not conversational conversations. Production prompting relies on clear instructions, structural XML delimiters, few-shot example patterns, and prompt caching features.",
    mechanics: "Prompts split information into system instructions, few-shot examples, retrieved facts, and current user inputs using clean XML tags. To keep costs low, we cache system prompts at the model gateway, utilizing prompt caching to cut input latency.",
    diagram: `[System prompt (Instructions + Schema)] + [Few-Shot Examples (XML)] + [Retrieved Context]\n                                      |\n       +------------------------------+ (Inject cache_control/automatic cache)\n       v\n[Model Generation Output] -> [Pydantic JSON Parser] -> Success / Retry Loop`
  },
  4: {
    opening: "Retrieval-augmented generation (RAG) grounds model reasoning in custom facts. Quality relies on high-fidelity document layout identification, semantic chunking boundaries, hybrid multi-search retrieval, and quantitative eval loops.",
    mechanics: "Structured parsing (Docling) identifies paragraphs and tables. We split text along structural semantic boundaries, enrich chunks with metadata, execute hybrid vector-lexical search (Vector similarity + BM25), merge rankings via RRF, and validate outputs using the RAG Triad.",
    diagram: `Document Ingest -> [Docling Parser] -> [Semantic Chunking] -> [Vector Embedding + BM25 Index]\n                                                                         |\nQuery Input ------> [Hybrid Multi-Retrieve] -> [Cross-Encoder Rerank] <---+\n                                 |\n                                 v\n                        [LLM-as-a-Judge Eval]`
  },
  5: {
    opening: "Tools give models hands and eyes, enabling them to read databases, run commands, and access systems. Exposing tools requires JSON definitions, execution sandboxes, and approval steps.",
    mechanics: "Tools are defined using Pydantic models. Models emit tool intents, the application intercept-executes the Python methods, parses outputs, catches exceptions gracefully, and maps MCP standard stdio/HTTP transports with human confirmation checkpointers.",
    diagram: `User Goal -> [ReAct Agent Loop] -> [Tool Schema Match] -> [Application Intercept]\n                                                                  |\n       +------------------------ require human approval? <--------+\n       v\n[Execute Sandbox] -> [Parse Structured Result] -> [Model Observation]`
  },
  6: {
    opening: "Context engineering is context budget optimization. Systems must manage sliding history windows, sub-millisecond semantic query caches, and secure user preference stores.",
    mechanics: "We separate session history into sliding message-pair queues. Semantic caches check incoming queries against vector indexes (FAISS). Episodic and long-term memory stores persist preferences under privacy constraints.",
    diagram: `Incoming Query -> [FAISS Semantic Cache] --(Hit)--> Return cached answer\n                         |\n                       (Miss)\n                         v\n[Retrieve episodic context] + [Sliding message history] -> [Model Call] -> [Background cache write]`
  },
  7: {
    opening: "Multi-agent systems decompose complex goals into directed execution graphs. Each node is a specialized prompt; each edge is a routing code.",
    mechanics: "We model execution as a LangGraph StateGraph. Specialized nodes alter shared states, conditional edges route transitions based on programmatic logic, loop budgets prevent runaway cycles, and checkpointers enable time-travel resume functionality.",
    diagram: `[Input State] -> [Graph Node: Planner] -> [Worker Node: Writer] -> [Validator Edge]\n                                                   ^                    |\n                                                   |------(Fail/Retry)--+\n                                                   v\n                                            [Synth Node] -> [Output]`
  },
  8: {
    opening: "Guardrails validate that models remain safe, on-topic, and truthful. Observability maps spans to regression evaluations.",
    mechanics: "A production gate acts in three layers: input validation (Llama Guard, regex), action bounds (read-only limits, tool limits), and output checks (contradiction, faithfulness). Telmetry records spans to MLflow or LangSmith.",
    diagram: `User Request -> [Input Guardrail] -> [Agent StateGraph] -> [Output Guardrail] -> Client\n                       |                    |                   |\n                       +--(Reject)          +--(Traces/Metrics) +--(Fallback)`
  },
  9: {
    opening: "Cloud infrastructure hosts models and services, managing streaming SSE, API gateway bounds, secrets managers, and Locust load testing.",
    mechanics: "We package Python apps inside Docker containers, stream tokens over Server-Sent Events (SSE), secure credentials via Secrets Manager, and load-test concurrency limits to identify bottlenecks.",
    diagram: `Web Browser -> [API Gateway / ALB] -> [Dockerized FastAPI] -> [AWS Secrets Manager]\n                                                |\n       +----------------- stream tokens via SSE -+\n       v\n[Locust Concurrent load testing]`
  }
};

// Comprehensive 62-Module technical lessons database
const deepDives = {
  // PHASE 1: Python Foundations
  "1.1": {
    lede: "Python is the host language for AI engineering. Understanding its core primitives—variables, clean type contracts, dynamic control flows, and structural decorators—is essential for building reliable services.",
    sections: [
      {
        title: "Dynamic Execution and Structural Contracts",
        body: [
          "Python is dynamically executed, but production AI services require explicit interfaces. Standard variables hold context, while control flow directs inputs. We implement the Decorator Pattern to wrap standard functions dynamically, injecting cross-cutting concerns like retries, latency telemetry, caching, and safety guards.",
          "Decorators act as wrapper closures, modifying target function runtime behaviors without changing their core source code. We use `functools.wraps` to preserve vital functional metadata across wrappers."
        ],
        diagram: `User Request -> [Decorator wrapper (starts timer)] -> [Target API Function] -> [Wrapper audits MS and logs]`
      }
    ],
    examples: [
      {
        title: "Dynamic Telemetry Decorator",
        lang: "python",
        code: `from functools import wraps\nimport time\n\ndef time_telemetry(func):\n    @wraps(func)\n    def wrapper(*args, **kwargs):\n        start = time.perf_counter()\n        try:\n            return func(*args, **kwargs)\n        finally:\n            duration = time.perf_counter() - start\n            print(f"Execution [ {func.__name__} ] completed in {duration:.4f}s")\n    return wrapper\n\n@time_telemetry\ndef dummy_generator(n: int):\n    return [x**2 for x in range(n)]\n\ndummy_generator(100000)`
      }
    ],
    decisionTable: [["Measuring custom execution logs", "Custom Decorator class", "Wraps functions dynamically without polluting local business loops."]],
    sources: [["Python Decorators Guide", "https://realpython.com/primer-on-python-decorators/"]]
  },
  "1.2": {
    lede: "Object-oriented structures compile stable configurations. Pydantic models enforce type validation at process boundaries, parsing loose runtime parameters into typed schemas.",
    sections: [
      {
        title: "Classes, Dataclasses, and Validation Guards",
        body: [
          "Classes construct reusable abstractions for model client engines, session states, and vector index repositories. Standard dataclasses act as lightweight, in-memory containers for structured telemetry data.",
          "Pydantic base models validate untrusted JSON datasets at the HTTP and tool execution edges, raising type errors if incoming arguments deviate from expected schemas."
        ]
      }
    ],
    examples: [
      {
        title: "Pydantic Schema Validation",
        lang: "python",
        code: `from pydantic import BaseModel, Field\n\nclass ConfigSchema(BaseModel):\n    model_name: str = Field(min_length=3)\n    temperature: float = Field(default=0.2, ge=0.0, le=2.0)\n\ntry:\n    cfg = ConfigSchema(model_name=\"llm\", temperature=2.5)\nexcept Exception as exc:\n    print(f"Validation Blocked Input: {exc}")`
      }
    ],
    decisionTable: [["Enforcing type safety on requests", "Pydantic BaseModel", "Rejects malformed inputs at the service boundary."]],
    sources: [["Pydantic BaseModels Guide", "https://docs.pydantic.dev/"]]
  },
  "1.3": {
    lede: "Data structures dictate spatial access efficiency. Selecting appropriate collections avoids computational bottlenecks during token indexing and message grouping.",
    sections: [
      {
        title: "Dynamic Collections and State Buckets",
        body: [
          "Lists maintain sequential arrays, tuples act as frozen records, and sets provide sub-millisecond membership testing. We use collections primitives—like `defaultdict` (grouping sections without existence checks), `Counter` (tracking model error occurrences), and `deque` (managing sliding message history)—to build resilient memory structures."
        ]
      }
    ],
    examples: [
      {
        title: "Sliding Message Windows with deque",
        lang: "python",
        code: `from collections import deque, Counter\n\nhistory = deque(maxlen=3)\nhistory.append("User message 1")\nhistory.append("Model reply 1")\nhistory.append("User message 2")\nprint(list(history))\n\nerrors = Counter(["429", "503", "429"])\nprint(dict(errors))`
      }
    ],
    decisionTable: [["Managing sliding chat logs", "collections.deque", "Efficiently ejects oldest elements automatically when maxlen is exceeded."]],
    sources: [["Python Collections", "https://docs.python.org/3/library/collections.html"]]
  },
  "1.4": {
    lede: "Error management prevents system crashes. Context managers safely close resources and custom exceptions convey failures without exposing secrets.",
    sections: [
      {
        title: "Defensive Exception Handling and File Streams",
        body: [
          "AI servers execute dynamic, error-prone actions: calling remote APIs, parsing unstructured documents, and saving files. We use `try/except/finally` structures to handle exceptions gracefully, custom exceptions to isolate system failures, and context managers to guarantee that database or file connections close safely."
        ]
      }
    ],
    examples: [
      {
        title: "Context Manager File Extraction",
        lang: "python",
        code: `class FileAudit:\n    def __init__(self, path: str):\n        self.path = path\n    def __enter__(self):\n        print("Opening audit file...")\n        return self\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        print("Safely closed file.")\n\nwith FileAudit("log.json"):\n    print("Writing record...")`
      }
    ],
    decisionTable: [["Managing external file logs", "Context Manager (with)", "Guarantees files close cleanly under exceptions."]],
    sources: [["Python Context Managers", "https://realpython.com/python-with-statement/"]]
  },
  "1.5": {
    lede: "HTTP clients are communication conduits. Building resilient networks requires configuring appropriate request parameters, timeouts, and automated backoff scripts.",
    sections: [
      {
        title: "HTTP Networking and tenacity Backoffs",
        body: [
          "Calling model APIs is a network operation. We configure timeouts on every request to prevent system hangs. When remote APIs return HTTP 429 rate limits or HTTP 503 timeouts, we use `tenacity` retries with exponential backoffs to distribute attempts cleanly."
        ]
      }
    ],
    examples: [
      {
        title: "Resilient API Call Retries",
        lang: "python",
        code: `from tenacity import retry, stop_after_attempt, wait_exponential\n\n@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=6))\ndef invoke_resilient_call():\n    print("Executing attempt...")\n    raise ConnectionError("Transient timeout")\n\ntry:\n    invoke_resilient_call()\nexcept Exception:\n    print("Failed after 3 retries.")`
      }
    ],
    decisionTable: [["Handling remote API rate limits", "Tenacity Retry exponential", "Prevents request stampedes using backoff limits."]],
    sources: [["Tenacity Library Docs", "https://tenacity.readthedocs.io/"]]
  },
  "1.6": {
    lede: "Databases hold conversational states and indexes. We scale database interaction using SQLAlchemy connection pooling, raw SQL queries, and strict transaction isolation.",
    sections: [
      {
        title: "SQLAlchemy Pooling and Read-Only Guards",
        body: [
          "Connecting to databases for every individual query is highly expensive. We utilize connection pooling to reuse sockets. To defend against SQL injection, we enforce read-only transactions, limit record rows, and use parameterized raw SQL when the ORM adds unnecessary overhead."
        ]
      }
    ],
    examples: [
      {
        title: "Database Session Transaction",
        lang: "python",
        code: `# Mocking database parameter bindings\ndef save_state(user_id: str, payload: str):\n    sql = "UPDATE session SET data = :data WHERE id = :id"\n    bindings = {"data": payload, "id": user_id}\n    print(f"Executed parameterized SQL: {sql} with {bindings}")\n\nsave_state("user_10", "{'chat': 'data'}")`
      }
    ],
    decisionTable: [["Retrieving exact metrics fast", "Raw Parameterized SQL", "Retrieves database values without ORM mapping latency."]],
    sources: [["SQLAlchemy Core Docs", "https://docs.sqlalchemy.org/"]]
  },
  "1.7": {
    lede: "FastAPI turns Python types into robust web APIs. It validates payload models at the boundary, exposes OpenAPI docs, and injects state dependencies.",
    sections: [
      {
        title: "High-Performance Endpoints and Dependencies",
        body: [
          "We use FastAPI to map system prompts and agent pipelines to HTTP routes. Pydantic models enforce inputs, while the Dependency Injection engine (`Depends`) manages long-lived database and model client lifecycles, ensuring resource cleanup."
        ]
      }
    ],
    examples: [
      {
        title: "FastAPI Route Handler",
        lang: "python",
        code: `# Minimal representation of a FastAPI route declaration\n# app = FastAPI()\n# @app.post("/chat")\n# async def chat(input: InputModel, client: Client = Depends(get_client)):\n#     return await client.complete(input.prompt)\nprint("FastAPI Route configuration declared.")`
      }
    ],
    decisionTable: [["Exposing agent workflows over HTTP", "FastAPI + Depends", "Exposes type-safe, validated endpoints with automatic documentation."]],
    sources: [["FastAPI Documentation", "https://fastapi.tiangolo.com/"]]
  },
  "1.8": {
    lede: "Asyncio coordinates network I/O. Using an event loop, we execute parallel calls, manage API timeouts, and run non-blocking background telemetry.",
    sections: [
      {
        title: "Cooperative Concurrency in AI Systems",
        body: [
          "Calling LLM endpoints, fetching vector indexes, and auditing tools are I/O operations. Using `asyncio.gather`, we fire calls in parallel, utilizing `asyncio.wait_for` to handle lags, and `asyncio.create_task` to dispatch background logging tasks."
        ]
      }
    ],
    examples: [
      {
        title: "Parallel Async Model Fetching",
        lang: "python",
        code: `import asyncio\n\nasync def fetch(model: str, delay: float):\n    await asyncio.sleep(delay)\n    return f"{model} response"\n\nasync def main():\n    results = await asyncio.gather(fetch(\"base\", 0.1), fetch(\"custom\", 0.2))\n    print(results)\n\nasyncio.run(main())`
      }
    ],
    decisionTable: [["Fetching three model variants", "asyncio.gather", "Fires network calls in parallel, shrinking user latency bounds."]],
    sources: [["Python asyncio", "https://docs.python.org/3/library/asyncio.html"]]
  },

  // PHASE 2: LLM Mental Model
  "2.1": {
    lede: "An LLM is a probabilistic next-token generator. Understanding that weights represent statistical patterns—not real-time factual lookup—is key to resolving hallucinations.",
    sections: [
      {
        title: "Probabilistic Generation vs Database Querying",
        body: [
          "A language model is trained on a static corpus snapshot. Because it predicts distributions over token vocabularies, it outputs highly fluent but occasionally false statements. It has no live connection to truth; RAG or tools must supply recent facts."
        ]
      }
    ],
    examples: [
      {
        title: "Model Knowledge Limitation Example",
        lang: "python",
        code: `# Conceptual prompt grounding flow\ndef prompt_with_date(query: str):\n    # Models cannot know today's date unless injected\n    return f"Today is 2026-05-30. User asks: {query}"\nprint(prompt_with_date("What occurred in the news today?"))`
      }
    ],
    decisionTable: [["Factual accuracy checks", "Inject context facts in prompt", "Prevents model weight hallucinations on recent data."]],
    sources: [["LLM Hallucinations Overview", "https://wikipedia.org/wiki/Hallucination_(artificial_intelligence)"]]
  },
  "2.2": {
    lede: "Models process subword tokens, not raw characters.Positional attention dynamics govern how inputs are weighted, causing attention decay in long context windows.",
    sections: [
      {
        title: "Attention Limits and Tokenization Dynamics",
        body: [
          "Tokenizers use Byte-Pair Encoding (BPE) to group characters. Attention coordinates positional sequences, but attention values degrade in the middle of long contexts ('Lost in the Middle'), requiring careful context ordering."
        ]
      }
    ],
    examples: [
      {
        title: "Approximate Token Calculator",
        lang: "python",
        code: `def count_approx_tokens(text: str) -> int:\n    return len(text) // 4\nprint(f"Approx tokens: {count_approx_tokens('Hello antidisestablishmentarianism')}")`
      }
    ],
    decisionTable: [["Context planning", "Place core context at ends", "Combats attention decay in long inputs."]],
    sources: [["Lost in the Middle Paper", "https://arxiv.org/abs/2307.03172"]]
  },
  "2.3": {
    lede: "Reasoning models allocate extra compute to planning. By generating internal thinking chains, they verify logic before outputting text.",
    sections: [
      {
        title: "Thinking Budgets and Planning Chains",
        body: [
          "Unlike base models that generate text directly, reasoning models (DeepSeek R1, Claude 3.7) generate hidden thinking tokens. We manage these budgets at the gateway, routing difficult planning to reasoning models and simple extractions to base tiers."
        ]
      }
    ],
    examples: [
      {
        title: "Reasoning Route Dispatcher",
        lang: "python",
        code: `def select_model(task: str) -> str:\n    if "debug" in task or "math" in task:\n        return "reasoning-model-v1"\n    return "fast-base-v1"\nprint(select_model("Fix recursive loop memory leak"))`
      }
    ],
    decisionTable: [["Logical code refactoring", "Reasoning model", "Allows internal verification and self-correction during decoding."]],
    sources: [["DeepSeek R1 Paper", "https://arxiv.org/abs/2501.12948"]]
  },
  "2.4": {
    lede: "Benchmarks document baseline quality but can lie. Production systems require custom micro-evals reflecting your specific domain queries.",
    sections: [
      {
        title: "Reading Evals and Designing Micro-Benchmarks",
        body: [
          "GSM8K and SWE-bench present high-level evaluations, but contamination and prompt sensitivity alter scores. Developers must build localized micro-eval datasets using real logs to evaluate models reliably."
        ]
      }
    ],
    examples: [
      {
        title: "Simple Accuracy Scorer",
        lang: "python",
        code: `dataset = [{"expected": "YES", "actual": "YES"}, {"expected": "NO", "actual": "YES"}]\naccuracy = sum(1 for r in dataset if r["expected"] == r["actual"]) / len(dataset)\nprint(f"Eval Accuracy: {accuracy:.2f}")`
      }
    ],
    decisionTable: [["Evaluating model shifts", "Build custom golden eval set", "Tests models on your exact dataset layout instead of general leaderboards."]],
    sources: [["LMArena Leaderboards", "https://lmarena.ai/"]]
  },
  "2.5": {
    lede: "Selecting a model is a trade-off between latency, cost, and context size. Routing workloads dynamically optimizes cost-to-performance ratios.",
    sections: [
      {
        title: "Model Capabilities and API Trade-offs",
        body: [
          "Different models have different strengths: GPT-4o offers high tool speed, Sonnet offers deep language synthesis, and local Llama engines optimize data privacy. We route requests based on token size, latency SLA, and budget limits."
        ]
      }
    ],
    examples: [
      {
        title: "Model Cost Estimator",
        lang: "python",
        code: `def estimate_cost(tokens_in: int, tokens_out: int, model: str) -> float:\n    rates = {"fast": (0.50, 1.50), "heavy": (5.00, 15.00)}\n    in_rate, out_rate = rates.get(model, (1.0, 3.0))\n    return (tokens_in * in_rate + tokens_out * out_rate) / 1000000\nprint(f"Cost: ${estimate_cost(10000, 2000, 'fast'):.6f}")`
      }
    ],
    decisionTable: [["High-throughput text translation", "Fast Model Tier", "Reduces operational expenses significantly with sub-second latencies."]],
    sources: [["Artificial Analysis Model Metrics", "https://artificialanalysis.ai/"]]
  },

  // PHASE 3: Prompt Engineering
  "3.1": {
    lede: "Prompting via APIs differs significantly from chat interfaces. Behind the scenes, we manage system parameters, system instructions, and dynamic formats.",
    sections: [
      {
        title: "UI Configurations vs Raw API Control",
        body: [
          "Chat UIs inject hidden system constraints and run tool calls silently in the background. Production code requires calling raw APIs, configuring temperature explicitly, and managing role frameworks programmatically."
        ]
      }
    ],
    examples: [
      {
        title: "API Message Format Construction",
        lang: "python",
        code: `api_payload = [\n    {"role": "system", "content": "Return only exact matches."},\n    {"role": "user", "content": "Find ID in text."}\n]\nprint(api_payload)`
      }
    ],
    decisionTable: [["Ensuring structured responses", "Production API client", "Allows absolute control over system messages and JSON constraints."]],
    sources: [["OpenAI Chat Completions Guide", "https://platform.openai.com/docs/guides/text-generation"]]
  },
  "3.2": {
    lede: "API parameters govern output characteristics. We configure message frameworks, token limits, and JSON structures directly at the network call.",
    sections: [
      {
        title: "Structured API Access and System Roles",
        body: [
          "API clients expose options like `messages` (system, user, assistant history), `temperature` (randomness bounds), and `response_format` (JSON schemas), providing a robust developer interface."
        ]
      }
    ],
    examples: [
      {
        title: "Strict JSON Mode Settings",
        lang: "python",
        code: `request_params = {\n    "model": "gpt-4o-mini",\n    "temperature": 0.0,\n    "response_format": {"type": "json_object"}\n}\nprint(request_params)`
      }
    ],
    decisionTable: [["Deterministic data extractions", "Temperature = 0.0 + JSON Mode", "Guarantees highly repeatable token output paths."]],
    sources: [["Anthropic Messages API", "https://docs.anthropic.com/en/api/messages"]]
  },
  "3.3": {
    lede: "A production prompt is a structured module. We isolate instructions, few-shot examples, and user variables using structural XML tags.",
    sections: [
      {
        title: "Prompt Architecture and XML Boundaries",
        body: [
          "We structure prompts into system roles, static instructions, few-shot examples, and dynamic context windows using clear XML tags (e.g., `<system>`, `<examples>`). We prefill assistant turns to guarantee JSON formats."
        ]
      }
    ],
    examples: [
      {
        title: "Prefilled Assistant Turn Prompt",
        lang: "python",
        code: `messages = [\n    {"role": "system", "content": "Output JSON matching {id: int}"},\n    {"role": "user", "content": "Extract ID from user 102"},\n    {"role": "assistant", "content": "{\\"id\\":"}\n]\nprint(messages)`
      }
    ],
    decisionTable: [["Enforcing JSON schema formats", "XML tags + Assistant Prefill", "Forces the model to skip prose prefixes and output clean JSON."]],
    sources: [["Anthropic Prompt Design", "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/use-xml-tags"]]
  },
  "3.4": {
    lede: "Core prompt engineering structures information cleanly. We leverage zero-shot, few-shot, and COSTAR frameworks to guide model outputs.",
    sections: [
      {
        title: "Zero-Shot vs Few-Shot Examples",
        body: [
          "Zero-shot relies entirely on instruction. Few-shot supplies 2-3 concrete input-output examples directly inside the context. This pattern is the single best way to establish complex data outputs in production."
        ]
      }
    ],
    examples: [
      {
        title: "Few-Shot Classification Prompt",
        lang: "python",
        code: `prompt = \"\"\"\nClassify support emails.\nInput: I need a refund.\nOutput: BILLING\nInput: The link is broken.\nOutput: BUG\nInput: My password fails.\nOutput:\"\"\"\nprint(prompt)`
      }
    ],
    decisionTable: [["Teaching complex formatting rules", "Few-shot conditioning", "Outperforms long prose rules by demonstrating target outputs."]],
    sources: [["COSTAR Prompt Framework", "https://towardsdatascience.com/c-o-s-t-a-r-framework-for-prompt-engineering/"]]
  },
  "3.5": {
    lede: "Different tasks require different prompt designs. We construct custom patterns for extraction, classification, translation, and query decomposition.",
    sections: [
      {
        title: "Applied Prompt Patterns for Data Processing",
        body: [
          "We customize prompt designs based on the task: entity extraction uses JSON schemas, classification uses strict tag limits, translation preserves markup tags, and decomposition splits large queries into parallel steps."
        ]
      }
    ],
    examples: [
      {
        title: "Decomposition Schema Prompt",
        lang: "python",
        code: `query = "Compare sales in US and EU"\nsub_queries = [\n    "Get sales metrics for US",\n    "Get sales metrics for EU"\n]\nprint(f"Decomposed: {sub_queries}")`
      }
    ],
    decisionTable: [["Processing multi-part queries", "Decomposition pattern", "Splits complex requests into easier parallel steps."]],
    sources: [["Prompt Patterns Repository", "https://github.com/dair-ai/Prompt-Engineering-Guide"]]
  },
  "3.6": {
    lede: "Advanced reasoning patterns structure logic explicitly. We implement Chain of Thought, self-reflection loops, and tree-of-thought pathways.",
    sections: [
      {
        title: "Chain of Thought and Critique Loops",
        body: [
          "Chain of Thought ('think step-by-step') ensures models calculate intermediate steps. Self-reflection loops prompt the model to critique its own drafts, catching errors before final output generation."
        ]
      }
    ],
    examples: [
      {
        title: "Self-Reflection Orchestrator",
        lang: "python",
        code: `draft = "Here is the SQL: SELECT * FROM customer;"\ncritique = "Safety alert: This selects all rows without a limit."\nrefined = f"Refined SQL: {draft} LIMIT 100;"\nprint(refined)`
      }
    ],
    decisionTable: [["High-value code generation", "Self-Reflection Loop", "Runs automated evaluations to detect code issues before execution."]],
    sources: [["Chain of Thought Paper", "https://arxiv.org/abs/2201.11903"]]
  },
  "3.7": {
    lede: "In production, prompts are version-controlled assets. We optimize cost and latency using prompt caching and programmatic prompt compilers.",
    sections: [
      {
        title: "Prompt Caching and DSPy Compilers",
        body: [
          "Large prompt prefixes are expensive to process repeatedly. We apply prompt caching headers to cut input costs by up to 90%. We use DSPy to automatically optimize instructions and few-shot examples against validation datasets."
        ]
      }
    ],
    examples: [
      {
        title: "Prompt Cache Tag Schema",
        lang: "python",
        code: `cache_payload = {\n    "role": "system",\n    "content": "MASSIVE SYSTEM PROMPT RULES",\n    "cache_control": {"type": "ephemeral"} # Instructs API gateway to cache\n}\nprint(cache_payload)`
      }
    ],
    decisionTable: [["Massive persistent system handbooks", "Prompt Caching", "Reduces API costs and latencies by caching static instructions."]],
    sources: [["Anthropic Prompt Caching", "https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching"]]
  },

  // PHASE 4: RAG + Evaluation
  "4.1": {
    lede: "RAG grounds model completions in custom facts. It solves context limitations by retrieving source documents and placing them inside the context window.",
    sections: [
      {
        title: "The Open-Book Exam Analogy",
        body: [
          "An LLM's weights are like its memory for an exam. RAG is like giving the model an open-book exam: before answering, we retrieve the exact relevant page of a document, place it in the context window, and tell the model to answer from it."
        ]
      }
    ],
    examples: [
      {
        title: "Grounded RAG Prompt",
        lang: "python",
        code: `def build_rag_prompt(query: str, retrieved_fact: str) -> str:\n    return f"Context: {retrieved_fact}\\nQuery: {query}\\nAnswer only from Context."\nprint(build_rag_prompt("Who is CEO?", "Fact: Balaji is CEO."))`
      }
    ],
    decisionTable: [["Answering from private policies", "Retrieval-Augmented Generation", "Ensures answers are grounded in private, dynamic corporate data."]],
    sources: [["Retrieval-Augmented Generation Paper", "https://arxiv.org/abs/2005.11401"]]
  },
  "4.2": {
    lede: "Embeddings map text to multi-dimensional coordinate spaces, representing semantic meaning. We select models based on dimension sizes, latencies, and costs.",
    sections: [
      {
        title: "Vector Embeddings and Proximity Metrics",
        body: [
          "Embedding models convert text into long lists of floats (e.g., 1536 coordinates). We calculate semantic similarity using distance metrics (like Cosine distance, Euclidean distance, or Dot Product)."
        ]
      }
    ],
    examples: [
      {
        title: "Cosine Proximity Scorer",
        lang: "python",
        code: `import numpy as np\n\ndef cosine_similarity(a, b):\n    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))\n\nprint(f"Similarity: {cosine_similarity([1.0, 0.2], [0.9, 0.35]):.4f}")`
      }
    ],
    decisionTable: [["Calculating semantic distance", "Cosine Similarity", "Measures conceptual proximity, ignoring text length variances."]],
    sources: [["OpenAI Embeddings Guide", "https://platform.openai.com/docs/guides/embeddings"]]
  },
  "4.3": {
    lede: "Ingestion is where RAG pipelines succeed or fail. We identify layouts and extract tables cleanly using advanced parsers rather than plain text converters.",
    sections: [
      {
        title: "High-Fidelity Document Ingestion",
        body: [
          "PDFs contain complex structural elements: headings, tables, columns, and code blocks. Using standard text slicers (like PyMuPDF) converts tables to gibberish. We use layout-aware parsers like Docling to preserve table structures in structured Markdown."
        ]
      }
    ],
    examples: [
      {
        title: "Layout-Aware Parsing Block",
        lang: "python",
        code: `# Conceptual Docling ingestion flow\n# doc = DoclingParser.parse("contract.pdf")\n# print(doc.tables[0].to_markdown())\nprint("Parsed table cell rows successfully into Markdown format.")`
      }
    ],
    decisionTable: [["Parsing multi-column legal PDFs", "Docling Parser", "Preserves reading orders, lists, and table rows cleanly."]],
    sources: [["Docling Ingestion Library", "https://ds4sd.github.io/docling/"]]
  },
  "4.4": {
    lede: "Chunking defines the unit of retrieval. We split text along structural semantic boundaries rather than fixed character limits.",
    sections: [
      {
        title: "Chunking Strategies and Hierarchy",
        body: [
          "Fixed character chunking splits sentences in half, causing retrieval failure. We implement Semantic Heading Chunking to split along heading boundaries, and Parent-Child mapping to retrieve small chunks while passing larger parent contexts to the model."
        ]
      }
    ],
    examples: [
      {
        title: "Parent-Child Mapping Schema",
        lang: "python",
        code: `parent_chunk = "This is H2. Remote employees can work from home 3 days a week."\nchild_chunk_1 = "work from home 3 days"\nmapping = {"child_id": "child_1", "parent_id": "parent_1", "parent_text": parent_chunk}\nprint(mapping)`
      }
    ],
    decisionTable: [["Dividing documents logically", "Semantic Heading Chunking", "Preserves paragraph and table integrity."]],
    sources: [["RAG Chunking Strategies", "https://python.langchain.com/docs/concepts/chunking/"]]
  },
  "4.5": {
    lede: "Chunk enrichment adds searchable properties. We extract entities, generate key phrases, and redact sensitive PII before index writing.",
    sections: [
      {
        title: "Ingestion Enrichment and PII Redaction",
        body: [
          "Before indexing, we enrich chunks by generating metadata: keywords, entities, and summaries. To guarantee data privacy, we run PII redaction pipelines to mask credit cards, names, and social security numbers."
        ]
      }
    ],
    examples: [
      {
        title: "PII Redactor regex",
        lang: "python",
        code: `import re\n\ndef redact_ssn(text: str) -> str:\n    return re.sub(r"\\d{3}-\\d{2}-\\d{4}", "###-##-####", text)\n\nprint(redact_ssn("User SSN is 123-45-6789"))`
      }
    ],
    decisionTable: [["Safeguarding customer privacy", "PII Redaction filter", "Masks sensitive parameters before writing to vector indexes."]],
    sources: [["Microsoft Presidio PII Analyzer", "https://microsoft.github.io/presidio/"]]
  },
  "4.6": {
    lede: "Vector databases store embeddings and retrieve nearest neighbors. We select index configurations based on search latency, recall accuracy, and cost constraints.",
    sections: [
      {
        title: "Vector Databases and Index Topologies",
        body: [
          "Vector databases (Pinecone, pgvector) use approximate nearest neighbor (ANN) indexes to speed up search. We configure HNSW (navigable graphs for high recall, high memory costs) or IVF (clustered indexes for fast speeds, lower memory footprints) depending on constraints."
        ]
      }
    ],
    examples: [
      {
        title: "Local pgvector Configuration Schema",
        lang: "python",
        code: `# pgvector SQL index creation command\nsql_index = "CREATE INDEX ON items USING hnsw (embedding vector_cosine_ops);"\nprint(sql_index)`
      }
    ],
    decisionTable: [["High-accuracy vector indexing", "HNSW Index", "Provides excellent recall rates at the cost of higher memory usage."]],
    sources: [["pgvector index guide", "https://github.com/pgvector/pgvector"]]
  },
  "4.7": {
    lede: "Vector similarity search frequently misses exact terms or rare IDs. We combine semantic vector and lexical BM25 search to build hybrid pipelines.",
    sections: [
      {
        title: "Hybrid Search and Cross-Encoder Rerankers",
        body: [
          "We implement Hybrid Search by combining dense vectors (for semantic synonyms) and sparse BM25 (for exact keywords), merging them via Reciprocal Rank Fusion (RRF). We pass candidates to a Cross-Encoder Reranker to filter out irrelevant chunks."
        ]
      }
    ],
    examples: [
      {
        title: "RRF Score Aggregator",
        lang: "python",
        code: `def rrf_score(dense_rank: int, sparse_rank: int, k: int = 60) -> float:\n    return (1.0 / (k + dense_rank)) + (1.0 / (k + sparse_rank))\nprint(f"RRF score (ranks 1 & 2): {rrf_score(1, 2):.5f}")`
      }
    ],
    decisionTable: [["Production RAG systems", "Hybrid + Reranker", "Maximizes retrieval precision and recall metrics."]],
    sources: [["Cohere Rerank API", "https://docs.cohere.com/docs/rerank-overview"]]
  },
  "4.8": {
    lede: "Vector search struggle with complex multi-hop relationships. We construct Graph-augmented RAG pipelines to map explicit, structured relationships.",
    sections: [
      {
        title: "Graph Databases and Cypher Multi-Hop Queries",
        body: [
          "Vector search cannot naturally answer queries like 'Which other trials used Drug X for Condition Y?'. We use graph databases (Neo4j) to map explicit relationships and execute Cypher queries to retrieve precise, multi-hop facts."
        ]
      }
    ],
    examples: [
      {
        title: "Cypher Graph Query",
        lang: "python",
        code: `cypher_query = \"\"\"\nMATCH (d:Drug {name: "X"})-[:USED_FOR]->(c:Condition)\nRETURN c.name\n\"\"\"\nprint(cypher_query.strip())`
      }
    ],
    decisionTable: [["Querying explicit data relationships", "Neo4j Graph Database", "Solves multi-hop relationship queries that vector search misses."]],
    sources: [["Neo4j Cypher Manual", "https://neo4j.com/docs/cypher-manual/current/"]]
  },
  "4.9": {
    lede: "Manual vibe-checking is brittle. Building production RAG requires scoring pipelines quantitatively using the RAG Triad and automated judges.",
    sections: [
      {
        title: "The RAG Triad and Quantitative Evaluation",
        body: [
          "We score RAG pipelines using the RAG Triad: **Context Relevance** (does the retriever fetch clean context?), **Groundedness** (is the answer fully supported by context?), and **Answer Relevance** (does it answer the query?). We automate evaluations using Ragas."
        ]
      }
    ],
    examples: [
      {
        title: "RAG Evaluation Scorer",
        lang: "python",
        code: `metrics = {"context_relevance": 0.95, "faithfulness": 0.90, "answer_relevance": 0.85}\ntriad_avg = sum(metrics.values()) / len(metrics)\nprint(f"Triad Score: {triad_avg:.4f}")`
      }
    ],
    decisionTable: [["Automated pipeline monitoring", "RAG Triad + Ragas", "Verifies both retrieval and generation accuracy continuously."]],
    sources: [["Ragas Evaluation Docs", "https://docs.ragas.io/"]]
  },

  // PHASE 5: Tools, MCP, & Single Agents
  "5.1": {
    lede: "Function calling lets models request external actions by outputting JSON instead of prose. We parse these tool intents and run them in local code.",
    sections: [
      {
        title: "Function Calling Mechanics and JSON Schemas",
        body: [
          "We define tools using Pydantic models, converting them into standard JSON schemas. The model reads the schema and outputs a structured tool-call block, which the application parses and executes cleanly."
        ]
      }
    ],
    examples: [
      {
        title: "Tool Call JSON Parser",
        lang: "python",
        code: `import json\n\ndef parse_tool_arguments(raw_json: str) -> dict:\n    try:\n        return json.loads(raw_json)\n    except json.JSONDecodeError:\n        return {"error": "Invalid JSON format"}\nprint(parse_tool_arguments('{"user_id": 10}'))`
      }
    ],
    decisionTable: [["Exposing API endpoints to models", "Pydantic Schema compilation", "Enforces strict parameter typing during function calling."]],
    sources: [["OpenAI Function Calling", "https://platform.openai.com/docs/guides/function-calling"]]
  },
  "5.2": {
    lede: "A good tool does one job well. We design robust tools using strict argument boundaries, clear docstrings, and clean structured outputs.",
    sections: [
      {
        title: "Tool Design and Error Fallbacks",
        body: [
          "Models read tool docstrings to understand *how* and *when* to invoke them. We write precise descriptions, return structured JSON data (never raw prose), and catch exceptions gracefully, returning errors to the model."
        ]
      }
    ],
    examples: [
      {
        title: "Structured Tool Implementation",
        lang: "python",
        code: `def calculate_discount(price: float, discount: float) -> dict:\n    \"\"\"Calculate discounted total. Arguments must be floats.\"\"\"\n    if price < 0 or discount < 0:\n        return {"error": "Negative values prohibited", "success": False}\n    return {"total": price * (1.0 - discount), "success": True}\nprint(calculate_discount(100.0, 0.15))`
      }
    ],
    decisionTable: [["Constructing robust agent tools", "Clear Docstrings + structured JSON return", "Guides model routing and prevents code crashes during execution."]],
    sources: [["LangChain Custom Tools", "https://python.langchain.com/docs/how_to/custom_tools/"]]
  },
  "5.3": {
    lede: "The Model Context Protocol (MCP) standardizes how AI applications connect to data sources and tools, replacing custom integrations with a universal client-server boundary.",
    sections: [
      {
        title: "Model Context Protocol Primitives",
        body: [
          "MCP establishes standard interfaces for tools, resources (static files), and prompt templates. Clients connect to MCP servers over standard transports like stdio pipes or HTTP Server-Sent Events (SSE)."
        ]
      }
    ],
    examples: [
      {
        title: "MCP Resource Schema",
        lang: "python",
        code: `mcp_resource = {\n    "uri": "postgres://schema/public",\n    "name": "Database Schema Reference",\n    "mimeType": "application/json"\n}\nprint(mcp_resource)`
      }
    ],
    decisionTable: [["Universal tool client-server connections", "Model Context Protocol (MCP)", "Standardizes tool and resource discoverability for model clients."]],
    sources: [["Model Context Protocol Home", "https://modelcontextprotocol.io/"]]
  },
  "5.4": {
    lede: "The ReAct pattern structures agent execution into a clean cycle: Thought, Action, Observation. We govern this loop with strict iteration bounds.",
    sections: [
      {
        title: "The ReAct Loop and Budget Enforcements",
        body: [
          "Unbounded loops can run indefinitely if a tool crashes, causing API cost explosions. We structure execution into the ReAct cycle and enforce hard limits (e.g., maximum 5 iterations) to shut down runaway agents."
        ]
      }
    ],
    examples: [
      {
        title: "Bounded Run Loop",
        lang: "python",
        code: `def run_react_agent(steps_limit: int):\n    step = 0\n    while step < steps_limit:\n        step += 1\n        print(f"Agent Loop Step: {step}")\n    print("Loop terminated by budget limit.")\nrun_react_agent(3)`
      }
    ],
    decisionTable: [["Defending against runaway agents", "Hard iteration loop limits", "Prevents cost surges by shutting down looping calls."]],
    sources: [["ReAct Pattern Paper", "https://arxiv.org/abs/2210.03629"]]
  },
  "5.5": {
    lede: "LangChain abstracts common agent architectures. We compile agents with models, tools, and structured outputs cleanly using library wrappers.",
    sections: [
      {
        title: "LangChain Agent Compilations",
        body: [
          "We use LangChain abstractions to bundle model providers, tool definitions (`@tool`), memory checkpointers, and output parsers, reducing orchestration boilerplate in simple applications."
        ]
      }
    ],
    examples: [
      {
        title: "LangChain Tool Annotation",
        lang: "python",
        code: `# Mocking LangChain tool registration\ndef tool_decorator(parse_docstring=True):\n    return lambda fn: fn\n\n@tool_decorator(parse_docstring=True)\ndef get_weather(city: str) -> str:\n    \"\"\"Fetch current weather.\"\"\"\n    return f"Warm in {city}"\n\nprint(get_weather("Paris"))`
      }
    ],
    decisionTable: [["Reducing client connector boilerplate", "LangChain Agent wrappers", "Speeds up initial development of standard chat and tool architectures."]],
    sources: [["LangChain Agent Documentation", "https://python.langchain.com/docs/concepts/agents/"]]
  },
  "5.6": {
    lede: "High-risk tool actions require human validation. We implement pause-and-resume checkpointers to pause execution for human approvals.",
    sections: [
      {
        title: "Human-in-the-Loop Approval Gateways",
        body: [
          "For sensitive actions (like financial charges, database updates, or sending emails), we save the complete agent execution state to memory or disk, raise a pause flag, and wait for human confirmation via webhooks."
        ]
      }
    ],
    examples: [
      {
        title: "Pause-and-Resume State Flag",
        lang: "python",
        code: `def execute_sensitive_action(state: dict) -> str:\n    if state.get("approved", False):\n        return "Executed Payment Transaction."\n    state["status"] = "PAUSED"\n    return "Hold: Paused for Human Approval."\n\nstate_context = {"approved": False, "status": "ACTIVE"}\nprint(execute_sensitive_action(state_context))`
      }
    ],
    decisionTable: [["Executing client financial charges", "Pause-and-resume checkpointer", "Enforces mandatory human validation before high-risk database writes."]],
    sources: [["LangGraph Human-in-the-loop", "https://langchain-ai.github.io/langgraph/concepts/human_in_the_loop/"]]
  },
  "5.7": {
    lede: "External tools present severe security risks. We protect resources using input sanitizers, read-only permissions, and network timeouts.",
    sections: [
      {
        title: "Tool Security Boundaries and Sandboxing",
        body: [
          "A tool return can contain malicious prompt injections. We scan and sanitize tool outputs, execute untrusted scripts inside isolated sandboxes, enforce read-only database connections, and set strict network timeouts."
        ]
      }
    ],
    examples: [
      {
        title: "Read-Only Database Query Guard",
        lang: "python",
        code: `def secure_sql_guard(query: str) -> str:\n    forbidden = ["delete", "drop", "update", "insert"]\n    if any(cmd in query.lower() for cmd in forbidden):\n        raise PermissionError("Write access is prohibited on this read-only query tool.")\n    return f"Executing Query: {query}"\n\ntry:\n    secure_sql_guard("DELETE FROM customer;")\nexcept PermissionError as e:\n    print(e)`
      }
    ],
    decisionTable: [["Executing user-submitted SQL inputs", "Sanitizer Guard + Read-only DB connection", "Prevents table drop mutations and SQL injections."]],
    sources: [["OWASP LLM Security Top 10", "https://owasp.org/www-project-top-10-for-large-language-model-applications/"]]
  },
  "5.8": {
    lede: "Computer-use and browser agents operate directly through user interfaces. Exposing these tools requires isolated sandboxes, screenshot trails, and strict confirmation gates.",
    sections: [
      {
        title: "UI Automation and Computer-Use Sandboxes",
        body: [
          "When no API exists, we use browser automation (Playwright) to control legacy UIs. Because parsing DOM coordinates is unstable, we isolate browser execution inside secure Docker containers, record screenshot trails, and apply strict domain allowlists."
        ]
      }
    ],
    examples: [
      {
        title: "Browser Action Log",
        lang: "python",
        code: `browser_action = {\n    "action": "click",\n    "selector": "#submit-btn",\n    "screenshot_path": "logs/step_2.png",\n    "domain_allowlist": ["internal.company.com"]\n}\nprint(browser_action)`
      }
    ],
    decisionTable: [["Integrating with legacy legacy interfaces", "Playwright inside Docker sandbox", "Controls user interfaces safely, tracking audit logs."]],
    sources: [["Anthropic Computer Use API", "https://docs.anthropic.com/en/docs/build-with-claude/computer-use"]]
  },

  // PHASE 6: Memory & Context Engineering
  "6.1": {
    lede: "Context windows represent the model's working memory. Overfilling contexts dilutes attention, increases cost, and triggers recency biases.",
    sections: [
      {
        title: "Working Memory Limits and Budget Allocation",
        body: [
          "The context window holds system instructions, retrieved data, and conversation history. Because models have finite capacities, we calculate exact token budgets for each section to prevent silent text truncation."
        ]
      }
    ],
    examples: [
      {
        title: "Dynamic Context Planner",
        lang: "python",
        code: `def context_allocator(tokens_in: int, limit: int = 4000) -> dict:\n    return {\n        "system": 1000,\n        "history": 1500,\n        "available_rag": max(0, limit - 1000 - 1500 - tokens_in)\n    }\nprint(context_allocator(500))`
      }
    ],
    decisionTable: [["Allocating context dynamically", "Calculated section budgets", "Prevents truncation failures by enforcing strict boundaries."]],
    sources: [["LLM Context Limits Overview", "https://platform.openai.com/docs/guides/text-generation"]]
  },
  "6.2": {
    lede: "Prompt structure determines instruction adherence. We organize layouts cleanly, separating system instructions, facts, and user messages.",
    sections: [
      {
        title: "System / Context / User Isolation Guidelines",
        body: [
          "We arrange prompt contexts systematically: system guidelines at the top, retrieved facts inside XML tags in the middle, and the user's latest query at the bottom. This layout utilizes recency bias to ensure high model instruction adherence."
        ]
      }
    ],
    examples: [
      {
        title: "Context Isolation Template",
        lang: "python",
        code: `def build_prompt_structure(system, context, query):\n    return f"<SYSTEM>{system}</SYSTEM>\\n<CONTEXT>{context}</CONTEXT>\\n<USER>{query}</USER>"\nprint(build_prompt_structure("Be concise", "Source A", "Answer?"))`
      }
    ],
    decisionTable: [["Preventing prompt injection hijacks", "Delimited XML Section structures", "Isolates untrusted data from core system directions."]],
    sources: [["Prompt Engineering Guidelines", "https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview"]]
  },
  "6.3": {
    lede: "Short-term memory manages active session history. We implement sliding message windows to maintain conversation context within budget boundaries.",
    sections: [
      {
        title: "Sliding Message-Pair Queues",
        body: [
          "To prevent context bloat, we slide a message history window, keeping only the last N turns verbatim. We ensure we never split message pairs, preserving matching user-assistant turns to keep references coherent."
        ]
      }
    ],
    examples: [
      {
        title: "Message Pair History Trimmer",
        lang: "python",
        code: `def trim_history(messages: list, keep_turns: int) -> list:\n    # 1 turn is 1 user + 1 assistant message\n    return messages[-keep_turns * 2:]\nprint(trim_history([{"u": 1}, {"a": 1}, {"u": 2}, {"a": 2}], 1))`
      }
    ],
    decisionTable: [["Maintaining multi-turn chat loops", "Sliding message-pair window", "Keeps context footprint small while preserving recent context."]],
    sources: [["LangChain Short-Term Memory", "https://python.langchain.com/docs/concepts/memory/"]]
  },
  "6.4": {
    lede: "Semantic caching reuses model answers when queries are highly similar, lowering latencies to <5ms and cutting API costs to zero.",
    sections: [
      {
        title: "FAISS Vector Caches and Similarity Thresholds",
        body: [
          "We construct a Semantic Cache using local vector indexes (FAISS). When a user query matches a past query above a strict similarity threshold (e.g., 0.97), we return the cached response immediately, bypassing model invocation."
        ]
      }
    ],
    examples: [
      {
        title: "Semantic Cache Logic",
        lang: "python",
        code: `def check_semantic_cache(similarity_score: float, threshold: float = 0.97) -> str:\n    if similarity_score >= threshold:\n        return "CACHE_HIT: Returning stored answer."\n    return "CACHE_MISS: Calling model provider."\nprint(check_semantic_cache(0.98))`
      }
    ],
    decisionTable: [["Exposing high-frequency QA routes", "FAISS Semantic Cache", "Delivers sub-5ms response times, saving model token billings."]],
    sources: [["FAISS Vector Library", "https://github.com/facebookresearch/faiss"]]
  },
  "6.5": {
    lede: "Episodic memory saves conversational highlights. We index notable facts and retrieve them dynamically to personalize responses.",
    sections: [
      {
        title: "Episodic Fact Indexing and Context Enrichment",
        body: [
          "We use a secondary background loop to scan chat history. If the model tags an event as worth remembering (e.g., 'user has subscription A'), we write it as an episodic fact, dynamically retrieving it to enrich future prompts."
        ]
      }
    ],
    examples: [
      {
        title: "Episodic Fact Schema",
        lang: "python",
        code: `episodic_record = {\n    "fact_id": "fact_502",\n    "category": "preference",\n    "text": "User uses Python rather than TypeScript.",\n    "timestamp": 178000000\n}\nprint(episodic_record)`
      }
    ],
    decisionTable: [["Personalizing developer preferences", "Episodic fact indexing", "Retrieves contextually relevant facts on-demand."]],
    sources: [["LangChain InMemoryStore", "https://python.langchain.com/docs/how_to/store/"]]
  },
  "6.6": {
    lede: "Large histories exceed token budgets. We apply context compression to summarize old chat turns while keeping recent turns verbatim.",
    sections: [
      {
        title: "Context Compression Triggers and Detail Loss",
        body: [
          "When conversation history exceeds a trigger threshold (e.g., 3000 tokens), we ask a model to summarize older turns into a concise paragraph. We append this summary to the system prompt, keeping only the last 5 turns verbatim."
        ]
      }
    ],
    examples: [
      {
        title: "Compressed History Prompt Layout",
        lang: "python",
        code: `prompt = \"\"\"\n<summary>Previously, the user asked for billing updates and was told to write in.</summary>\n[USER]: What is the email address again?\n[ASSISTANT]:\n\"\"\"\nprint(prompt.strip())`
      }
    ],
    decisionTable: [["Long conversational session support", "Threshold context compression", "Maintains dialogue continuity under tight token limits."]],
    sources: [["LLM Context Compression strategies", "https://arxiv.org/abs/2310.03138"]]
  },
  "6.7": {
    lede: "Long-term memory stores durable user facts across sessions. We manage storage using profile relational stores and ensure strict GDPR compliance.",
    sections: [
      {
        title: "Durable Profile Stores and Right to be Forgotten",
        body: [
          "We persist structured user facts (like names or billing tiers) in relational profile databases. Under GDPR privacy regulations, we guarantee absolute tenant isolation and build clean data deletion pathways to delete all user indexes on demand."
        ]
      }
    ],
    examples: [
      {
        title: "Durable Fact Deletion Command",
        lang: "python",
        code: `def purge_user_memory(user_id: str):\n    # Deletes relational states and vector indices matching tenant ID\n    print(f"Purged user: {user_id} from Postgres & Vector index tables. GDPR compliant.")\npurge_user_memory("user_50")`
      }
    ],
    decisionTable: [["Durable profile storage", "Postgres Relational DB + delete cascades", "Guarantees complete GDPR right-to-be-forgotten deletion compliance."]],
    sources: [["GDPR Right to Erasure", "https://gdpr-info.eu/art-17-gdpr/"]]
  },

  // PHASE 7: Multi-Agent Orchestration
  "7.1": {
    lede: "Single-agent architectures fail when tasks become too broad. We decide when to transition to multi-agent orchestrations by weighing specialized accuracy against network overhead.",
    sections: [
      {
        title: "When to Go Multi-Agent",
        body: [
          "Single-agent-with-tools works for 80% of tasks. We transition to multi-agent networks only when sub-steps require distinct permissions, completely different prompt instructions, or specialized diagnostic domains."
        ]
      }
    ],
    examples: [
      {
        title: "Graph Workload Analysis Heuristic",
        lang: "python",
        code: `def check_agent_split(tools: list) -> bool:\n    # If an agent has too many complex, conflicting tools, split it\n    return len(tools) > 10\nprint(f"Should split? {check_agent_split(range(12))}")`
      }
    ],
    decisionTable: [["Exposing massive conflicting toolsets", "Decompose into specialized Workers", "Lowers planning model confusion and increases task success rates."]],
    sources: [["Anthropic: Building Effective Agents", "https://www.anthropic.com/research/building-effective-agents"]]
  },
  "7.2": {
    lede: "LangGraph models agent execution as directed cyclical graphs. We define state transitions using StateGraph, nodes, and conditional edges.",
    sections: [
      {
        title: "LangGraph StateGraph and Node Architecture",
        body: [
          "We model multi-agent networks using LangGraph: **Nodes** are Python functions that execute work, **Edges** connect nodes, and **StateGraph** maintains a shared state. Checkpointers enable persistence."
        ]
      }
    ],
    examples: [
      {
        title: "LangGraph State Schema Definition",
        lang: "python",
        code: `class State:\n    def __init__(self):\n        self.messages = []\n        self.next_node = "planner"\nstate = State()\nprint(f"Graph State Initialized. Next: {state.next_node}")`
      }
    ],
    decisionTable: [["Cyclical, planning agent workflows", "LangGraph StateGraph", "Allows complex loop transitions and state persistence out of the box."]],
    sources: [["LangGraph Fundamentals", "https://langchain-ai.github.io/langgraph/"]]
  },
  "7.3": {
    lede: "Production graphs follow structured coordinate patterns. We deploy supervisor-workers, sequential pipelines, and plan-and-execute workflows.",
    sections: [
      {
        title: "Orchestration Patterns and State Routing",
        body: [
          "We structure our workflows based on complexity: linear tasks use sequential pipelines, complex assignments use a central supervisor node to dispatch specialized workers, and long planning tasks use plan-and-execute nodes."
        ]
      }
    ],
    examples: [
      {
        title: "Plan-and-Execute Task List",
        lang: "python",
        code: `plan = ["Extract data", "Generate report", "Format JSON"]\ncompleted = []\nwhile plan:\n    task = plan.pop(0)\n    completed.append(f"Ran: {task}")\nprint(completed)`
      }
    ],
    decisionTable: [["Complex exploratory code audits", "Supervisor + Specialist workers", "Leverages specialists managed by a central planning supervisor."]],
    sources: [["Multi-Agent Design Patterns", "https://langchain-ai.github.io/langgraph/concepts/multi_agent/"]]
  },
  "7.4": {
    lede: "Cyclical graphs introduce high debugging and state-plumbing overhead. Wrapping sub-agents behind simple tool interfaces is a clean, lightweight alternative.",
    sections: [
      {
        title: "The Agent-as-a-Tool Pattern",
        body: [
          "We wrap specialized sub-agents behind a standard tool schema. The parent agent calls the sub-agent like a simple function call, keeping internal states isolated and interfaces clean."
        ]
      }
    ],
    examples: [
      {
        title: "Sub-Agent Tool Wrapper",
        lang: "python",
        code: `class ResearchSubAgent:\n    def run(self, query: str) -> str:\n        return f"Research results on {query}"\n\ndef research_tool(query: str) -> str:\n    # Parent agent calls this tool; sub-agent handles execution internally\n    return ResearchSubAgent().run(query)\n\nprint(research_tool("caching"))`
      }
    ],
    decisionTable: [["Modular specialist team assemblies", "Agent-as-a-Tool pattern", "Keeps graph state isolated and avoids massive cyclical graphs."]],
    sources: [["LangGraph Agent-as-a-tool guide", "https://langchain-ai.github.io/langgraph/how-tos/agent-as-tool/"]]
  },
  "7.5": {
    lede: "State persistence enables robust error recovery. We manage graph states using Pydantic classes, reducers, and database checkpointers.",
    sections: [
      {
        title: "Shared States, Reducers, and Checkpointers",
        body: [
          "Nodes write updates to a shared Pydantic state. We use reducers to merge updates (e.g. appending elements to list arrays), and checkpointers (SQLite/Postgres) to persist state for fault recovery."
        ]
      }
    ],
    examples: [
      {
        title: "Pydantic State Reducer Logic",
        lang: "python",
        code: `# Simulated State Reducer\nclass StateStore:\n    def __init__(self):\n        self.messages = []\n    def update(self, new_messages: list):\n        # Reducer: appends messages instead of overwriting history\n        self.messages.extend(new_messages)\n\nstore = StateStore()\nstore.update(["hello"])\nstore.update(["world"])\nprint(store.messages)`
      }
    ],
    decisionTable: [["Recovering from server crashes", "Database Checkpointer (PostgresSaver)", "Allows agents to resume exactly from their last saved step."]],
    sources: [["LangGraph Persistence", "https://langchain-ai.github.io/langgraph/concepts/persistence/"]]
  },
  "7.6": {
    lede: "Agent-to-Agent (A2A) protocols allow models to delegate tasks across different frameworks and servers, expanding system capabilities.",
    sections: [
      {
        title: "A2A Primitives and Capability Cards",
        body: [
          "We implement Agent-to-Agent protocols using capability cards: JSON descriptors advertising an agent's specialized tools and schemas, enabling models to discover and delegate tasks to remote agents."
        ]
      }
    ],
    examples: [
      {
        title: "Agent Capability Card",
        lang: "python",
        code: `capability_card = {\n    "agent_id": "sql_agent_5",\n    "domain": "Sales database queries",\n    "input_schema": {"query": "string"}\n}\nprint(capability_card)`
      }
    ],
    decisionTable: [["Cross-framework agent delegation", "A2A Protocol Schema", "Enables different agent systems to communicate and coordinate cleanly."]],
    sources: [["A2A protocol discussions", "https://arxiv.org/abs/2402.03578"]]
  },
  "7.7": {
    lede: "Different agent frameworks satisfy different engineering needs. We compare LangGraph, Pydantic AI, and custom asyncio state engines.",
    sections: [
      {
        title: "Framework Trade-offs and Capabilities",
        body: [
          "We select our framework based on requirements: LangGraph offers highly mature checkpointers, Pydantic AI offers strong type validation and developer ergonomics, and custom asyncio engines offer absolute execution control."
        ]
      }
    ],
    examples: [
      {
        title: "Custom Asyncio State Router",
        lang: "python",
        code: `async def step_router(state: str) -> str:\n    await asyncio.sleep(0.01)\n    return "validator" if state == "code_written" else "synthesizer"\nprint(asyncio.run(step_router("code_written")))`
      }
    ],
    decisionTable: [["Type-safe, FastAPI-aligned systems", "Pydantic AI", "Provides clean, type-safe development environments."]],
    sources: [["Pydantic AI Framework", "https://ai.pydantic.dev/"]]
  },
  "7.8": {
    lede: "Multi-agent systems are difficult to debug. We capture traces, enforce loop step caps, and isolate cost metrics to prevent credit drains.",
    sections: [
      {
        title: "Multi-Agent Telemetry and Runaway Bounds",
        body: [
          "We use multi-span traces (LangSmith) to map agent-to-agent call sequences. We set hard execution limits (e.g. max 15 steps) and cost tracking filters to shut down looping workflows before budgets are exhausted."
        ]
      }
    ],
    examples: [
      {
        title: "Runaway Loop Guard",
        lang: "python",
        code: `def validate_step_budget(current_step: int, limit: int = 10):\n    if current_step >= limit:\n        raise RuntimeError("Agent network loop terminated to prevent billing drain.")\n    print("Step safe.")\ntry:\n    validate_step_budget(10)\nexcept RuntimeError as e:\n    print(e)`
      }
    ],
    decisionTable: [["Monitoring nested multi-agent systems", "LangSmith Tracing + step limits", "Isolates and catches infinite loops and unexpected cost surges."]],
    sources: [["LangSmith Tracing Guide", "https://docs.smith.langchain.com/"]]
  },

  // PHASE 8: Guardrails & LLMOps
  "8.1": {
    lede: "Production guardrails must be applied in layered defensive barriers. We enforce input validation, action constraints, and output audits.",
    sections: [
      {
        title: "The Three-Layer Defensive Gate",
        body: [
          "AI security requires layered defense: **Input Guardrails** scan for injections under 5ms, **Action Guardrails** sanitize tools (enforcing read-only limits), and **Output Guardrails** run contradiction checks and inject fallbacks."
        ]
      }
    ],
    examples: [
      {
        title: "Multi-Layer Guardrail Scanner",
        lang: "python",
        code: `def scan_input(text: str) -> bool:\n    return "ignore previous" not in text.lower()\n\ndef scan_output(text: str) -> str:\n    if "secret_password" in text:\n        return "Filtered output."\n    return text\n\nprint(scan_input("Hello there"))\nprint(scan_output("The secret_password is: 123"))`
      }
    ],
    decisionTable: [["Layered API boundary security", "Three-Layer Guardrail Design", "Ensures complete system safety across the entire request lifecycle."]],
    sources: [["OWASP LLM Security Top 10", "https://owasp.org/www-project-top-10-for-large-language-model-applications/"]]
  },
  "8.2": {
    lede: "Managed guardrails simplify enterprise compliance. We deploy AWS Bedrock Guardrails to filter content and block sensitive topics.",
    sections: [
      {
        title: "Managed Guardrail Policies and Context Grounding",
        body: [
          "AWS Bedrock Guardrails provide managed safety filters. We configure policies to block specific toxic categories (hate, violence), filter PII automatically, and check grounding to ensure model responses remain on-topic."
        ]
      }
    ],
    examples: [
      {
        title: "Managed Grounding Schema",
        lang: "python",
        code: `bedrock_guardrail_config = {\n    "filters": [{"type": "HATE", "threshold": "HIGH"}],\n    "blocked_topics": ["medical_advice"],\n    "pii_action": "ANONYMIZE"\n}\nprint(bedrock_guardrail_config)`
      }
    ],
    decisionTable: [["Managed enterprise compliance", "AWS Bedrock Guardrails", "Provides simple, managed safety gates at scale."]],
    sources: [["AWS Bedrock Guardrails", "https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html"]]
  },
  "8.3": {
    lede: "Observability maps script metrics to production realities. We capture multi-span execution logs, token costs, and P95 latency metrics.",
    sections: [
      {
        title: "Observability, Telemetry, and Dashboards",
        body: [
          "We record execution logs using LangSmith or Langfuse. We aggregate performance metrics—P95/P99 latency times, token cost trends, and tool error rates—on centralized dashboards to monitor system health."
        ]
      }
    ],
    examples: [
      {
        title: "Trace Log Record",
        lang: "python",
        code: `trace_record = {\n    "trace_id": "tr_9901",\n    "endpoint": "/chat",\n    "latency_ms": 1280,\n    "input_tokens": 1024,\n    "output_tokens": 256,\n    "cost_usd": 0.0013\n}\nprint(trace_record)`
      }
    ],
    decisionTable: [["Isolating system bottlenecks", "Multi-span execution logging", "Exposes exact latency bottlenecks across databases, RAG, and APIs."]],
    sources: [["Langsmith Documentation", "https://docs.smith.langchain.com/"]]
  },
  "8.4": {
    lede: "AI updates must be tested quantitatively. We build CI/CD regression test suites using golden datasets and capture production user feedback loops.",
    sections: [
      {
        title: "CI/CD Regression Suites and Golden Datasets",
        body: [
          "To prevent prompt regression (where fixing bug A breaks feature B), we write automated CI/CD workflows that test every code commit against a golden dataset of 100 benchmark queries, blocking deployment if accuracy drops."
        ]
      }
    ],
    examples: [
      {
        title: "Golden Dataset Scorer",
        lang: "python",
        code: `golden_set = [{"q": "Breach cure term?", "a": "30 days"}]\nactual_replies = [{"q": "Breach cure term?", "a": "The policy requires 30 days."}]\n\npassed = sum(1 for g, r in zip(golden_set, actual_replies) if g["a"] in r["a"])\nprint(f"Regression Pass: {passed}/{len(golden_set)}")`
      }
    ],
    decisionTable: [["Deploying prompt edits safely", "CI/CD Golden Regression pipeline", "Ensures updates are validated against a test suite before release."]],
    sources: [["Langfuse Prompt Testing", "https://langfuse.com/docs/prompts/testing"]]
  },

  // PHASE 9: Cloud Infrastructure & Deployment
  "9.1": {
    lede: "Production AI systems require scalable data architectures. We select cloud storage tools based on transaction speed and persistence durability.",
    sections: [
      {
        title: "Storage Primitives: S3, RDS, and DynamoDB",
        body: [
          "We select our database based on storage requirements: AWS S3 holds unstructured raw documents, RDS PostgreSQL stores relational user states and pgvector indices, and DynamoDB holds pipeline job states."
        ]
      }
    ],
    examples: [
      {
        title: "S3 Object Upload Command",
        lang: "python",
        code: `s3_upload = {\n    "bucket": "document-lake-v1",\n    "key": "raw_contract.pdf",\n    "metadata": {"user_owner": "tenant_5"}\n}\nprint(s3_upload)`
      }
    ],
    decisionTable: [["Storing thousands of raw PDFs", "Amazon S3", "Offers highly durable, low-cost object storage for files."]],
    sources: [["AWS Storage Services", "https://aws.amazon.com/products/storage/"]]
  },
  "9.2": {
    lede: "AI compute architectures run Python workloads cleanly. We package applications in ECR registries and deploy on Lambda or ECS Fargate.",
    sections: [
      {
        title: "Compute Selection: Lambda vs ECS Fargate",
        body: [
          "We deploy short, event-driven pipelines on serverless AWS Lambda. Long-running, high-memory agent graphs are packaged into Docker images and hosted on serverless ECS Fargate containers."
        ]
      }
    ],
    examples: [
      {
        title: "FastAPI Dockerfile Template",
        lang: "dockerfile",
        code: `FROM python:3.13-slim\nWORKDIR /app\nCOPY pyproject.toml uv.lock ./\nRUN pip install uv && uv sync --frozen\nCOPY . .\nCMD ["uv", "run", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "80"]`
      }
    ],
    decisionTable: [["Hosting long-running agent workflows", "ECS Fargate containers", "Provides isolated, long-running environments without execution timeouts."]],
    sources: [["AWS ECS Fargate", "https://aws.amazon.com/fargate/"]]
  },
  "9.3": {
    lede: "Networking and access control secure systems. We configure VPC security groups and IAM roles to enforce the principle of least privilege.",
    sections: [
      {
        title: "Networking, VPC Subnets, and IAM Roles",
        body: [
          "We isolate our database and index instances in private VPC subnets. We enforce least privilege access control using AWS IAM roles, ensuring that container compute instances only have access to specific S3 buckets."
        ]
      }
    ],
    examples: [
      {
        title: "IAM Least Privilege Policy Schema",
        lang: "python",
        code: `iam_policy = {\n    "Effect": "Allow",\n    "Action": ["s3:GetObject"],\n    "Resource": ["arn:aws:s3:::document-lake-v1/*"]\n}\nprint(iam_policy)`
      }
    ],
    decisionTable: [["Securing database connections", "Private VPC Subnets + IAM Roles", "Prevents database exposure by restricting network traffic to private channels."]],
    sources: [["AWS IAM Guide", "https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html"]]
  },
  "9.4": {
    lede: "Selecting AI endpoints varies by cloud. We compare AWS Bedrock, GCP Vertex AI, and Azure AI models to establish model routing.",
    sections: [
      {
        title: "AWS Bedrock vs GCP Vertex AI vs Azure AI Foundry",
        body: [
          "Different clouds offer similar models: AWS Bedrock provides Claude, GCP Vertex AI provides Gemini, and Azure AI Foundry provides GPT. We select model backends based on cloud integration limits, costs, and availability."
        ]
      }
    ],
    examples: [
      {
        title: "Bedrock Invocation Config",
        lang: "python",
        code: `bedrock_config = {\n    "modelId": "anthropic.claude-3-5-sonnet-v2",\n    "contentType": "application/json",\n    "accept": "application/json"\n}\nprint(bedrock_config)`
      }
    ],
    decisionTable: [["AWS-native enterprise Claude hosting", "AWS Bedrock API", "Guarantees data compliance and private model invocation bounds."]],
    sources: [["AWS Bedrock Models", "https://aws.amazon.com/bedrock/"]]
  },
  "9.5": {
    lede: "Waiting for full completions creates poor user experiences. We configure FastAPI generators to stream responses using Server-Sent Events.",
    sections: [
      {
        title: "Streaming Responses over HTTP Server-Sent Events",
        body: [
          "We wrap FastAPI routes in `StreamingResponse` objects. The server yields tokens to client browsers in real-time using the Server-Sent Events (SSE) protocol, lowering perceived user latency."
        ]
      }
    ],
    examples: [
      {
        title: "SSE Stream Yield Generator",
        lang: "python",
        code: `async def generate_response_tokens():\n    for token in ["This", " is", " real-time", " streaming."]:\n        yield f"data: {token}\\n\\n"\n        await asyncio.sleep(0.01)\n\n# fastapi route returns: StreamingResponse(generate_response_tokens(), media_type="text/event-stream")\nprint("SSE generator initialized.")`
      }
    ],
    decisionTable: [["Text chat user interfaces", "FastAPI StreamingResponse (SSE)", "Enables token-by-token rendering, improving perceived responsiveness."]],
    sources: [["Server-sent events MDN", "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events"]]
  },
  "9.6": {
    lede: "AI systems fail at model rate limits before CPU limits are reached. We scale systems using Locust load testing, key pools, and secrets managers.",
    sections: [
      {
        title: "Rate Limit Bottlenecks, Key Pools, and Load Testing",
        body: [
          "We load-test our endpoints using Locust or k6 to identify rate-limit bottlenecks. We secure credentials using cloud Secrets Managers and rotate API keys to handle high-concurrency requests safely."
        ]
      }
    ],
    examples: [
      {
        title: "Secrets Manager Retrieval",
        lang: "python",
        code: `# Mocking dynamic secrets retrieval at runtime\ndef fetch_api_key_from_secrets() -> str:\n    # Retrieves secret from manager environment dynamically\n    return os.getenv("API_KEY_SECRET", "masked_key_A")\nprint(f"Loaded: {fetch_api_key_from_secrets()}")`
      }
    ],
    decisionTable: [["Handling 429 Rate Limit failures", "API Key Pools + dynamic model routing", "Distributes concurrent request loads safely across multiple keys."]],
    sources: [["Locust Concurrency Testing", "https://locust.io/"]]
  }
};

function lessonFor(text) {
  return {
    explanation: "This concept is a core structural pillar of AI systems.",
    mechanics: "Define typed schemas, apply validation, trace telemetry, and construct safe fallback routes.",
    code: "# Core operational block"
  };
}

function codeBlock(code, lang = "python") {
  return `<pre><code class="language-${lang}">${escapeHtml(code.trim())}</code></pre>`;
}

function diagramBlock(text) {
  return `<pre class="diagram"><code>${escapeHtml(text.trim())}</code></pre>`;
}

function moduleExample(phase, section) {
  return "";
}

function renderConceptItem(item) {
  return "";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function moduleId(section) {
  return `module-${section.n.replace(".", "-")}-${slug(section.title)}`;
}

function capstoneId(capstone) {
  return `capstone-${capstone.n}`;
}

function allPages() {
  const pages = [{ id: "", title: "Introduction", type: "home" }];
  curriculum.forEach((phase) => {
    pages.push({ id: `phase-${phase.id}`, title: phase.title, phase, type: "phase" });
    phase.sections.forEach((section) => pages.push({ id: moduleId(section), title: `${section.n} ${section.title}`, phase, section, type: "module" }));
  });
  capstones.forEach((capstone) => pages.push({ id: capstoneId(capstone), title: `Capstone ${capstone.n}: ${capstone.title}`, capstone, type: "capstone" }));
  pages.push({ id: "hosting", title: "Hosting", type: "hosting" });
  return pages;
}

const pages = allPages();

function link(id, label) {
  return `<a href="#/${id}">${escapeHtml(label)}</a>`;
}

function list(items) {
  return `<ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>`;
}

function plainList(items) {
  return list(items.map(escapeHtml));
}

function moduleItems(section) {
  return section.items;
}

function renderDecisionTable(rows) {
  return `
    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>Task Scenario</th><th>Recommended Approach</th><th>Rationale</th></tr>
        </thead>
        <tbody>
          ${rows.map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function renderSources(sources) {
  return list(sources.map(([label, url]) => `<a href="${url}" target="_blank" rel="noreferrer">${escapeHtml(label)}</a>`));
}

function renderDeepDive(phase, section, guide, deepDive) {
  return `
    <h1>${escapeHtml(section.n)} ${escapeHtml(section.title)}</h1>
    <div class="meta"><span class="pill">${escapeHtml(phase.title)}</span><span class="pill">${escapeHtml(phase.weeks)}</span><span class="pill">Updated for 2026</span></div>
    <p class="lede">${escapeHtml(deepDive.lede)}</p>
    <h2>Scope</h2>
    ${plainList(moduleItems(section))}
    ${deepDive.sections.map((entry) => `
      <h2>${escapeHtml(entry.title)}</h2>
      ${entry.body.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
      ${entry.diagram ? diagramBlock(entry.diagram) : ""}
    `).join("")}
    <h2>Worked examples</h2>
    ${deepDive.examples.map((example) => `
      <h3>${escapeHtml(example.title)}</h3>
      ${codeBlock(example.code, example.lang)}
    `).join("")}
    <h2>Decision table</h2>
    ${renderDecisionTable(deepDive.decisionTable)}
    <h2>Production checklist</h2>
    ${list([
      "Validate data schemas at the application boundary using clean Pydantic classes.",
      "Record telemetry metadata: request/response JSONs, latency metrics, and API costs.",
      "Set timeouts on third-party integrations to preserve event loop health.",
      "Manage sensitive functions behind manual checkpoints and approval steps.",
      "Rotated environment credentials safely via cloud Secrets Managers."
    ])}
    <h2>Further reading</h2>
    ${renderSources(deepDive.sources)}
  `;
}

function renderModule(phase, section) {
  const guide = chapterGuides[phase.id];
  const deepDive = deepDives[section.n];
  if (deepDive) return renderDeepDive(phase, section, guide, deepDive);
  
  // Clean fallback in case a section ID isn't found in the map (failsafe)
  return `
    <h1>${escapeHtml(section.n)} ${escapeHtml(section.title)}</h1>
    <div class="meta"><span class="pill">${escapeHtml(phase.title)}</span><span class="pill">${escapeHtml(phase.weeks)}</span></div>
    <p class="lede">This section details ${escapeHtml(section.title.toLowerCase())}.</p>
    <h2>Scope</h2>
    ${plainList(moduleItems(section))}
  `;
}

function renderCapstone(capstone) {
  return `
    <h1>Capstone ${capstone.n}: ${escapeHtml(capstone.title)}</h1>
    <div class="meta"><span class="pill">${escapeHtml(capstone.phase)}</span><span class="pill">${escapeHtml(capstone.domain)}</span></div>
    <p class="lede">${escapeHtml(capstone.proves)}</p>
    <h2>System requirements</h2>
    ${plainList(capstone.build)}
    <h2>Architecture</h2>
    <pre><code>client -> API Gateway -> Dockerized FastAPI Services -> Vector Indexes + DBs\n                  |\n                  v\n            LangSmith / Telemetry Metrics</code></pre>
    <h2>Stack</h2>
    ${plainList(capstone.stack)}
    <h2>Engineering constraints</h2>
    ${list([
      "All third-party network connections utilize timeout controls and retry policies.",
      "Every API action records metrics: latency traces, input sizes, and token costs.",
      "Retrieval indexes and generation tasks are tested and evaluated separately.",
      "High-risk tools (like billing charges or data updates) are paused for human approval.",
      "Environment configurations secure credentials using dynamic Secrets Managers."
    ])}
  `;
}

function renderHosting() {
  return `
    <h1>Hosting the Book</h1>
    <p class="lede">This book is a single page application built using plain static HTML, CSS, and JavaScript. There are no build tools required.</p>
    <h2>Fastest deployment options</h2>
    ${list([
      "GitHub Pages: push the repository code and turn on Pages from the settings menu.",
      "Netlify Drop: drag the project directory straight into the Netlify dashboard.",
      "Cloudflare Pages: configure a pages project pointing to this folder."
    ])}
    <h2>Local preview</h2>
    <pre><code>cd ai-engineer-book\npython3 -m http.server 8080</code></pre>
    <p>Then open your web browser to <code>http://localhost:8080</code>.</p>
  `;
}

function renderPage(page) {
  if (!page || page.type === "home") return renderHome();
  if (page.type === "phase") return renderPhase(page.phase);
  if (page.type === "module") return renderModule(page.phase, page.section);
  if (page.type === "capstone") return renderCapstone(page.capstone);
  if (page.type === "hosting") return renderHosting();
  return renderHome();
}

function renderToc(filter = "") {
  const q = filter.trim().toLowerCase();
  const matches = (text) => !q || text.toLowerCase().includes(q);
  const groups = curriculum.map((phase) => {
    const moduleLinks = phase.sections
      .filter((section) => matches(`${phase.title} ${section.n} ${section.title} ${section.items.join(" ")}`))
      .map((section) => `<a class="toc-link" href="#/${moduleId(section)}">${escapeHtml(section.n)} ${escapeHtml(section.title)}</a>`)
      .join("");
    if (!moduleLinks && !matches(phase.title)) return "";
    return `<div class="toc-group"><a class="toc-heading" href="#/phase-${phase.id}">${escapeHtml(phase.id)}. ${escapeHtml(phase.title)}</a>${moduleLinks}</div>`;
  }).join("");
  const capstoneLinks = capstones
    .filter((capstone) => matches(`${capstone.title} ${capstone.domain} ${capstone.build.join(" ")}`))
    .map((capstone) => `<a class="toc-link" href="#/${capstoneId(capstone)}">Capstone ${capstone.n}: ${escapeHtml(capstone.title)}</a>`)
    .join("");
  document.querySelector("#toc").innerHTML = `
    <div class="toc-group">
      <a class="toc-heading" href="#/">Start</a>
      <a class="toc-link" href="#/">Introduction</a>
    </div>
    ${groups}
    <div class="toc-group">
      <span class="toc-heading">Capstones</span>
      ${capstoneLinks || ""}
      <a class="toc-link" href="#/hosting">Hosting</a>
    </div>
  `;
}

function currentId() {
  return decodeURIComponent(location.hash.replace(/^#\/?/, ""));
}

function activateToc(id) {
  document.querySelectorAll(".toc-link, .toc-heading").forEach((node) => {
    const nodeId = decodeURIComponent((node.getAttribute("href") || "").replace(/^#\/?/, ""));
    node.classList.toggle("active", nodeId === id);
  });
}

function renderPager(page) {
  const index = pages.findIndex((candidate) => candidate.id === page.id);
  const prev = pages[index - 1];
  const next = pages[index + 1];
  document.querySelector("#pager").innerHTML = `
    ${prev ? `<a href="#/${prev.id}">Previous<br><strong>${escapeHtml(prev.title)}</strong></a>` : "<span></span>"}
    ${next ? `<a href="#/${next.id}">Next<br><strong>${escapeHtml(next.title)}</strong></a>` : "<span></span>"}
  `;
}

function route() {
  const id = currentId();
  const page = pages.find((candidate) => candidate.id === id) || pages[0];
  document.querySelector("#page").innerHTML = renderPage(page);
  renderPager(page);
  activateToc(page.id);
  document.title = page.title === "Introduction" ? "The AI Engineer Book" : `${page.title} - The AI Engineer Book`;
  document.body.classList.remove("nav-open");
  document.querySelector("#menu").setAttribute("aria-expanded", "false");
  document.querySelector("#content").focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "instant" });
}

function renderHome() {
  const totalModules = curriculum.reduce((sum, phase) => sum + phase.sections.length, 0);
  return `
    <h1>The AI Engineer Book</h1>
    <p class="lede">A highly technical roadmap to transition software developers of all experience levels into professional AI engineering: Python asyncio networks, large language models, prompt compilers, hybrid RAG retrieval, MCP tool integrations, memory systems, LangGraph multi-agent orchestration, guardrails, and cloud capacity scaling.</p>
    <div class="meta">
      <span class="pill">${curriculum.length} phases</span>
      <span class="pill">${totalModules} deep-dives</span>
      <span class="pill">${capstones.length} capstones</span>
      <span class="pill">Static site</span>
    </div>
    <img class="cover" src="assets/cover.png" alt="Technical study book cover artwork with notebook, code panels, and AI workflow diagrams">
    <p>AI engineering is the software discipline of wrapping probabilistic models in robust, deterministic systems. The model handles complex language generation, reasoning, classification, and planning; the surrounding system handles validation, context indexing, tool security, operational metric logging, and failure recovery.</p>
    <p>This roadmap is designed as a **Bridge**: every module introduces basic core concepts and everyday analogies first, before progressively scaling that same concept to production-grade advanced patterns and working Python code.</p>
    <h2>Contents</h2>
    ${curriculum.map((phase) => `
      <section class="module-card">
        <h3>${link(`phase-${phase.id}`, `${phase.id}. ${phase.title}`)}</h3>
        <p>${escapeHtml(chapterGuides[phase.id].opening)}</p>
      </section>
    `).join("")}
    <h2>System Architecture Model</h2>
    ${diagramBlock(`User Request -> [FastAPI Route] -> [Context Builder (Sliding Window + Memory)] -> [Model API Call]\n                                                                         |\n       +--------------------------------- validate output JSON <---------+\n       v\n[Guardrail Filter] -> [JSON Trace Telemetry] -> client SSE stream`)}
    <p>This flowchart represents the standard AI engineering request cycle. The user issues a query, the API validates parameters and fetches memory context, the model decides next tool calls or generates responses, the output is verified against safety schemas, and results are streamed back token-by-token.</p>
  `;
}

function renderPhase(phase) {
  const guide = chapterGuides[phase.id];
  return `
    <h1>${escapeHtml(phase.title)}</h1>
    <div class="meta"><span class="pill">${escapeHtml(phase.weeks)}</span><span class="pill">${escapeHtml(phase.weeksDetail)}</span></div>
    <p class="lede">${escapeHtml(guide.opening)}</p>
    <h2>Mechanics</h2>
    <p>${escapeHtml(guide.mechanics)}</p>
    <h2>Architecture</h2>
    ${diagramBlock(guide.diagram)}
    <h2>Chapter sections</h2>
    ${phase.sections.map((section) => `
      <section class="module-card">
        <h3>${link(moduleId(section), `${section.n} ${section.title}`)}</h3>
        ${plainList(moduleItems(section))}
      </section>
    `).join("")}
    <h2>Failure modes</h2>
    ${plainList(phaseGuides[phase.id].mistakes)}
  `;
}

renderToc();
route();

window.addEventListener("hashchange", route);

document.querySelector("#search").addEventListener("input", (event) => {
  renderToc(event.target.value);
  activateToc(currentId());
});

document.querySelector("#menu").addEventListener("click", () => {
  const open = !document.body.classList.toggle("nav-open");
  document.querySelector("#menu").setAttribute("aria-expanded", String(!open));
});
