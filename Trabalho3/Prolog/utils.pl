% Utilities 
:- dynamic(playcounter/1).

is_row(Number) :- Number > 0, Number < 9.
isColumn(Letter) :- member(Letter, "abcdefghijABCDEFGHIJ").

equal(A,A).
different(A,B) :- A\==B.

copy([],_).
copy(L,R) :- accCp(L,R).

accCp([],[]).
accCp([H|T1],[H|T2]) :- accCp(T1,T2).

/** 
*All valid player letters.
*/ 
player_letter(1,'w').
player_letter(1,'W').
player_letter(2,'b').
player_letter(2,'B').
player_piece(1,'w').
player_piece(2,'b').
player_dux(1,'W').
player_dux(2,'B').
opposing_player(1,2).
opposing_player(2,1).   


/**
*Converts Column Letter to Number 
*/

column_to_number('a',1).
column_to_number('A',1).
column_to_number('b',2).
column_to_number('B',2).
column_to_number('c',3).
column_to_number('C',3).
column_to_number('d',4).
column_to_number('D',4).
column_to_number('e',5).
column_to_number('E',5).
column_to_number('f',6).
column_to_number('F',6).
column_to_number('g',7).
column_to_number('G',7).
column_to_number('h',8).
column_to_number('H',8).
column_to_number('i',9).
column_to_number('I',9).
column_to_number('j',10).
column_to_number('J',10).

/**
*Split Array into Args
*/ 
string_to_move(StringA-StringB, ListOfMove):-
	name(StringA, [ColumnASCII1,RowASCII1]), 
	name(StringB,[ColumnASCII2,RowASCII2]), 
	isColumn(ColumnASCII1), 
	isColumn(ColumnASCII2), 
	name(Row1, [RowASCII1]), 
	name(Row2, [RowASCII2]), 
	name(Column1, [ColumnASCII1]), 
	name(Column2, [ColumnASCII2]), 
	is_row(Row1), 
	is_row(Row2),
	ListOfMove = [Column1,Row1,Column2,Row2].

/**
*Line Number to position in Board array. 
*/
line_to_position(1,8).
line_to_position(2,7).
line_to_position(3,6).
line_to_position(4,5).
line_to_position(5,4).
line_to_position(6,3).
line_to_position(7,2).
line_to_position(8,1).

piece_type(1,'w').
piece_type(2,'W').
piece_type(3,'b').
piece_type(4,'B').

/** 
*Checks the direction of a moving piece 
*1 is up, 2 is left, 3 is right , 4 is down
*/
checks_the_direction_of_move(Move,Direction) :- 
	nth0(0, Move, ColumnLetter), 
	nth0(1, Move, Line), 
	nth0(2, Move, ColumnLetter1), 
	nth0(3, Move, Line1),
        line_to_position(Line, Y),
        line_to_position(Line1, Y1),
        column_to_number(ColumnLetter, X),
        column_to_number(ColumnLetter1, X1),
        checks_the_direction([X,Y,X1,Y1],Direction).
        
checks_the_direction(Move,Direction) :- 
		nth0(0, Move, X), 
		nth0(1, Move, Y), 
		nth0(2, Move, X1), 
		nth0(3, Move, Y1), 
		X-X1 >0,
		Y=Y1,
		Direction is 2.

checks_the_direction(Move,Direction) :- 
		nth0(0, Move, X), 
		nth0(1, Move, Y), 
		nth0(2, Move, X1), 
		nth0(3, Move, Y1), 
		X-X1 <0, 
		Y=Y1,
		Direction is 3.

checks_the_direction(Move,Direction) :- 
		nth0(0, Move, X), 
		nth0(1, Move, Y), 
		nth0(2, Move, X1),
		nth0(3, Move, Y1), 
		Y-Y1 >0,
		X=X1,
		Direction is 1.

checks_the_direction(Move,Direction) :- 
		nth0(0, Move, X), 
		nth0(1, Move, Y), 
		nth0(2, Move, X1), 
		nth0(3, Move, Y1), 
		Y-Y1 <0,
		X=X1,
		Direction is 4.

/**
*adds 1 position given a direction
*/
add1_pos(1,Pos,NextPiece):-
		nth0(0, Pos, X), 
		nth0(1, Pos, Y),
		Y1 is Y+1 , 
		is_row(Y1),
		NextPiece =[X,Y1].

add1_pos(4,Pos,NextPiece):-
		nth0(0, Pos, X), 
		nth0(1, Pos, Y), 
		Y1 is Y-1 , 
		is_row(Y1),
		NextPiece =[X,Y1].

add1_pos(2,Pos,NextPiece):-
		nth0(0, Pos, X), 
		nth0(1, Pos, Y), 
		column_to_number(X,X1), 
		X2 is X1-1, 
		column_to_number(X3,X2),
		NextPiece =[X3,Y].
add1_pos(3,Pos,NextPiece):-
		nth0(0, Pos, X), 
		nth0(1, Pos, Y), 
		column_to_number(X,X1),
		X2 is X1+1, 
		column_to_number(X3,X2) ,
		NextPiece =[X3,Y].

/**
*given a direction X, get perpendicular directions
*/
directions_90(1,2,3).
directions_90(4,2,3).
directions_90(2,1,4).
directions_90(3,1,4).

/**
* Converts columns number of a move to a letter
*/
create_move(X, Move):-
        nth0(0,X,X1), 
        column_to_number(Column1, X1),
        nth0(1,X,Y1), 
        nth0(2,X,X2),
        column_to_number(Column2, X2),
        nth0(3,X,Y2),
        Move=[Column1,Y1,Column2,Y2].

/**
*clear the console, doesn't work on eclipse
*/
cls :- write('\33\[2J').


% Checks the difference between two states.
analyse_changes(Before, After, Changes) :-
	once(analyse_all(Before, After, [], Changes, 8)).

analyse_all([],[], Tmp, Changes, _Column) :- Changes = Tmp.

analyse_all([BeforeHead|BeforeTail], [AfterHead|AfterTail], Tmp, Changes, Column) :-
	once(analyse_line(BeforeHead, AfterHead, [], TmpChanges, Column, 1)),
	TmpChanges \= [],
	append(Tmp, [TmpChanges], NewIterTmp),
	NewColumn is Column - 1,
	once(analyse_all(BeforeTail, AfterTail, NewIterTmp, Changes, NewColumn)).

analyse_all([BeforeHead|BeforeTail], [AfterHead|AfterTail], Tmp, Changes, Column) :-
	NewColumn is Column - 1,
	once(analyse_all(BeforeTail, AfterTail, Tmp, Changes, NewColumn)).

analyse_line([],[], Tmp, Changes, _Column, _Line) :- Changes = Tmp.

analyse_line([BeforeHead|BeforeTail], [AfterHead|AfterTail], Tmp, Changes, Column, Line) :-
	BeforeHead==AfterHead,
	NewLine is Line + 1,
	once(analyse_line(BeforeTail, AfterTail, Tmp, Changes, Column, NewLine)).

analyse_line([BeforeHead|BeforeTail], [AfterHead|AfterTail], Tmp, Changes, Column, Line) :-
	append([Column-Line], Tmp, NewIterTmp), 
	NewLine is Line + 1,
	once(analyse_line(BeforeTail, AfterTail, NewIterTmp, Changes, Column, NewLine)).

