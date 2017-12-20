% INTERFACE 

:- dynamic(board/1).

initial_board( [ 
	   ['w','w','w','w','w','w','w','w','w','w','8'],
	   [' ',' ',' ',' ','W',' ',' ',' ',' ',' ','7'],
	   [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','6'],
	   [' ',' ',' ','b','w',' ','b',' ',' ',' ','5'],
	   [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','4'],
	   [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','3'],
	   [' ',' ',' ',' ',' ','B',' ',' ',' ',' ','2'],
	   ['b','b','b','b','b','b','b','b','b','b','1'],
	   ['_a_','_b_','_c_','_d_','_e_','_f_','_g_','_h_','_i_','_j_']
	   ]).

board( [ 
	   ['w','w','w','w','w','w','w','w','w','w','8'],
	   [' ',' ',' ',' ','W',' ',' ',' ',' ',' ','7'],
	   [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','6'],
	   [' ',' ',' ','b','w',' ','b',' ',' ',' ','5'],
	   [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','4'],
	   [' ',' ',' ',' ',' ',' ',' ',' ',' ',' ','3'],
	   [' ',' ',' ',' ',' ','B',' ',' ',' ',' ','2'],
	   ['b','b','b','b','b','b','b','b','b','b','1'],
	   ['_a_','_b_','_c_','_d_','_e_','_f_','_g_','_h_','_i_','_j_']
	   ]).

% If line reached the end, stop, and print a new line. 
print_line([]) :- print_newline.

% If line has content, continue reading until the end. 
print_line( [Head|Tail]) :- print_character(Head), print_line(Tail).

print_final_line([]) :- print_newline.

print_final_line( [Head|Tail]) :- print_final_character(Head), print_final_line(Tail).

% If board has reached the end, print the final separating line. 
print_board([Last|[]]) :-  print_top, write('                 '), print_final_line(Last).

print_board([]).

% While board has content, continue to print lines. 
print_board([Head|Tail]) :- print_top, write('                 '), print_line(Head), print_board(Tail).

print_board :- board(X), print_board(X).

% Tutorial for movement 
print_make_move:- write('Write your move like "b3-b7.", b3 being the piece position and b7 the piece destination.').

% Print specific character. 
print_character(X) :- write('|  '), write(X), write('  ').

print_final_character(X) :- write('|_'), write(X), write('_').

% Print separating line. 
print_top :- write('                 -------------------------------------------------------------\n').

% Print on a new line. 
print_newline :- write('\n').

% Extract game state.
get_game_state(Return) :-
	board(Board),
	append_all(Board, [], Return).

append_all([_|[]], TmpList, FinalList) :- FinalList = TmpList.

append_all([Head|Tail], TmpList, FinalList) :-
	append_line(Head, [], Tmp2List),
	append(TmpList, [Tmp2List], NewIterList),
	append_all(Tail, NewIterList, FinalList).

append_line([_|[]], TmpList, FinalList) :- FinalList = TmpList.

append_line([Head|Tail], TmpList, FinalList) :-
	append(TmpList, [Head], NewIterList),
	append_line(Tail, NewIterList, FinalList).