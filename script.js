const prefs = {
    "alliteration" : false,
    "animals" : true,
    "nouns": true
}

$(document).ready(async() => {
    await getData();
    genName();

    $(".filters form").change(function() {
        if (this.id == "adjective")
            prefs.alliteration = $("#adjective input").is(":checked");
        else {
            if ($("#entity :checked").val() == "both") {
                prefs.animals = prefs.nouns = true;
            } else {
                prefs.animals = prefs.nouns = false;
                prefs[$("#entity :checked").val()] = true;
            }
        }
    });

    $(document).keypress(evt => {
        if (evt.keyCode == 32) {
            evt.preventDefault();
            genName();
        }
    });
});

function genName() {
    let entity = getEntity();
    let letter = prefs.alliteration ? entity[0] : getLetterOfRandThing(adjectives);
	$("#name").text(`${getAdj(letter)} ${entity}`)
}

var adjectives, animals, nouns;

function getAdj(ltr) {
	return getThing(adjectives[ltr]);
}

function getAnimal() {
	return getThing(animals);
}

function getNoun(ltr) {
    return getThing(nouns[ltr]);
}

function getEntity() {
    if (prefs.animals && prefs.nouns) {
        if (Math.random() > 0.7) return getAnimal();
    }
    else if (prefs.animals) return getAnimal();
    return getNoun(getLetterOfRandThing(nouns));
}

function getThing(arr) {
	return arr[Math.floor(Math.random()*arr.length)];
}

// nth thing
function getLetterOfRandThing(obj) {
    let randThing = Math.floor(Math.random()*obj.totalWords);
    let cnt=0;
    for (let key in obj) {
        if (key == "totalWords") continue;
        cnt += obj[key].length;
        if (cnt > randThing) return key;
    }
    return Math.floor(Math.random()*26) + 'a'.charCodeAt(0);
}

async function getData() {
    const amlUrl = 'https://dulldesk.github.io/words/animals/animals-min.json';
    const adjUrl = 'https://dulldesk.github.io/words/adjectives';
    const nounUrl = 'https://dulldesk.github.io/words/nouns';
    // const amlUrl = 'https://gist.githubusercontent.com/dulldesk/a2a0af68393225fa4bb5c2f068476c67/raw/3ea6f7c60ea3615e3a2cf79e4f5abf1fef00b1d1/animals.json';
    // const adjUrl = 'https://gist.githubusercontent.com/hugsy/8910dc78d208e40de42deb29e62df913/raw/eec99c5597a73f6a9240cab26965a8609fa0f6ea/english-adjectives.txt'
    // const nounUrl = 'https://raw.githubusercontent.com/martinsvoboda/nouns/master/nouns/en_nouns.txt';

    adjectives = await fetchFromStatic(adjUrl);
    nouns = await fetchFromStatic(nounUrl);
    animals = await fetchData(amlUrl).then(data => data.json());

    // adjectives = await fetchData(adjUrl,true).then(data => data.split('\n'));
    // nouns = await fetchData(nounUrl,true).then(data => data.split('\n'));

    async function fetchData(url, castToText=false) {
	    return new Promise((resolve,reject) => {
	       fetch(url).then(response => {
               if (!response.ok) reject("data not ok");
	           else resolve(castToText ? response.text() : response);
           })
        });
    }

    async function fetchFromStatic(url) {
        return new Promise(async(resolve, reject) => {
            let obj = {};
            obj.totalWords = 0;

            for (let chr="a".charCodeAt(0); chr < "z".charCodeAt(0); chr++) {
                let ltr = String.fromCharCode(chr);
                obj[ltr] = await fetchData(`${url}/${ltr}-min.json`).then(data => data.json()).catch(err => reject(err));
                obj.totalWords += obj[ltr].length;
            }
            resolve(obj);
        });
    }
}
