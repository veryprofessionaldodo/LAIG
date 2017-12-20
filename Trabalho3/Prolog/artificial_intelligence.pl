/************************/
/***** AI BEHAVIOUR *****/
/************************/

/**
*AI moves for a player passed in argument. 
*Gets all moves possible, and chooses a random one
*moves the piece, and removes any captured pieces caused by that move
*checks if the game is over    
*/
aI_move(Player, 1, Move):- 
	gather_all_moves(ListOfMoves,Player),!,
	length(ListOfMoves,X),
	X>0,
	random_member(NL, ListOfMoves),
        move(NL),
	Move = NL.

/**
*AI moves for a player passed in argument. 
*Gets all moves possible, and chooses the best move possible given priorities
*moves the piece, and removes any captured pieces caused by that move
*checks if the game is over    
*/
aI_move(Player, 2, Move):- 
	gather_all_moves(ListOfMoves,Player),!, 
	length(ListOfMoves,X),
	X>0,
        choose_best_move(ListOfMoves, Player, NewMove),
        move(NewMove),
        Move = NewMove.


/**
*Chooses the best move in a list following the priorities
*/
choose_best_move_helper([], _, NL,CurrentBestCapturedPieces, NumberofCaptures, FoundAttackDux):-
        NumberofCaptures>0,
        NL=CurrentBestCapturedPieces;
        FoundAttackDux\= [],
        NL=FoundAttackDux.
                 
choose_best_move_helper([H|T], Player, NL,CurrentBestCapturedPieces, NumberofCaptures, FoundAttackDux):- 
        does_move_check_mate(H,Player),
        NL=H;
        move_X_Captured_Pieces(H,Player,Counter), 
        Counter>NumberofCaptures, 
        choose_best_move_helper(T, Player, NL,H, Counter, FoundAttackDux);
        NumberofCaptures<1,
	nth0(0,H,ColumnPiece),
	nth0(1,H,LinePiece),
	column_to_number(ColumnPiece,ColumnPieceN),
	get_piece(ColumnPieceN,LinePiece,Piece),
	player_piece(_,Piece),
	nth0(2,H,ColumnLetter), 
        nth0(3,H,Line), 
	Pos=[ColumnLetter,Line],
        does_move_attack_dux(Pos,Player),
        choose_best_move_helper(T, Player, NL,CurrentBestCapturedPieces, NumberofCaptures, H);
        choose_best_move_helper(T, Player, NL,CurrentBestCapturedPieces, NumberofCaptures, FoundAttackDux).
                
choose_best_move(ListOfMoves, Player, NL):-
	random_permutation(ListOfMoves, NewRandomList),
	choose_best_move_helper(NewRandomList, Player, NL,[], 0, []);  
	random_member(NL, ListOfMoves).

/**
*Gather all moves for all pieces.
*/
gather_all_moves(FinalList,Player):-find_all_moves([],Player,FinalList).


find_all_moves(StartList,Player,FinalList):-find_all_moves_line(StartList,Player,8,FinalList).

find_all_moves_line(StartList,Player,Line,FinalList):-
	Line>0,
        find_all_moves_column([],Player,Line,1,FinalColumnList),
        NEwLine is Line-1,
        append(StartList,FinalColumnList,NewStartList),
        find_all_moves_line(NewStartList,Player,NEwLine,FinalList).


find_all_moves_line(StartList,_,_,FinalList):- FinalList = StartList.

find_all_moves_column(StartList,Player,Line,Column,FinalColumnList):-
	Column < 11,
        get_piece(Column,Line,Piece),
        player_letter(Player,Piece),
	column_to_number(ColumnLetter,Column),
        check_all_pos_up([],[ColumnLetter,Line],Player,[ColumnLetter,Line],ListUp),
        check_all_pos_down([],[ColumnLetter,Line],Player,[ColumnLetter,Line],ListDown),
        check_all_pos_left([],[ColumnLetter,Line],Player,[ColumnLetter,Line],ListLeft),
        check_all_pos_right([],[ColumnLetter,Line],Player,[ColumnLetter,Line],ListRight),
        NEwColumn is Column+1,
        append(StartList,ListUp,List1),
        append(List1,ListDown,List2),
        append(List2,ListLeft,List3),
        append(List3,ListRight,NewColumnList),
        find_all_moves_column(NewColumnList,Player,Line,NEwColumn,FinalColumnList);
	Column < 11,
	NEwColumn is Column+1,
	find_all_moves_column(StartList,Player,Line,NEwColumn,FinalColumnList).
        
find_all_moves_column(StartList,_,_,_,FinalColumnList):-FinalColumnList = StartList.


