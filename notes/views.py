from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.
def home(request):
    return render(request, 'home.html')

def getNotes(request):
    notes = request.POST.getlist('notes[]')
    print('Notes :', notes)

    chords_to_notes_mappings = {
        "A": ['A', 'B', 'C#', 'D', 'E', 'F#', 'G#', 'A'],
        "A#": ['A#', 'C', 'D', 'D#', 'F', 'G', 'A', 'A#'],
        "B": ['B', 'C#', 'D#', 'E', 'F#', 'G#', 'A#', 'B'],
        "C": ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
        "C#": ['C#', 'D#', 'F', 'F#', 'G#', 'A#', 'C', 'C#'],
        "D": ['D', 'E', 'F#', 'G', 'A', 'B', 'C#', 'D'],
        "D#": ['D#', 'F', 'G', 'G#', 'A#', 'C', 'D'],
        "E": ['E', 'F#', 'G#', 'A', 'B', 'C#', 'D#'],
        "F": ['F', 'G', 'A', 'A#', 'C', 'D', 'E'],
        "F#": ['F#', 'G#', 'A#', 'B', 'C#', 'D#', 'F'],
        "G": ['G', 'A', 'B', 'C', 'D', 'E', 'F'],
        "G#": ['G#', 'A#', 'C', 'C#', 'D#', 'F', 'G']
    }

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

    print('Matched Count : ', matched_notes_count)

    all_matched_counts = matched_notes_count.values()
    max_matched_count = max(all_matched_counts)
    print('Max matched :', max_matched_count)

    possible_chords = []

    for key, value in matched_notes_count.items():
        if value == max_matched_count:
            possible_chords.append(key)

    print('Possible Chords :', possible_chords)

    context = {}
    context['possible_chords'] = possible_chords
    context['max_matched_count'] = max_matched_count

    return JsonResponse(context)