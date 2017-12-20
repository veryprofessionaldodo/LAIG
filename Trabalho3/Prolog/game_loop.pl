:- reconsult(utils).
:- reconsult(interface).
:- reconsult(game_logic).
:- reconsult(artificial_intelligence).
:- use_module(library(random)).
:- use_module(library(lists)).
:- use_module(library(system)).

/****************************/
/*****BEGINNING OF GAME *****/
/****************************/
/**
*Start Function CALL THIS to start the program
*/
latrunculli:- 
        cls, nl, nl,
        write('                                             LATRUNCULLI \n \n \n'),
        write('                               Which type of game do you want to play? \n'),
        write('                                    1 - Player Versus Player \n'),
        write('                                      2 - Player Versus AI \n'),
        write('                                        3 - AI Versus AI \n\n'),
        write('                                               '),
        read(ReadMode), 
        playMode(ReadMode).

/** 
*Starts a new game in pvp. 
*/
playMode(1) :-  
        clear_global_variables, 
        cls,  
        write('Good luck to both!\n\n'), 
        print_make_move, nl, !, 
        play(1,0,0), nl.

/* 
*Starts a new game in pvAI. 
*/
playMode(2) :-  
        clear_global_variables, 
        cls, 
        write('Good luck!\n\n'), !, 
        get_level_ai(Level,0), 
        print_make_move, nl, 
        play(2,Level,0), nl.

/** 
*Starts a new game in AIvAI. 
*/
playMode(3) :-  
        clear_global_variables, 
        cls, 
        get_level_ai(Level1,1), 
        get_level_ai(Level2,2), 
        print_board,nl, 
        play(3,Level1,Level2), nl.

/** 
*Invalid game mode. 
*/
playMode(_) :-  
        cls, nl, nl,
        write('                                             LATRUNCULLI     \n \n \n'),
        write('                                   Invalid game type! Try again.  \n\n'),
        write('                                     1 - Player Versus Player  \n'),
        write('                                       2 - Player Versus AI   \n'),
        write('                                        3 - AI Versus AI      \n\n'),
        write('                                               '),
	read(ReadMode), 
        playMode(ReadMode).

/**
*Clears all existent boards and creates a new one, also clear all playcounters and creates a new one
*/
clear_global_variables :- 
        retractall(board(_)), 
        initial_board(StartBoard), 
        assert(board(StartBoard)), 
        retractall(playcounter(_)), 
        assert(playcounter(101)).

/**
*Menu to get the ai level for pvAI
*/
get_level_ai(Level,0):- 
        cls, nl, nl,
        write('                                             LATRUNCULLI  \n \n \n'),
        write('                                               AI LEVEL        \n \n'),
        write('                            Which type of AI do you want to play against?  \n'),
        write('                                            1 - Random \n'),
        write('                                        2 - Intelligent AI \n\n'),
        write('                                               '),
        read(Level).

/**
*Menu to get the ai level for AIvAI
*/
get_level_ai(Level,AiNumber):- 
        cls, nl, nl,
        write('                                             LATRUNCULLI  \n \n \n'),
        write('                                               AI LEVEL   \n \n'),
        format('                         Which type of AI do you want to use for Player ~w?    \n',[AiNumber]),
        write('                                            1 - Random \n'),
        write('                                        2 - Intelligent AI \n\n'),
        write('                                               '),
        read(Level).


/****************************/
/********THE GAME LOOP ******/
/****************************/

/** 
*Game Loop, in pvp. 
*/
play(1,0,0) :-  
        cls,nl, nl,  
        write('                                             LATRUNCULLI  \n \n \n'),
        write('                                                 PvP   \n \n'),
        print_board,
        read_move(1),  %l?jogada jogador 1      
        cls,nl, nl,  
        write('                                             LATRUNCULLI  \n \n \n'),
        write('                                                 PvP   \n \n'),
        print_board,
        read_move(2), %l?jogada jogador 2
        play(1,0,0). %chamada recursiva

/** 
Game Loop in pvAI. 
*/
play(2,LevelAi,0):- 
        cls,nl, nl,  
        write('                                             LATRUNCULLI  \n \n \n'),
        write('                                                 PvAI   \n \n'),
        print_board, read_move(1), 
        aI_move(2, LevelAi),  sleep(2),
        play(2,LevelAi,0).
 
/** 
Game Loop in AIvAI. 
*/
play(3,LevelAi1,LevelAi2):- 
        cls,nl, nl, 
        aI_move(1, LevelAi1), sleep(2), 
        aI_move(2, LevelAi2), sleep(2), 
        play(3,LevelAi1,LevelAi2).

/**
*Reads move for a player passed in argument. 
*Checks if the move is valid
*if it is moves the piece, and removes any captured pieces caused by that move
*checks if the game is over    
*/
read_move(Player):- 
        nl, nl,
        format('                                        Make your move, Player ~w   \n \n',[Player]),
        write('                                                '),
        read(MoveString), 
        string_to_move(MoveString, Move), 
        check_if_valid(Move, Player), !,
	move(Move),
        remove_captured_pieces(Move,Player),
        is_game_over(Player).

/**
* if the move is invalid, error message and trys to read it again
*/
read_move(Y):- 
        write('\n\n                                        '),
        write('Invalid play!\n\n'), 
        read_move(Y).


/*****************************/
/****Removes captured PIECES*/
/****************************/

/**
*Removes all captured pieces caused by a movement 
taking into account all the rules
*/
remove_captured_pieces(Move,Player) :- 
        checks_the_direction_of_move(Move,Direction),
        nth0(2, Move, PosX), 
        nth0(3, Move, PosY), 
        Pos = [PosX,PosY],
        flank_attack(Pos,Direction,Player),
        phalanx_attack(Pos,Direction,Player),
        push_and_crush_capture(Pos,Direction,Player),
        normal_capture(Pos,Player),
        check_mate(Pos).

