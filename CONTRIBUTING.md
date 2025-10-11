

---

# CONTRIBUTING

## Para colaboradores do projeto

### 0) Padrões que seguimos

* **Branch base:** `main`
* **Commits:** **Conventional Commits** (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:` …)
* **Nome de branch:** use prefixos e *kebab-case*, **sem espaços** e **sem dois-pontos**.
  Exemplos: `feat/tela-login`, `fix/validacao-email`, `docs/guia-contribuicao`

---

### 1) Atualize sua cópia local antes de começar

Sempre trabalhe a partir da branch `main` **atualizada**.

```bash
# Pegue as refs mais recentes do remoto
git fetch --all --prune

# Vá para a branch base
git checkout main

# Traga as mudanças remotas mantendo histórico limpo
git pull --rebase origin main
```

> Dica: use `--rebase` para evitar merges desnecessários no histórico.

---

### 2) Crie uma nova branch para sua alteração

Crie a partir de `main`. Exemplos de nomes:

* **Feature (ex.: tela de login):**

```bash
git checkout main
git switch -c feat/tela-login
# ou: git checkout -b feat/tela-login
```

* **Correção (bugfix):**

```bash
git switch -c fix/erro-duplicacao-tarefa
```

* **Documentação/Manutenção:**

```bash
git switch -c docs/atualiza-readme
git switch -c chore/atualiza-deps
```

---

### 3) Faça commits usando Conventional Commits

Mensagens curtas, claras e no imperativo.

```bash
git add .
git commit -m "feat(login): adicionar tela de login com validação básica"
git commit -m "fix(task): corrigir status ao concluir tarefa diária"
git commit -m "docs(contributing): incluir passo a passo de branches"
```

> Formato recomendado: `tipo(escopo): descrição`

---

### 4) Mantenha sua branch atualizada durante o trabalho

Regularmente, rebaseie com `main` para evitar conflitos no fim.

```bash
# Estando na sua branch (ex.: feat/tela-login):
git fetch origin
git rebase origin/main
# Se houver conflitos: resolva-os nos arquivos, depois:
git add <arquivos-resolvidos>
git rebase --continue
```

> Se precisar pausar alterações locais para atualizar:

```bash
git stash
git pull --rebase origin main
git stash pop
```

---

### 5) Envie sua branch para o remoto

```bash
git push -u origin feat/tela-login
```

---

### 6) Abra um Pull Request (PR)

* **Base:** `main`
* **Título:** siga Conventional Commits (ex.: `feat(login): criar tela de login`)
* **Descrição:** explique o que mudou, por quê e como testar.
* **Referencie issues:** `Closes #123` (se houver).
* **Anexe imagens/prints** quando útil.
* **Marque revisores** e aplique labels (quando existirem).

> Se ainda estiver trabalhando, abra como **Draft PR**.

---

### 7) Evite conflito de trabalho com outras pessoas

* **Antes de começar**, verifique issues e PRs abertos.
* **Assuma a issue** (comente “assign to me” ou marque-se).
* **Comunique-se** no PR/issue se tocar em arquivos que outra pessoa está alterando.
* **Commits pequenos e frequentes** facilitam revisão e resolução de conflitos.

---

### 8) Checklist antes de pedir review

* Código compila e roda localmente.
* Rodou linters e formatadores (se configurados):
  `npm run lint` / `npm run format` (ou scripts do projeto).
* Testes passam (se existirem): `npm test`.
* Sem arquivos temporários (ex.: `.env`, `node_modules/`, logs).

---

### 9) Merge e limpeza

Após aprovado e integrado:

```bash
# Volte para a base e atualize
git checkout main
git pull --rebase origin main

# Remova a branch local
git branch -d feat/tela-login

# (Opcional) Remova a branch remota
git push origin --delete feat/tela-login
```

> Recomenda-se **Squash & Merge** no PR para manter o histórico limpo. Use um título de squash no padrão Conventional Commits.

---

### 10) Problemas comuns

* **Conflitos frequentes?** Rebaseie cedo e com frequência.
* **Arquivos inmainidos no commit?**
  Ajuste `.gitignore` e use `git restore --staged <arquivo>`.
* **Rebase complicado?** Você pode abortar: `git rebase --abort` e pedir ajuda no PR.

---

Qualquer dúvida, abra uma **issue** com contexto e passos para reproduzir. Boas contribuições! 🙌
