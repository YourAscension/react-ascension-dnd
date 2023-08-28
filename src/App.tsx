import React, { useState } from "react";
import DragAndDrop from "./containers/drag-and-drop";
import { generateItems, generateRandomRgbColor } from "./utils";
import { IItems } from "./utils/types";

function App() {
  const [items, setItems] = useState<IItems[]>(generateItems(4));
  const [isColumn, setIsColumn] = useState<boolean>(true);

  const addNewItemHandler = () => {
    setItems(prev => [...prev, {
      id: items.length,
      title: "item " + items.length,
      color: generateRandomRgbColor()
    }]);
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
      <section className="section-one">
        <div className="items-counter">{items.map(item => <div key={item.id} className="item-count"
                                                               style={{ backgroundColor: item.color }}>{item.id}</div>)}</div>
      </section>
      <section className="section-two">
        <button onClick={()=>setIsColumn(!isColumn)}>Set direction: { isColumn ? 'column' : 'row'}</button>
        <button onClick={addNewItemHandler}>Add new item</button>
        <DragAndDrop
          onSwapElement={swapItemsHandler}
        >
          {
            (dropZoneRef) => {
              return <div ref={dropZoneRef} className="container" style={ {flexDirection: isColumn ? 'column' : 'row'}}>
                {
                  items.map(item => {
                    return <DragAndDrop.Draggable key={item.id} id={item.id}>
                      {
                        (draggableRef) => <div ref={draggableRef}>
                          <div className="item-header" style={{ backgroundColor: item.color }}></div>
                          <div className="item-content">{item.title}</div>
                        </div>
                      }
                    </DragAndDrop.Draggable>;
                  })
                }
              </div>
                ;
            }}
        </DragAndDrop>
      </section>
    </>
  )
    ;
}

export default App;
