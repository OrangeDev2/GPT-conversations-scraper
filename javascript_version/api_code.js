const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio');

const app = express();

app.use(cors()); // Enable CORS for all routes

const headers = { // https://developer.mozilla.org/en-US/docs/Glossary/Request_header
  'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; Chrome/92.0.4515.159 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
  'Accept-Encoding': 'gzip, deflate',
  'Cache-Control': 'no-cache',
  'Connection': 'keep-alive'
};

app.get('/', (req, res) => {
  const url = 'https://chat.openai.com/share/[id]'; // Put your Chat Share Link.  ChatGPT, Poe AI Chat, or Bing AI Chat.  [Note]: Bing AI Share Feature is available on Microsoft Edge.

  axios.get(url, {headers}) // gpt_url default.
    .then(response => response.data)
    .then(html => {
      const $ = cheerio.load(html);

      const gpt_html = url?.match(/https:\/\/chat\.openai\.com\/share\//) ? $('script#__NEXT_DATA__').html() : null; // Extracted html for ChatGPT
      const bing_html = url?.match(/https:\/\/sl\.bing\.net\//gm) ? html : null; // Extracted html for Bing
      const poe_html = url?.match(/https:\/\/poe\.com\/s\//) ? JSON.parse($('script#__NEXT_DATA__').html()) : null; // Extracted JSON for Poe

      if (!gpt_html && !bing_html && !poe_html){
        res.status(404).send('Resource not found');
      }

      if (gpt_html) { // ChatGPT
            gpt_json = JSON.parse(gpt_html).props.pageProps.serverResponse;

            let modelSlug = gpt_json.data.model.slug;
            let title = gpt_json.data.title;

            let dialogues = [
                gpt_json.data.linear_conversation.map((message, index) => ({
                  "from": index  % 2 === 0 ? "human" : "assistant",
                  "value": message.message?.content.parts[0]
                }))
              ];

            const json = 
                {
                    model_slug: modelSlug,
                    title: title,
                    items: dialogues[0]
                }
            

            console.log(json);
            res.status(200).json(json);

        } else if (bing_html) { // Bing Chat
            const shareId = bing_html.match(/(?<=shareId=)[^&]+/gm); // Searching for Share ID in the HTTP 200 Response

            if (shareId) { // ShareId found.
                const getBingConvos = 'https://www.bing.com/turing/getsharedmessages?shareId=';
                const shareIdUrl = getBingConvos + shareId[0];

                axios.get(shareIdUrl)
                    .then(secondResponse => secondResponse.data)
                    .then(bingJson => {
                        let dialogues = [
                          bingJson.messages.map((message, index) => ({
                            "from": index  % 2 === 0 ? "human" : "assistant", // Change sender to assistant
                            "value": message.text
                          }))
                        ];

                        const json = {
                          items: dialogues[0],
                          model_name: "Bing",
                          title: bingJson.messages[0].text
                        };
            
                        console.log(json);
                        res.status(200).json(json);

                    })
                    .catch(error => {
                        console.error('Error fetching Bing conversation data:', error);
                        res.status(500).json({ error: 'Failed to fetch the bing shareID page' });
                    });
                  } else if (!shareId) {
                    res.status(404).send('Resource not found');
                  }
        } else if (poe_html) { // POE AI CHat
            let dialogues = [
              poe_html.props.pageProps.data.chatShare.messages.map((message, index) => ({
                "from": index  % 2 === 0 ? "human" : "assistant",
                "value": message.text
              }))
            ];

            const json = {
              items: dialogues[0],
              model_name: "Poe",
              bot_name: poe_html.props.pageProps.data.chatShare.chatBot.handle,
              title: poe_html.props.pageProps.data.chatShare.messages[0].text
            };

            console.log(json);
            res.status(200).json(json);

    }})
    .catch(error => { // Link returns error.
      console.error('Error, data fetch failed:', error);
      res.status(500).json({ error: 'Failed to fetch the website' });
    });
});

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});