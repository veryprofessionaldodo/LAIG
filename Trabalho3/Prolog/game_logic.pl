/****************************/
/*****GAME LOGIC *****/
/****************************/

/**
*Attempt to move a piece.
*/ 
attempt_to_move(Move) :- 
		is_vertical_or_horizontal(Move), !, 
		advances_move_piece(Move),!,
		once(check_piece_warfare(Move)).


% Check if is horizontal or vertical move. 
is_vertical_or_horizontal(Move) :- 
		vertical(Move) ; 
		horizontal(Move).

horizontal(Move) :- 
		nth0(1, Move, Row), 
		nth0(3, Move, Row), 
		traverse_move_horizontal(Move). 

vertical(Move) :- 
		nth0(0, Move, Column), 
		nth0(2, Move, Column), 
		traverse_move_vertical(Move).  

check_next_piece(Direction, PosPiece, PosFinal):- 
                add1_pos(Direction,PosPiece,NextPiece),
                nth0(0,NextPiece,X),
                nth0(1,NextPiece,Y),
                column_to_number(X,Column),
                get_piece(Column, Y, ' '),
                (nth0(0,PosFinal,X1),
                nth0(1,PosFinal,Y1),
                column_to_number(X1,Column1),
                Column1=Column, Y=Y1;
                 check_next_piece(Direction, NextPiece, PosFinal)).



advances_move_piece(Move):-
                checks_the_direction_of_move(Move,Direction),
                nth0(2,Move,X),
                nth0(3,Move,Y),
                Pos=[X,Y],
                nth0(0,Move,X1),
                nth0(1,Move,Y1),
                NextPiece= [X1,Y1],
                check_next_piece(Direction,NextPiece,Pos).

%Vertical
traverse_move_vertical(Move) :- 
		nth0(0, Move,ColumnLetter), 
		column_to_number(ColumnLetter, Column), 
		nth0(1, Move, Row1), 
		nth0(3, Move, Row2), 
		Row1 \= Row2,
		((Row1 < Row2, NewRow1 is Row1 + 1) ;
		 	(Row1 > Row2, NewRow1 is Row1 -1)),
		check_from_X_to_Y_Row(Column, NewRow1, Row2).

%End Condition 
check_from_X_to_Y_Row(Column, Row, Row) :- 
		get_piece(Column, Row, Piece), 
		equal(Piece,' ').

check_from_X_to_Y_Row(Column, Row1, Row2) :- 
		get_piece(Column, Row1, Piece), 
		equal(Piece,' '),
		((Row1 < Row2, NewRow1 is Row1 + 1) ; 
		 	(Row1 > Row2, NewRow1 is Row1 - 1)), 
		check_from_X_to_Y_Row(Column, NewRow1, Row2).


%Horizontal
traverse_move_horizontal(Move) :- 
		nth0(0, Move,ColumnLetter1), 
		nth0(2, Move, ColumnLetter2), 
		nth0(3, Move, Row),
		column_to_number(ColumnLetter1, Column1), 
		column_to_number(ColumnLetter2, Column2), 
		Column1 \= Column2, 
		((Column1 < Column2, NewColumn1 is Column1 + 1) ; 
		  	(Column1 > Column2, NewColumn1 is Column1 -1)),
		check_from_X_to_Y_Column(Row, NewColumn1, Column2).

%End Condition
check_from_X_to_Y_Column(Row, Column, Column):- 
		get_piece(Column, Row, Piece), 
		equal(Piece,' ').

check_from_X_to_Y_Column(Row, Column1, Column2) :- 
		((Column1 < Column2, NewColumn1 is Column1 + 1) ; 
		 	(Column1 > Column2, NewColumn1 is Column1 -1)),
		get_piece(NewColumn1, Row, Piece), 
		equal(Piece, ' '),
		check_from_X_to_Y_Column(Row, NewColumn1, Column2).

%Checks if player is moving is own piece, not an enemy's or a blank space. 
is_own_piece(Move, Player) :- 
		nth0(0, Move, ColumnLetter), 
		column_to_number(ColumnLetter, Column), 
		nth0(1, Move, Line),
        get_piece(Column, Line, Piece), 
        player_letter(Player, Piece).

