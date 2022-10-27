export const withVoids = editor => {
	const { isVoid } = editor;

	editor.isVoid = node => {
		switch (node.type) {
			case 'void':
				return true;
			default:
				return isVoid(node);
		}
	};

	return editor;
};