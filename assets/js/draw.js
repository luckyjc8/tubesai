function drawEmptyBoard () {
    var html = '<div class="container">';
    for ( let row = MIN_ROW_INDEX; row < MAX_ROW; row++ ) {
        html += '<div class="othello-row">';
        for (let col = MIN_COL_INDEX; col < MAX_COL; col++ ) {
            html += '<div id= ' + (row * MAX_ROW + col + 1) + ' class="square">';
            html += '</div>';
        }
        html += '</div>';
    }
    html += '</div>';
    document.body.innerHTML = html;
    console.log(html);
}

drawEmptyBoard();