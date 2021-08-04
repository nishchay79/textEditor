export const calculateCharLength = (text) => {
    return text.length;
}

export const calculateWordLength = (text) => {
    let charLength = text.split(' ');
    let numberOfWords = charLength.length;
    return numberOfWords;
}