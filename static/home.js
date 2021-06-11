const recordButton = document.querySelector('.record_button');
const playButton = document.querySelector('.play_button');

recordButton.addEventListener('click', toggleRecording);
playButton.addEventListener('click', playSong);

function toggleRecording() {
    console.log('toggle')
    recordButton.classList.toggle('active');
    recordButton.innerHTML = `<i class="fas fa-microphone-alt"></i>&nbsp;&nbsp;Recording...`

    if (isRecording()) {
        console.log('start')
        startRecording();
    } else {
        console.log('stop')
        stopRecording();
    }
}

function isRecording() {
    return recordButton != null && recordButton.classList.contains('active');
}

let recordingStartTime;
let songNotes;
function startRecording() {
    recordingStartTime = Date.now();
    songNotes = [];
    playButton.classList.remove('show');
}

function stopRecording() {
    playSong();
    playButton.classList.add('show');
    recordButton.innerHTML = `<i class="fas fa-microphone"></i>&nbsp;&nbsp;Record`
}

function playSong() {
    if (songNotes.length === 0)
        return;
    songNotes.forEach(note => {
        setTimeout(() => {
            currNote = document.querySelector(`.piano_key[data-note="${note.key}"]`)
            playNote(currNote)
        }, note.startTime)
    })
    // console.log(songNotes);
}

function recordNote(note) {
    songNotes.push({
        key: note,
        startTime: Date.now() - recordingStartTime
    })
}


function getSelectedNotes() {
    var notes = [];
    var markedCheckbox = document.querySelectorAll('input[type="checkbox"]:checked');

    for (var checkbox of markedCheckbox) {
        notes.push(checkbox.id);
    }

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
            // console.log(response);

            $("#possible_scales").html('');
            var possScales = '';
            for (var i = 0; i < response.possible_scales.length; i++) {
                // console.log(response.possible_scales[i]);
                possScales += '<a href="#" class="selected_note_box possible_chord_box"><span class="selected_note possible_chord">' + response.possible_scales[i] + '</span></a>';
            }
            // possScales += '<span class="selected_note"> with ' + response.max_matched_count + ' notes matching</span>';
            $("#possible_scales").append(possScales);

            $("#inputted_notes").html('');
            // var inputtedNotes = '';

            // for (var scale in response.possible_chords_in_possible_scales) {
            //     inputtedNotes += '<div class="row result_row"><div class="col-1"><span class="possible_scale_name"></span></div>';
            //     for (var note in response.possible_chords_in_possible_scales[scale]) {
            //         inputtedNotes +=
            //             '<div class="col text-center"><span class="note mb-2">' + note + '</span></div>';
            //     }
            //     inputtedNotes += '</div>'
            //     break;
            // }
            // $("#inputted_notes").append(inputtedNotes);

            // $("#possible_chords").html('');
            // var possChords = '';
            // for (var scale in response.possible_chords_in_possible_scales) {
            //     possChords += '<div class="row result_row"><div class="col-1 text-center"><span class="note possible_scale_name">Scale ' + scale + '</span></div>';
            //     for (var note in response.possible_chords_in_possible_scales[scale]) {
            //         possChords +=
            //             '<div class="col text-center justify-content-center"><div class="row"><span class="note mb-4">' + note + '</span></div>' + '<div class="btn-group-vertical btn_group_width" role="group" aria-label="Basic radio toggle button group">'
            //             + makeRadioButtons(response.possible_chords_in_possible_scales[scale][note], scale, note)
            //             + '</div></div>';
            //     }
            //     possChords += '</div>'
            // }

            $("#possible_chords").html('');
            var possChords = '';
            possChords += '<div class="d-flex align-items-start mb-5"><div class="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">'

            for (var scale in response.possible_chords_in_possible_scales) {
                if (scale === Object.keys(response.possible_chords_in_possible_scales)[0])
                    possChords += '<button class="nav-link active result_scale_pill mt-4" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#' + scale + 'abcd' + '" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false">Scale ' + scale + '</button>';
                else
                    possChords += '<button class="nav-link result_scale_pill mt-4" id="v-pills-profile-tab" data-bs-toggle="pill" data-bs-target="#' + scale + 'abcd' + '" type="button" role="tab" aria-controls="v-pills-profile" aria-selected="false">Scale ' + scale + '</button>';
            }
            possChords += '</div><div class="card flex-fill flex-row shadow-inset border-light p-5 ml-4 rounded"><div class="card-body flex-fill flex-row p-0"><div class="tab-content flex-row" id="v-pills-tabContent">';

            for (var scale in response.possible_chords_in_possible_scales) {
                if (scale === Object.keys(response.possible_chords_in_possible_scales)[0])
                    possChords += '<div class="tab-pane show active flex-fill fade" id=' + scale + 'abcd' + ' role="tabpanel" aria-labelledby="v-pills-profile-tab"><div class="row">'
                else
                    possChords += '<div class="tab-pane flex-fill fade" id=' + scale + 'abcd' + ' role="tabpanel" aria-labelledby="v-pills-profile-tab"><div class="row">'

                for (var note in response.possible_chords_in_possible_scales[scale]) {
                    possChords +=
                        '<div class="col text-center justify-content-center resultant_no_shadow"><div class="row"><span class="note mb-4">' + note + '</span></div>' + '<div class="btn-group-vertical btn_group_width resultant_no_shadow" role="group" aria-label="Basic radio toggle button group">'
                        + makeRadioButtons(response.possible_chords_in_possible_scales[scale][note], scale, note)
                        + '</div></div>';
                }
                possChords += '</div></div>'
            }
            possChords += '</div></div></div></div>'

            // possChords += '<span class="selected_note"> with ' + response.max_matched_count + ' notes matching</span>';
            $("#possible_chords").append(possChords);
        },
        error: function (err) {
            console.log(err);
        }
    })
}

