/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import App from './App';

let offsetX: number;
let offsetY: number;

function allowDrop(ev: DragEvent) {
  ev.preventDefault();
}

const onDragStart = function(ev: DragEvent) {
  const target = ev.target as HTMLElement;
  const rect = target.getBoundingClientRect();

  offsetX = ev.clientX - rect.x;
  offsetY = ev.clientY - rect.y;
};

const drop = function(ev: DragEvent) {
  ev.preventDefault();

  const target = ev.target as HTMLElement;
  const left = parseInt(target.style.left);
  const top = parseInt(target.style.top);

  const body = document.getElementById('ext-body') as HTMLElement;
  body.style.left = ev.clientX - left - offsetX + 'px';
  body.style.top = ev.clientY - top - offsetY + 'px';
};

render(
  () => <App />,
  (() => {
    const app = document.createElement('div');
    //app.style.position = 'absolute';
    //app.style.right = '0';
    //app.style.left = '0';
    //app.style.top = '0';
    //app.style.bottom = '0';
    //app.style.zIndex = '-9999';

    const body = document.body
    body.ondrop = drop;
    body.ondragstart = onDragStart;
    body.ondragover = allowDrop;


    document.body.append(app);
    return app;
  })(),
);
