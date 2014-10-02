function makeStaticCellFunctional(doc,id,mode,compilers) {
    doc.cells[id] = new Object();
    doc.cells[id].id = id;
    doc.cells[id].mode = mode;
    doc.cells[id].renderDisplay = $('#renderDisplay' + id);
    $('.btn').button();
}

function addStaticCellFromJson(id,doc,mode,input,compilers) {
  doc.ids.push(id);
  makeStaticCellFunctional(doc,id,mode,compilers);
  if(!compilers[mode].hideAfterCompile) {
    $('#editCell' + id).show();
    doc.cells[id].editor = compilers[mode].editor(id);
    doc.cells[id].editor.getSession().setValue(input.code);
  } else {
    toggleEditor(doc,id);
  }
}

function compileStaticCell(id,doc,mode,input,compilers) {
  var compiler = compilers[mode];
  if(compiler.aggregate) {
    var prefixInput = "";
    for(var midx in doc.ids) {
      var mid = doc.ids[midx];
      if(doc.cells[mid].mode == mode) {
        if(id == mid) break;
        prefixInput = prefixInput + compiler.editorToInput(doc, doc.cells[mid].id).code + "\n";
      }
    }
    input.code = prefixInput + input.code;
  }
  compileCode(input,
      function(x) {
        outputResult(doc, id, x, compilers);
      }, doc.cells[id].mode);
}

function createStaticCellHTML(id,section,doc,mode,input,compilers) {
  var createEditor = !compilers[mode].hideAfterCompile;

  var cellDiv = document.createElement('div');
  cellDiv.id = 'cell'+id;
  cellDiv.class = 'cellWrapper';
  if(createEditor) {
    // edit cell
    var editCellDiv = document.createElement('div');
    editCellDiv.id = 'editCell'+id;
    editCellDiv.className = 'cell';
    editCellDiv.setAttribute('hidden' , 'true');
    var inputDiv = document.createElement('div');
    inputDiv.className = "input";
    $(inputDiv).append('<a id="runCode'+id+'" type="button" class="runButton" onclick="runCode(doc, '+id+', compilers)"><i class="fa fa-play-circle-o fa-2x"></i></span></a>');
    var editorCellDiv = document.createElement('div');
    editorCellDiv.id = "editor" + id
    editorCellDiv.className = 'cell light-border editor';
    $(editorCellDiv).html(input.code);
    $(inputDiv).append(editorCellDiv);
    $(editCellDiv).append(inputDiv);
    $(cellDiv).append(editCellDiv);
  }
  $(cellDiv).append('<div id="renderDisplay'+id+'" class="cell">Loading...</div>');
  section.append(cellDiv);

  // make functional
  doc.ids.push(id);
  doc.cells[id] = new Object();
  doc.cells[id].id = id;
  doc.cells[id].mode = mode;
  doc.cells[id].renderDisplay = $('#renderDisplay' + id);
  doc.cells[id].input = input;
  if(createEditor) {
    $('.btn').button();
    $('#editCell' + id).show();
    doc.cells[id].editor = compilers[mode].editor(id, input.code);
  }
  compileStaticCell(id, doc, mode, input, compilers);
}