# Repositório para o Trabalho de Programação orientada a Objetos para Desenvolvimento - Rep_Max

Esse repositório será usado para versionar e controlar nosso processo de aprendizado enquanto desenvolvemos o projeto. 

# Introdução:
O Rep Max será um Sistema de Log Book de Treino de Academia. Ele resolverá os problemas listados abaixo:

<ul >
  <li>Ausência de um histórico organizado de séries, repetições e cargas utilizadas em cada treino;</li>
  <li>Dificuldade de identificar se um exercício está em progressão, estagnação ou regressão de desempenho;</li>
  <li>Falta de suporte para técnicas de intensificação de treino (bi-set, tri-set, monster set e drop set), que hoje são anotadas de forma manual e pouco estruturada;</li>
  <li>Dúvidas frequentes sobre a execução correta de determinados exercícios, sem uma referência disponível no momento do treino;</li>
  <li>Ausência de um canal integrado entre aluno e personal trainer, que hoje depende de aplicativos de mensagens externos (como WhatsApp) e planilhas avulsas.</li>
</ul>
Como o repMax resolve isso é detalhado na documentação.

# Quem está fazendo esse projeto:

O Projeto é feito pela dupla de alunos: Zadoque Pires de Deus Souza Carneiro (vulgo EU) e Artur Pereira da Silva. Embora no histórico do github aqui só eu esteja commitando agora nesse exato o momento, Artur já fez boa parta da documentação no que tange a API RESTfull, requisitos, orçamento, etc. O que explica o fato de que eu não vou (espero pelo menos) levar a noite toda para terminar essa parte. 

# Uso de IA nesse projeto:

> [!WARNING]
> Totalmente desencorajado pelo nosso querido professor. Isso tem como objetivo que realmente possamos aprender os conceitos. A IA será usada expressamente apenas para fazer auditoria, não modificação, e também para criação de commits descritivos, sempre validados e corrigidos caso fiquem genéricos.

# Uso de Framework e Soluçõe prontas em geral:

> [!WARNING]
> Mesmo caso da IA, totalmente desencorado também pelo nosso querido professor. Embora tenhamos conseguido negociar o uso de Spring Boot para a API RESTfull, não chegamos a validar o uso de um framework para a interface WEB. Mas vamos marcar uma reunião com nosso AD Hoc e resolver essa pendência. Na documentação eu já vou colocar planejado e justificado, mas ainda vou passar pela régua do supervisor.

# Padrão de Projeto usado no Front-end:
## Para componentes React:
  PacalCase
  ### Exemplos:
  LoginPage.tsx
  RoutineCard.tsx
## Para arquivos .ts:
  kebab-case
  ### Exemplos:
  credenciais-login.ts
  auth-service.ts
  usuarios-mock.ts
# Fase 1:
## Documentação e Requisitos:
Dentro da pasta documentacao, tem o arquivo main.tex e o compilado dele main.pd que define os requisitos e arquitetura do projeto com justificativas.

# Fase 2: Desenvolvimento do Front-End com Dados Mocados

<br>

<blockquote>
  <strong>💡 O que é esta fase?</strong><br>
  Construção das telas e componentes visuais utilizando dados fictícios (mocks) estruturados, simulando o comportamento real do sistema.
</blockquote>

<br>

<details>
  <summary><strong>🧠 Por que usamos essa estratégia?</strong></summary>
  <br>
  
  <table>
    <thead>
      <tr>
        <th>Benefício</th>
        <th>Descrição</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>⚡ Feedback Rápido (Fail Fast)</strong></td>
        <td>O cliente ou os stakeholders conseguem interagir com uma interface realista logo nas primeiras Sprints. Se algo precisar mudar no design ou no fluxo, a alteração é feita rapidamente na camada visual.</td>
      </tr>
      <tr>
        <td><strong>🔄 Paralelismo de Equipes</strong></td>
        <td>Assim que a estrutura de dados (o contrato da API) é definida, a equipe de front-end pode construir as telas com mocks, enquanto a equipe de back-end desenvolve as APIs reais em paralelo. Ninguém fica esperando por ninguém.</td>
      </tr>
      <tr>
        <td><strong>📉 Redução de Desperdício</strong></td>
        <td>Descobrir que uma funcionalidade não faz sentido depois que o banco de dados e as APIs já estão prontos gera um custo de refatoração altíssimo. Com o mock, o desperdício de código é mínimo.</td>
      </tr>
      <tr>
        <td><strong>🧪 Testabilidade Antecipada</strong></td>
        <td>Permite criar testes de interface (E2E) e de componentes desde o primeiro dia, garantindo que o comportamento visual esteja correto.</td>
      </tr>
    </tbody>
  </table>
</details>