% Checks whether piece is in warfare with enemy or not.
check_piece_warfare(Move) :- 
		nth0(0, Move, ColumnLetter), 
		nth0(1, Move, Row), 
		nth0(2, Move, ColumnLetterDestination), 
		nth0(3, Move, RowDestination),
		column_to_number(ColumnLetter, Column), 
		column_to_number(ColumnLetterDestination, ColumnDestination), 
		get_piece(Column, Row, Piece), 
		player_letter(Player, Piece),  
        opposing_player(Player,Enemy),
        (check_surroundings(Player, Enemy, Column, Row, ColumnDestination, RowDestination) ; fail) .                   % Analyzes surrounding area to the piece in question.
        

% If no enemy is around player, he can move without restriction.
check_surroundings(_, Enemy, Column, Row, _, _) :-  
		player_piece(Enemy, EnemyPiece), player_dux(Enemy, EnemyDux),
		NewColumn1 is Column + 1,
		get_piece(NewColumn1, Row, Piece1), 							  % Analyze all 4 sides of piece
		different(Piece1, EnemyPiece) , different(Piece1,EnemyDux),   % If it finds an enemy, verifies if 
		NewColumn2 is Column - 1 , 
		get_piece(NewColumn2, Row, Piece2),                            % it's already in a warfare with an ally.
		different(Piece2, EnemyPiece) , different(Piece2,EnemyDux), 
		NewRow1 is Row + 1, 
		get_piece(Column, NewRow1, Piece3), 
		different(Piece3, EnemyPiece) , different(Piece3,EnemyDux) , 
		NewRow2 is Row - 1 , 
	 	get_piece(Column, NewRow2, Piece4), 
		different(Piece4, EnemyPiece) , different(Piece4,EnemyDux). % If not, then the piece can move.

% Starts veryfing surrounding areas.
check_surroundings(Player, Enemy, Column, Row, ColumnDestination, RowDestination) :-  
		(((NewColumn1 is Column + 1,
			get_piece(NewColumn1, Row, Piece1),							  % Analyze all 4 sides of piece
			player_letter(N1, Piece1), 
		  	equal(N1, Enemy), 
		  	once(is_in_previous_warfare(Column, Row, Player, NewColumn1, Row)),
		  	is_offensive_move(Player, Column, Row, ColumnDestination, RowDestination)) ;   % If it finds an enemy, verifies if 
		(NewColumn2 is Column - 1 , 
		  	get_piece(NewColumn2, Row, Piece2),                            % it's already in a warfare with an ally.
		  	player_letter(N2, Piece2), 
		  	equal(N2, Enemy), 
		  	once(is_in_previous_warfare(Column, Row, Player, NewColumn2, Row)),
		  	is_offensive_move(Player, Column, Row, ColumnDestination, RowDestination)) ; 
		((NewRow1 is Row + 1, 
		  	get_piece(Column, NewRow1, Piece3),
		  	player_letter(N3, Piece3), 
		  	equal(N3, Enemy), 
		  	once(is_in_previous_warfare(Column, Row, Player, Column, NewRow1)),
		  	is_offensive_move(Player, Column, Row, ColumnDestination, RowDestination)) ;  
		 (NewRow2 is Row - 1 , 
	 	  	get_piece(Column, NewRow2, Piece4),
		   	player_letter(N4, Piece4), 
		   	equal(N4, Enemy), 
		   	once(is_in_previous_warfare(Column, Row, Player, Column, NewRow2)),
		   	is_offensive_move(Player, Column, Row, ColumnDestination, RowDestination))))). % If not, then the piece can move.


% Checks if surrouding enemy piece is already in warfare with another ally.
is_in_previous_warfare(PlayerColumn, PlayerRow, Player, Column, Row) :-
		(((NewColumn1 is Column + 1, 
			(NewColumn1 \== PlayerColumn ; Row \== PlayerRow),
			get_piece(NewColumn1, Row, Piece1),
			player_letter(N1, Piece1), 
			equal(N1, Player)) ;                         % If enemy is already surrounded
		 (NewColumn2 is Column - 1 , 
		 	(NewColumn2 \== PlayerColumn ; Row \== PlayerRow),
		 	get_piece(NewColumn2, Row, Piece2),
		 	player_letter(N2, Piece2), 
		 	equal(N2, Player))) ;                         % by an ally, then the piece selected
		 ((NewRow1 is Row + 1, 
		 	(Column \== PlayerColumn ; NewRow1 \== PlayerRow),
		 	get_piece(Column, NewRow1, Piece3),
		 	player_letter(N3, Piece3), 
		 	equal(N3, Player)) ;                         % can move freely.
		 (NewRow2 is Row - 1 , 
		 	(Column \== PlayerColumn ; NewRow2 \== PlayerRow),
		 	get_piece(Column, NewRow2, Piece4),
		 	player_letter(N4, Piece4), 
		 	equal(N4, Player)))).                            


