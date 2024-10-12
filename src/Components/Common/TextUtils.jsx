// Function to strip HTML tags from a string
export const stripHtmlTags = (html) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
  };
  
  // Function to truncate a string if it exceeds maxLength characters
  export const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return `${text.substring(0, maxLength)}...`; 
    }
    return text; 
  };
    