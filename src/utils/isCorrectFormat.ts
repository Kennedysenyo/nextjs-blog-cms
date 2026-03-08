export const isCorrectFormat = (type: "email" | "password", input: string) => {
  const emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex: RegExp = /^.{8,}$/;

  if (type === "email") {
    return emailRegex.test(input);
  }
  if (type === "password") {
    return passwordRegex.test(input);
  }
};
