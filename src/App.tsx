import type { Component } from 'solid-js';

import styles from './App.module.css';

function drag(ev: DragEvent) {
  ev.dataTransfer?.setData("text", "ext-body");
}

const App: Component = () => {
  return (
    <div class={styles.App} id="ext-body" draggable="true" onDragStart={drag}>
      <header >
        <h1>Pricing Info</h1>
      </header>
    </div>
  );
};

export default App;
