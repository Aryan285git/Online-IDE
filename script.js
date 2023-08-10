document.getElementById('downloadButton').addEventListener('click', function() {
    var code = document.getElementById('codeArea').value;
    var selectedLanguage = document.getElementById('language').value;

    var data = { code: code, language: selectedLanguage };

    fetch('/download', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.blob())
    .then(blob => {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'code.' + selectedLanguage;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(url);
    });
});
