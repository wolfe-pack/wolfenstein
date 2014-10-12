function compileCode (input, usage, mode) {
    $.ajax({
       type: "POST",
       contentType: "application/json",
       url: '/compiler/' + mode,
       data: JSON.stringify(input),
       dataType: "json",
       success: usage,
       error: function(j, t, e) {}
    });
};

var heightUpdateFunction = function(editor, id) {
    // http://stackoverflow.com/questions/11584061/
    //console.log(id);
    //console.log(editor);
    var newHeight =
              editor.getSession().getScreenLength()
              * editor.renderer.lineHeight
              + editor.renderer.scrollBar.getWidth();

    $(id).height(newHeight.toString() + "px");
    // This call is required for the editor to fix all of
    // its inner structure for adapting to a change in size
    editor.resize();
};

function outputResult(doc, id, result, compilers) {
      switch(result.format) {
        case "html": doc.cells[id].renderDisplay.html(result.result); break;
        case "string": doc.cells[id].renderDisplay.html("<div class=\"string-result\">" + result.result + "</div>"); break;
      }
      if(compilers[doc.cells[id].mode].hideAfterCompile) $('#toggleEditor'+id).click();
      MathJax.Hub.Queue(["Typeset",MathJax.Hub,"renderDisplay"+id]);
      $('pre code').each(function(i, block) {
        hljs.highlightBlock(block);
      });
      /*
      // post compiling work
      switch(doc.cells[id].mode) {
        case "scala": break;
        case "markdown":
            $('#toggleEditor'+id).click();
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,"renderDisplay"+id]);
            break;
        case "latex":
            $('#toggleEditor'+id).click();
            MathJax.Hub.Queue(["Typeset",MathJax.Hub,"renderDisplay"+id]);
            break;
        case "heading1":
            $('#toggleEditor'+id).click();
            break;
        case "heading2":
            $('#toggleEditor'+id).click();
            break;
        case "heading3":
            $('#toggleEditor'+id).click();
            break;
        case "heading4":
            $('#toggleEditor'+id).click();
            break;
        case "heading5":
            $('#toggleEditor'+id).click();
            break;
      }*/
}


function runCode(doc, id, compilers) {
  outputResult(doc, id, { format: "html", result: '<div class="text-center">' +
                                                  '   <img src="/assets/images/ajax-loader.gif"></img>' +
                                                  '</div>' }, compilers)
  var mode = doc.cells[id].mode;
  var compiler = compilers[mode];
  var input = compiler.editorToInput(doc, id);
  input.extraFields = doc.cells[id].config;
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
  // convert config as well
  input.extraFields = doc.cells[id].config;
  compileCode(input,
      function(x) {
        outputResult(doc, id, x, compilers);
      }, doc.cells[id].mode);
}

function changeMode(id, newMode) {
   var currentCode = compilers[doc.cells[id].mode].editorToInput(doc, id).code;
   compilers[doc.cells[id].mode].removeEditor(id);
   doc.cells[id].mode = newMode;
   //text = doc.cells[id].editor.getSession().getValue();
   doc.cells[id].editor = compilers[newMode].editor(id, currentCode);
   doc.cells[id].editor.focus();
}

function newCellDiv(id) {
   return '<div id="cell' + id + '" class="cellWrapper" onmouseover="document.getElementById(\'sidebarCell' + id + '\').style.display = \'block\';" onmouseout="document.getElementById(\'sidebarCell' + id + '\').style.display = \'none\';">' +
   '<div id="editCell' + id + '" class="light-border">' +
   '  <div id="sidebarCell' + id + '" class="sidebarCell text-right" style="display: none;">' +
   '    <div class="btn-group btn-group-xs">' +
   '      <!--button id="moveAbove' + id + '" type="button" class="btn btn-default" onclick="moveCellAbove(doc,' + id + ',compilers)"><i class="fa fa-chevron-up"></i></button-->' +
   '      <button id="addAbove' + id + '" type="button" class="btn btn-default" onclick="addCellAbove(doc,' + id + ',compilers)"><i class="fa fa-sort-up"></i><i class="fa fa-plus"></i></button>' +
   '      <button id="toggleCellConfig' + id + '" type="button" class="btn btn-default edit-btn" onclick="cellConfigClicked(' + id + ', doc, compilers)"><i class="fa fa-cog fa-fw"></i></button>' +
   '      <button id="toggleEditor' + id + '" type="button" class="btn btn-default edit-btn" onclick="toggleEditor(doc,' + id + ')"><i class="fa fa-pencil fa-fw"></i></button>' +
   '      <button id="remove' + id + '" type="button" class="btn btn-default" onclick="removeCell(doc,' + id + ')"><span class="fa fa-trash-o"></span></button>' +
   '      <button id="addBelow' + id + '" type="button" class="btn btn-default" onclick="addCellBelow(doc,' + id + ',compilers)"><i class="fa fa-plus"></i><i class="fa fa-sort-down"></i></button>' +
   '      <!--button id="moveBelow' + id + '" type="button" class="btn btn-default" onclick="moveCellBelow(doc,' + id + ',compilers)"><i class="fa fa-chevron-down"></i></button-->' +
   '    </div>' +
   '  </div>' +
   //'  cell ' + id + ' contents' +
   '  <div class="input">' +
   '    <div id="modeForm' + id + '" class="btn-group btn-group-xs" data-toggle="buttons">' + editorToolbar() +
   '    </div>' +
   '    <div id="editor' + id + '" class="cell light-border"></div>' +
   '      <button id="runCode' + id + '" type="button" class="btn btn-default btn-xs" onclick="runCode(doc, ' + id + ',compilers)"><span class="glyphicon glyphicon-play"></span></button>' +
   '  </div>' +
   '  <div id="renderDisplay' + id + '" class="cell"  ondblclick="toggleEditor(doc,' + id + ')"></div>' +
   '</div>' +
   '</div>'
}

