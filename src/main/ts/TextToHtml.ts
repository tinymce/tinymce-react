// This was temporarily stolen from cement and will be eventually be removed. I think...
// Don't compare other unicode spaces here, as we're only concerned about whitespace the browser would collapse
const isCollapsibleWhitespace = (c: string): boolean => ' \f\t\v'.indexOf(c) !== -1;
const isNewLineChar = (c: string): boolean => c === '\n' || c === '\r';
const isNewline = (text: string, idx: number): boolean => (idx < text.length && idx >= 0) ? isNewLineChar(text[idx]) : false;

// Converts duplicate whitespace to alternating space/nbsps
const normalizeWhitespace = (text: string): string => {
  let pcIsSpace = false;
  let str = '';
  for (const c of text) {
    // Are we dealing with a char other than some collapsible whitespace or nbsp? if so then just use it as is
    if (isCollapsibleWhitespace(c) || c === '\u00a0') {
      // If the previous char is a space, we are at the start or end, or if the next char is a new line char, then we need
      // to convert the space to a nbsp
      if (pcIsSpace || str === '' || str.length === text.length - 1 || isNewline(text, str.length + 1)) {
        pcIsSpace = false;
        str += '\u00a0';
      } else {
        pcIsSpace = true;
        str += ' ';
      }
    } else {
      // Treat newlines as being a space, since we'll need to convert any leading spaces to nsbps
      pcIsSpace = isNewLineChar(c);
      str += c;
    }
  }
  return str;
};

// Leverage the browser to HTML encode the text by setting text content and then reading HTML
const encode = (text: string): string => {
  const wrapper = document.createElement('div');
  wrapper.textContent = text;
  return wrapper.innerHTML;
};

// Converts a string with newline characters and normalized whitespace into HTML
const convert = (text: string): string => {
  const normalizedText = normalizeWhitespace(text).replace(/^[\r\n]*|[\r\n]*$/g, '');

  const blocks = normalizedText.split(/\n{2,}|(?:\r\n){2,}/); // two or more newlines == paragraph separator

  const paragraphs = blocks.map((p) => p.split(/\n|\r\n/).join('<br />')); // single newline == BR tag

  // TBIO can handle merging text with only one paragraph, but best to be safe
  return paragraphs.length === 1 ? paragraphs[0] : paragraphs.map((p) => '<p>' + p + '</p>').join('');
};

export const textToHtml = (rawText: string) => {
  const text = encode(rawText);
  const html = convert(text);
  return html;
};