const prefs = {
    "alliteration" : false,
    "animals" : true,
    "nouns": true
}

const apiUrl = 'https://random-word-form.herokuapp.com/random';

$(document).ready(async() => {
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

    await genName();

    $(document).keypress(evt => {
        if (evt.keyCode == 32) {
            evt.preventDefault();
            genName();
        }
    });
});

async function genName() {
    let entity = await getEntity();
    let letter = prefs.alliteration ? entity[0] : false;
    $("#name-block").text(`${await genWord('adjective',letter)} ${entity}`);
    $('.warn').hide();
}

async function getEntity() {
    return new Promise(async(resolve, reject) => {
        try {
            if (prefs.animals && prefs.nouns) {
                if (Math.random() > 0.7) resolve(await genWord('animal'));
            } else if (prefs.animals) resolve(await genWord('animal'));
            resolve(await genWord('noun'));
        } catch (e) {
            reject(e);
        }
    });
}

async function genWord(type, letter=false) {
    return new Promise(async(resolve,reject) => {
        let response = await fetch(`${apiUrl}/${type}/${letter ? letter : ''}`);
        if (!response.ok) reject("data not ok");
        else response.json().then(data => resolve(data[0]));
    });
}

async function showWarn(id,sec) {
	setTimeout(() => {
		if ($("#name-block").text().trim() == "loading...") $(`#${id}`).show();
	}, sec*1000);
}

function Warn(suff, delay) {
  this.delay = delay;
  this.id = `warn-${suff}`;
  showWarn(this.id, this.delay);
}

[new Warn("load", 3), new Warn("refresh",12)];
