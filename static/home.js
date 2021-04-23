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
        type: 'POST',
        url: 'receivednotes',
        async: true,
        data: {
            csrfmiddlewaretoken: csrftoken,
            notes: notes
        },
        success: function (response) {
            console.log(response);

            $("#possible_chords").html('');
            var possContent = '';
            for (var i = 0; i < response.possible_chords.length; i++) {
                possContent += '<a href="#" class="selected_note_box possible_chord_box"><span class="selected_note possible_chord">' + response.possible_chords[i] + '</span></a>';
            }
            // possContent += '<span class="selected_note"> with ' + response.max_matched_count + ' notes matching</span>';
            $("#possible_chords").append(possContent);
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


    form.textarea.value = form.textarea.value + result + "  ";

    spaceBtn.onclick = (() => {
        form.textarea.value += " ";
    });
    backspaceBtn.onclick = (() => {
        text_before = form.textarea.value.toString();

        // var two_spaces = /\s\s/;
        var single_letter = /[a-zA-Z]/;
        var space_letter = /\s[a-zA-Z]/;
        var sharp_note = /[a-zA-Z][#]/;

        if (text_before.slice(text_before.length - 2, text_before.length) === "  ") {
            form.textarea.value = text_before.slice(0, text_before.length - 2);
        } else if (space_letter.test(text_before.slice(text_before.length - 2, text_before.length))) {
            form.textarea.value = text_before.slice(0, text_before.length - 1);
        } else if (sharp_note.test(text_before.slice(text_before.length - 2, text_before.length))) {
            form.textarea.value = text_before.slice(0, text_before.length - 2);
        } else if (single_letter.test(text_before.slice(text_before.length - 1, text_before.length))) {
            form.textarea.value = text_before.slice(0, text_before.length - 1);
        } else {
            form.textarea.value = text_before.slice(0, text_before.length - 1);
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