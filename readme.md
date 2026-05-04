# RiverScript Backend

Tags: `Node.js` `TypeScript` `Adapter Pattern` `Sequential Processing` `Service Decoupling`

A robust, highly-evolved service-oriented backend for conversational logic, originally built as an AIML client and re-engineered through multiple language paradigms. This project serves as a "Truth Layer" in generative AI applications, ensuring deterministic reliability with factual grounding.

## Context & Story

RiverScript Backend has a 20-year journey, evolving from VB6 to modern Node.js while retaining its core purpose of providing factual data and augmenting conversational AI. It started as a proof-of-concept, evolved for a platform for "Be the Spark tour" in Milwaukee showcasing conversational tech well before the LLM era. Over time, it has been re-engineered multiple times to ensure longevity and reliability.

## Architecture & Decisions

- **Programmable Logic**: Migrated from legacy AIML to RiveScript for more complex stateful branching logic.
- **Observation & Documentation**: Integrated Swagger to maintain a visible and testable API contract, upholding the "Invisible Tech" philosophy of observability.
- **Language Chain**: Retained the sequential i18n pipeline (_Detect $\rightarrow$ English $\rightarrow$ Process $\rightarrow$ Translate_) for consistent business logic regardless of host language.

## Key Features

- **RiveScript Support**: Enables complex, stateful branching logic.
- **API Documentation**: Available via Swagger at `http://localhost:5000/api-docs`.
- **Sequential i18n Pipeline**: Ensures consistent business logic across languages.
- **Dockerized Deployment**: Simplifies setup and deployment with Docker.

## Quick Start

### Installation
```bash
npm install
```

### Running the Service
```bash
npm start
```

### Accessing API Docs
Open your browser and navigate to `http://localhost:5000/api-docs` to view and test the API contract.