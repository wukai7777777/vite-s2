import React, { useCallback, useMemo, useState } from 'react';
import isHotkey from 'is-hotkey';
import { ReactEditor, Editable, withReact, useSlate, Slate } from 'slate-react';
import { Editor, Transforms, createEditor, Element } from 'slate';
import { withHistory } from 'slate-history';

import { Button, Icon, Toolbar } from './components';
import { withVoids } from './withVoids';

const HOTKEYS = {
	'mod+b': 'bold',
	'mod+i': 'italic',
	'mod+u': 'underlined',
	'mod+`': 'code'
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

const RichTextExample = () => {
	const [value, setValue] = useState(initialValue);
	const renderElement = useCallback(props => <MyElement {...props} />, []);
	const renderLeaf = useCallback(props => <Leaf {...props} />, []);
	const editor = useMemo(
		() => withHistory(withReact(withVoids(createEditor()))),
		[]
	);

	return (
		<Slate editor={editor} value={value} onChange={value => setValue(value)}>
			<Toolbar>
				<MarkButton format="bold" icon="format_bold" />
				<MarkButton format="italic" icon="format_italic" />
				<MarkButton format="underlined" icon="format_underlined" />
				<MarkButton format="code" icon="code" editor={editor} />
				<BlockButton format="heading-one" icon="looks_one" />
				<BlockButton format="heading-two" icon="looks_two" />
				<BlockButton format="block-quote" icon="format_quote" />
				<BlockButton format="numbered-list" icon="format_list_numbered" />
				<LayoutButton format="left" icon="format_align_left" />
				<LayoutButton format="center" icon="format_align_center" />
				<LayoutButton format="right" icon="format_align_right" />
				<LayoutButton format="top" icon="format_vertical_align_top" />
				<LayoutButton format="middle" icon="format_vertical_align_center" />
				<LayoutButton format="bottom" icon="format_vertical_align_bottom" />
			</Toolbar>
			<div className="editor-wrapper">
				<Editable
					className="editor"
					renderElement={renderElement}
					renderLeaf={renderLeaf}
					placeholder="Enter some rich text…"
					spellCheck
					autoFocus
					onKeyDown={event => {
						for (const hotkey in HOTKEYS) {
							if (isHotkey(hotkey, event)) {
								event.preventDefault();
								const mark = HOTKEYS[hotkey];
								toggleMark(editor, mark);
							}
						}
					}}
				/>
				</div>
		</Slate>
	);
};

const toggleBlock = (editor, format) => {
	const isActive = isBlockActive(editor, format);
	const isList = LIST_TYPES.includes(format);

	Transforms.unwrapNodes(editor, {
		match: n => LIST_TYPES.includes(n.type),
		split: true
	});

	Transforms.setNodes(editor, {
		type: isActive ? 'paragraph' : isList ? 'list-item' : format
	});

	console.log('wukai-----111133', Transforms, Element, Editor);

	if (!isActive && isList) {
		const block = { type: format, children: [] };
		Transforms.wrapNodes(editor, block);
	}
};

const getLayoutKey = format => ['left', 'center', 'right'].includes(format)
? 'align'
: 'verticalAlign';

const toggleLayout = (editor, format) => {
	const isActive = isLayoutActive(editor, format);
	Transforms.setNodes(editor, {
		data: {
			[getLayoutKey(format)]: isActive ? '' : format,
		},
	});
}

const toggleMark = (editor, format) => {
	const isActive = isMarkActive(editor, format);

	if (isActive) {
		Editor.removeMark(editor, format);
	} else {
		Editor.addMark(editor, format, true);
	}
};

const isBlockActive = (editor, format) => {
	const [match] = Editor.nodes(editor, {
		match: n => n.type === format
	});

	return !!match;
};

const isLayoutActive = (editor, format) => {
	const key = getLayoutKey(format);
	const [node] = Editor.nodes(editor, {
		match: n => {
			return Element.isElement(n);
		},
	});
	if (!node) {
		return false;
	}

	const formatValue = node[0]?.data && node[0]?.data[key]
	if (formatValue) {
		return formatValue === format;
	}

	return ['left', 'top'].includes(format);

};


const isMarksActive = (editor, format) => {
	const [match] = Editor.nodes(editor, {
		match: n => n[format],
	});

	return !!match;
}

const isMarkActive = (editor, format) => {
	const marks = Editor.marks(editor);
	return marks ? marks[format] === true : false;
};

const MyElement = (props) => {
	const { attributes, children, element } = props;
	const style = {};
	const textAlign = element.data?.align;
	if (textAlign) {
		style.textAlign = textAlign;
	}
	switch (element.type) {
		case 'block-quote':
			return <blockquote {...attributes} style={style}>{children}</blockquote>;
		case 'bulleted-list':
			return <ul {...attributes} style={style}>{children}</ul>;
		case 'heading-one':
			return <h1 {...attributes} style={style}>{children}</h1>;
		case 'heading-two':
			return <h2 {...attributes} style={style}>{children}</h2>;
		case 'list-item':
			return <li {...attributes} style={style}>{children}</li>;
		case 'numbered-list':
			return <ol {...attributes} style={style}>{children}</ol>;
		default:
			return <div {...attributes} style={style}>{children}</div>;
	}
};

// function getStyle(leaf) {
// 	if (Array.isArray(leaf.marks)) {
// 		return leaf.marks.reduce((acc, a) => {
// 			acc[a.type] = a.data[a.type];
// 			return acc;
// 		}, {});
// 	}
// 	return {};
// }

const Leaf = (props) => {
	let { attributes, children, leaf } = props;
	const style = {};
	if (leaf.bold) {
		children = <strong style={style}>{children}</strong>;
	}

	if (leaf.code) {
		children = <code style={style}>{children}</code>;
	}

	if (leaf.italic) {
		children = <em style={style}>{children}</em>;
	}

	if (leaf.underlined) {
		children = <u style={style}>{children}</u>;
	}

	return <span {...attributes} style={style}>{children}</span>;
};

const BlockButton = ({ format, icon }) => {
	const editor = useSlate();
	return (
		<Button
			active={isBlockActive(editor, format)}
			onMouseDown={event => {
				event.preventDefault();
				toggleBlock(editor, format);
			}}>
			<Icon>{icon}</Icon>
		</Button>
	);
};

const LayoutButton = ({ format, icon }) => {
	const editor = useSlate();
	return (
		<Button
			active={isLayoutActive(editor, format)}
			onMouseDown={event => {
				event.preventDefault();
				toggleLayout(editor, format);
			}}>
			<Icon>
				{icon}</Icon>
		</Button>
	);
};

const MarkButton = ({ format, icon }) => {
	const editor = useSlate();
	return (
		<Button
			active={isMarksActive(editor, format)}
			onMouseDown={event => {
				event.preventDefault();
				toggleMark(editor, format);
				ReactEditor.focus(editor);
			}}>
			<Icon>{icon}</Icon>
		</Button>
	);
};

const oldData = { "object": "value", "document": { "object": "document", "data": {}, "nodes": [{ "object": "block", "type": "paragraph", "data": { "align": "center" }, "nodes": [{ "object": "text", "text": "页面辅助 缩放", "marks": [{ "object": "mark", "type": "fontFamily", "data": { "fontFamily": "Arial" } }, { "object": "mark", "type": "fontSize", "data": { "fontSize": 18 } }, { "object": "mark", "type": "color", "data": { "color": "rgba(56,56,56,1)" } }, { "object": "mark", "type": "bold", "data": {} }, { "object": "mark", "type": "italic", "data": {} }, { "object": "mark", "type": "underlined", "data": {} }] }] }, { "object": "block", "type": "paragraph", "data": {}, "nodes": [{ "object": "text", "text": "", "marks": [{ "object": "mark", "type": "fontFamily", "data": { "fontFamily": "Arial" } }, { "object": "mark", "type": "fontSize", "data": { "fontSize": 18 } }, { "object": "mark", "type": "color", "data": { "color": "rgba(56,56,56,1)" } }, { "object": "mark", "type": "italic", "data": {} }] }] }, { "object": "block", "type": "paragraph", "data": {}, "nodes": [{ "object": "text", "text": "有了 固定尺寸 后, 对于页面的精细化调整, 和全局效果把控 的需求则需强化", "marks": [{ "object": "mark", "type": "fontFamily", "data": { "fontFamily": "Arial" } }, { "object": "mark", "type": "fontSize", "data": { "fontSize": 18 } }, { "object": "mark", "type": "color", "data": { "color": "rgba(56,56,56,1)" } }] }] }, { "object": "block", "type": "paragraph", "data": {}, "nodes": [{ "object": "text", "text": "", "marks": [{ "object": "mark", "type": "fontFamily", "data": { "fontFamily": "Arial" } }, { "object": "mark", "type": "fontSize", "data": { "fontSize": 18 } }, { "object": "mark", "type": "color", "data": { "color": "rgba(56,56,56,1)" } }] }] }, { "object": "block", "type": "paragraph", "data": {}, "nodes": [{ "object": "text", "text": "因此在4.1", "marks": [{ "object": "mark", "type": "fontFamily", "data": { "fontFamily": "Arial" } }, { "object": "mark", "type": "fontSize", "data": { "fontSize": 18 } }, { "object": "mark", "type": "color", "data": { "color": "rgba(56,56,56,1)" } }] }] }, { "object": "block", "type": "paragraph", "data": {}, "nodes": [{ "object": "text", "text": "我们配合固定尺寸, 增加了编辑态的. 仪表盘内容缩放查看功能", "marks": [{ "object": "mark", "type": "fontFamily", "data": { "fontFamily": "Arial" } }, { "object": "mark", "type": "fontSize", "data": { "fontSize": 18 } }, { "object": "mark", "type": "color", "data": { "color": "rgba(56,56,56,1)" } }] }] }, { "object": "block", "type": "paragraph", "data": {}, "nodes": [{ "object": "text", "text": "在画布区域底部, 增设了底部操作栏, ", "marks": [{ "object": "mark", "type": "fontFamily", "data": { "fontFamily": "Arial" } }, { "object": "mark", "type": "fontSize", "data": { "fontSize": 18 } }, { "object": "mark", "type": "color", "data": { "color": "rgba(56,56,56,1)" } }] }] }, { "object": "block", "type": "paragraph", "data": {}, "nodes": [{ "object": "text", "text": "", "marks": [{ "object": "mark", "type": "fontFamily", "data": { "fontFamily": "Arial" } }, { "object": "mark", "type": "fontSize", "data": { "fontSize": 18 } }, { "object": "mark", "type": "color", "data": { "color": "rgba(56,56,56,1)" } }] }] }, { "object": "block", "type": "paragraph", "data": {}, "nodes": [{ "object": "text", "text": "其中包含快捷操作:", "marks": [{ "object": "mark", "type": "fontFamily", "data": { "fontFamily": "Arial" } }, { "object": "mark", "type": "fontSize", "data": { "fontSize": 18 } }, { "object": "mark", "type": "color", "data": { "color": "rgba(56,56,56,1)" } }] }] }, { "object": "block", "type": "paragraph", "data": {}, "nodes": [{ "object": "text", "text": "- 显示 全部内容", "marks": [{ "object": "mark", "type": "fontFamily", "data": { "fontFamily": "Arial" } }, { "object": "mark", "type": "fontSize", "data": { "fontSize": 18 } }, { "object": "mark", "type": "color", "data": { "color": "rgba(56,56,56,1)" } }] }] }, { "object": "block", "type": "paragraph", "data": {}, "nodes": [{ "object": "text", "text": "- 显示 充满画布", "marks": [{ "object": "mark", "type": "fontFamily", "data": { "fontFamily": "Arial" } }, { "object": "mark", "type": "fontSize", "data": { "fontSize": 18 } }, { "object": "mark", "type": "color", "data": { "color": "rgba(56,56,56,1)" } }] }] }, { "object": "block", "type": "paragraph", "data": {}, "nodes": [{ "object": "text", "text": "- 快捷比例 50% / 100% / 200%", "marks": [{ "object": "mark", "type": "fontFamily", "data": { "fontFamily": "Arial" } }, { "object": "mark", "type": "fontSize", "data": { "fontSize": 18 } }, { "object": "mark", "type": "color", "data": { "color": "rgba(56,56,56,1)" } }] }] }] } };

// 将老数据迁移到新数据结构
const nodes = oldData.document.nodes
function buildData() {
	if (Array.isArray(nodes)) {
		return nodes.map(ele => {
			ele.children = ele.nodes.map(node => {
				// 给leaf 叶子节点添加 type;
				const temp = {};
				if (Array.isArray(node.marks)) {
					node.marks.forEach(mark => {
						if (!mark.data[mark.type]) {
							temp[mark.type] = true;
						} else {
							temp[mark.type] = mark.data[mark.type];
						}
					});
				}
				return {
					...node,
					...temp,
				}
			});
			delete ele.nodes;
			return ele;
		});
	}

	return [];
}

const initialValue = buildData();
console.log('wukai---initialValue', initialValue, oldData);

const initialValue22 = [
	{
		type: 'paragraph',
		children: [
			{
				text: '段落中的一行文字。',
				marks: [
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
				],
			},
		],
	},
	{
		type: 'paragraph',
		children: [
			{ text: '这是可编辑的 ' },
			{ text: '富', bold: true },
			{ text: ' 文本, ' },
			{ text: '较', italic: true },
			{ text: '<textarea>', code: true },
			{ text: ' 好的多了 ' },
			{ text: '!' },
			{ type: 'void', text: '一些文本呢在 void 中.' },
			{ text: '一些文本围绕 void 节点。' }
		]
	},
	{
		type: 'paragraph',
		children: [
			{
				text:
					"因为它是富文本它可以折行 "
			},
			{ text: '加粗', bold: true },
			{
				text:
					', 或者在页面中间添加一个语义渲染的块引号，如下所示:'
			}
		]
	},
	{
		type: 'block-quote',
		children: [{ text: '一句明智的话。' }]
	},
	{
		type: 'paragraph',
		children: [{ text: '你自己试试吧!' }]
	}
];

export default RichTextExample;
