### Entries

#### 1 Create the prompt

- **Prompt**: `Read src/projects/ai-course/module1/prompts/1-web-api-specs.md and follow the instructions at the top of the file`
- **Tool**: Cline
- **Mode**: Action
- **Context**: Clean
- **Model**: Claude Sonnet 4
- **Input**: `src/projects/ai-course/module1/prompts/1-web-api-specs.md`
- **Output**: `src/projects/ai-course/module1/prompts/2-web-api-prompt.md`
- **Cost**: $1.4814
- **Reflections**:
  - The agent had follow up questions before it would start implementation:
    - Should the prompt assume the developer already has PostgreSQL running locally, or should it include instructions for setting up the database? `Assume database exists, include environment setup`

    - For the project structure, should the backend and frontend be in separate subdirectories within `src/projects/ai-course/module1/src`, or do you have a preferred organization?

    - Should the prompt include instructions for setting up the development environment (package.json files, dependencies installation), or focus primarily on the implementation details?

  - Once I answerd the first question the agent lept into action. Not ideal. It as also assument the prompt location to save.
  - I will manually change the name from `.../prompts/configuration-service-implementation-prompt.md` -> `.../prompts/2-web-api-prompt.md` to save tokens.
  - Outputting the result of the prompt took the cost from `0.2300` -> `0.3560` a big jump. It could be optimised.

#### 2 Collaborate to create the plan

- **Prompt**: `Read src/projects/ai-course/module1/prompts/2-web-api-plan.md and run planning session with me. I would like the plan to be output to src/projects/ai-course/module1/prompts/3-web-api-plan.md once complete.`
- **Tool**: Cline
- **Mode**: Plan
- **Context**: Clean
- **Model**: Claude Sonnet 4
- **Input**: `src/projects/ai-course/module1/prompts/2-web-api-prompt.md`
- **Output**: `src/projects/ai-course/module1/prompts/3-web-api-plan.md`
- **Cost**: $1.4814
- **Reflections**: The agent stopped at `0.2080` credits to ask some follow up questions:
  1.  **Database Setup**: Should the plan include specific instructions for creating the PostgreSQL database locally, or can we assume the database server is already running and just needs the database/schema created?
  2.  **Development Workflow**: Do you want the plan to include specific commands for running both backend and frontend in development mode simultaneously, or should it focus on individual setup instructions?
  3.  **Testing Strategy**: Should the plan include instructions for setting up a separate test database, or is it acceptable to use the same database with cleanup between tests?
  4.  **Deployment Considerations**: Should this plan be focused purely on local development, or do you want any considerations for potential deployment scenarios?
  5.  **Error Handling Depth**: The specs mention consistent error shapes - should the plan include detailed error handling for all edge cases (network failures, database connection issues, etc.) or focus on the core business logic errors?
  6.  **Answer**: `1. we can assume the database is runnig locally and just needsa the database chemas created.2. Just focus on individual setup instructions.3. No, just use mocking. do not test the database directly.4. Just focus onlocal development.5. Decide on an easy global error shap that can be returned with a message, type, and status.Let me know if that answers your questions.`

1.

#### 3 Execute the plan

- **Prompt**: `Read src/projects/ai-course/module1/prompts/3-web-api-plan.md and begin work. I would like each plan step to be treated as a commit point. so stop at the end of each step, prompt me to commit and wait for me to prompt you to continue. the database name is agentic-mod-1 on port number 5433 when you create the needed .env file, prompt me and I will add the username and password. All work should be created in the src/projects/ai-course/module1 as the root.`
- **Tool**: Cline
- **Mode**: Act
- **Context**: Clean
- **Model**: Claude Sonnet 4
- **Input**: `src/projects/ai-course/module1/prompts/3-web-api-plan.md`
- **Cost**: $6.4392
- **Reflections**: I have run out of tokens by the time I hit step 5.1. I am not going to be feeding any more money into this project. I will continue using free if I can.

#### 3.1 Continue execute the plan

- **Prompt**: `Read src/projects/ai-course/module1/prompts/3-web-api-plan.md and read src/projects/ai-course/module1/IMPLEMENTATION_PROGRESS.md to see where we are upto and where you need to start working from. I would like each plan step to be treated as a commit point. so stop at the end of each step, prompt me to commit and wait for me to prompt you to continue.`
- **Tool**: Cline
- **Mode**: Act
- **Context**: Clean
- **Model**: Cohere: North Mini Code (free)
- **Input**: `src/projects/ai-course/module1/prompts/3-web-api-plan.md`
- **Cost**: $0.0000
- **Reflections**: This failed `{"message":"OpenRouter Mid-Stream Error: Stream terminated with error status but no error details provided","modelId":"cohere/north-mini-code:free"}`

#### 3.2 Continue execute the plan

- **Prompt**: `Read src/projects/ai-course/module1/prompts/3-web-api-plan.md and read src/projects/ai-course/module1/IMPLEMENTATION_PROGRESS.md to see where we are upto and where you need to start working from. I would like each plan step to be treated as a commit point. so stop at the end of each step, prompt me to commit and wait for me to prompt you to continue.`
- **Tool**: Cline
- **Mode**: Act
- **Context**: Clean
- **Model**: gpt-5.5 - medium
- **Input**: `src/projects/ai-course/module1/prompts/3-web-api-plan.md`
- **Cost**: $0.0000
- **Reflections**: Using cline with my work subscription. I was only able to use two s
