from django.shortcuts import render
from django.http import JsonResponse
from scales_to_notes_mappings import chords_to_notes_mappings

# Create your views here.
def keyboard(request):
    return render(request, 'keyboard.html')

def home(request):
    return render(request, 'home.html')

def getNotes(request):
    notes = request.POST.getlist('notes[]')
    print('Notes :', notes)

    matched_notes_count = {
        "A": 0,
        "A#": 0,
        "B": 0,
        "C": 0,
        "C#": 0,
        "D": 0,
        "D#": 0,
        "E": 0,
        "F": 0,
        "F#": 0,
        "G": 0,
        "G#": 0
    }

    for key, value in chords_to_notes_mappings.items():
        for note in notes:
            if note in value:
                matched_notes_count[key] += 1

    all_matched_counts = matched_notes_count.values()
    max_matched_count = max(all_matched_counts)

    possible_scales = []

    for key, value in matched_notes_count.items():
        if value == max_matched_count:
            possible_scales.append(key)

    print('Matched Count : ', matched_notes_count)
    print('Max matched :', max_matched_count)
    print('Possible Scales :', possible_scales)

    # for scale in possible_scales:
    #     for key, value in chords_to_notes_mappings.items():
    #         if key == scale:
    #             for key2 in value:
    #                 note_arr = []
    #                 for note in notes:
    #                     if note in value[key2]:
    #                         note_arr.append(note)
    #                         possible_chords[key2] = note_arr

    possible_chords_in_possible_scales = {}

    for scale in possible_scales:
        possible_chords = {}
        for key, value in chords_to_notes_mappings.items():
            if key == scale:
                for note in notes:
                    note_arr = []
                    for key2 in value:
                        if note in value[key2]:
                            note_arr.append(key2)
                            possible_chords[note] = note_arr
        possible_chords_in_possible_scales[scale] = possible_chords
    
    print(possible_chords)

    print(possible_chords_in_possible_scales)

    context = {}
    context['possible_scales'] = possible_scales
    context['possible_chords'] = possible_chords
    context['possible_chords_in_possible_scales'] = possible_chords_in_possible_scales
    context['max_matched_count'] = max_matched_count

    return JsonResponse(context)