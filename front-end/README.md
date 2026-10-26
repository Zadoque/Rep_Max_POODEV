# Rep Max — Front-end

Interface React, TypeScript, Vite e Tailwind CSS do Rep Max. A aplicação está em desenvolvimento com dados mockados, mas os serviços já separam a origem dos dados para a futura integração com a API.

## Desenvolvimento

```bash
npm install
npm run dev
```

Para validar o projeto:

```bash
npm run build
npm run lint
```

## Mocks e integração futura

O arquivo `.env.development` usa `VITE_USE_MOCK=true`. Os serviços de autenticação, preferências, dashboard, exercícios e histórico verificam essa variável. Os dados de exercício seguem o modelo do back-end (`id`, nome, grupo muscular, instruções e mídia) e o histórico associa as métricas ao exercício.

O catálogo local contém 50 exercícios e 150 frames PNG, armazenados em `public/exercises/`. A animação alterna três frames por exercício. Os assets vêm do [Workout Guide](https://github.com/avidevper/workout-guide-svgs), com licença CC BY-SA 4.0 e atribuição preservada nos arquivos `ATTRIBUTION-workout-guide.md` e `LICENSES-workout-guide.md`.
