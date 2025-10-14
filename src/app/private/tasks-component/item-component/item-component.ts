import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-item-component',
  imports: [],
  templateUrl: './item-component.html',
  styleUrl: './item-component.css'
})
export class ItemComponent {
  @Output()
  cambiarPestana = new EventEmitter<string>();

  solicitarCambio(nuevaPestana: string) {
    this.cambiarPestana.emit(nuevaPestana)
  };

}
