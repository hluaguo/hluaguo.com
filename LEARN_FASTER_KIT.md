# Learn FASTER Kit

An AI-powered learning accelerator designed to transform the IDE into a personalized coaching lab. The **Learn FASTER Kit** automates science-backed learning methodologies, enabling developers to master complex technical skills with 10x more efficiency than passive reading.

[View on GitHub](https://github.com/hluaguo/learn-faster-kit)

## The Core: The FASTER Framework
The project is built around Jim Kwik's **FASTER** methodology (Forget, Act, State, Teach, Enter, Review), implemented as an automated software layer. It moves beyond "watching tutorials" by forcing active engagement and retrieval.

### Key Capabilities
- **Claude Code Integration**: Built as a specialized agent layer for **Claude Code**, adding `/learn` and `/review` capabilities directly to the developer's CLI.
- **Teach-Back Engine**: Validates understanding by requiring the user to explain concepts back to the AI, which then identifies gaps in the mental model.
- **Automated SRS**: A built-in **Spaced Repetition System** that tracks your mastery levels and automatically schedules "Retrieval Expeditions" at optimal intervals.
- **Adaptive Coaching Modes**: Toggle between *Balanced*, *Exam-Prep*, *Theory-Focused*, and *Practical* modes to match your immediate learning objectives.

## Technical Execution
- **Stack**: Python 3.12+ 
- **Tooling**: Built with **uv** for ultra-fast performance and zero-config execution.
- **Agent Architecture**: Leverages specialized Markdown-based prompting and structured `.learning/` data persistence to maintain context across long-term learning journeys.

---

*This kit is my response to the information deluge—a tool to ensure that in the age of AI, our human ability to master new skills remains our greatest competitive advantage.*