function makeRadioButtons(array, scale, note) {
    btn_array = '';
    radio_btn_group_name = scale + note;
    for (var i = 0; i < array.length; i++) {
        unique_name = scale + note + array[i];
        btn_array += '<input type="radio" class="btn-check resultant_no_shadow" name=' + note + ' id=' + unique_name + ' value=' + array[i] + ' autocomplete="off" /><label class="btn btn-outline-primary btn_resultant_chord_in_scale resultant_no_shadow" for=' + unique_name + ' >' + array[i] + '</label>';
    }
    // btn_array += '<div class="btn-group" role="group" aria-label="Basic radio toggle button group">';

    // for (var i = 0; i < array.length; i++) {
    //     btn_array.push('<input type="radio" class="btn-check" name=' + unique_name + ' id=' + unique_name + ' value=' + array[i] + ' autocomplete="off" checked />< label class= "btn btn-outline-primary" for=' + unique_name + ' > Radio 1</label >');
    // }

    // btn_array += '</div>';
    return btn_array;
}


let songChords = [];

$("#final_submit").click(function () {
    songChords = [];
    var final_cords = []

    for (note in songNotes) {
        console.log(songNotes[note])
        var note_elem = document.querySelector(`.piano_key[data-note="${songNotes[note].key}"]`);
        var matching_startTime = songNotes[note].startTime;
        var matching_note = note_elem.getAttribute('value');
        final_cords.push({
            key: matching_note,
            startTime: matching_startTime
        })
    }

    // console.log('matching notes', final_cords)

    $(".btn-check").each(function () {
        curr_checked_btn_name = $(this)[0].name;
        curr_checked_btn_defaultValue = $(this)[0].defaultValue;

        if ($(this)[0].checked) {
            final_cords.forEach(function (item) {
                if (item.key === curr_checked_btn_name) {
                    songChords.push({
                        key: curr_checked_btn_defaultValue,
                        startTime: item.startTime
                    })
                }
            })

            // console.log('SongChords : ', songChords)
        }
        else {
            // console.log($(this))
        }
    });

    songChords.sort(function (a, b) {
        return a.startTime - b.startTime;
    });

    console.log('SongChords sorted : ', songChords)

    if (songChords.length === 0)
        return;
    songChords.forEach(chord => {
        setTimeout(() => {
            playChord(chord.key)
        }, chord.startTime)
    })
});


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

