import React, { useState, useId } from "react";
import DragAndDrop from "./containers/drag-and-drop";

function App() {

  const uniqueId = useId();

  const [items, setItems] = useState([
    { id: 1, title: "item 1" },
    { id: 2, title: "item 2" },
    { id: 3, title: "item 3" },
    { id: 999, title: "item 99" },
    { id: 5, title: "item 5" }
  ]);

  return (
    <>
      <button
        onClick={() => setItems(prev => [...prev, { id: items.length + 1, title: "item " + (items.length + 1) }])}>Add
        item
      </button>
      <DragAndDrop
      //@ts-ignore
        setItems={setItems}>
        {
          (dropZoneRef) =>{
            return <div ref={dropZoneRef} className="container">
              Container:
              {
                items.map((item, index) => {
                  if (index === 2) {
                    return <h2 key={uniqueId}>2</h2>;
                  }
                  return <DragAndDrop.DraggableElement key={item.id} id={item.id}>
                    {
                      (draggableRef) => <div ref={draggableRef}>{item.title}</div>
                    }
                  </DragAndDrop.DraggableElement>;
                })
              }
            </div>;
          }}
      </DragAndDrop>
    </>
  );
}

export default App;
