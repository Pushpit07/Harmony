var context = new AudioContext();
var o = null;
var g = null;

function playNote(frequency, type) {
    console.log("playNote");

    setTimeout(function () {
        o = context.createOscillator();
        g = context.createGain();
        o.type = type;
        o.connect(g);
        o.frequency.value = frequency;
        g.connect(context.destination);
        o.start(0);
        g.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 1);
    }, 1000);
}


function getSelectedNotes() {
    var notes = [];
    var markedCheckbox = document.querySelectorAll('input[type="checkbox"]:checked');

    for (var checkbox of markedCheckbox) {
        notes.push(checkbox.id);
    }
    console.log('Notes :', notes)
    form.textarea.value = ""

    document.getElementById('selected_notes').innerHTML = '';
    var selectedNotesContent = '';
    for (var i = 0; i < notes.length; i++) {
        selectedNotesContent += '<a href="#" class="selected_note_box"><div class="selected_note">' + notes[i] + '</div></a>';
        form.textarea.value = form.textarea.value + notes[i] + "  ";
    }
    $("#selected_notes").append(selectedNotesContent);

    sendNotes(notes);
}

function sendNotes(notes) {
    var csrftoken = getCookie('csrftoken');

    $.ajax({
        headers: { 'X-CSRFToken': csrftoken },
        type: 'POST',
        url: 'receivednotes',
        async: true,
        data: {
            csrfmiddlewaretoken: csrftoken,
            notes: notes
        },
        success: function (response) {
            console.log(response);

            $("#possible_scales").html('');
            var possScales = '';
            for (var i = 0; i < response.possible_scales.length; i++) {
                console.log(response.possible_scales[i]);
                possScales += '<a href="#" class="selected_note_box possible_chord_box"><span class="selected_note possible_chord">' + response.possible_scales[i] + '</span></a>';
            }
            // possScales += '<span class="selected_note"> with ' + response.max_matched_count + ' notes matching</span>';
            $("#possible_scales").append(possScales);

            $("#possible_chords").html('');
            var possChords = '';
            for (var scale in response.possible_chords_in_possible_scales) {
                possChords += '<div class="row mt-5"><span class="possible_scale_name">' + scale + '</span>';
                for (var note in response.possible_chords_in_possible_scales[scale]) {
                    possChords += '<div class="col text-center"> Note <span class="note_name"> ' + note + '</span><div> found in chords <div class="note_name">' + response.possible_chords_in_possible_scales[scale][note] + '</div></div></div>';
                }
                possChords += '</div>'
            }
            // possChords += '<span class="selected_note"> with ' + response.max_matched_count + ' notes matching</span>';
            $("#possible_chords").append(possChords);
        },
        error: function (err) {
            console.log(err);
        }
    })
}

console.log('Poss', document.getElementById('poss'))


function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    console.log(cookieValue);
    return cookieValue;
}


// function checkSelected(checkboxElem) {
//     if (checkboxElem.checked) {
//         // console.log(checkboxElem.id, ':  Checked');
//         getSelectedNotes();
//     } else {
//         // console.log("Unchecked : ", checkboxElem.id);
//         getSelectedNotes();
//     }
// }

function disp(result) {
    const spaceBtn = document.querySelector('#space');
    const backspaceBtn = document.querySelector('#Backspace');
    const display = document.querySelector('.display');


    if (result !== "") {
        text_earlier = form.textarea.value.toString();

        splitted_text_earlier = text_earlier.split("  ");

        formatted_notes_earlier = []
        for (i = 0; i < (splitted_text_earlier.length) - 1; i++) {
            formatted_notes_earlier.push(splitted_text_earlier[i]);
        }

        if (formatted_notes_earlier.indexOf(result) > -1) {
            //do nothing
        } else {
            form.textarea.value = form.textarea.value + result + "  ";
        }
    }

    text_before = form.textarea.value.toString();

    splitted_text = text_before.split("  ");

    formatted_notes = []
    for (i = 0; i < (splitted_text.length) - 1; i++) {
        formatted_notes.push(splitted_text[i]);
    }

    for (i = 0; i < formatted_notes.length; i++) {
        document.getElementById(formatted_notes[i]).checked = true;
        getSelectedNotes();
    }

    spaceBtn.onclick = (() => {
        form.textarea.value += "  ";
    });
    backspaceBtn.onclick = (() => {
        text_before = form.textarea.value.toString();
        // var two_spaces = /\s\s/;
        var single_letter = /[a-zA-Z]\s\s/;
        var sharp_note = /[a-zA-Z][#]\s\s/;

        if (single_letter.test(text_before.slice(text_before.length - 3, text_before.length))) {
            form.textarea.value = text_before.slice(0, text_before.length - 3);
        } else if (sharp_note.test(text_before.slice(text_before.length - 4, text_before.length))) {
            form.textarea.value = text_before.slice(0, text_before.length - 4);
        } else {
            form.textarea.value = text_before.slice(0, text_before.length - 1);
        }

        text_after = form.textarea.value.toString();

        splitted_text = text_after.split("  ");

        formatted_notes = []
        for (i = 0; i < (splitted_text.length) - 1; i++) {
            formatted_notes.push(splitted_text[i]);
        }

        all_notes = ["A", "A#", "B", "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#"]

        for (i = 0; i < all_notes.length; i++) {
            if (formatted_notes.indexOf(all_notes[i]) > -1) {
                document.getElementById(all_notes[i]).checked = true;
                getSelectedNotes();
            } else {
                document.getElementById(all_notes[i]).checked = false;
                getSelectedNotes();
            }
        }
    });
    display.ondblclick = (() => {
        form.textarea.value = "";
    });
}

// function keypress(e) {
//     var keynum;

//     if (window.event) { // IE                  
//         keynum = e.keyCode;
//     } else if (e.which) { // Netscape/Firefox/Opera                 
//         keynum = e.which;
//     }

//     console.log(String.fromCharCode(keynum));
// }


window.addEventListener('keydown', function (event) {
    event.preventDefault();

    if (event.keyCode === 32) {
        document.getElementById('space').classList.add("keyPressed");
    } else if (event.keyCode === 8) {
        document.getElementById('Backspace').classList.add("backspace_pressed");
        document.getElementById('back_arrow').classList.add("backspace_arrow_pressed");
    } else if (document.getElementById(event.key).classList.contains("disabled_key")) {
        // don't do anything
    } else if (document.getElementById(event.key).classList.contains("sharp_note_key")) {
        document.getElementById(event.key).classList.add("sharp_note_key_pressed");
    }
    else {
        document.getElementById(event.key).classList.add("keyPressed");
    }
}, false);

window.addEventListener('keyup', function (event) {
    event.preventDefault();

    if (event.keyCode === 32) {
        document.getElementById('space').click();
        document.getElementById('space').classList.remove("keyPressed");
    } else if (event.keyCode === 8) {
        document.getElementById('Backspace').click();
        document.getElementById('Backspace').classList.remove("backspace_pressed");
        document.getElementById('back_arrow').classList.remove("backspace_arrow_pressed");
    } else if (document.getElementById(event.key).classList.contains("disabled_key")) {
        // don't do anything
    } else if (document.getElementById(event.key).classList.contains("sharp_note_key")) {
        document.getElementById(event.key).click();
        document.getElementById(event.key).classList.remove("sharp_note_key_pressed");
    }
    else {
        document.getElementById(event.key).click();
        document.getElementById(event.key).classList.remove("keyPressed");
    }
}, false);