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


const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }],
  },
]

const App = () => {
  const [editor] = useState(() => withReact(createEditor()))

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
    editor={editor}
    value={initialValue}>
    <Editable />
  </Slate>
}


export default App;