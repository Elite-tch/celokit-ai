// components/CodeEditor.js
'use client';
import { useEffect, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { EditorState } from '@codemirror/state';
import { javascript } from '@codemirror/lang-javascript';
import { oneDark } from '@codemirror/theme-one-dark';

export default function CodeEditor({ 
  value, 
  onChange, 
  language = 'javascript', 
  readOnly = false,
  theme = 'dark',
  height = 'auto'
}) {
  const editorRef = useRef(null);
  const viewRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current) return;

    // Language extension
    let langExtension = javascript();
    if (language === 'solidity') {
      langExtension = javascript(); // Use JavaScript highlighting for Solidity as fallback
    }

    // Extensions
    const extensions = [
      basicSetup,
      langExtension,
      EditorView.theme({
        '&': {
          height: height === 'auto' ? 'auto' : height,
        },
        '.cm-content': {
          padding: '16px',
          minHeight: '100px',
        },
        '.cm-focused': {
          outline: 'none',
        },
        '.cm-editor': {
          fontSize: '14px',
        },
      }),
    ];

    // Add theme
    if (theme === 'dark') {
      extensions.push(oneDark);
    }

    // Add readonly extension
    if (readOnly) {
      extensions.push(EditorState.readOnly.of(true));
    }

    // Add update listener for onChange
    if (onChange && !readOnly) {
      extensions.push(
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        })
      );
    }

    // Create editor state
    const state = EditorState.create({
      doc: value || '',
      extensions,
    });

    // Create editor view
    const view = new EditorView({
      state,
      parent: editorRef.current,
    });

    viewRef.current = view;

    // Cleanup
    return () => {
      view?.destroy();
    };
  }, [value, onChange, language, readOnly, theme, height]);

  // Update content when value changes externally
  useEffect(() => {
    if (viewRef.current && value !== undefined) {
      const currentValue = viewRef.current.state.doc.toString();
      if (currentValue !== value) {
        viewRef.current.dispatch({
          changes: {
            from: 0,
            to: currentValue.length,
            insert: value,
          },
        });
      }
    }
  }, [value]);

  return <div ref={editorRef} className="w-full" />;
}