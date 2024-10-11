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

                        let finalLyrics = $('.lyric-original').html().replace(/<br>/g, '\n').replace(/<p>/g, '\n').replace(/<\/p>/g, '\n');

                        return finalLyrics;
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
        throw new Error('Unexected error');
    }
}

module.exports= {
    getLyrics 
}


// getLyrics('franglish position')
//     .then((lyrics) => console.log(lyrics))