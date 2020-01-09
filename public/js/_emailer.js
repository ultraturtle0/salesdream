var load_template = (div, template, tags) => {
    var quill = new Quill(div, {
        modules: {
            toolbar: {
                container: [
                    [{ header: [1, 2, false] }],
                    ['bold', 'italic', 'underline'],
                    ['image', 'code-block'],
                    [{ tags }]
                ],
                handlers: {
                    "tags": function (value) { 
                        if (value) {
                            const tag_value = `[[${value}]]`;
                            const cursorPosition = this.quill.getSelection().index;
                            this.quill.insertText(cursorPosition, tag_value);
                            this.quill.setSelection(cursorPosition + tag_value.length);
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
        /*console.log(range);
        console.log(oldRange);
        console.log(source);
        */
    });
    return quill;
};

var load_preview = (content, tags) => {
    var valid = true;
    var text = content
        .replace(/\[\[([A-Za-z]+)\]\]/g, (_, tag) => {
            if (tags[tag]) {
                return tags[tag];
            } else {
                valid = false;
                return `<span style="color:red;">[[${tag}]]</span>`;
            };
        });
    console.log(valid);
    var html = `<p>${text.replace('\n', '<br>')}</p>`;
    return ({ text, valid, html });
};


