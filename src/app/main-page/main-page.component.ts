import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { EventType } from '../models/EventType';
import { Player, FIRST_PLAYER } from '../models/Player';
import { Chess } from 'chess.js';
import { GameState } from '../models/GameState';
import { MatDialog } from '@angular/material/dialog';
import { ReplayDaliogComponent } from '../replay-daliog/replay-daliog.component';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent {

  Player = Player;

  @ViewChild('iframeForWhitePlayer') iframeForWhitePlayer: ElementRef | undefined;
  @ViewChild('iframeForBlackPlayer') iframeForBlackPlayer: ElementRef | undefined;

  @HostListener('window:message', ['$event'])
  onMessage(event: any) {
    this.receiveMessage(event);
  }

  constructor(private _matDialog: MatDialog) { }

  onIframeLoad(player: Player): void {
    this.emitPlayerGameInit(player);
  }

  private receiveMessage(event: any): void {
    if(event.origin != window.location.origin)
      return;

    const data = event.data;

    switch(data.eventType) { 
      case EventType.MOVE_CHANGED: { 
        this.moveChangedHandler(data); 
         break; 
      }
    }
  }

  private moveChangedHandler(data: any) {
    console.log("main", data);
    
    const boardFEN = data.FEN;
    const nextPlayer = this.getNextPlayer();
    const gameState = this.getGameState(boardFEN);

    if (gameState == GameState.INPROGRESS) {
      this.emitBoardUpdated(nextPlayer, boardFEN);
    }
    else {
      const replayDialogRef = this._matDialog.open(ReplayDaliogComponent, {
        data: {
          gameState: gameState,
          currentPlayer: this.getCurrentPlayer()
        },
      });
      replayDialogRef.afterClosed().subscribe(replay => {
        if(replay){
          localStorage.clear();
          this.emitPlayerGameInit(Player.BLACK);
          this.emitPlayerGameInit(Player.WHITE);
        }
      });
    }
    this.updateGameState(nextPlayer, boardFEN);  
  }

  private getGameState(boardFEN: any): GameState {
    const chess = new Chess();
    chess.load(boardFEN);

    return chess.isGameOver()
      ? chess.isCheckmate()
        ? GameState.CHECKMATE
        : chess.isStalemate()
          ? GameState.STALEMATE
          : GameState.DRAW
      : GameState.INPROGRESS;
  }

  private getNextPlayer(): Player {
    return this.getCurrentPlayer() == FIRST_PLAYER
      ? Player.BLACK
      : Player.WHITE;
  }

  private getCurrentPlayer(): string {
    return localStorage.getItem('currentPlayer')
       || FIRST_PLAYER;
  }

  private getCurrentBoardFEN(): string | null {
    return localStorage.getItem('boardFEN');
  }
  
  private getPlayerIframe(player: string): ElementRef<any> | undefined {
    return player == Player.BLACK
      ? this.iframeForBlackPlayer
      : this.iframeForWhitePlayer;
  }

  private emitBoardUpdated(player: string, boardFEN: string) {
    const eventData = { 
      eventType : EventType.BOARD_UPDATED,
      FEN: boardFEN,
      playerColor: player,
      isPlayerTurn: true
    };
    this.getPlayerIframe(player)?.nativeElement.contentWindow
      .postMessage(eventData, window.location.origin);
  }

  private updateGameState(player: string, boardFEN: string): void {
    localStorage.setItem('currentPlayer', player);
    localStorage.setItem('boardFEN', boardFEN);
  }

  private emitPlayerGameInit(player: Player): void {
    const eventData = { 
      eventType : EventType.GAME_INIT,
      FEN: this.getCurrentBoardFEN(),
      playerColor: player,
      isPlayerTurn: (this.getCurrentPlayer() == player)
    };

    this.getPlayerIframe(player)?.nativeElement.contentWindow
      .postMessage(eventData, window.location.origin);
  }
}