function makeCellFunctional(doc,id,compiler,compilers,initialContent,config) {
    doc.cells[id] = new Object();
    doc.cells[id].id = id;
    doc.cells[id].mode = compiler;
    doc.cells[id].renderDisplay = $('#renderDisplay' + id);
    doc.cells[id].config = config;

    doc.cells[id].editor = compilers[compiler].editor(id,initialContent);
    doc.cells[id].showEditor = true;

    $('.btn').button();

    var sz = $('#modeForm'+id+' label');
    for (var i=0, len=sz.length; i<len; i++) {
        sz[i].onclick = function() {
            newMode = this.querySelector('input').value;
            //console.log(doc.cells[id].mode, newMode);
            if(doc.cells[id].mode != newMode) {
              changeMode(id, newMode);
            }
        };
    }
}

function addCellFromJson(doc,format,content,compilers,config) {
  $( "#cells" ).append(newCellDiv(doc.numCells));
  doc.ids.push(doc.numCells);
  makeCellFunctional(doc,doc.numCells,format,compilers,content, config);
  //doc.cells[doc.numCells].editor.getSession().setValue(content);
  $('#modeForm'+ doc.numCells +' label input[value='+ format +']').parent().click()
  //runCode(doc, doc.numCells, compilers);
  doc.numCells += 1;
}

function addCell(doc,compilers) {
  $( "#cells" ).append(newCellDiv(doc.numCells));
  doc.ids.push(doc.numCells);
  makeCellFunctional(doc,doc.numCells, "scala",compilers,"",{});
  doc.numCells += 1;
}

function addCellAbove(doc,id,compilers) {
  console.log("TODO: adding above " + id);
  $( "#cell"+id ).before(newCellDiv(doc.numCells));
  doc.ids.splice(doc.ids.indexOf(id),0,doc.numCells);
  makeCellFunctional(doc,doc.numCells, "scala",compilers,"",{});
  doc.numCells += 1;
}

function addCellBelow(doc,id,compilers) {
  console.log("TODO: adding below " + id);
  $( "#cell"+id ).after(newCellDiv(doc.numCells));
  doc.ids.splice(doc.ids.indexOf(id)+1,0,doc.numCells);
  makeCellFunctional(doc,doc.numCells, "scala",compilers,"",{});
  doc.numCells += 1;
}

function moveCellAbove(doc,id,compilers) {
  console.log("TODO: move cell up " + id);
  //$( "#cell"+id ).before(newCellDiv(doc.numCells));
  //doc.ids.splice(doc.ids.indexOf(id),0,doc.numCells);
  //makeCellFunctional(doc,doc.numCells, "scala",compilers,{});
  //doc.numCells += 1;
}

function moveCellBelow(doc,id,compilers) {
  console.log("TODO: move cell down " + id);
  //$( "#cell"+id ).after(newCellDiv(doc.numCells));
  //doc.ids.splice(doc.ids.indexOf(id)+1,0,doc.numCells);
  //makeCellFunctional(doc,doc.numCells, "scala",compilers,{});
  //doc.numCells += 1;
}

function toggleEditor(doc,id) {
  doc.cells[id].showEditor = !doc.cells[id].showEditor;
  if(doc.cells[id].showEditor) {
    // console.log("showing editor" + id);
    $('#editCell' + id + ' .input').show();
  } else {
    // console.log("hiding editor" + id);
    $('#editCell' + id + ' .input').hide();
  }
}

function removeCell(doc,id) {
  console.log("removing " + id);
  $('#cell' + id).remove();
  delete doc.cells[id];
}

function saveDoc(doc, compilers) {
  console.log("saving doc to " + $('#saveAsInput')[0].value);
  var d = docToJson(doc,compilers);
  console.log(d);
  $.ajax({
       type: "POST",
       contentType: "application/json",
       url: '/doc/save/' + $('#saveAsInput')[0].value,
       data: JSON.stringify(d),
       success: function(d) {
         bootstrap_alert("success", "Success", "Saved to " + $('#saveAsInput')[0].value, 2000);
         console.log(d);
       },
       error: function(j,t,e) {
         bootstrap_alert("danger", "Failed", JSON.stringify(e), 5000);
         console.log(d);
       }
    });
}

function runAll(doc, compilers) {
  for (var idx in doc.ids){
    var id = doc.ids[idx];
    if (doc.cells.hasOwnProperty(id)) {
      runCode(doc, id, compilers);
    }
  }
}
