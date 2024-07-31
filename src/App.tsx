import { createSignal, type Component } from 'solid-js';

import styles from './App.module.css';

function drag(ev: DragEvent) {
  ev.dataTransfer?.setData("text", "ext-body");
}

interface HouseInfo {
  tax: number;
  price: number;
  areaInfo: AreaInfo;
}

interface AreaInfo {
  area: number;
  rooms: number;
  parking: number;
}

function parseAreaInfo(areaInfo: string[]): AreaInfo {
  const [rawArea, rawRooms, rawParking] = areaInfo;

  const area = parseFloat(rawArea.replace(/[^0-9.]/g, ""));
  const rooms = parseInt(rawRooms.replace(/[^0-9]/g, ""));
  const parking = parseInt(rawParking.replace(/[^0-9]/g, ""));

  return { area, rooms, parking };
}

function parseHouseInfo(): HouseInfo[] {
  const cards = [...document.querySelectorAll('[data-testid="house-card-container"]')];

  return cards.map((card): HouseInfo => {
    const h3Tags = [...card.getElementsByTagName("h3")]
    const [pRent, pTax, pAreaInfo] = h3Tags

    const price = parseFloat(pRent?.innerText.replace(/[^0-9.]/g, ""))
    const tax = parseFloat(pTax?.innerText.replace(/[^0-9.]/g, ""))

    const house: HouseInfo = {
      tax,
      price,
      areaInfo: parseAreaInfo(pAreaInfo?.innerText.split(" · ")),
    }

    // if p hidden is present, return
    if (card.querySelector("#rendered")) return house

    // append a hiden element with id
    const hidden = document.createElement("p") as HTMLParagraphElement
    hidden.style.display = "none"
    hidden.id = "rendered"
    hidden.innerText = JSON.stringify(house)
    card.appendChild(hidden)


    const perArea = document.createElement("p") as HTMLParagraphElement
    const costPerArea = house.price / house.areaInfo.area
    perArea.innerText = `Cost per Area: R$ ${costPerArea.toFixed(2)}`

    const perRoom = document.createElement("p") as HTMLParagraphElement
    const costPerRoom = house.price / house.areaInfo.rooms
    perRoom.innerText = `Cost per Rooms: R$ ${costPerRoom.toFixed(2)}`

    card.appendChild(perArea)
    card.appendChild(perRoom)

    return house;
  })
}

function calcHouseAvg(houses: HouseInfo[], parser: (h: HouseInfo) => number): string {
  const value = houses.reduce((acc, house) => acc + parser(house), 0) / houses.length;
  return `R$ ${value.toFixed(2)}`;
}

const [houses, setHouses] = createSignal<HouseInfo[]>([]);

const App: Component = () => {
  setInterval(() => {
    setHouses(parseHouseInfo())
  }, 250)

  return (
    <div class={styles.App} id="ext-body" draggable="true" onDragStart={drag}>
      <header >
        <h1>Pricing Info</h1>

        <div>
          <p>Avg price: {calcHouseAvg(houses(), (h) => h.price)}</p>
          <p>Avg price per area: {calcHouseAvg(houses(), (h) => h.price / h.areaInfo.area) + "/mˆ2"}</p>
          <p>Avg price per room: {calcHouseAvg(houses(), (h) => h.price / h.areaInfo.rooms)}/quarto</p>
        </div>
      </header>
    </div>
  );
};

export default App;
