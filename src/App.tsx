import React, { useState } from "react";
import DragAndDrop from "./containers/drag-and-drop";

function App() {

  interface IItems {
    id: number;
    title: string;
    isNotDraggable?: true;
  }

  const [items, setItems] = useState<IItems[]>([
    { id: 1, title: "item 1" },
    { id: 2, title: "item 2", isNotDraggable: true },
    { id: 3, title: "item 3" },
    { id: 999, title: "item 99" },
    { id: 5, title: "item 5" }
  ]);

  const addNewItemHandler = () => {
    setItems(prev => [...prev, { id: items.length + 1, title: "item " + (items.length + 1) }]);
  };

  const swapItemsInArray = (draggingElementId: number, elementToSwapId: number, items: IItems[]) => {

      let itemsCopy = [...items];
      const draggingItem = itemsCopy.find(item => item.id === draggingElementId);

      itemsCopy = itemsCopy.filter(item => item.id !== draggingElementId);

      const elementToSwapIndex = [...items].indexOf([...items].find(item => item.id === elementToSwapId)!);

      itemsCopy.splice(elementToSwapIndex, 0, draggingItem!);
      return itemsCopy;
    }
  ;

  const swapItemsHandler = (draggingElementId: number, elementToSwapId: number) => {
    setItems(prev => swapItemsInArray(draggingElementId, elementToSwapId, prev));
  };

  return (
    <>
      <section className='right-section'>
      <button onClick={addNewItemHandler}>Add new item</button>
      <DragAndDrop
        onSwapElement={swapItemsHandler}
      >
        {
          (dropZoneRef) => {
            return <div ref={dropZoneRef} className="container">
              {
                items.map(item => {
                  if (item?.isNotDraggable === true) {
                    return <div className="item item-freeze" key={item.id}>{item.title}</div>;
                  }
                  return <DragAndDrop.Draggable key={item.id} id={item.id}>
                    {
                      (draggableRef) => <div ref={draggableRef}>{item.title}</div>
                    }
                  </DragAndDrop.Draggable>;
                })
              }
            </div>
              ;
          }}
      </DragAndDrop>
      </section>
      <section className="left-section">
        <code>{JSON.stringify(items.map(item=>item.id))}</code>
      </section>
    </>
  )
    ;
}

export default App;
