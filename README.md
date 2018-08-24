# UMTG

Magic the Gathering card management tool based on electron.

Data and pictures are retreived from the Scryfall REST-API.
* [Scryfall](https://scryfall.com/)
* [Scryfall REST API](https://scryfall.com/docs/api)

Demo Video:
* [Youtube video](https://www.youtube.com/watch?v=X2G8kBDmOLU&t=3s)

# Data storeage

Deckfiles, database, etc. are stored at *~/.umtg*.
The *.umtg* folder has the following structure:

```
./settings.json     - json files with app settings
./umtg.db           - sqlite database with card/set information
./decks/            - folder for decklist files
```

**Database structure**

Table Card

* id: TEXT
* jsonString: TEXT
* amount: INTEGER
* foilAmount: INTEGER

Table Set

* id: TEXT
* jsonString: TEXT

# Development

```
# clone repo
git clone <url>

cd umtg
npm install
npm start


# run test with
npm run test

# run linter with
npm run lint

# run coverage with
npm run coverage
```