is_offensive_move(Player, PlayerColumn, PlayerRow, Column, Row):- 
		opposing_player(Player,Enemy), player_dux(Enemy, EnemyDux), 
		((((NewColumn1 is Column + 1,
			get_piece(NewColumn1, Row, Piece1),							  % Analyze all 4 sides of piece
		  	equal(Piece1, EnemyDux)) ;  % If it finds an enemy, verifies if 
		(NewColumn2 is Column - 1 , 
		  	get_piece(NewColumn2, Row, Piece2),                            % it's already in a warfare with an ally.
		  	equal(Piece2, EnemyDux))) ; 
		((NewRow1 is Row + 1, 
		  	get_piece(Column, NewRow1, Piece3),
		  	equal(Piece3, EnemyDux)) ;  
		 (NewRow2 is Row - 1 , 
	 	  	get_piece(Column, NewRow2, Piece4),
		   	equal(Piece4, EnemyDux))));
		(column_to_number(PlayerColumnLetter, PlayerColumn),
		 column_to_number(ColumnLetter, Column),
		 move_X_Captured_Pieces([PlayerColumnLetter, PlayerRow, ColumnLetter, Row],Player,_))).

/*********************************/
/****** MOVE GET AND SET*********/
/*******************************/

/**
*Moves a piece to a new position
*/
move(Move):- 
        nth0(0, Move, ColumnLetter), 
        nth0(1, Move, LinePieceToMove), 
        column_to_number(ColumnLetter, ColumnPieceToMove),
        get_piece(ColumnPieceToMove,LinePieceToMove,Piece),      %gets the piece on a given position
        nth0(2, Move, ColumnNewPosLetter), 
        nth0(3, Move, LineNewPos),
        set_piece(ColumnNewPosLetter,LineNewPos,Piece),          %moves it to the new position 
        set_piece(ColumnLetter,LinePieceToMove,' ').   
/**
*FOR AI ONLY!!!
*for logic purposes, cancels the last movement made
*/
de_move(Move):-
        nth0(2, Move, ColumnLetter), 
        nth0(3, Move, LinePieceToMove), 
        column_to_number(ColumnLetter, ColumnPieceToMove),
        get_piece(ColumnPieceToMove,LinePieceToMove,Piece),                 
        nth0(0, Move, ColumnNewPosLetter), 
        nth0(1, Move, LineNewPos),
        set_piece(ColumnNewPosLetter,LineNewPos,Piece),                           
        set_piece(ColumnLetter,LinePieceToMove,' ').  

%Sees what piece is in position. IMPORTANT NOTE: Column is a number, not a letter. Conversion must be made previously. 
get_piece(Column,Line,Piece):- 
        board(Board), 
        (Column > 0, Column < 11, line_to_position(Line, LineNumber),
        nth1(LineNumber, Board, X), 
        nth1(Column, X, Piece), !).

%If it's not a valid position.
get_piece(_,_,Piece):- 
        Piece = 'x'.

%Replaces a character in a given position on the board.
set_piece(ColumnLetter,Line,Piece):- 
        column_to_number(ColumnLetter, Column), 
        line_to_position(Line, LineNumber),                                   
        board(Board), 
        replace(Board,LineNumber,Column,Piece,NewBoard),
        retract(board(Board)), 
        assert(board(NewBoard)).


replace( [L|Ls] , 1 , ColumnNumber , Piece , [R|Ls] ) :-        % once we find the desired row,
        replace_column(L,ColumnNumber,Piece,R).                 % - we replace specified column, and we're done.

replace( [L|Ls] , LineNumber , ColumnNumber , Piece , [L|Rs] ) :-      % if we haven't found the desired row yet
        LineNumber > 1 ,                                               % - and the row offset is positive,
        X1 is LineNumber-1 ,                                           % - we decrement the row offset
        replace( Ls , X1 , ColumnNumber , Piece , Rs ).                % - and recurse down                                     

replace_column( [_|Cs] , 1 , Piece , [Piece|Cs] ).              % once we find the specified offset, just make the substitution and finish up.

replace_column( [C|Cs] , ColumnNumber , Piece , [C|Rs] ) :-     % otherwise,
        ColumnNumber > 1 ,                                      % - assuming that the column offset is positive,
        Y1 is ColumnNumber-1 ,                                  % - we decrement it
        replace_column( Cs , Y1 , Piece , Rs ).                 % - and recurse down.



