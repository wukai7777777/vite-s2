// Import React dependencies.
import React, {
  useState,
  useCallback,
} from 'react'
// Import the Slate editor factory.
import {
  createEditor, Editor, Transforms, Text,
} from 'slate'

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react'

// Define our own custom set of helpers.
const CustomEditor = {
  isBoldMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.bold === true,
      universal: true,
    })

    return !!match
  },

  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === 'code',
    })

    return !!match
  },

  toggleBoldMark(editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor)
    Transforms.setNodes(
      editor,
      { bold: isActive ? null : true },
      { match: n => Text.isText(n), split: true }
    )
  },

  toggleCodeBlock(editor) {
    const isActive = CustomEditor.isCodeBlockActive(editor)
    Transforms.setNodes(
      editor,
      { type: isActive ? null : 'code' },
      { match: n => Editor.isBlock(editor, n) }
    )
  },
}


const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
]

const App = () => {
  const [editor] = useState(() => withReact(createEditor()))

  // Define a rendering function based on the element passed to `props`. We use
  // `useCallback` here to memoize the function for subsequent renders.
  const renderElement = useCallback(props => {
    switch (props.element.type) {
      case 'code':
        return <CodeElement {...props} />
      default:
        return <DefaultElement {...props} />
    }
  }, []);

  const renderLeaf = useCallback(props => {
    return <Leaf {...props} />;
  }, []);


  // Render the Slate context.
  return <Slate
    onChange={value => {
      const isAstChange = editor.operations.some(
        op => 'set_selection' !== op.type
      )

      if (isAstChange) {
        // Save the value to Local Storage.
        const content = JSON.stringify(value)
        localStorage.setItem('content', content)
      }
    }}
    editor={editor} value={initialValue}>
    <Editable
      renderElement={renderElement}
      renderLeaf={renderLeaf}
      onKeyDown={event => {

      // if (event.key === '&') {
      //   event.preventDefault();
      //   editor.insertText('and');
      // }

      // if (event.key === '`' && event.ctrlKey) {
      //   // Prevent the "`" from being inserted by default.
      //   event.preventDefault();
      //   // Otherwise, set the currently selected blocks type to "code".
      //   Transforms.setNodes(
      //     editor,
      //     { type: 'code' },
      //     { match: n => Editor.isBlock(editor, n) },
      //   );
      // }

      // if (event.key === '`' && event.ctrlKey) {
      //   // Prevent the "`" from being inserted by default.
      //   event.preventDefault();
      //   // Otherwise, set the currently selected blocks type to "code".
      //   Transforms.setNodes(
      //     editor,
      //     { type: 'code' },
      //     { match: n => Editor.isBlock(editor, n) },
      //   );
      // }

      // if (!event.ctrlKey) {
      //   return
      // }
      // switch (event.key) {
      //   // When "`" is pressed, keep our existing code block logic.
      //   case '`': {
      //     event.preventDefault()
      //     const [match] = Editor.nodes(editor, {
      //       match: n => n.type === 'code',
      //     })
      //     Transforms.setNodes(
      //       editor,
      //       { type: match ? 'paragraph' : 'code' },
      //       { match: n => Editor.isBlock(editor, n) }
      //     )
      //     break
      //   }
      //   // When "B" is pressed, bold the text in the selection.
      //   case 'b': {
      //     event.preventDefault()
      //     const [match] = Editor.nodes(editor, {
      //       match: n => n.bold === true,
      //     })
      //     Transforms.setNodes(
      //       editor,
      //       { bold: match ? false : true },
      //       // Apply it to text nodes, and split the text node up if the
      //       // selection is overlapping only part of it.
      //       { match: n => Text.isText(n), split: true }
      //     )
      //     break
      //   }
      // }

      if (!event.ctrlKey) {
        return
      }

      // Replace the `onKeyDown` logic with our new commands.
      switch (event.key) {
        case '`': {
          event.preventDefault()
          CustomEditor.toggleCodeBlock(editor)
          break
        }

        case 'b': {
          event.preventDefault()
          CustomEditor.toggleBoldMark(editor)
          break
        }
      }



    }} />
  </Slate>
}

const CodeElement = props => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  )
}

const DefaultElement = props => {
  return <p {...props.attributes}>{props.children}</p>
}

// Define a React component to render leaves with bold text.
const Leaf = props => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? 'bold' : 'normal' }}
    >
      {props.children}
    </span>
  )
}

export default App;