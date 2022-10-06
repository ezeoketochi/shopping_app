const db = new Dexie("ShoppingApp");
db.version(1).stores((e = { items: "++id,name,price,isPurchased" }));

const itemForm = document.getElementById((elementid = "itemForm"));
const itemsDiv = document.getElementById((elementid = "itemsDiv"));
const totalPriceDiv = document.getElementById((elementid = "totalPriceDiv"));

itemForm.onsubmit = async (Event = Event) => {
  Event.preventDefault();

  const name = document.getElementById((elementid = "nameInput")).value;
  const quantity = document.getElementById((elementid = "quantityInput")).value;
  const price = document.getElementById((elementid = "priceInput")).value;

  await db.items.add({ name, quantity, price });
  await populateItemsDiv();

  itemForm.reset();
};

const populateItemsDiv = async () => {
  const allItems = await db.items.reverse().toArray();

  itemsDiv.innerHTML = allItems
    .map(
      (item) =>
        `  <div class="item ${item.isPurchased && "purchased"}">
     
        <input type="checkbox" 
      class="checkbox"
      onchange = "toogleItemStatus(event, ${item.id})"
      ${item.isPurchased && `checked`}/>

      <div class="itemInfo">
        <p>${item.name}</p>
        <p>$${item.price} x ${item.quantity}</p>
      </div>

      <button class="deleteButton" onclick ="removeItem(${item.id})">X</button>
    </div>`
    )
    .join((seperator = ""));

  const arrayofPrices = allItems.map((item) => item.price * item.quantity);

  const totalPrice = arrayofPrices.reduce((a, b) => a + b, 0);
  totalPriceDiv.innerText = `Total Price : $` + totalPrice;
};

window.onload = populateItemsDiv;

const toogleItemStatus = async (event, id) => {
  await db.items.update(id, { isPurchased: !!event.target.checked });
  await populateItemsDiv();
};

const removeItem = async (id) => {
  await db.items.delete(id);
  populateItemsDiv();
};