/*********************************/
/******CAPTURE RULES*********/
/*******************************/

/**
*Checks if a move caused a flank capture, if it did removes the piece from the board
*/
%flank rule
helper_flank_attack(Pos,Direction,Player,1):- 
        add1_pos(Direction,Pos,NextPiece),
        nth0(0,NextPiece,ColumnLetter), 
        nth0(1,NextPiece,Line),                 %gets the position of the next piece in that direction
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        player_letter(Player,Piece).            %gets the piece and checks if it's player's piece, if it does follows the rule

helper_flank_attack(Pos,Direction,Player,_):- 
        add1_pos(Direction,Pos,NextPiece), 
        nth0(0,NextPiece,ColumnLetter), 
        nth0(1,NextPiece,Line),                  %gets the position of the next piece in that direction
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        opposing_player(Player,OppPlayer),
        player_letter(OppPlayer,Piece),          %gets the piece and checks if it's an enemy
        helper_flank_attack(NextPiece,Direction,Player,1).  %recurse it down

flank_attack(Pos,Direction,Player):-
        add1_pos(Direction,Pos,NextPiece), 
        nth0(0,NextPiece,ColumnLetter), 
        nth0(1,NextPiece,Line),                  %gets the position of the next piece in that direction
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        opposing_player(Player,OppPlayer),
        player_piece(OppPlayer,Piece),           %gets the piece and checks if it's an enemy
        helper_flank_attack(NextPiece,Direction,Player,0), %checks if it follows the flank rule
        set_piece(ColumnLetter,Line,' '), 
        format('Player ~w Piece at ~w~w got captured ~n~n',[Player,ColumnLetter,Line]).   % if it does eliminates it

flank_attack(_,_,_).

/**
*Checks if a move caused a phalanx/testudo capture, if it did removes the piece from the board
*/
helper_phalanx_attack(Direction, Direction2, Pos,NextPiece,Player,1):-
        add1_pos(Direction2,Pos,NextPieceForPhalanx), 
        nth0(0,NextPieceForPhalanx,ColumnPhalanxLetter), 
        nth0(1,NextPieceForPhalanx,LinePhalanx),         %gets the position of the piece in the perpendicular direction
        column_to_number(ColumnPhalanxLetter, ColumnPhalanx),
        get_piece(ColumnPhalanx,LinePhalanx,Piece),
        player_letter(Player,Piece),                    %gets the piece and checks if it's a player's piece
        add1_pos(Direction,NextPiece,NextPieceForPhalanx2),
        nth0(0,NextPieceForPhalanx2,ColumnLetter), 
        nth0(1,NextPieceForPhalanx2,Line),               %gets the position of the piece in the direction of the move
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece2),
        opposing_player(Player,OppPlayer),
        player_piece(OppPlayer,Piece2).          %gets the piece and checks if it's an enemy


helper_phalanx_attack(Direction, Direction2, Pos,NextPiece,Player,0):-
        add1_pos(Direction2,Pos,NextPieceForPhalanx), 
        nth0(0,NextPieceForPhalanx,ColumnPhalanxLetter), 
        nth0(1,NextPieceForPhalanx,LinePhalanx),         %gets the position of the piece in the perpendicular direction
        column_to_number(ColumnPhalanxLetter, ColumnPhalanx),
        get_piece(ColumnPhalanx,LinePhalanx,Piece),
        player_letter(Player,Piece),                    %gets the piece and checks if it's a player's piece
        add1_pos(Direction,NextPiece,NextPieceForPhalanx2), 
        nth0(0,NextPieceForPhalanx2,ColumnLetter), 
        nth0(1,NextPieceForPhalanx2,Line),               %gets the position of the piece in the direction of the move
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece2),
        opposing_player(Player,OppPlayer),
        player_piece(OppPlayer,Piece2),          %gets the piece and checks if it's an enemy
        set_piece(ColumnLetter,Line,' '), 
        format('Player ~w Piece at ~w~w got captured ~n~n',[Player,ColumnLetter,Line]).    %if it is follows the rule

