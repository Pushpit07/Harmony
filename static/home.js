function doalert(checkboxElem) {
    if (checkboxElem.checked) {
        console.log(checkboxElem.id, ':  Checked');
    } else {
        console.log("Unchecked : ", checkboxElem.id);
    }
}