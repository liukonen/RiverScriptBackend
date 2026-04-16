
# RiverScript Backend

**Intent Processing & Deterministic Service Reference**

A service-oriented core for conversational logic. Originally built as an AIML client, this backend functions as a reference for augmenting generative AI with factual, API-driven data (Weather, Search, i18n).

### Technical Stack

-   **Runtime:** Node.js (TypeScript)
    
-   **Integrations:** DuckDuckGo AI, OpenWeather API, Swagger (OpenAPI)
    
-   **Infrastructure:** Docker, Docker Compose
    
-   **Patterns:** Adapter Pattern, Sequential processing, Service Decoupling
    

### The Mission: A 20-Year Evolution

This project is a record of architectural survivability. It originated in 2006 as a VB6 AIML client and has been systematically re-engineered through **VB.Net, C#, client-side JavaScript, and finally Node.js.** It was a centerpiece of the **"Be the Spark"** tour, demonstrating conversational tech long before the LLM era. Today, it serves as a "Truth Layer"—handling the factual grounding (Weather/Entity retrieval) that generative models often fail to execute with deterministic reliability.

### Architecture & Decisions

-   **Programmable Logic:** Migrated from legacy AIML to **RiveScript** to allow for more complex, stateful branching logic that standard generative tokens cannot guarantee.
    
-   **Observation & Documentation:** Integrated **Swagger** to ensure the API contract remains visible and testable, upholding the "Invisible Tech" philosophy of observability.
    
-   **Language Chain:** Retains the sequential i18n pipeline (_Detect $\rightarrow$ English $\rightarrow$ Process $\rightarrow$ Translate_) to ensure business logic remains canonical regardless of the host language.
    

### Impact & ROI

-   **Lifecycle Management:** Proof of ability to migrate mission-critical logic across four distinct language paradigms without loss of intent.
    
-   **Hallucination Mitigation:** Uses verified API adapters to ground conversational UI in real-time facts.
    
-   **Operational Readiness:** Standardized via Docker and Swagger for immediate deployment and developer handoff.
    

### The Golden Path

1.  `npm install`
    
2.  `npm start`
    
3.  **Docs:** View the API contract at `http://localhost:5000/api-docs`