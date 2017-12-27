:-use_module(library(sockets)).
:-use_module(library(lists)).
:-use_module(library(codesio)).

port(8081).

% Server Entry Point
server :-
	port(Port),
	write('Opened Server'),nl,nl,
	socket_server_open(Port, Socket),
	server_loop(Socket),
	socket_server_close(Socket),
	write('Closed Server'),nl.

% Server Loop 
% Uncomment writes for more information on incomming connections
server_loop(Socket) :-
	repeat,
	socket_server_accept(Socket, _Client, Stream, [type(text)]),
		% write('Accepted connection'), nl,
	    % Parse Request
		catch((
			read_request(Stream, Request),
			read_header(Stream)
		),_Exception,(
			% write('Error parsing request.'),nl,
			close_stream(Stream),
			fail
		)),
		
		% Generate Response
		handle_request(Request, MyReply, Status),
		format('Request: ~q~n',[Request]),
		format('Reply: ~q~n', [MyReply]),
		
		% Output Response
		format(Stream, 'HTTP/1.0 ~p~n', [Status]),
		format(Stream, 'Access-Control-Allow-Origin: *~n', []),
		format(Stream, 'Content-Type: text/plain~n~n', []),
		format(Stream, '~p', [MyReply]),
	
		% write('Finnished Connection'),nl,nl,
		close_stream(Stream),
	(Request = quit), !.
	
close_stream(Stream) :- flush_output(Stream), close(Stream).

% Handles parsed HTTP requests
% Returns 200 OK on successful aplication of parse_input on request
% Returns 400 Bad Request on syntax error (received from parser) or on failure of parse_input
handle_request(Request, MyReply, '200 OK') :- catch(parse_input(Request, MyReply),error(_,_),fail), !.
handle_request(syntax_error, 'Syntax Error', '400 Bad Request') :- !.
handle_request(_, 'Bad Request', '400 Bad Request').

% Reads first Line of HTTP Header and parses request
% Returns term parsed from Request-URI
% Returns syntax_error in case of failure in parsing
read_request(Stream, Request) :-
	read_line(Stream, LineCodes),
	print_header_line(LineCodes),
	
	% Parse Request
	atom_codes('GET /',Get),
	append(Get,RL,LineCodes),
	read_request_aux(RL,RL2),	
	
	catch(read_from_codes(RL2, Request), error(syntax_error(_),_), fail), !.
read_request(_,syntax_error).
	
read_request_aux([32|_],[46]) :- !.
read_request_aux([C|Cs],[C|RCs]) :- read_request_aux(Cs, RCs).


% Reads and Ignores the rest of the lines of the HTTP Header
read_header(Stream) :-
	repeat,
	read_line(Stream, Line),
	print_header_line(Line),
	(Line = []; Line = end_of_file),!.

check_end_of_header([]) :- !, fail.
check_end_of_header(end_of_file) :- !,fail.
check_end_of_header(_).

% Function to Output Request Lines (uncomment the line bellow to see more information on received HTTP Requests)
% print_header_line(LineCodes) :- catch((atom_codes(Line,LineCodes),write(Line),nl),_,fail), !.
print_header_line(_).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
%%%%                                       Commands                                                  %%%%
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

% Require your Prolog Files here
:-reconsult(interface).
:-reconsult(game_logic).
:-reconsult(game_loop).
:-reconsult(artificial_intelligence).
:-reconsult(utils).

% In case game state is required.
parse_input(get_game_state, [ok, Return_Message]) :- get_game_state(Return_Message).

% Handle movement and updates board-
parse_input([move,Player,MoveCurrPlace-MoveDest], [ok, RemovedPieces]) :- 
	write('convert string to move\n'),
	string_to_move(MoveCurrPlace-MoveDest, Move), 
	write('check if valid\n'),
	check_if_valid(Move, Player), !,
	write('move\n'),
	move(Move), 
	get_game_state(BeforeCaptures), 
	write('remove captured pieces\n'),
	remove_captured_pieces(Move, Player), 
	get_game_state(AfterCaptures), !,
	write('analyse changes\n'),
	once(analyse_changes(BeforeCaptures, AfterCaptures, RemovedPieces)).

parse_input([move,Player,MoveColumn-MoveLine], [error]).

% Handle undo
parse_input([undo,NewBoard], [ok]) :-
    retractall(board(_)), 
    assert(board(NewBoard)).

% Get new move by AI
parse_input([get_ai_move, AIPlayer, AILevel], [ok, Move, RemovedPieces]) :-
	aI_move(AIPlayer, AILevel, Move),
	get_game_state(BeforeCaptures), 
	remove_captured_pieces(Move, AIPlayer), 
	get_game_state(AfterCaptures), !,
	once(analyse_changes(BeforeCaptures, AfterCaptures, RemovedPieces)).

% Check if game is over
parse_input([is_game_over,Player], [game_is_over]).	

parse_input([get_piece,Column-Line], Piece) :-
	get_piece(Column,Line, Piece).

parse_input(quit, goodbye).	