helper_phalanx_attack(Direction, Direction2, Pos,NextPiece,Player,Type):-
        add1_pos(Direction2,Pos,NextPieceForPhalanx), 
        nth0(0,NextPieceForPhalanx,ColumnPhalanxLetter), 
        nth0(1,NextPieceForPhalanx,LinePhalanx),         %gets the position of the piece in the perpendicular direction
        column_to_number(ColumnPhalanxLetter, ColumnPhalanx),
        get_piece(ColumnPhalanx,LinePhalanx,Piece),
        player_letter(Player,Piece),                    %gets the piece and checks if it's a player's piece
        add1_pos(Direction,NextPiece,NextPieceForPhalanx2), 
        nth0(0,NextPieceForPhalanx2,ColumnLetter), 
        nth0(1,NextPieceForPhalanx2,Line),               %gets the position of the piece in the direction of the move
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece2),
        player_letter(Player,Piece2),                     %gets the piece and checks if it's a player's piece
        helper_phalanx_attack(Direction,Direction2,NextPiece,NextPieceForPhalanx2,Player,Type).  %recurse it down

phalanx_attack(Pos,Direction,Player):-
        add1_pos(Direction,Pos,NextPiece), 
        nth0(0,NextPiece,ColumnLetter), 
        nth0(1,NextPiece,Line),           %gets the position of the next piece in that direction
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        player_letter(Player,Piece),     %gets the piece and checks if it's an enemy
        directions_90(Direction,X,_),
        helper_phalanx_attack(Direction,X,Pos,NextPiece,Player,0).  %gets a perpendicular direction and checks if it follows the rule

phalanx_attack(Pos,Direction,Player):-
        add1_pos(Direction,Pos,NextPiece), 
        nth0(0,NextPiece,ColumnLetter), 
        nth0(1,NextPiece,Line),           %gets the position of the next piece in that direction
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        player_letter(Player,Piece),      %gets the piece and checks if it's an enemy
        directions_90(Direction,_,X), 
        helper_phalanx_attack(Direction,X,Pos,NextPiece,Player,0).  %gets the perpendicular direction and checks if it follows the rule

phalanx_attack(_,_,_).


/**
*Checks if a move caused a push and crush capture, if it did removes the piece from the board
*/
helper_push_and_crush_capture2(Pos,Direction,Player):- 
        add1_pos(Direction,Pos,NextPiece), 
        nth0(0,NextPiece,ColumnLetter), 
        nth0(1,NextPiece,Line),       %gets the position of the next piece in that direction
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        opposing_player(Player,OppPlayer),
        (player_letter(OppPlayer,Piece);
            equal(Piece,' ')).      %gets the piece and checks if it's an enemy or empty space

                                 
helper_push_and_crush_capture(Pos,Direction,Player,0):- 
        add1_pos(Direction,Pos,NextPiece), 
        nth0(0,NextPiece,ColumnLetter), 
        nth0(1,NextPiece,Line),              %gets the position of the next piece in that direction
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        opposing_player(Player,OppPlayer),
        player_piece(OppPlayer,Piece),      %gets the piece and checks if it's an enemy
        \+ helper_push_and_crush_capture2(NextPiece,Direction,Player),   %checks if the next piece is an enemy if it isn't follows the rule              
        set_piece(ColumnLetter,Line,' '), 
        format('Player ~w Piece at ~w~w got captured ~n~n',[Player,ColumnLetter,Line]).     %removes captured piece

helper_push_and_crush_capture(Pos,Direction,Player,1):- 
        add1_pos(Direction,Pos,NextPiece), 
        nth0(0,NextPiece,ColumnLetter), 
        nth0(1,NextPiece,Line),      %gets the position of the next piece in that direction
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        opposing_player(Player,OppPlayer),
        player_piece(OppPlayer,Piece),      %gets the piece and checks if it's an enemy
        \+ helper_push_and_crush_capture2(NextPiece,Direction,Player).  %checks if the next piece is an enemy if it isn't follows the rule              


push_and_crush_capture(Pos,Direction,Player):-
        add1_pos(Direction,Pos,NextPiece), 
        nth0(0,NextPiece,ColumnLetter), 
        nth0(1,NextPiece,Line),             %gets the position of the next piece in that direction
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),player_letter(Player,Piece),   %gets the piece and checks if it's an ally
        helper_push_and_crush_capture(NextPiece,Direction,Player,0).    %checks next position                          

push_and_crush_capture(_,_,_).


/**
*Checks if a move caused a normal capture, if it did removes the piece from the board
*/

%if it is a player's piece follows the rule
check_if_player_piece(NextPiece,Player):- 
        nth0(0,NextPiece,Column), 
        nth0(1,NextPiece,Line), 
        get_piece(Column,Line,Piece),
        player_letter(Player,Piece).

