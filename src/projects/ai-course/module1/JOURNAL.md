### Entries

#### 1

- **Prompt**: `Read src/projects/ai-course/module1/prompts/1-web-api-specs.md and follow the instructions at the top of the file`
- **Tool**: Cline
- **Mode**: Plan
- **Context**: Clean
- **Model**: Claude Sonnet 4
- **Input**: `src/projects/ai-course/module1/prompts/1-web-api-specs.md`
- **Output**: `src/projects/ai-course/module1/prompts/1-web-api-prompt.md`
- **Cost**: $0.3560
- **Reflections**:
  - The agent had follow up questions before it would start implementation:
    - Should the prompt assume the developer already has PostgreSQL running locally, or should it include instructions for setting up the database? `Assume database exists, include environment setup`

    - For the project structure, should the backend and frontend be in separate subdirectories within `src/projects/ai-course/module1/src`, or do you have a preferred organization?

    - Should the prompt include instructions for setting up the development environment (package.json files, dependencies installation), or focus primarily on the implementation details?

  - Once I answerd the first question the agent lept into action. Not ideal. It as also assument the prompt location to save.
  - I will manually change the name from `.../prompts/configuration-service-implementation-prompt.md` -> `.../prompts/2-web-api-prompt.md` to save tokens.
  - Outputting the result of the prompt took the cost from `0.2300` -> `0.3560`
