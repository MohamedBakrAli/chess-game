import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameState } from '../models/GameState';
import { Player } from '../models/Player';

@Component({
  selector: 'app-replay-daliog',
  templateUrl: './replay-daliog.component.html',
  styleUrls: ['./replay-daliog.component.css']
})
export class ReplayDaliogComponent {
  constructor(private _dialogRef: MatDialogRef<ReplayDaliogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { gameState: GameState, currentPlayer: Player }) { }

  getGameState(): string {
    return this.data.gameState != GameState.INPROGRESS
      ? this.data.gameState == GameState.CHECKMATE
        ? `congratulations! ${ this.data.currentPlayer } player is the winner.`
        : `There is no winner, this game end as ${ this.data.gameState }.`
      : "";
  }

  onCancel(): void {
    this._dialogRef.close(false/*replay*/);
  }

  onReplay(): void {
    this._dialogRef.close(true/*replay*/);
  }
}


