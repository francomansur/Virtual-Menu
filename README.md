# Virtual Menu - CS50
#### Video Demo:  https://youtu.be/XDQRKiQTss8
#### Description:

## Overview
Virtual Menu is a system designed to streamline restaurant operations, simplifying the ordering process and menu organization. Customers can place orders directly on the Menu page without needing to log in, while restaurant staff can access the Management page to view, manage, and track these orders efficiently. The Management page is secured and requires login, ensuring that only authorized staff can access this sensitive area.

## How to run the Application

## Clonando o Repositório

1. Copie a URL do repositório no GitHub.

2. Clone o repositório localmente usando o comando:
   ```bash
   git clone <URL-do-repositorio>

3. Entre na pasta Virtual-Menu
   ```bash
   cd virtual-menu

4. Entre na pasta restaurant
   ```bash
   cd restaurant

## Configurando o Ambiente Virtual e Servidor Flask

1. **Crie um ambiente virtual**:
   - Mac/Linux:
     ```bash
     python3 -m venv venv
     ```
   - Windows:
     ```bash
     python -m venv venv
     ```

2. **Ative o ambiente virtual**:
   - Mac/Linux:
     ```bash
     source venv/bin/activate
     ```
   - Windows:
     ```bash
     venv\Scripts\activate
     ```

3. **Instale as dependências do projeto**:
   ```bash
   pip install -r requirements.txt

4. **Inicie o Flask**:
   ```bash
   flask run --host=localhost --port=5001
   ```

## Configurando o Ambiente Virtual e Servidor Flask

1. **Abra um novo terminal**:

2. **Prepare o ambiente virtual**:
   ```bash
   cd restaurant
   ```
   ```bash
   source venv/bin/activate
   ```
3. **Vá até a pasta do frontend**:
   ```bash
   cd frontend
   ```

4. 1. **Certifique-se de que o [Node.js](https://nodejs.org/) está instalado**.
   - Você pode verificar executando:
     ```bash
     node -v
     npm -v
     ```

5. **Configuração do Frontend para Rodar em 127.0.0.1**

1. No diretório `frontend`, crie um arquivo chamado `.env`.
```bash
   touch .env
```

2. Adicione a seguinte linha ao arquivo:
   ```env
   HOST=127.0.0.1


5. **Instale as dependencias do React e inicie o servidor**:
   ```bash
   npm install
   ```
   ```bash
   npm start
   ```
6. **Caso enfrente erros de permissão ao rodar npm start, remova a pasta nodule_modules e o arquivo package-lock.json**
   ```bash
   rm -rf node_modules package-lock.json
   ```

   ```bash
   npm install
   ```

   ```bash
   npm start
   ```
