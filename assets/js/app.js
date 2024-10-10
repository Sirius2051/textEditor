document.addEventListener('DOMContentLoaded', () => {
    const textArea = document.getElementById('editor');
    const loadFile = document.getElementById('file');
    let editor, fileName, fileType;

    function init() {
        editor = CodeMirror.fromTextArea(textArea, {
            lineNumbers: true,
            mode: 'htmlmixed',
            theme: 'dracula',
            extraKeys: { "Ctrl-Space": "autocomplete" }
        });
        fileName = localStorage.getItem('openFileName');
        var lastFileContent = localStorage.getItem('openFileContent');
        fileType = localStorage.getItem('openFileType');
        if (fileName && lastFileContent) {
            setEditorMode(fileName)
            setInformation()
            editor.setValue(lastFileContent);
            document.getElementById('save').addEventListener('click', guardar);
        }
        editor.on('change', () => {
            console.log("Pepe")
            const content = editor.getValue();
            localStorage.setItem('openFileContent', content);
        });

        loadFile.addEventListener('change', load);
    }

    function load(event) {
        

        var file = new FileReader();
        file.addEventListener('load', read);
        file.readAsText(event.target.files[0]);

        fileName = event.target.files[0].name;
        fileSize = event.target.files[0].size;
        fileType = event.target.files[0].type;
        
        setInformation();
        setEditorMode(fileName);

        document.getElementById('save').addEventListener('click', guardar);

    }
    function setInformation() {
        var fileInfo = document.getElementById('information');

        fileInfo.innerHTML = `
            <span class=""fileName">${fileName}</span>
            <span class="fileType">${fileType}</span>
        `;
    }

    function read(event) {
        editor.setValue(event.target.result);
        localStorage.setItem('openFileName', fileName);
        localStorage.setItem('openFileType', fileType);
        localStorage.setItem('openFileContent', event.target.result);
    }

    function setEditorMode(fileName) {
        const extension = fileName.split('.').pop();
        switch (extension) {
            case 'js':
                editor.setOption('mode', 'javascript');
                break;
            case 'html':
                editor.setOption('mode', 'htmlmixed');
                break;
            case 'css':
                editor.setOption('mode', 'css');
                break;
            default:
                editor.setOption('mode', 'text/plain');
        }
    }
    function guardar() {
        var content = editor.getValue();
        var blob = new Blob([content], { type: `${fileType};charset=utf-8` });
        var link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }

    init();
});



