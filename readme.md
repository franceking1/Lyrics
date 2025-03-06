<h2 style="text-align :center ; color: yellow ; font-size: 50px; font-family: 'Times New Roman', Times, serif;">Lyrics Finder</h2>

# Install the package 📥

```bash
npm install @faouzkk/lyrics-finder
```


# Usage 📚

```js
const getLyrics = require('@faouzkk/lyrics-finder');

(async () => {
    try {
        const lyrics = await getLyrics('Eminem Lose Yourself');
        console.log(lyrics);
    } catch (error) {
        console.log(error)
    }
})();
```

JUST for fun