normal_capture(Pos,Player):- 
        add1_pos(1,Pos,NextPiece), 
        nth0(0,NextPiece,ColumnLetter), 
        nth0(1,NextPiece,Line),       %Gets position of the upper piece
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        opposing_player(Player,OppPlayer),
        player_piece(OppPlayer,Piece),  %checks if it's an enemy
        Y1 is Line+1 , 
        NextPiece2 =[Column,Y1],
        check_if_player_piece(NextPiece2,Player),     %checks if the position in that direction is a player's piece or a wall
        set_piece(ColumnLetter,Line,' '), 
        format('Player ~w Piece at ~w~w got captured ~n~n',[Player,ColumnLetter,Line]), fail.    %if it is applies the rule, and checks others directions

normal_capture(Pos,Player):-
        add1_pos(4,Pos,NextPiece), 
        nth0(0,NextPiece,ColumnLetter), 
        nth0(1,NextPiece,Line),     %Gets position of the left piece
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        opposing_player(Player,OppPlayer),
        player_piece(OppPlayer,Piece),  %checks if it's an enemy
        Y1 is Line-1, 
        NextPiece2 =[Column,Y1],
        check_if_player_piece(NextPiece2,Player),    %checks if the position in that direction is a player's piece or a wall
        set_piece(ColumnLetter,Line,' '), 
        format('Player ~w Piece at ~w~w got captured ~n~n',[Player,ColumnLetter,Line]),fail.    %if it is applies the rule, and checks others directions

normal_capture(Pos,Player):- 
        add1_pos(2,Pos,NextPiece), 
        nth0(0,NextPiece,ColumnLetter), 
        nth0(1,NextPiece,Line),         %Gets position of the right piece
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        opposing_player(Player,OppPlayer),
        player_piece(OppPlayer,Piece),        %checks if it's an enemy
        X1 is Column-1 ,
        NextPiece2 =[X1,Line],
        check_if_player_piece(NextPiece2,Player),    %checks if the position in that direction is a player's piece or a wall   
        set_piece(ColumnLetter,Line,' '), 
        format('Player ~w Piece at ~w~w got captured ~n~n',[Player,ColumnLetter,Line]),fail.   %if it is applies the rule, and checks others directions

normal_capture(Pos,Player):- 
        add1_pos(3,Pos,NextPiece), 
        nth0(0,NextPiece,ColumnLetter), 
        nth0(1,NextPiece,Line),        %Gets position of the lower piece
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        opposing_player(Player,OppPlayer),
        player_piece(OppPlayer,Piece),  %checks if it's an enemy
        X1 is Column+1,
        NextPiece2 =[X1,Line],
        check_if_player_piece(NextPiece2,Player),       %checks if the position in that direction is a player's piece or a wall
        set_piece(ColumnLetter,Line,' '), 
        format('Player ~w Piece at ~w~w got captured ~n~n',[Player,ColumnLetter,Line]).     %if it is applies the rule                                                                                                     %if it is applies the rule
            

normal_capture(_,_).

/**
*Checks if a move caused a check mate, if it did removes the DUX from the board
*/

%checks if the dux has atleast one enemy around him
is_Dux_in_Guerrilla(Player,DuxPos):-
        add1_pos(1,DuxPos,NextPieceUp), 
        nth0(0,NextPieceUp,ColumnLetterUp), 
        nth0(1,NextPieceUp,LineUp),                           
        column_to_number(ColumnLetterUp, ColumnUp),
        get_piece(ColumnUp,LineUp,PieceUp),
        opposing_player(Player,OppPlayer1),
        player_letter(OppPlayer1,PieceUp);
        add1_pos(4,DuxPos,NextPieceDown), 
        nth0(0,NextPieceDown,ColumnLetterDown), 
        nth0(1,NextPieceDown,LineDown),                           
        column_to_number(ColumnLetterDown, ColumnDown),
        get_piece(ColumnDown,LineDown,PieceDown),
        opposing_player(Player,OppPlayer4),
        player_letter(OppPlayer4,PieceDown);
        add1_pos(2,DuxPos,NextPieceLeft), 
        nth0(0,NextPieceLeft,ColumnLetterLeft), 
        nth0(1,NextPieceLeft,LineLeft),                           
        column_to_number(ColumnLetterLeft, ColumnLeft),
        get_piece(ColumnLeft,LineLeft,PieceLeft),
        opposing_player(Player,OppPlayer2),
        player_letter(OppPlayer2,PieceLeft);
        add1_pos(3,DuxPos,NextPieceRight), 
        nth0(0,NextPieceRight,ColumnLetterRight), 
        nth0(1,NextPieceRight,LineRight),                           
        column_to_number(ColumnLetterRight, ColumnRight),
        get_piece(ColumnRight,LineRight,PieceRight),
        opposing_player(Player,OppPlayer3),
        player_letter(OppPlayer3,PieceRight).

