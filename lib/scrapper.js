const axios = require('axios');
const cheerio = require('cheerio');

async function getLyrics(topic) {
    try {
        const response = await axios.get(`https://solr.sscdn.co/letras/m1/?q=${topic}&wt=json&callback=LetrasSug`);

        if (response.status === 200) {
            const { data } = response;
            const jsonData = data.replace('LetrasSug(', '').replace(')\n', '');
            const parsedData = JSON.parse(jsonData);

            if (parsedData?.response?.docs && parsedData.response.docs.length > 0) {
                const results = [];
                for (const lyric of parsedData.response.docs) {
                    const songTitle = lyric?.txt || 'Unknown Song';
                    const artistName = lyric?.art || 'Unknown Artist';

                    if (lyric?.dns && lyric?.url) {
                        const lyricUrl = `https://www.letras.mus.br/${lyric.dns}/${lyric.url}`;
                        const lyricResponse = await axios.get(lyricUrl);

                        if (lyricResponse.status === 200) {
                            const $ = cheerio.load(lyricResponse.data);
                            let finalLyrics = $('.lyric-original > p');
                            let lyrics_text = [];

                            if (finalLyrics.length) {
                                finalLyrics.each(function (i, elem) {
                                    const span = $(this).find('span.verse');

                                    if (span.length) {
                                        let miniArray = [];
                                        span.each(function (j, elem) {
                                            miniArray[j] = $(this).find("span.romanization").text();
                                        });
                                        lyrics_text[i] = miniArray;
                                    } else {
                                        lyrics_text[i] = $(this).html().split('<br>');
                                    }
                                });
                            }

                            let textToReturn = '';
                            if (lyrics_text.length) {
                                textToReturn += `Song: ${songTitle}\nArtist: ${artistName}\n\n`;

                                lyrics_text.forEach((line, index) => {
                                    if (index !== 0) textToReturn += '\n';
                                    line.forEach((word) => {
                                        textToReturn += word + "\n";
                                    });
                                });
                            }

                            results.push({
                                songTitle: songTitle,
                                artistName: artistName,
                                lyricsText: textToReturn
                            });
                        }
                    }
                }
                return results;
            } else {
                throw new Error('Lyrics not found');
            }
        } else {
            throw new Error('Error fetching lyrics');
        }
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getLyrics
};
