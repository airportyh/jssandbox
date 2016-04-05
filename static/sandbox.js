var id;
var codeEditor;
var iframe;
var code = {
  js: '// Type some JS code',
  html: 
    '<!doctype html>\n' + 
    '<html>\n' +
    '  <head>\n' +
    '    <script src="index.js"></' + 'script>\n' +
    '    <link rel="stylesheet" href="index.css">\n' +
    '  </head>\n' +
    '  <body>\n' +
    '    <!-- Type some HTML -->\n' +
    '  </body>\n' +
    '</html>'
    ,
  css: '/* Type some CSS */'
}
var modes = {
  js: 'javascript',
  html: 'htmlmixed',
  css: 'css'
}

init();
function init() {
  console.log('here');
  id = getID();
  var leftPanel = document.getElementById('left-panel');
  codeEditor = CodeMirror(leftPanel);
  codeEditor.setOption('extraKeys', {
    'Cmd-Enter': saveAndRun
  });
  codeEditor.on('change', function() {
    var selected = $('#codeSelector').val();
    code[selected] = codeEditor.getValue();
  });
  iframe = document.getElementById('iframe');
  if (id) {
    $.ajax({
      method: 'get',
      url: '/' + id,
      dataType: 'json',
      success: function(data) {
        code = data;
        var selected = $('#codeSelector').val();
        codeEditor.setValue(code[selected]);
        codeEditor.setOption('mode', modes[selected]);
      }
    });
    iframe.setAttribute('src', '/' + id + '/');
  } else {
    var selected = $('#codeSelector').val();
    codeEditor.setValue(code[selected]);
    codeEditor.setOption('mode', modes[selected]);
  }
  $('#runButton').click(saveAndRun);
  $('#codeSelector').change(function() {
    var selected = $(this).val();
    codeEditor.setOption('mode', modes[selected]);
    codeEditor.setValue(code[selected]);
  });
}

function saveAndRun() {
  if (id) {
    update();
  } else {
    create();
  }
}

function update() {
  $.ajax({
    method: 'put',
    url: '/' + id,
    data: code,
    success: function(data) {
      iframe.contentWindow.location.reload(true);
    }
  });
}

function create() {
  $.ajax({
    method: 'post',
    url: '/create',
    data: code,
    success: function(data) {
      id = data.id;
      window.location = '/' + id + '/edit';
    }
  });
}

function getID() {
  var match = location.pathname.match(/\/([0-9]+)\/edit/);
  return match && match[1];
}