%checks if it's a wall if it is checks if the dux has atleast one enemy around him                                    
check_mate_check_piece_or_wall(Player,NextPiece,DuxPos):-    
        nth0(0,NextPiece,Column),
        Column>10, 
        is_Dux_in_Guerrilla(Player,DuxPos);
        nth0(0,NextPiece,Column), 
        Column<1, 
        is_Dux_in_Guerrilla(Player,DuxPos);
        nth0(1,NextPiece,Line), 
        Line>8, 
        is_Dux_in_Guerrilla(Player,DuxPos);
        nth0(1,NextPiece,Line), 
        Line<1, 
        is_Dux_in_Guerrilla(Player,DuxPos).


check_mate_check_piece_or_wall(_,NextPiece,_):-
        nth0(0,NextPiece,Column), 
        nth0(1,NextPiece,Line),     %checks if it's a piece
        get_piece(Column,Line,Piece),
        player_letter(_,Piece).
            
helper_check_mate(Player,DuxPos):- 
        nth0(0,DuxPos,ColumnLetterUp), 
        nth0(1,DuxPos,LineUp),  
        column_to_number(ColumnLetterUp, ColumnUp), 
        Y1 is LineUp+1 , 
        NextPieceUp =[ColumnUp,Y1],  %checks the upper position 
        check_mate_check_piece_or_wall(Player,NextPieceUp,DuxPos),   %and checks if it's a piece or wall
        nth0(0,DuxPos,ColumnLetterDown), 
        nth0(1,DuxPos,LineDown),  
        column_to_number(ColumnLetterDown, ColumnDown), 
        Y2 is LineDown-1 , 
        NextPieceDown =[ColumnDown,Y2],       %checks the bottom position
        check_mate_check_piece_or_wall(Player,NextPieceDown,DuxPos),    %and checks if it's a piece or wall
        nth0(0,DuxPos,ColumnLetterLeft), 
        nth0(1,DuxPos,LineLeft),  
        column_to_number(ColumnLetterLeft, ColumnLeft), X1 is ColumnLeft-1 ,NextPieceLeft =[X1,LineLeft],       %checks the position to the left
        check_mate_check_piece_or_wall(Player,NextPieceLeft,DuxPos),             %and checks if it's a piece or wall
        nth0(0,DuxPos,ColumnLetterRight),
        nth0(1,DuxPos,LineRight),  
        column_to_number(ColumnLetterRight, ColumnRight), X2 is ColumnRight+1 , NextPieceRight =[X2,LineRight],    %checks the position to the right
        check_mate_check_piece_or_wall(Player,NextPieceRight,DuxPos).     %and checks if it's a piece or wall
        

check_mate(Pos):-
        add1_pos(1,Pos,NextPiece), 
        nth0(0,NextPiece,ColumnLetter), 
        nth0(1,NextPiece,Line),       %checks the upper position 
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        player_dux(Player,Piece),
        helper_check_mate(Player,NextPiece),
        set_piece(ColumnLetter,Line,' '),  %and sees if it's a dux
        format('Player ~w Dux at ~w~w got immobilized ~n~n',[Player,ColumnLetter,Line]).

check_mate(Pos):-
        add1_pos(4,Pos,NextPiece), 
        nth0(0,NextPiece,ColumnLetter), 
        nth0(1,NextPiece,Line),       %checks the bottom position
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        player_dux(Player,Piece),
        helper_check_mate(Player,NextPiece),
        set_piece(ColumnLetter,Line,' '),  %and sees if it's a dux 
        format('Player ~w Dux at ~w~w got immobilized ~n~n',[Player,ColumnLetter,Line]).                                                                                                                    

check_mate(Pos):-
        add1_pos(2,Pos,NextPiece), 
        nth0(0,NextPiece,ColumnLetter), 
        nth0(1,NextPiece,Line),      %checks the position to the left
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        player_dux(Player,Piece),
        helper_check_mate(Player,NextPiece),
        set_piece(ColumnLetter,Line,' '),  %and sees if it's a dux 
        format('Player ~w Dux at ~w~w got immobilized ~n~n',[Player,ColumnLetter,Line]). 

