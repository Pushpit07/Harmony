notes = {
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
    
note1, note2, note3, note4, note5, note6 = input("Enter 6 notes: ").split()
# note1 = 'C'
# note2 = 'D'
# note3 = 'C#'
# note4 = 'A'
# note5 = 'G'
# note6 = 'F'

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

for key, value in notes.items():
    if note1 in value:
        matched_notes_count[key] += 1
    if note2 in value:
        matched_notes_count[key] += 1
    if note3 in value:
        matched_notes_count[key] += 1
    if note4 in value:
        matched_notes_count[key] += 1
    if note5 in value:
        matched_notes_count[key] += 1
    if note6 in value:
        matched_notes_count[key] += 1
        

print('Matched Count : ', matched_notes_count)

all_matched_counts = matched_notes_count.values()
max_matched_count = max(all_matched_counts)
print('Max matched :', max_matched_count)

for key, value in matched_notes_count.items():
    if value == max_matched_count:
        print(key)
    # print(value)
    # for note in value:
    #     print(note)