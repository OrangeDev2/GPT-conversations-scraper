![New Project (1)](https://github.com/OrangeDev2/ScrapeSharedConvoAPI/assets/47803678/e4b66fca-12ab-4144-835a-5783dc13fd16)
# Shared Conversation Web Scraper API - Available in Python and JavaScript
**Shared Conversation Scraper API: Extracting Dialogues from ChatGPT, Bing, and Poe and Converting Them to JSON Format. Available in Python and JavaScript.**

# ChatGPT 3.5 Dialogues in JSON Format. GPT-4 will also be compatible.
![image](https://github.com/OrangeDev2/ScrapeSharedConvoAPI/assets/47803678/3708f241-3a99-4737-a0be-aab5561262e9)
# Poe (Google-PaLM) Dialogues in JSON Format.
![image](https://github.com/OrangeDev2/ScrapeSharedConvoAPI/assets/47803678/522dd1c2-504f-4230-b9d5-a5372c7df1ca)
# Bing AI Chat - Dialogues in JSON Format.
![image](https://github.com/OrangeDev2/ScrapeSharedConvoAPI/assets/47803678/4a2be4dd-e9ac-45e0-a15b-2b402cf957fe)

# **Clone the Repository**: Clone or download this repository.

# JavaScript Version
1. Install NodeJS: https://nodejs.org/en Make sure you have (LTS) installed
2. `cd javascript_version`- navigate to correct directory
3. `npm install` - to install the required dependencies: (node_modules folder and package-lock.json)
4. Make sure to replace `https://chat.openai.com/share/[id]` in `scrape.js - line 19` with any share link you want to scrape.
5. `npm start` - Your server will be hosted at http://localhost:3000/
6. `Ctrl+C` + `y` + `Enter` to shut down server.
7. Repeat Step 4

# Python Version
1. Install Python: Make sure you have Python installed. You can download it from python.org.
2. `cd python_version`- navigate to correct directory
3. `pip install Flask requests beautifulsoup4` - to install the required dependencies
4. Make sure to replace `https://poe.com/s/[id]` in `scrape.py - line 19` with any share link you want to scrape.
5. `python scrape.py` - Your server will be hosted at http://localhost:5000/
6. `Ctrl+C` to shut down server
7. Repeat Step 4