check_mate(Pos):-
        add1_pos(3,Pos,NextPiece), 
        nth0(0,NextPiece,ColumnLetter), 
        nth0(1,NextPiece,Line),        %checks the position to the right
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        player_dux(Player,Piece),
        helper_check_mate(Player,NextPiece),
        set_piece(ColumnLetter,Line,' '),  %and sees if it's a dux 
        format('Player ~w Dux at ~w~w got immobilized ~n~n',[Player,ColumnLetter,Line]).   
            
check_mate(_).

/****************************/
/*******GAME OVER Predicates*/
/****************************/
/**
*Ends the game if one player has no movements possible, lost all is pieces or dux or if the number of possible plays reached 0
*/

%Checks if the game ended
is_game_over(Player):-board(Board), check_soldiers_and_Dux(Board,0,0,0,0),
        playcounter(X), X>0 , 
        Y is X-1, 
        retract(playcounter(X)), 
        assert(playcounter(Y)),
        check_possible_moves(Player). 


is_game_over(_):-playcounter(X), X<1,
        cls, print_board, 
        write('\n The game ended with a draw. \n'), break.

is_game_over(Player):- 
             opposing_player(Player,OppPlayer),
             cls, print_board,
             format('\n Player ~w Lost, there is possible move \n',[OppPlayer]), break.

check_possible_moves(Player):-
	opposing_player(Player,OppPlayer),	
        gather_all_moves(ListOfMoves,OppPlayer),!,  
        length(ListOfMoves,X),
	X>0.


%checks if one of the players lost all is pieces or Dux

check_soldiers_and_Dux(_,1,1,1,1).   % tudo normal continuar normalmente

check_soldiers_and_Dux(T,Pb,PB,Pw,PW):- 
        length(T, 1), 
        Pb=0, 
        cls, print_board, 
        write('\n Player 2 Lost, there is no more soldiers \n'), break;
        length(T, 1), 
        PB=0, 
        cls, print_board, 
        write('\n Player 2 Lost, you lost your Dux \n'), break;
        length(T, 1), 
        Pw=0, 
        cls, print_board, 
        write('\n Player 1 Lost, there is no more soldiers \n'), break;
        length(T, 1), 
        PW=0,
        cls, print_board, 
        write('\n Player 1 Lost, you lost your Dux \n'), break.

check_soldiers_and_Dux([H|T],Pb,PB,Pw,PW):-
        check_soldiers_and_Dux_Row(H,Pb,PB,Pw,PW,T).

check_soldiers_and_Dux_Row(T,Pb,PB,Pw,PW,X):- 
        length(T, 1),
        check_soldiers_and_Dux(X,Pb,PB,Pw,PW). % acabou fila atual passa para a próima

check_soldiers_and_Dux_Row([H|T],Pb,PB,Pw,PW,X):-
        H = 'b',check_soldiers_and_Dux_Row(T,1,PB,Pw,PW,X);
        H = 'B',check_soldiers_and_Dux_Row(T,Pb,1,Pw,PW,X);
        H = 'w',check_soldiers_and_Dux_Row(T,Pb,PB,1,PW,X);
        H = 'W',check_soldiers_and_Dux_Row(T,Pb,PB,Pw,1,X);
        H = ' ',check_soldiers_and_Dux_Row(T,Pb,PB,Pw,PW,X).

% Check whether play is valid for a specific player. 
check_if_valid(Move, Player) :- 
        is_own_piece(Move, Player), 
        attempt_to_move(Move).


%checks if the dux has atleast one enemy around him
dux_sides_attacked(Player,DuxPos,Counter):-
        check_if_enemy(DuxPos,Player,1,CounterUP),
	check_if_enemy(DuxPos,Player,4,CounterDOWN),
	check_if_enemy(DuxPos,Player,2,CounterLEFT),
	check_if_enemy(DuxPos,Player,3,CounterRIGHT),
	Counter is CounterUP+CounterDOWN+CounterLEFT+CounterRIGHT.

check_if_enemy(Pos,Player,Direction,Counter):-
        add1_pos(Direction,Pos,NextPiece), 
        nth0(0,NextPiece,ColumnLetter), 
        nth0(1,NextPiece,Line),                           
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        opposing_player(Player,OppPlayer1),
        player_letter(OppPlayer1,Piece),
	Counter is 1;
	Counter is 0.