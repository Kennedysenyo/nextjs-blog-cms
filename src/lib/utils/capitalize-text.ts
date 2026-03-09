export const capitalizeText = (text: string): string => {
  const textArray = text.trim().toLocaleLowerCase().split(" ");
  const newArray = [];
  for (let word of textArray) {
    const capitalizedWord = word[0].toLocaleUpperCase() + word.slice(1);
    newArray.push(capitalizedWord);
  }
  return newArray.join(" ");
};
