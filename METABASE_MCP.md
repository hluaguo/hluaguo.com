# Metabase MCP Server

A specialized bridge between enterprise business intelligence and the next generation of AI assistants. The **Metabase MCP Server** implements the Model Context Protocol (MCP) to allow LLMs like Claude and Cursor to directly interact with, query, and manage **Metabase** data environments using natural language.

[View on GitHub](https://github.com/hluaguo/metabase-mcp)

## The Concept: Conversational BI
The goal of this project is to eliminate the friction between "asking a question" and "getting the data." By exposing Metabase's powerful analytics engine through the MCP standard, I've enabled a workflow where data exploration happens at the speed of thought, directly within the developer's chat interface.

### Key Capabilities
- **Natural Language Analytics**: Seamlessly translates conversational prompts into executable SQL queries against your Metabase-connected databases.
- **Autonomous Discovery**: Allows AI agents to list databases, inspect complex schemas, and understand field metadata with built-in pagination support.
- **Resource Management**: Extends beyond simple querying to allow the management of Metabase Cards (questions), Collections, and Dashboards.
- **Unified Interface**: Supports multiple transport layers including **STDIO** for local IDE integration and **SSE/HTTP** for remote server architectures.

## Technical Execution
- **Core Framework**: Built using **FastMCP** for high-level protocol orchestration and robust error handling.
- **Language**: Python 3.12+ with strict typing and modern asynchronous patterns.
- **Tooling Ecosystem**: Leverages **uv** for high-performance dependency management and **Ruff/Mypy** for industrial-grade code quality.
- **Security**: Implements flexible authentication supporting both API Key and session-based flows.

---

*This project represents my focus on building "Connective Tissue"—the software layers that enable advanced AI models to safely and effectively navigate real-world enterprise data.*