check_all_pos_up(StartList,Pos,Player,LastNewPos,ListUp):-
        add1_pos(1,LastNewPos,NextPos), 
        append(Pos, NextPos, Move),
        check_if_valid(Move, Player),
        append(StartList,[Move],NewListUp),
        check_all_pos_up(NewListUp,Pos,Player,NextPos,ListUp);
        add1_pos(1,LastNewPos,NextPos),
        check_all_pos_up(StartList,Pos,Player,NextPos,ListUp).
        
        
check_all_pos_up(StartList,_,_,_,ListUp):- ListUp = StartList.

check_all_pos_down(StartList,Pos,Player,LastNewPos,ListDown):-
        add1_pos(4,LastNewPos,NextPos), 
        append(Pos, NextPos, Move),
        check_if_valid(Move, Player),
        append(StartList,[Move],NewListDown),
        check_all_pos_down(NewListDown,Pos,Player,NextPos,ListDown);
        add1_pos(4,LastNewPos,NextPos),
        check_all_pos_down(StartList,Pos,Player,NextPos,ListDown).
        
        
check_all_pos_down(StartList,_,_,_,ListDown):- ListDown = StartList.

check_all_pos_left(StartList,Pos,Player,LastNewPos,ListLeft):-
        add1_pos(2,LastNewPos,NextPos), 
        append(Pos, NextPos, Move),
        check_if_valid(Move, Player),
        append(StartList,[Move],NewListLeft),
        check_all_pos_left(NewListLeft,Pos,Player,NextPos,ListLeft);
        add1_pos(2,LastNewPos,NextPos),
        check_all_pos_left(StartList,Pos,Player,NextPos,ListLeft).
        
        
check_all_pos_left(StartList,_,_,_,ListLeft):- ListLeft = StartList.

check_all_pos_right(StartList,Pos,Player,LastNewPos,ListRight):-
        add1_pos(3,LastNewPos,NextPos), 
        append(Pos, NextPos, Move),
        check_if_valid(Move, Player),
        append(StartList,[Move],NewListRight),
        check_all_pos_right(NewListRight,Pos,Player,NextPos,ListRight);
        add1_pos(3,LastNewPos,NextPos),
        check_all_pos_up(StartList,Pos,Player,NextPos,ListRight).
        
        
check_all_pos_right(StartList,_,_,_,ListRight):- ListRight = StartList.
/****************************/
 %NUMBER 1 PRIORITY               
/***************************/

/**
* Checks if a move causes the enemy dux to be immobalized
*/
does_move_check_mate_helper(Move,Player,Direction):-
        nth0(2, Move, PosX), 
        nth0(3, Move, PosY), 
        Pos = [PosX,PosY],
        add1_pos(Direction,Pos,NextPiece), 
        nth0(0,NextPiece,ColumnLetter), 
        nth0(1,NextPiece,Line),                                    
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        opposing_player(Player,OppPlayer),
        player_dux(OppPlayer,Piece),
	move(Move),
        (helper_check_mate(Player,NextPiece),de_move(Move);
	de_move(Move),fail).  

does_move_check_mate(Move,Player):-
	does_move_check_mate_helper(Move,Player,1);
	does_move_check_mate_helper(Move,Player,2);
	does_move_check_mate_helper(Move,Player,3);
        does_move_check_mate_helper(Move,Player,4).            



/******************************/
%NUMBER 2 PRIORITY
/*****************************/
 
/**
*Checks if a move captures any piece if it does returns the number of pieces it captures
*/
move_X_Captured_Pieces(Move,Player,Counter):-
	checks_the_direction_of_move(Move,Direction),
        nth0(2, Move, PosX), 
        nth0(3, Move, PosY), 
        Pos = [PosX,PosY],
        is_move_flank_attack(Pos,Direction,Player,CounterFlank),
        is_move_phalanx_attack(Pos,Direction,Player,CounterPhalanx),
        is_move_push_and_crush_capture(Pos,Direction,Player,CounterPushAndCrush),
        is_move_normal_capture1(Pos,Player,Counter1),
        is_move_normal_capture2(Pos,Player,Counter2),
        is_move_normal_capture3(Pos,Player,Counter3),
        is_move_normal_capture4(Pos,Player,Counter4),
        Counter is CounterFlank+CounterPhalanx+CounterPushAndCrush+Counter1+Counter2+Counter3+Counter4, 
        Counter >0.

%checks if the move causes a flank capture
is_move_flank_attack(Pos,Direction,Player,Counter):-
	add1_pos(Direction,Pos,NextPiece), 
	nth0(0,NextPiece,ColumnLetter), 
	nth0(1,NextPiece,Line),                          
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        opposing_player(Player,OppPlayer),
        player_piece(OppPlayer,Piece),        
        helper_flank_attack(NextPiece,Direction,Player,0),                                                                                            
        Counter is 1.

