import { useState, useRef, useEffect } from 'react';

export function useRete(createEditor) {
  const [container, setContainer] = useState(null)
  const editorRef = useRef();

  useEffect(() => {
    if (container) {
      createEditor(container).then((value) => {
        console.log('editor created');
        editorRef.current = value;
      });
    }
  }, [container])

  useEffect(() => {
    return () => {
      if (editorRef.current) {
        console.log('editor destroyed');
        editorRef.current.destroy();
      }
    }
  }, []);

  return [setContainer, editorRef];
};
