var init = function(diepte) {
    var board,
    game = new Chess(),
    statusEl = $('#status'),
    fenEl = $('#fen'),
    pgnEl = $('#pgn');
    function Evaluation (){
       var evaluationNumber=0;
       for(var i=0; i<64; i++){
            var square=game.SQUARES[i];
            //console.log(square[1]);
            var pos=String(square);
            if (game.in_checkmate() === true & game.turn() === 'b') {evaluationNumber += -99999}
            if (game.in_checkmate() === true & game.turn() === 'w') {evaluationNumber += 99999}
            if(!(game.get(pos)==null)){
                var tvalue=1;
                var pvalue=0;
                if(game.get(pos).color=='w'){tvalue*=-1};
                if(((square[1]=='6'&game.get(pos).color=='w')||(square[1]=='2'&game.get(pos).color=='b'))&game.get(pos).type=='p'){pvalue+=0.5*tvalue}
                if(((square[1]=='7'&game.get(pos).color=='w')||(square[1]=='1'&game.get(pos).color=='b'))&game.get(pos).type=='p'){pvalue+=1*tvalue}
                if(square[1]=='3'||square[1]=='4'||square[1]=='5'||square[1]=='6'){pvalue+=0.1}
                if((square[0]=='c'||square[0]=='d'||square[0]=='e'||square[0]=='f')&
                   (square[1]=='3'||square[1]=='4'||square[1]=='5'||square[1]=='6')){pvalue+=0.1}
                
                switch (game.get(pos).type) {
                case 'p':
                evaluationNumber+=(1+pvalue)*tvalue;
                    break; 
                case 'r':
                evaluationNumber+=(5+pvalue)*tvalue;
                    break;
                case 'b':
                evaluationNumber+=(3+pvalue)*tvalue;
                    break; 
                case 'n':
                evaluationNumber+=(3+pvalue)*tvalue;
                    break;
                case 'q':
                evaluationNumber+=(9+pvalue)*tvalue;
                    break;
                default: 
                evaluationNumber+=0;
                }
            }
            
        }
        
        
        evaluationNumber=Math.round(evaluationNumber * 100) / 100;
        //console.log(evaluationNumber);   
        return evaluationNumber; 
    }
    
    function minimax(maxdepth, depth, maximizingPlayer, movesDone, alpha, beta){
        if(depth==maxdepth){
            for (var i=0; i<movesDone.length; i++){
                var possibleMoves= game.moves();
                //	console.log("Depth:"+movesDone)
                game.move(possibleMoves[movesDone[i]]);
            } 
            evaluationValue= Evaluation();
            for (var i=0; i<movesDone.length; i++){
                game.undo()
            } 
            var returnValue= [evaluationValue, [movesDone[0]]];
            return returnValue
        }
        var i;
        var newvalue=[];
        for (var i=0; i<movesDone.length; i++){
            var possibleMoves= game.moves();
            //	console.log("Depth:"+movesDone)
            game.move(possibleMoves[movesDone[i]]);
        } 
        var children= game.moves();
        if (children.length==0){
                value=[Evaluation(), [movesDone[0]]];
                return value 
            }
        for (var i=0; i<movesDone.length; i++){
            game.undo()
        } 

       
        if (maximizingPlayer) {
            var value =[-999999999, []];
            
            for(i=0; i<children.length; i++){
                movesDone[depth] = i;
                newvalue=minimax(maxdepth, depth+1, false, JSON.parse(JSON.stringify(movesDone)), alpha, beta );
                
                if(newvalue[0]==value[0]){
                    value[1].push(newvalue[1][0]);
                }
                if(newvalue[0]>value[0]){
                    value[0]= newvalue[0];
                    value[1]= [newvalue[1][0]];
                }
                //alpha=value[0];
                //if(alpha <= beta){return value}
              }
            return value
            }
        else
        var value =[999999999, []];
            for(i=0; i<children.length; i++){
                movesDone[depth] = i;
                newvalue=minimax(maxdepth, depth+1, true, JSON.parse(JSON.stringify(movesDone)), alpha, beta);
                //console.log(value[1]);
                if(newvalue[0]==value[0]){
                  value[1].push(newvalue[1][0]);
                }
                if(newvalue[0]<value[0]){
                    value[0]= newvalue[0];
                    value[1]= [newvalue[1][0]];
                }
                beta=value[0];
                if(beta<alpha){return value}
                } 
            return value
            
    }
    var aantalzetten=0;
    var totaledenktijd=0;
    var getBestMove=function () { 				
        var tijdvoor= new Date();
        var res = minimax(diepte, 0, true , [], -999999999, 999999999); 
        console.log(res);
        var tijdna= new Date();
        var tijdsduur= tijdna.getTime()-tijdvoor.getTime();
        aantalzetten+=1;
        totaledenktijd+=tijdsduur;
        var gemiddeldetijd= totaledenktijd/aantalzetten;
        console.log ("het duurde:"+tijdsduur);
        console.log("de denk tijd is gemiddeld:"+gemiddeldetijd);
        /*
        var bestMoves = scores.filter(myFunction);
        function myFunction(value) {
        return value > res-1;
        }
        var randomIndex = Math.floor(Math.random() * bestMoves.length);
        var index;
        for (q=0; q<randomIndex+1; q++){
            index=scores.indexOf(res,index+1);
            console.log(randomIndex)
        }
        */
        var randomIndex = Math.floor(Math.random() * res[1].length);
        var possibleMoves= game.moves();
        game.move(possibleMoves[res[1][randomIndex]]);
        board.position(game.fen());
        updateStatus();
        //console.log(game.history()[game.history().length-2]);
       //console.log(game);

    } 
    /*= function( depth = 0){
        var possibleMovesBlack= game.moves();
        console.log(possibleMovesBlack);
        var Evaluations=[];
        var oldPosition= game.fen();
        if (possibleMovesBlack===0) return;
        var i;
        for(i=0; i<possibleMovesBlack.length; i++){
            
        }
        console.log(Evaluations);
        Evaluations.sort(function(a, b){return a - b});
        console.log(Evaluations);
        game.move(Evaluations[0]);
        board.position(game.fen());
        updateStatus();
    }
    */
    var removeGreySquares = function() {
    $('#board .square-55d63').css('background', '');
    };
    var greySquare = function(square) {
    var squareEl = $('#board .square-' + square);
    
    var background = '#a9a9a9';
    if (squareEl.hasClass('black-3c85d') === true) {
        background = '#696969';
    }
    squareEl.css('background', background);
    };
    var onDragStart = function(source, piece) {
    // do not pick up pieces if the game is over
    // or if it's not that side's turn
    if (game.game_over() === true ||
        (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
        return false;
    }
    };
    var makeRandomMove = function() {
    var possibleMoves = game.moves();
    // game over
    if (possibleMoves.length === 0) return;
    var randomIndex = Math.floor(Math.random() * possibleMoves.length);
    game.move(possibleMoves[randomIndex]);
    board.position(game.fen());
    updateStatus();
    };
    var onDrop = function(source, target) {
    removeGreySquares();
    // see if the move is legal
    var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });
    
    // illegal move
    if (move === null) return 'snapback';
      // make random legal move for black
      window.setTimeout(getBestMove, 250);
      updateStatus();
    };
    
    var onSnapEnd = function() {
    board.position(game.fen());
    };
    var onMouseoverSquare = function(square, piece) {
    // get list of possible moves for this square
    var moves = game.moves({
        square: square,
        verbose: true
    });
    // exit if there are no moves available for this square
    if (moves.length === 0) return;
    // highlight the square they moused over
    greySquare(square);
    // highlight the possible squares for this piece
    for (var i = 0; i < moves.length; i++) {
        greySquare(moves[i].to);
    }
    };
    var onMouseoutSquare = function(square, piece) {
    removeGreySquares();
    };
    var onSnapEnd = function() {
    board.position(game.fen());
    };
    var updateStatus = function() {
    var status = '';
    var moveColor = 'White';
    if (game.turn() === 'b') {
        moveColor = 'Black';
    }
    // checkmate?
    if (game.in_checkmate() === true) {
        status = 'Game over, ' + moveColor + ' is in checkmate.';
    }
    // draw?
    else if (game.in_draw() === true) {
        status = 'Game over, drawn position';
    }
    // game still on
    else {
        status = moveColor + ' to move';
        // check?
        if (game.in_check() === true) {
        status += ', ' + moveColor + ' is in check';
        }
    }
    statusEl.html(status);
    fenEl.html(game.fen());
    pgnEl.html(game.pgn());
    };
    var cfg = {
    draggable: true,
    position: 'start',
    onDragStart: onDragStart,
    onDrop: onDrop,
    onMouseoutSquare: onMouseoutSquare,
    onMouseoverSquare: onMouseoverSquare,
    onSnapEnd: onSnapEnd
    };
    board = ChessBoard('board', cfg);
    updateStatus();
    }; // end init()
