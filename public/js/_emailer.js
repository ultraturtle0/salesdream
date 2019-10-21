var load_template = (div, template, tags) => {
    var quill = new Quill(div, {
        modules: {
            toolbar: {
                container: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    ['image', 'code-block'],
                    [{'tags': [
                        '[[Name]]',
                        '[[Email]]'
                    ]}]
                ],
                handlers: {
                    "tags": function (value) { 
                        if (value) {
                            const cursorPosition = this.quill.getSelection().index;
                            this.quill.insertText(cursorPosition, value);
                            this.quill.setSelection(cursorPosition + value.length);
                        }
                    }
                }
            }
        },
        theme: 'snow'  // or 'bubble'
    });

    // add html for custom template tags
    Array.prototype.slice.call(document.querySelectorAll('.ql-tags .ql-picker-item'))
        .forEach(item => item.textContent = item.dataset.value);
    document.querySelector('.ql-tags .ql-picker-label').innerHTML
        = 'Template tags' + document.querySelector('.ql-tags .ql-picker-label').innerHTML;

    quill.setContents([
        { insert: template }
    ]);
    quill.on('selection-change', (range, oldRange, source) => {
        console.log(range);
        console.log(oldRange);
        console.log(source);
    });
    return quill;
};


