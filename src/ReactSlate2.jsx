// Import React dependencies.
import React, {
  useState,
  useCallback,
  useMemo,
} from 'react'
// Import the Slate editor factory.
import {
  createEditor, Editor, Transforms, Text,
  Node,
} from 'slate'

// Import the Slate components and React plugin.
import { Slate, Editable, withReact } from 'slate-react'

const list = [
  {
      "object": "block",
      "type": "paragraph",
      "data": {
          "align": "left",
          "verticalAlign": "top"
      },
      "nodes": [
          {
              "object": "text",
              "text": "今天是周一",
              "marks": [
                  {
                      "object": "mark",
                      "type": "fontFamily",
                      "data": {
                          "fontFamily": "Arial"
                      }
                  },
                  {
                      "object": "mark",
                      "type": "fontSize",
                      "data": {
                          "fontSize": 48
                      }
                  },
                  {
                      "object": "mark",
                      "type": "color",
                      "data": {
                          "color": "rgba(183,27,28,1)"
                      }
                  },
                  {
                      "object": "mark",
                      "type": "underlined",
                      "data": {}
                  }
              ]
          }
      ]
  },
  {
      "object": "block",
      "type": "paragraph",
      "data": {
          "align": "left",
          "verticalAlign": "top"
      },
      "nodes": [
          {
              "object": "text",
              "text": "2022-10-30 20:22:59",
              "marks": [
                  {
                      "object": "mark",
                      "type": "fontFamily",
                      "data": {
                          "fontFamily": "Arial"
                      }
                  },
                  {
                      "object": "mark",
                      "type": "fontSize",
                      "data": {
                          "fontSize": 48
                      }
                  },
                  {
                      "object": "mark",
                      "type": "color",
                      "data": {
                          "color": "rgba(183,27,28,1)"
                      }
                  },
                  {
                      "object": "mark",
                      "type": "underlined",
                      "data": {}
                  }
              ]
          }
      ]
  }
]


// const initialValue = [
//   {
//     type: 'paragraph',
//     children: [{ text: 'A line of text in a paragraph.' }],
//   },
// ]

// Define a serializing function that takes a value and returns a string.
const serialize = value => {
  return (
    value
      // Return the string content of each paragraph in the value's children.
      .map(n => Node.string(n))
      // Join them all with line breaks denoting paragraphs.
      .join('\n')
  )
}

// Define a deserializing function that takes a string and returns a value.
const deserialize = string => {
  // Return a value array of children derived by splitting the string.
  return string.split('\n').map(line => {
    return {
      children: [{ text: line }],
    }
  })
}

const App = () => {
  const [editor] = useState(() => withReact(createEditor()));
  const initialValue = useMemo(
    () => list,
    []
  )

  // Render the Slate context.
  return <Slate
    onChange={value => {
      const isAstChange = editor.operations.some(
        op => 'set_selection' !== op.type
      )

      if (isAstChange) {
        // Save the value to Local Storage.
        const content = JSON.stringify(value)
        localStorage.setItem('content', serialize(value))
      }
    }}
    editor={editor}
    value={initialValue}>
    <Editable />
  </Slate>
}


export default App;