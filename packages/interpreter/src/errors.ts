const DEFAULT_PADDING = 20;

export const formatError = (
  input: string,
  index: number,
  error: string,
  padding = DEFAULT_PADDING
) => {
  const start = Math.max(0, index - padding);
  const end = Math.min(start + padding * 2 + 1, input.length);
  const indent = index - start + (start > 0 ? 1 : 0);
  let sliced = input.slice(start, end);
  if (start > 0) sliced = `…${sliced}`;
  if (end < input.length) sliced = `${sliced}…`;
  const cursor = " ".repeat(indent) + "^";
  return `${error}:\n${sliced}\n${cursor}`;
};
