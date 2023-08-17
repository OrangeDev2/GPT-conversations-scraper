![New Project (1)](https://github.com/OrangeDev2/shared_conversation_scraper/assets/47803678/32e7ea39-540e-4f77-9337-75ef418c3cfc)
# Shared Conversation Scraper API
Shared Conversation Scraper API: Extract Dialogues from ChatGPT, Bing AI, and Poe - AI Chat

**Clone the Repository**: Clone or download this repository.

# JavaScript Version
1. Install NodeJS: https://nodejs.org/en Make sure you have (LTS) installed
2. `cd javascript_version`- navigate to correct directory
3. `npm install` - to install the required dependencies: (node_modules folder and package-lock.json)
4. Make sure to replace `https://chat.openai.com/share/[id]` in `scrape.js - line 19` with any share link you want to scrape.
5. `npm start` - Your server will be hosted at http://localhost:3000/
6. `Ctrl+C` + `y` + `Enter` to shut down server
7 . Repeat Step 4.

# Python Version
1. Install Python: Make sure you have Python installed. You can download it from python.org.
2. `cd python_version`- navigate to correct directory
3. `pip install Flask requests beautifulsoup4` - to install the required dependencies
4. Make sure to replace `https://poe.com/s/[id]` in `scrape.py - line 19` with any share link you want to scrape.
5. `python scrape.py` - Your server will be hosted at http://localhost:5000/
6. `Ctrl+C` to shut down server
7. Repeat Step 4