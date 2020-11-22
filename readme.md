# Search Engine

This is just a simple open-source search engine.

## Crawler

All the code for the web crawler is in `/crawler`. The beginning sites to crawl are in a variable array called `crawllist`, edit this to your liking. If you are testing the search engine, leave the user-agent to what it is. If you are launching a product, change it to something and never change it again.<br>

Obviously, it would take days of running the crawler to index ac chunk of the internet. For that reason, this is not an ideal search engine. If you want to use this as a real search engine, I suggest remaking the crawler script as it is not the most efficient and it is messy.

## Search Interface

The search interface is available in the folder called `/search`, everything is in that. The base URL is `/search` this is where queries will be sent.

## Robots.txt

This crawler follows all rules according to the sites `robots.txt` file

## Running

Steps to run this search engine:

Clone repo
`git clone https://github.com/mr-winson/search-engine`

Go to crawler folder
`cd search-engine/crawler`

Install dependencies
`npm i`

Run crawler
`npm start`

Finally, let this run for a couple minutes and collect data for your database of webpages. Once it has finished, go onto the next steps.<br>

Go to search folder
`cd ../search`

Install packages
`npm i`

Start search interface
`npm start`

Go to localhost on port 3000.

## Contributing

If you want to contribute, you can always open a pull request or file an issue.

## License

This project is licensed under MIT. Please see the License in the `LICENSE` file.