is_move_flank_attack(_,_,_,Counter):-Counter is 0.

%checks if the move causes a phalanx capture
is_move_phalanx_attack(Pos,Direction,Player,Counter):-
	add1_pos(Direction,Pos,NextPiece), 
	nth0(0,NextPiece,ColumnLetter), 
	nth0(1,NextPiece,Line),          
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        player_letter(Player,Piece),                              
        directions_90(Direction,X,_), 
        helper_phalanx_attack(Direction,X,Pos,NextPiece,Player,1),
        Counter is 1.                                         

is_move_phalanx_attack(Pos,Direction,Player,Counter):-
	add1_pos(Direction,Pos,NextPiece), 
	nth0(0,NextPiece,ColumnLetter), 
	nth0(1,NextPiece,Line),          
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        player_letter(Player,Piece),                              
        directions_90(Direction,_,X), 
        helper_phalanx_attack(Direction,X,Pos,NextPiece,Player,1),
        Counter is 1.                                       

is_move_phalanx_attack(_,_,_,Counter):- 
		Counter is 0.

%checks if the move causes a push and crush capture
is_move_push_and_crush_capture(Pos,Direction,Player,Counter):-
	add1_pos(Direction,Pos,NextPiece), 
	nth0(0,NextPiece,ColumnLetter), 
	nth0(1,NextPiece,Line),             
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        player_letter(Player,Piece),                                         
        helper_push_and_crush_capture(NextPiece,Direction,Player,1),
        Counter is 1.                                                                               

is_move_push_and_crush_capture(_,_,_,Counter):- 
		Counter is 0.

%checks if the move causes a normal capture
is_move_normal_capture1(Pos,Player,Counter):- 
	add1_pos(1,Pos,NextPiece), 
	nth0(0,NextPiece,ColumnLetter), 
	nth0(1,NextPiece,Line),                                         
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        opposing_player(Player,OppPlayer),
        player_piece(OppPlayer,Piece),       
        Y1 is Line+1 , NextPiece2 =[Column,Y1],
        check_if_player_piece(NextPiece2,Player),                                                            %
        Counter is 1;
        Counter is 0.                                                                                                                             

is_move_normal_capture2(Pos,Player,Counter):-
	add1_pos(4,Pos,NextPiece), 
	nth0(0,NextPiece,ColumnLetter),
	nth0(1,NextPiece,Line),                                          
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        opposing_player(Player,OppPlayer),
        player_piece(OppPlayer,Piece),        
        Y1 is Line-1, 
        NextPiece2 =[Column,Y1],
        check_if_player_piece(NextPiece2,Player),                                                             
        Counter is 1;
        Counter is 0.                                                                                                    

is_move_normal_capture3(Pos,Player,Counter):- 
	add1_pos(2,Pos,NextPiece), 
	nth0(0,NextPiece,ColumnLetter), 
	nth0(1,NextPiece,Line),                                         
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        opposing_player(Player,OppPlayer),
        player_piece(OppPlayer,Piece),       
        X1 is Column-1 ,
        NextPiece2 =[X1,Line],
        check_if_player_piece(NextPiece2,Player),                                                               
        Counter is 1;
        Counter is 0.                                                                                                      

is_move_normal_capture4(Pos,Player,Counter):- 
	add1_pos(3,Pos,NextPiece), 
	nth0(0,NextPiece,ColumnLetter), 
	nth0(1,NextPiece,Line),                                        
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        opposing_player(Player,OppPlayer),
        player_piece(OppPlayer,Piece),        
        X1 is Column+1,
        NextPiece2 =[X1,Line],
        check_if_player_piece(NextPiece2,Player),                                                              
        Counter is 1; 
        Counter is 0.                                                                                                         

/********************************/
%NUMBER 3 PRIORITY
/*******************************/

/**
* Checks if the move causes an attack to the enemy dux
*/
does_move_attack_dux_helper(Pos,Player,Direction):-
	add1_pos(Direction,Pos,NextPiece), 
	nth0(0,NextPiece,ColumnLetter), 
	nth0(1,NextPiece,Line),                                    
        column_to_number(ColumnLetter, Column),
        get_piece(Column,Line,Piece),
        opposing_player(Player,OppPlayer),
        player_dux(OppPlayer,Piece).                                   

does_move_attack_dux(Pos,Player):-
	does_move_attack_dux_helper(Pos,Player,1);
        does_move_attack_dux_helper(Pos,Player,2);
        does_move_attack_dux_helper(Pos,Player,3);
        does_move_attack_dux_helper(Pos,Player,4).    