function disp(result) {
    console.log(result);
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


function playNote(event) {
    if (event.keyCode !== undefined) {
        const noteAudio = document.querySelector(`audio[data-key="${event.keyCode}"]`);
        const key = document.querySelector(`.piano_key[data-key="${event.keyCode}"]`);

        if (!key)
            return;

        noteAudio.currentTime = 0;
        noteAudio.play();

        if (document.getElementById(event.key).classList.contains("sharp_note_key")) {
            document.getElementById(event.key).classList.add("sharp_note_key_pressed");
        } else {
            document.getElementById(event.key).classList.add("keyPressed");
        }

        noteAudio.addEventListener('ended', () => {
            if (document.getElementById(event.key).classList.contains("sharp_note_key")) {
                document.getElementById(event.key).click();
                document.getElementById(event.key).classList.remove("sharp_note_key_pressed");
            }
            else {
                document.getElementById(event.key).click();
                document.getElementById(event.key).classList.remove("keyPressed");
            }
        })
    } else {
        // console.log(event)
        const noteAudio = document.querySelector(`audio[data-key="${event.getAttribute("data-key")}"]`);
        const key = document.querySelector(`.piano_key[data-key="${event.getAttribute("data-key")}"]`);

        if (!key)
            return;

        noteAudio.currentTime = 0;
        noteAudio.play();

        if (document.getElementById(event.getAttribute("id")).classList.contains("sharp_note_key")) {
            document.getElementById(event.getAttribute("id")).classList.add("sharp_note_key_pressed");
        } else {
            document.getElementById(event.getAttribute("id")).classList.add("keyPressed");
        }

        noteAudio.addEventListener('ended', () => {
            if (document.getElementById(event.getAttribute("id")).classList.contains("sharp_note_key")) {
                document.getElementById(event.getAttribute("id")).click();
                document.getElementById(event.getAttribute("id")).classList.remove("sharp_note_key_pressed");
            }
            else {
                document.getElementById(event.getAttribute("id")).click();
                document.getElementById(event.getAttribute("id")).classList.remove("keyPressed");
            }
        })
    }
}

window.addEventListener('keydown', function (event) {
    event.preventDefault();
    if (event.repeat)
        return;

    keyboard_keys_to_notes = {
        "A": "C",
        "W": "C#",
        "S": "D",
        "E": "D#",
        "D": "E",
        "F": "F",
        "T": "F#",
        "G": "G",
        "Y": "G#",
        "H": "A",
        "U": "A#",
        "J": "B",
        "K": "C"
    }

    console.log(keyboard_keys_to_notes[event.key.toUpperCase()]);

    if (isRecording())
        recordNote(event.key.toUpperCase());

    if (event.keyCode === 32) {
        document.getElementById('space').classList.add("keyPressed");
    } else if (event.keyCode === 8) {
        document.getElementById('Backspace').classList.add("backspace_pressed");
        document.getElementById('back_arrow').classList.add("backspace_arrow_pressed");
    } else if (document.getElementById(event.key).classList.contains("disabled_key")) {
        // don't do anything
    } else {
        playNote(event);
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
    } else {
        if (document.getElementById(event.key).classList.contains("sharp_note_key")) {
            document.getElementById(event.key).classList.remove("sharp_note_key_pressed");
        }
        else {
            document.getElementById(event.key).classList.remove("keyPressed");
        }
    }
}, false);






/* 
Chords
*/

const context = new AudioContext();

// Signal dampening amount
let dampening = 0.99;

// Returns a AudioNode object that will produce a plucking sound
function pluck(frequency) {
    // We create a script processor that will enable
    // low-level signal sample access
    const pluck = context.createScriptProcessor(4096, 0, 1);

    // N is the period of our signal in samples
    const N = Math.round(context.sampleRate / frequency);

    // y is the signal presently
    const y = new Float32Array(N);
    for (let i = 0; i < N; i++) {
        // We fill this with gaussian noise between [-1, 1]
        y[i] = Math.random() * 2 - 1;
    }

    // This callback produces the sound signal
    let n = 0;
    pluck.onaudioprocess = function (e) {
        // We get a reference to the outputBuffer
        const output = e.outputBuffer.getChannelData(0);

        // We fill the outputBuffer with our generated signal
        for (let i = 0; i < e.outputBuffer.length; i++) {
            // This averages the current sample with the next one
            // Effectively, this is a lowpass filter with a
            // frequency exactly half of sampling rate
            y[n] = (y[n] + y[(n + 1) % N]) / 2;

            // Put the actual sample into the buffer
            output[i] = y[n];

            // Hasten the signal decay by applying dampening.
            y[n] *= dampening;

            // Counting constiables to help us read our current
            // signal y
            n++;
            if (n >= N) n = 0;
        }
    };

    // The resulting signal is not as clean as it should be.
    // In lower frequencies, aliasing is producing sharp sounding
    // noise, making the signal sound like a harpsichord. We
    // apply a bandpass centred on our target frequency to remove
    // these unwanted noise.
    const bandpass = context.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = frequency;
    bandpass.Q.value = 1;

    // We connect the ScriptProcessorNode to the BiquadFilterNode
    pluck.connect(bandpass);

    // Our signal would have died down by 2s, so we automatically
    // disconnect eventually to prevent leaking memory.
    setTimeout(() => {
        pluck.disconnect();
    }, 2000);
    setTimeout(() => {
        bandpass.disconnect();
    }, 2000);

    // The bandpass is last AudioNode in the chain, so we return
    // it as the "pluck"
    return bandpass;
}

// Fret is an array of finger positions
// e.g. [-1, 3, 5, 5, -1, -1];
// 0 is an open string
// >=1 are the finger positions above the neck
function strum(fret, stringCount = 6, stagger = 25) {
    // Reset dampening to the natural state
    dampening = 0.99;

    // Connect our strings to the sink
    const dst = context.destination;
    for (let index = 0; index < stringCount; index++) {
        if (Number.isFinite(fret[index])) {
            setTimeout(() => {
                pluck(getFrequency(index, fret[index])).connect(dst);
            }, stagger * index);
        }
    }
}

function getFrequency(string, fret) {
    // Concert A frequency
    const A = 110;

    // These are how far guitar strings are tuned apart from A
    const offsets = [-5, 0, 5, 10, 14, 19];

    return A * Math.pow(2, (fret + offsets[string]) / 12);
}

function mute() {
    dampening = 0.89;
}

function playChord(chord) {
    chords_to_play_mappings = {
        "A": [-1, 0, 2, 2, 2, 0],
        "A#": [-1, 1, 3, 3, 3, 1],
        "B": [-1, 2, 4, 4, 4, 2],
        "C": [-1, 3, 2, 0, 1, 0],
        "C#": [-1, 4, 3, 1, 2, 1],
        "D": [-1, -1, 0, 2, 3, 2],
        "D#": [-1, -1, 1, 3, 4, 3],
        "E": [0, 2, 2, 1, 0, 0],
        "F": [1, 3, 3, 2, 1, 1],
        "F#": [2, 4, 4, 3, 2, 2],
        "G": [3, 2, 0, 0, 0, 3],
        "G#": [4, 3, 1, 1, 1, 4]
    }

    console.log(chord);

    var frets = chords_to_play_mappings[chord]

    context.resume().then(strum(frets));
}
