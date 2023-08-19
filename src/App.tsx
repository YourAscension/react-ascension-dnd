import React, {useState} from 'react';
import DropZone from "./containers/drag-and-drop";

function App() {

    const [items, setItems] = useState([
        {id: 1, title: 'item 1'},
        {id: 2, title: 'item 2'},
        {id: 3, title: 'item 3'},
        {id: 4, title: 'item 4'},
        {id: 5, title: 'item 5'},
    ])

    return (
        <>
            <DropZone>
                {
                    (dropZoneRef) => {
                        return <div ref={dropZoneRef} className="container">
                            Container:
                            {
                                items.map(item => {
                                    return <DropZone.DraggableElement key={item.id} id={item.id}>
                                        { 
                                            (draggableRef) => <li ref={draggableRef}>{item.title}</li>
                                        }
                                    </DropZone.DraggableElement>
                                })
                            }
                        </div>
                    }}
            </DropZone>
        </>
    );
}

export default App;
