from flask import Flask
import requests
from bs4 import BeautifulSoup
import json
import re

app = Flask(__name__)

@app.route('/')
def scrape():
    headers = {
        'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; Chrome/92.0.4515.159 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    }

    url = 'https://poe.com/s/[id]'

    response = requests.get(url, headers=headers)

    if response.status_code == 200:

        # Check if the URL matches the pattern
        if 'https://chat.openai.com/share/' in url:
            gpt_html = response.text  # Extract HTML content from the response

            # Use BeautifulSoup to parse the HTML content
            soup = BeautifulSoup(gpt_html, 'html.parser')

            gpt_script = soup.find('script', id='__NEXT_DATA__')
            gpt_html = gpt_script.get_text() if gpt_script else None
            if gpt_html:
                gpt_data = json.loads(gpt_html)
                server_response = gpt_data['props']['pageProps']['serverResponse']

                model_slug = server_response['data']['model']['slug']
                title = server_response['data']['title']

                dialogues = [
                        {
                            "from": "human" if index % 2 == 0 else "assistant",
                            "value": message["message"]["content"]["parts"][0]
                        }
                        for index, message in enumerate(server_response["data"]["linear_conversation"])
                        if index > 1
                    ]
                
                result_json = {
                    "model_slug": model_slug,
                    "title": title,
                    "items": dialogues 
                    }

                print('ChatGPT - Shared Link: ', url, '\n')
                print(result_json)
                return result_json
            else:
                return "No GPT data found"
        if 'https://poe.com/s/' in url:
            poe_html = response.text  # Extract HTML content from the response

            # Use BeautifulSoup to parse the HTML content
            soup = BeautifulSoup(poe_html, 'html.parser')

            poe_script = soup.find('script', id='__NEXT_DATA__')
            poe_html = poe_script.get_text() if poe_script else None

            if poe_html:
                poe_data = json.loads(poe_html)

                model_name = "Poe"
                bot_name = poe_data['props']['pageProps']['data']['chatShare']['chatBot']['handle']
                title = poe_data['props']['pageProps']['data']['chatShare']['messages'][0]['text']

                dialogues = [
                    {
                        "from": "human" if index % 2 == 0 else "assistant",
                        "value": message["text"]
                    }
                    for index, message in enumerate(poe_data['props']['pageProps']['data']['chatShare']['messages'])
                    ]

                result_json = {
                    "model_slug": model_name,
                    "title": title,
                    "items": dialogues,
                    "bot_name": bot_name
                    }

                print('Poe AI Chat - Shared Link: ', url, '\n')
                print(result_json)
                return result_json
        if 'https://sl.bing.net/' in url:
            share_id_match = re.search(r'(?<=shareId=)[^&]+', response.text)

            if share_id_match:
                bing_share_id_url = 'https://www.bing.com/turing/getsharedmessages?shareId='+share_id_match.group(0)

                bing_share_id_response = requests.get(bing_share_id_url)


                if bing_share_id_response.status_code == 200:
                    bing_json = bing_share_id_response.json()

                    title = bing_json['messages'][0]['text']

                    dialogues = [
                        {
                            "from": "human" if index % 2 == 0 else "assistant",
                            "value": message["text"]
                        }
                        for index, message in enumerate(bing_json["messages"])
                        ]

                    result_json = {
                    "model_slug": "Bing AI",
                    "title": title,
                    "items": dialogues,
                    }

                    print('Bing AI Chat - Shared Link: ', url, '\n')
                    print(result_json)
                    return result_json

            else:
                print("Share ID not found in the response")
        else:
            return ""

        return ""
    else:
        return f"Request failed with status code: {response.status_code}"

if __name__ == '__main__':
    app.run()