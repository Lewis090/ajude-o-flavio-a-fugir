export class Input {
  constructor(canvas) {
    this.keys = new Set();
    this.target = null;
    window.addEventListener('keydown', (event) => {
      this.keys.add(event.key.toLowerCase());
      if ([' ', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright'].includes(event.key.toLowerCase())) event.preventDefault();
    });
    window.addEventListener('keyup', (event) => this.keys.delete(event.key.toLowerCase()));
    canvas.addEventListener('pointerdown', (event) => { canvas.setPointerCapture(event.pointerId); this.target = this.position(canvas, event); });
    canvas.addEventListener('pointermove', (event) => { if (event.buttons) this.target = this.position(canvas, event); });
    canvas.addEventListener('pointerup', () => { this.target = null; });
  }

  position(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height };
  }

  direction() {
    return {
      x: (this.keys.has('arrowright') || this.keys.has('d') ? 1 : 0) - (this.keys.has('arrowleft') || this.keys.has('a') ? 1 : 0),
      y: (this.keys.has('arrowdown') || this.keys.has('s') ? 1 : 0) - (this.keys.has('arrowup') || this.keys.has('w') ? 1 : 0)
    };
  }
}
