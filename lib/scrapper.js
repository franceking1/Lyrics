const axios = require('axios');
const cheerio = require('cheerio');



async function getLyrics(topic) {

    try {

        const response = await axios.get(`https://solr.sscdn.co/letras/m1/?q=${topic}&wt=json&callback=LetrasSug`)

        if (response.status === 200) {

            const { data } = response;

            //console.log(data);

            const jsonData = data.replace('LetrasSug(', '').replace(')\n', '');

            const parsedData = JSON.parse(jsonData);

            // console.log(JSON.stringify(parsedData, null, 2));

            if (parsedData?.response?.docs && parsedData.response.docs.length > 0) {

                const lyric = parsedData.response.docs[0]

                if (lyric?.dns && lyric?.url) {

                    const lyricUrl = `https://www.letras.mus.br/${lyric.dns}/${lyric.url}`

                    //console.log('Lyrics URL :' + lyricUrl);

                    const lyricResponse = await axios.get(lyricUrl);

                    if (lyricResponse.status === 200) {

                        const $ = cheerio.load(lyricResponse.data);

                        let finalLyrics = $('.lyric-original > p');

                        let lyrics_text = [];

                        if (finalLyrics.length) {

                            finalLyrics.each(function (i, elem) {

                                const span = $(this).find('span.verse');

                                if (span.length) {
                                    miniArray = [];
                                    span.each(function (j, elem) {
                                        miniArray[j] = $(this).find("span.romanization").text();
                                    })
                                    lyrics_text[i] = miniArray;
                                }
                                else {
                                    lyrics_text[i] = $(this).html().split('<br>');
                                }
                            });
                        }

                        //console.log(lyrics_text);

                        let textToReturn = '';

                        if (lyrics_text.length) {

                            lyrics_text.forEach((line) => {

                                line.forEach((word) => {
                                    textToReturn += word + "\n";
                                })
                            });
                        }

                        //console.log(textToReturn);
                        return textToReturn;
                    }
                    else {
                        //console.log('Lyrics not found');
                        throw new Error('No response from server');
                    }
                }

                else {
                    //console.log('Lyrics not found');
                    throw new Error('Lyrics not found');
                }
            }
            else {
                //console.log('Lyrics not found');
                throw new Error('Lyrics not found');
            }

        } else {
            //console.log('error on fetching Lyrics :', error);
            throw new Error('error on fetching Lyrics');
        }

    } catch (error) {
        //console.log('Unexpleted error', error)
        throw error
    }
}

module.exports = {
    getLyrics
}


// getLyrics('ninho VVS')
//     .then((lyrics) => {
//         console.log(lyrics);
//     })