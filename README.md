#  Sistema de Qualificação 

Este projeto multidisciplinar visa desenvolver uma plataforma gratuita de cursos em tecnologia, focada na qualificação e inserção de jovens e adultos no mercado de trabalho.

##  Arquitetura e Tecnologias

O projeto segue a arquitetura **Full Stack** com separação de responsabilidades:

| Camada | Tecnologia | Componentes Chave |
| :--- | :--- | :--- |
| **Backend (API)** | **Java 17 + Spring Boot 3.x** | POO, Spring Data JPA, Spring Security, REST Controllers. |
| **Banco de Dados** | **PostgreSQL** | Gerenciado via **Docker Compose** para padronizar o ambiente. |
| **Frontend (Web)** | **React.js** | Interface de Alunos, Professores e Administradores. |
| **Fluxo de Trabalho** | **Git & GitHub Flow** | Desenvolvimento baseado em Issues, Branches de Feature e Pull Requests (PRs). |

---

## Guia de Configuração e Execução 

Este guia permite que qualquer membro da equipe prepare e execute o projeto localmente.

### Pré-requisitos 

Certifique-se de ter as seguintes ferramentas instaladas:

1.  **Java Development Kit (JDK) 17 ou superior**.
2.  **Maven** (Gerenciador de dependências).
3.  **Git** (Para clonar o repositório).
4.  **Docker Desktop** (Essencial para rodar o banco de dados PostgreSQL).

### 1. Setup Inicial

1.  **Clone o Repositório:** Abra o terminal na pasta de trabalho e clone o projeto:
    ```bash
    git clone https://github.com/Eduardolimzz/sistema-de-qualificacao.git
    cd sistema-de-qualificacao
    ```
2.  **Abra no IntelliJ:** Importe a pasta clonada como um projeto Maven.
3.  **Instale as Dependências (Maven):**
    ```bash
    ./mvnw clean install
    ```

### 2. Configuração do Banco de Dados (Docker Compose)

1.  **Crie o arquivo `.env`:** Copie o arquivo `.env.example` para **`.env`** na **raiz** do projeto e preencha com suas credenciais. O host `postgres` é o nome do serviço no `compose.yaml`.

    ```dotenv
    # Exemplo do arquivo .env
    DB_USERNAME=postgres
    DB_PASSWORD=123456
    DB_URL=jdbc:postgresql://postgres:5432/sistema-de-qualificacao
    DB_NAME=sistema-de-qualificacao
    ```

2.  **Inicie o Contêiner:** Use o Docker Compose para subir o banco de dados em *background*.
    ```bash
    docker-compose up -d postgres
    ```

### 3. Execução da Aplicação Java 

1.  **Execute o Spring Boot:** O Spring Boot tentará iniciar e conectar ao contêiner Docker automaticamente ao ser executado.

    * **Via IntelliJ:** Clique no botão verde "Run" na classe principal: `SistemaDeQualificacaoApplication.java`.
    * **Via Terminal:**
      ```bash
      ./mvnw spring-boot:run
      ```

A aplicação estará acessível em `http://localhost:8080`.

---

## Contribuições (GitHub Flow) 

Seguimos a metodologia GitHub Flow. **NUNCA** faça commits diretamente na branch `main`.

1.  **Crie um Branch de Feature:** Para qualquer nova tarefa, comece a partir da `main`:
    ```bash
    git checkout main
    git pull origin main 
    git checkout -b feature/nome-da-sua-tarefa 
    ```
2.  **Desenvolva e Commite:** Use o padrão `feat(escopo): Descrição`.
    ```bash
    git commit -m "feat(service): Implementa lógica de validação do aluno." 
    ```
3.  **Abra o Pull Request (PR):** Envie o branch para o GitHub e abra um PR para a `main` para revisão do código.