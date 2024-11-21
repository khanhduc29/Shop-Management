import { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import { Box, Paper } from '@mui/material';
import Quill from 'quill';
import { Delta } from 'quill/core';

interface EditorProps {
  readOnly: boolean;
  defaultValue: Delta;
  onSelectionChange: (range: any) => void;
  onTextChange: (delta: any) => void;

}

// Editor is an uncontrolled React component
const Editor = forwardRef<Quill, EditorProps>(
  ({ readOnly, defaultValue, onTextChange, onSelectionChange }, ref) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const defaultValueRef = useRef(defaultValue);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    });

    useEffect(() => {
      (ref as React.MutableRefObject<Quill | null>).current?.enable(!readOnly);
    }, [ref, readOnly]);

    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;
      const editorContainer = container.appendChild(
        container.ownerDocument.createElement('div'),
      );
      const quill = new Quill(editorContainer, {
        theme: 'snow',
      });

      const mutableRef = ref as React.MutableRefObject<Quill | null>;
      if (mutableRef && mutableRef.current) {
        mutableRef.current = quill;
      }

      if (defaultValueRef.current) {
        quill.setContents(defaultValueRef.current);
      }

      quill.on(Quill.events.TEXT_CHANGE, (delta, _oldDelta, _source) => {
        onTextChangeRef.current?.(delta);
      });

      quill.on(Quill.events.SELECTION_CHANGE, (range) => {
        onSelectionChangeRef.current?.(range);
      });

      return () => {
        const mutableRef = ref as React.MutableRefObject<Quill | null>;
        if (mutableRef && mutableRef.current) {
          (ref as React.MutableRefObject<Quill | null>).current = null;
        }
        container.innerHTML = '';
      };
    }, [ref]);

    return (
      <Box
        component={Paper}
        elevation={3}
        p={2}
        sx={{ minHeight: '200px', maxHeight: '400px', overflowY: 'auto' }}
        ref={containerRef}
      >
        {/* The Quill editor will be inserted here */}
      </Box>
    );
  },
);

Editor.displayName = 'Editor';

export default Editor;
