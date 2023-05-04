import { AfterViewInit, Component, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxChessBoardService, NgxChessBoardView } from 'ngx-chess-board';
import { EventType } from '../models/EventType';
import { Player, FIRST_PLAYER } from '../models/Player';

@Component({
  selector: 'app-iframe-page',
  templateUrl: './iframe-page.component.html',
  styleUrls: ['./iframe-page.component.css']
})
export class IframePageComponent {
  playerColor: string | null = null;
  isPlayerTurn: boolean = false;

  @ViewChild('board', {static: false}) board: NgxChessBoardView | undefined;

  @HostListener('window:message', ['$event'])
  onMessage(event: any) {
    this.receiveMessage(event);
  }

  constructor(private _ngxChessBoardService: NgxChessBoardService,
              private _route: ActivatedRoute) { }

  moveChanged(): void {
    const eventData = {
      eventType : EventType.MOVE_CHANGED,
      FEN: this.board?.getFEN(),
      player: this.playerColor
    };

    // emit the parent with the move change
    window.parent.postMessage(eventData, window.location.origin);
    
    // move to the other player turn
    this.isPlayerTurn = false;
  }

  receiveMessage(event: any): void {
    if(event.origin != window.location.origin)
      return;

    const data = event.data;
    console.log("iframe : " + this.playerColor, event);

    switch(data.eventType) { 
      case EventType.BOARD_UPDATED: {
        this.updateBoardHandler(data);
        break;
      }
      case EventType.GAME_INIT: {
        this.updateBoardHandler(data);
        break;
      }
    }
  }

  private updateBoardHandler(data: any): void {
    this.board?.setFEN(data.FEN);
    this.isPlayerTurn = data.isPlayerTurn;
    this.playerColor = data.playerColor;

    if (this.playerColor != FIRST_PLAYER) 
      this.board?.reverse();
  }
}
