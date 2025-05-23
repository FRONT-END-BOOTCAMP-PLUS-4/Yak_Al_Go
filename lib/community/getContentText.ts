export function getContentText(content: any): string {
  // If content is already a string, return it
  if (typeof content === 'string') {
    return content;
  }

  // If content is null or undefined, return empty string
  if (!content) {
    return '';
  }

  // If content is a Lexical editor object
  if (content.root) {
    try {
      let text = '';

      // Helper function to traverse the Lexical tree
      const traverseNode = (node: any) => {
        if (node.text) {
          text += node.text;
        }

        if (node.children) {
          node.children.forEach(traverseNode);
        }
      };

      // Start traversal from root
      if (content.root.children) {
        content.root.children.forEach(traverseNode);
      }

      return text.trim();
    } catch (error) {
      console.error('Error parsing Lexical content:', error);
      return '';
    }
  }

  // If content is an object but not a Lexical editor object
  return JSON.stringify(content);
}
